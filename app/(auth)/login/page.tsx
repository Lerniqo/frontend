"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useAuth } from "@/contexts/AuthContext";

function LoginPageContent() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const { login: contextLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileIncompleteMessage, setProfileIncompleteMessage] =
    useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  // Memoize bubble colors to prevent re-initialization on state changes
  const bubbleColors = useMemo(
    () => ["#ffffff", "#8b5cf6", "#a78bfa", "#ede9fe", "#f3e8ff"],
    []
  );

  useEffect(() => {
    // Animation
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = (await contextLogin(
        formData.email,
        formData.password
      )) as {
        success: boolean;
        message: string;
        data?: { user?: { userId: string; role: string } };
      };

      if (response.success) {
        // Login successful, redirect to dashboard
        // The AuthContext handles the redirect
      } else {
        const message = response.message.toLowerCase();

        // Handle email not verified
        if (message.includes("email not verified")) {
          // Redirect to verify email page
          router.push(
            `/signup/verify-email?email=${encodeURIComponent(
              formData.email
            )}&fromLogin=true`
          );
          return;
        }

        // Handle profile not completed
        if (message.includes("profile not completed")) {
          // The response already contains userId and role from the error response
          if (response.data?.user?.userId && response.data?.user?.role) {
            // Show message
            setProfileIncompleteMessage(true);
            setRedirectCountdown(3);

            console.error("📋 Profile not completed - Countdown starting...");
            console.error("User ID:", response.data.user.userId);
            console.error("Role:", response.data.user.role);

            // Start countdown and redirect
            const interval = setInterval(() => {
              setRedirectCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(interval);
                  // Redirect to complete profile
                  const redirectUrl = `/signup/complete-profile?userId=${encodeURIComponent(
                    response.data?.user?.userId || ""
                  )}&role=${encodeURIComponent(
                    response.data?.user?.role || ""
                  )}`;
                  console.error("🔄 Redirecting to:", redirectUrl);
                  router.push(redirectUrl);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            console.error("❌ Missing userId or role in response");
            setErrors({
              submit:
                "Unable to retrieve profile information. Please try again.",
            });
          }
          return;
        }

        // Generic login error
        setErrors({
          submit: response.message || "Invalid email or password",
        });
      }
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] overflow-hidden text-gray-900">
      {/* Bubble Background */}
      <BubbleCanvas
        className="absolute inset-0 z-0"
        bubbleCount={36}
        colors={bubbleColors}
        minSize={18}
        maxSize={56}
        maxSpeed={0.6}
        blurPx={2}
      />

      {/* Left content (4/7 width) */}
      <div className="flex-[4] flex flex-col justify-center items-start text-white p-10 relative z-10">
        <div className="absolute top-8 left-10 flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-white/25 backdrop-blur-md text-[#6d28d9] text-2xl font-extrabold shadow-lg rounded-xl">
            L
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">
            Lerniqo
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-5xl font-extrabold mb-4 text-white">
            Welcome Back to <span className="text-white">Lerniqo</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Sign in to continue your personalized learning journey and access
            your courses.
          </p>
        </div>
      </div>

      {/* Right content (3/7 width) */}
      <div
        ref={cardRef}
        className="flex-[3] relative flex flex-col justify-center items-center z-20 min-h-screen bg-white/95 backdrop-blur-md shadow-2xl border-l border-white/30 p-10"
      >
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/3 via-[#7c3aed]/3 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent text-center">
            Sign In
          </h2>
          <p className="text-[#6d28d9] mb-10 text-lg text-center font-medium">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Incomplete Message */}
            {profileIncompleteMessage && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  ⚠️ Please Complete Your Profile
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  Your email has been verified. Now you need to complete your
                  profile to access your account.
                </p>
                <p className="text-sm text-yellow-600">
                  Redirecting in {redirectCountdown} seconds...
                </p>
              </div>
            )}
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1e1b4b] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading || profileIncompleteMessage}
                className="w-full px-4 py-2 border border-[#ede9fe] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d28d9] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1e1b4b] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading || profileIncompleteMessage}
                  className="w-full px-4 py-2 border border-[#ede9fe] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d28d9] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6d28d9] hover:text-[#7c3aed]"
                  disabled={isLoading || profileIncompleteMessage}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-[#6d28d9] hover:text-[#7c3aed] underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || profileIncompleteMessage}
              className="w-full group relative bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] text-white font-semibold py-4 px-6 shadow-lg hover:shadow-2xl hover:shadow-purple-400/50 active:scale-95 transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <span className="relative flex items-center justify-center transition-all duration-200">
                {profileIncompleteMessage ? (
                  "Redirecting..."
                ) : isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg
                      className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 r">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ede9fe]"></div>
            </div>
            <div className="relative flex justify-center text-sm ">
              <span className="px-2 bg-white/95 text-[#6b7280] rounded-full">
                Or
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-[#4b5563]">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="group relative bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity duration-200 underline underline-offset-2"
              disabled={isLoading || profileIncompleteMessage}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function BubbleCanvas({
  className,
  bubbleCount = 20,
  colors = ["#ffffff", "#a78bfa", "#c4b5fd", "#ddd6fe"],
  minSize = 16,
  maxSize = 48,
  maxSpeed = 0.6,
  blurPx = 0,
}: {
  className: string;
  bubbleCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  maxSpeed?: number;
  blurPx?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const resize = () => {
      const { width, height } = (
        canvas.parentElement as HTMLElement
      ).getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const bubbles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
    }> = Array.from({ length: bubbleCount }).map(() => ({
      x: rnd(0, canvas.width / dpr),
      y: rnd(0, canvas.height / dpr),
      r: rnd(minSize, maxSize),
      vx: rnd(-maxSpeed, maxSpeed),
      vy: rnd(-maxSpeed, maxSpeed),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: rnd(0.35, 0.8),
    }));

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
      for (const b of bubbles) {
        if (!prefersReduced) {
          b.x += b.vx;
          b.y += b.vy;
        }
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        if (b.x - b.r > w) b.x = -b.r;
        if (b.x + b.r < 0) b.x = w + b.r;
        if (b.y - b.r > h) b.y = -b.r;
        if (b.y + b.r < 0) b.y = h + b.r;
        ctx.globalAlpha = b.alpha;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = b.color;
        ctx.fill();
      }
      ctx.restore();
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReduced, blurPx, bubbleCount, colors, maxSize, maxSpeed, minSize]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
