"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/types/auth.types";
import { userService } from "@/services/userService";
import useTracker from "@/hooks/useTracker";
import { TrackingEventType, LoginEventData } from "@/types/tracking.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const trackEvent = useTracker();

  useEffect(() => {
    // Check if user is authenticated on initial load
    const initializeAuth = async () => {
      if (userService.isAuthenticated()) {
        try {
          // First try to get stored user data
          const storedUser = userService.getUser();
          if (storedUser) {
            setUser(storedUser);

            // Verify token is still valid by calling getCurrentUser
            const response = await userService.getCurrentUser();
            if (response.success && response.data) {
              // Update user data in case it changed
              setUser(response.data);
            } else {
              // Token might be invalid, clear auth
              userService.clearAuth();
              setUser(null);
            }
          } else {
            // No stored user, try to get current user
            const response = await userService.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data);
            } else {
              // Failed to get user, clear auth
              userService.clearAuth();
            }
          }
        } catch (error) {
          // Error getting user, clear auth
          console.error("Auth initialization error:", error);
          userService.clearAuth();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const response = await userService.login({
        email: email.toLowerCase(),
        password,
      }); // Convert email to lowercase

      if (response.success && response.data) {
        setUser(response.data.user);

        // Track successful login
        try {
          await trackEvent<LoginEventData>({
            type: TrackingEventType.LOGIN,
            data: {
              loginMethod: "email",
              deviceType: navigator.userAgent,
              browser: navigator.userAgent.split(" ").pop() || "unknown",
              isSuccessful: true,
            },
            userId: response.data.user.userId,
          });
        } catch (trackingError) {
          console.warn("Failed to track login event:", trackingError);
          // Continue anyway - don't block the login
        }

        // After successful login, redirect to dashboard
        // The protected route will handle role-based routing
        router.push("/dashboard");

        return { success: true, message: response.message };
      } else {
        // Handle specific error scenarios
        const errorMessage = response.message || "Login failed";

        // Check if email not verified
        if (
          errorMessage.toLowerCase().includes("email not verified") ||
          errorMessage.toLowerCase().includes("verify your email")
        ) {
          // Try to track failed login attempt, but don't block if it fails
          try {
            await trackEvent<LoginEventData>({
              type: TrackingEventType.LOGIN,
              data: {
                loginMethod: "email",
                deviceType: navigator.userAgent,
                browser: navigator.userAgent.split(" ").pop() || "unknown",
                isSuccessful: false,
                failureReason: "Email not verified",
              },
            });
          } catch (trackingError) {
            console.warn("Failed to track login event:", trackingError);
            // Continue anyway - don't block the redirect
          }

          // Don't auto-redirect; let the login page handle it
          return {
            success: false,
            message:
              "Email not verified. Please check your email for the verification code.",
          };
        }

        // Check if profile not completed
        if (
          errorMessage.toLowerCase().includes("profile not completed") ||
          errorMessage.toLowerCase().includes("complete your profile")
        ) {
          // Try to track failed login attempt, but don't block if it fails
          try {
            await trackEvent<LoginEventData>({
              type: TrackingEventType.LOGIN,
              data: {
                loginMethod: "email",
                deviceType: navigator.userAgent,
                browser: navigator.userAgent.split(" ").pop() || "unknown",
                isSuccessful: false,
                failureReason: "Profile not completed",
              },
            });
          } catch (trackingError) {
            console.warn("Failed to track login event:", trackingError);
            // Continue anyway - don't block the redirect
          }

          // Don't auto-redirect; let the login page handle it
          // Return the data from the error response so we have userId and role
          return {
            success: false,
            message: "Please complete your profile to continue.",
            data: response.data, // <-- RETURN THE DATA HERE
          };
        }

        // Track failed login attempt for other errors
        try {
          await trackEvent<LoginEventData>({
            type: TrackingEventType.LOGIN,
            data: {
              loginMethod: "email",
              deviceType: navigator.userAgent,
              browser: navigator.userAgent.split(" ").pop() || "unknown",
              isSuccessful: false,
              failureReason: errorMessage,
            },
          });
        } catch (trackingError) {
          console.warn("Failed to track login event:", trackingError);
          // Continue anyway - don't block the redirect
        }

        return { success: false, message: errorMessage };
      }
    } catch (error) {
      // Try to track failed login attempt, but don't block if it fails
      try {
        await trackEvent<LoginEventData>({
          type: TrackingEventType.LOGIN,
          data: {
            loginMethod: "email",
            deviceType: navigator.userAgent,
            browser: navigator.userAgent.split(" ").pop() || "unknown",
            isSuccessful: false,
            failureReason:
              error instanceof Error ? error.message : "Unknown error",
          },
        });
      } catch (trackingError) {
        console.warn("Failed to track login event:", trackingError);
        // Continue anyway - don't block the error handling
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const register = async (
    data: any
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await userService.basicRegister(data);
      if (response) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: "Registration failed" };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await userService.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
    } finally {
      userService.clearAuth();
      setUser(null);
      router.push("/login"); // Updated to match the correct route
    }
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
  };

  const refreshTokenMethod = async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await userService.refreshToken();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      }
      return {
        success: false,
        message: response.message || "Token refresh failed",
      };
    } catch (error) {
      return { success: false, message: "Token refresh failed" };
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshToken: refreshTokenMethod,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
