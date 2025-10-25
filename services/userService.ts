import apiClient from "@/services/apiClient";
import {
  User,
  StudentProfile,
  TeacherProfile,
  BasicRegisterData,
  StudentProfileData,
  TeacherProfileData,
  LoginData,
  VerifyEmailData,
  VerifyEmailResponse,
  VerifyEmailSuccessData,
  CompleteProfileResponse,
  UpdateProfileData,
  ChangePasswordData,
  UploadPhotoData,
  ApiResponse,
  BasicRegisterResponse,
  AuthResponse,
  TeachersListResponse,
} from "@/types/auth.types";

// Token and user management functions using localStorage
const setStoredToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const removeStoredToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

const setStoredUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(user));
  }
};

const getStoredUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

const removeStoredUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData");
  }
};

/**
 * Step 1: Basic registration (email, password, role only)
 */
const basicRegister = async (
  data: BasicRegisterData
): Promise<ApiResponse<BasicRegisterResponse>> => {
  try {
    const apiData = {
      ...data,
      email: data.email.toLowerCase(), // Convert email to lowercase
      role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
    };

    // Backend returns direct BasicRegisterResponse, not wrapped in ApiResponse
    const response = await apiClient.post<BasicRegisterResponse>(
      "/user-service/users/register",
      apiData
    );

    // Transform to standardized ApiResponse format
    return {
      success: true,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed";

    return {
      success: false,
      message: errorMessage,
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Step 2: Email verification
 */
const verifyEmail = async (
  code: string,
  email: string
): Promise<ApiResponse<VerifyEmailSuccessData>> => {
  try {
    const payload: VerifyEmailData = { code, email: email.toLowerCase() }; // Convert email to lowercase

    // The API returns a direct response format: {message, userId, role}
    const response = await apiClient.post<VerifyEmailResponse>(
      "/user-service/users/verify-email",
      payload
    );

    // Validate the response structure
    if (
      !response.data.userId ||
      !response.data.role ||
      !response.data.message
    ) {
      throw new Error("Invalid verification response format");
    }

    // Return standardized format with extracted data
    return {
      success: true,
      message: response.data.message,
      data: {
        userId: response.data.userId,
        role: response.data.role,
        message: response.data.message,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Email verification failed",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Resend verification code
 */
const resendVerificationCode = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/user-service/users/resend-verification", {
      email: email.toLowerCase(),
    }); // Convert email to lowercase

    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to resend verification code",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("/user-service/users");
  return response.data.data.users; // returns array of users
};

// Fetch only teachers (for internal use)
export const getTeachersList = async (): Promise<User[]> => {
  const response = await apiClient.get("/user-service/users/teachers"); // your new endpoint
  return response.data.data.teachers;
};

/**
 * Format student profile data for backend submission
 */
const formatStudentProfileData = (
  data: StudentProfileData
): StudentProfileData => {
  const formatOptionalString = (
    value: string | undefined
  ): string | undefined => {
    if (!value || value.trim() === "") return undefined;
    return value.trim();
  };

  const formatGender = (gender: string | undefined): string | undefined => {
    if (!gender || gender.trim() === "") return undefined;
    const genderMap: Record<string, string> = {
      male: "Male",
      female: "Female",
      other: "Other",
      "prefer-not-to-say": "Prefer not to say",
    };
    return genderMap[gender.toLowerCase()] || gender;
  };

  return {
    fullName: data.fullName.trim(),
    school: formatOptionalString(data.school),
    birthday: formatOptionalString(data.birthday),
    gradeLevel: data.gradeLevel,
    gender: formatGender(data.gender),
    parentGuardianName: formatOptionalString(data.parentGuardianName),
    relationship: formatOptionalString(data.relationship),
    parentContact: formatOptionalString(data.parentContact),
    addressCity: formatOptionalString(data.addressCity),
    learningGoals: formatOptionalString(data.learningGoals),
  };
};

/**
 * Format teacher profile data for backend submission
 */
const formatTeacherProfileData = (
  data: TeacherProfileData
): TeacherProfileData => {
  const formatOptionalString = (
    value: string | undefined
  ): string | undefined => {
    if (!value || value.trim() === "") return undefined;
    return value.trim();
  };

  return {
    fullName: data.fullName.trim(),
    birthday: formatOptionalString(data.birthday),
    address: formatOptionalString(data.address),
    phoneNumber: formatOptionalString(data.phoneNumber),
    nationalIdPassport: formatOptionalString(data.nationalIdPassport),
    yearsOfExperience: data.yearsOfExperience,
    highestEducationLevel: formatOptionalString(data.highestEducationLevel),
    qualifications: formatOptionalString(data.qualifications),
    shortBio: formatOptionalString(data.shortBio),
  };
};

/**
 * Step 3: Complete profile with personal information
 */
const completeProfile = async (
  profileData: StudentProfileData | TeacherProfileData,
  userId: string
): Promise<ApiResponse<AuthResponse>> => {
  try {
    console.log("🔄 Starting profile completion for userId:", userId);
    console.log("📝 Raw profile data:", profileData);

    // Format data based on the profile type
    let formattedData: StudentProfileData | TeacherProfileData;

    // Check if the data has student-specific fields to determine type
    if ("gradeLevel" in profileData || "parentGuardianName" in profileData) {
      formattedData = formatStudentProfileData(
        profileData as StudentProfileData
      );
      console.log("👨‍🎓 Formatted as Student profile:", formattedData);
    } else {
      formattedData = formatTeacherProfileData(
        profileData as TeacherProfileData
      );
      console.log("👨‍🏫 Formatted as Teacher profile:", formattedData);
    }

    const endpoint = `/user-service/users/complete-profile/${userId}`;
    console.log(
      "🎯 API Endpoint:",
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
    );

    // Backend returns CompleteProfileResponse directly, not wrapped
    const response = await apiClient.post<CompleteProfileResponse>(
      endpoint,
      formattedData
    );

    console.log("✅ Profile completion response:", response.data);

    // Handle the actual backend response format
    const responseData = response.data;

    // The backend returns: { message, userId, email, role, fullName }
    // It does NOT return a token - user needs to login after profile completion
    if (responseData.message && responseData.userId) {
      console.log(
        "🔐 Profile completed successfully - user will need to login"
      );

      // Return standardized format indicating success but no token
      return {
        success: true,
        message: responseData.message,
        data: {
          user: {
            userId: responseData.userId,
            email: responseData.email,
            role: responseData.role as "Student" | "Teacher" | "Admin",
            fullName: responseData.fullName,
            isVerified: true,
            isProfileCompleted: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          accessToken: "",
        },
      };
    } else {
      throw new Error("Invalid response format from complete-profile API");
    }
  } catch (error: any) {
    console.error("❌ Profile completion failed:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      userId,
      profileData,
    });

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Profile completion failed",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * User login (requires completed profile)
 */
const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post(
      "/user-service/users/login",
      {
        email: data.email.toLowerCase(), // Convert email to lowercase
        password: data.password,
      },
      { withCredentials: true } // Important for HTTP-only refresh token cookies
    );

    // Handle the new backend response format: { success: true, data: { accessToken, user }, message }
    if (
      response.data?.success &&
      response.data?.data?.accessToken &&
      response.data?.data?.user
    ) {
      const { accessToken, user } = response.data.data;

      console.log("✅ Login successful:", response.data);

      // Store both token and user data
      setStoredToken(accessToken);
      setStoredUser(user);

      return {
        success: true,
        message: response.data.message || "Login successful",
        data: {
          accessToken,
          user,
        },
      };
    } else {
      throw new Error("Invalid login response format");
    }
  } catch (error: any) {
    console.error("❌ Login failed:", error);

    // Extract error message and handle specific scenarios
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    const errorResponse = error.response?.data;

    // Return error with additional data for special cases
    return {
      success: false,
      message: errorMessage,
      error: error.response?.data?.error || error.message || "Unknown error",
      data: errorResponse?.userId
        ? ({
            user: {
              userId: errorResponse.userId,
              email: data.email.toLowerCase(),
              role: errorResponse.role || "Student",
              fullName: "",
              isVerified: errorResponse.profileCompleted !== false,
              isProfileCompleted: errorResponse.profileCompleted === true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            accessToken: "",
          } as AuthResponse)
        : undefined,
    };
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get("/user-service/users/me");

    // Handle direct user data response (not wrapped in ApiResponse)
    if (response.data && response.data.userId) {
      return {
        success: true,
        message: "User profile retrieved successfully",
        data: response.data,
      };
    } else {
      throw new Error("Invalid user profile response format");
    }
  } catch (error: any) {
    // If 401, try to refresh token
    if (error.response?.status === 401) {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess.success) {
        // Retry the request
        try {
          const response = await apiClient.get("/user-service/users/me");
          if (response.data && response.data.userId) {
            return {
              success: true,
              message: "User profile retrieved successfully",
              data: response.data,
            };
          }
        } catch (retryError) {
          // If retry fails, clear auth
          clearAuth();
        }
      } else {
        // Refresh failed, clear auth
        clearAuth();
      }
    }

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get user profile",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Refresh access token using HTTP-only refresh token cookie
 */
const refreshToken = async (): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post(
      "/user-service/users/refresh-token",
      {},
      { withCredentials: true }
    );

    // Handle the backend response format: { success: true, data: { accessToken, user }, message }
    if (
      response.data?.success &&
      response.data?.data?.accessToken &&
      response.data?.data?.user
    ) {
      const { accessToken, user } = response.data.data;

      // Update stored token and user data
      setStoredToken(accessToken);
      setStoredUser(user);

      return {
        success: true,
        message: response.data.message || "Token refreshed successfully",
        data: {
          accessToken,
          user,
        },
      };
    } else {
      throw new Error("Invalid refresh token response format");
    }
  } catch (error: any) {
    console.error("❌ Token refresh failed:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Token refresh failed",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Update current user profile
 */
const updateProfile = async (
  data: UpdateProfileData
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      "/user-service/users/me",
      data
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * User logout
 */
const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
      "/user-service/users/logout",
      {},
      { withCredentials: true } // Important for HTTP-only refresh token cookies
    );

    clearAuth();
    return {
      success: true,
      message: response.data?.message || "Logout successful",
    };
  } catch (error: any) {
    // Always remove token and user data even if logout fails
    clearAuth();

    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Logout failed",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Get list of all teachers (public)
 */
const getTeachers = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<TeachersListResponse>> => {
  try {
    const response = await apiClient.get<ApiResponse<TeachersListResponse>>(
      `/user-service/users/teachers?page=${page}&limit=${limit}`
    );

    return {
      message: response.data.message,
      data: response.data.data,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get teachers list",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Get specific teacher profile (public)
 */
const getTeacherProfile = async (
  teacherId: string
): Promise<ApiResponse<TeacherProfile>> => {
  try {
    const response = await apiClient.get<ApiResponse<TeacherProfile>>(
      `/user-service/users/teachers/${teacherId}`
    );
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get teacher profile",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Change password
 */
const changePassword = async (
  data: ChangePasswordData
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put<ApiResponse>(
      "/user-service/user/change-password",
      data
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to change password",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Upload profile photo
 */
const uploadPhoto = async (
  data: UploadPhotoData
): Promise<ApiResponse<{ photoUrl: string }>> => {
  try {
    const formData = new FormData();
    formData.append("photo", data.photo);

    const response = await apiClient.post<ApiResponse<{ photoUrl: string }>>(
      "/user-service/user/upload-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to upload photo",
      error: error.response?.data?.error || error.message || "Unknown error",
    };
  }
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = (): boolean => {
  return !!getStoredToken() && !!getStoredUser();
};

/**
 * Get current token
 */
const getToken = (): string | null => {
  return getStoredToken();
};

/**
 * Get stored user data
 */
const getUser = (): User | null => {
  return getStoredUser();
};

/**
 * Clear authentication state
 */
const clearAuth = (): void => {
  removeStoredToken();
  removeStoredUser();
};

// Export a singleton-like object with the same API shape as before
export const userService = {
  basicRegister,
  verifyEmail,
  resendVerificationCode,
  completeProfile,
  login,
  getCurrentUser,
  refreshToken,
  updateProfile,
  logout,
  getTeachers,
  getTeachersList,
  getTeacherProfile,
  changePassword,
  uploadPhoto,
  isAuthenticated,
  getToken,
  getUser,
  clearAuth,
};

export default userService;
