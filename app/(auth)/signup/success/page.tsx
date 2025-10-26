"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

// BubbleCanvas Component
const BubbleCanvas = ({
  bubbleCount = 30,
  colors = ["#ffffff", "#8b5cf6", "#a78bfa", "#ede9fe", "#f3e8ff"],
  minSize = 10,
  maxSize = 60,
  maxSpeed = 1.5,
  blurPx = 2,
}: {
  bubbleCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  maxSpeed?: number;
  blurPx?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      directionX: number;
      directionY: number;
      opacity: number;
    }>
  >([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize bubbles
    bubblesRef.current = Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * maxSpeed + 0.5,
      directionX: (Math.random() - 0.5) * 2,
      directionY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Update and draw bubbles
      bubblesRef.current.forEach((bubble) => {
        bubble.x += bubble.directionX * bubble.speed;
        bubble.y += bubble.directionY * bubble.speed;

        // Bounce off walls
        if (bubble.x - bubble.size < 0 || bubble.x + bubble.size > rect.width) {
          bubble.directionX *= -1;
        }
        if (
          bubble.y - bubble.size < 0 ||
          bubble.y + bubble.size > rect.height
        ) {
          bubble.directionY *= -1;
        }

        // Draw bubble
        ctx.fillStyle = bubble.color;
        ctx.globalAlpha = bubble.opacity;
        ctx.filter = `blur(${blurPx}px)`;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.filter = "blur(0px)";
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
      animate();
    }

    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbleCount, colors, minSize, maxSize, maxSpeed, blurPx]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default function SignupSuccessPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

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

  useEffect(() => {
    // Auto-redirect after countdown
    if (countdown <= 0) {
      router.push("/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleContinueToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* Left Side - Animated Background */}
      <div className="w-4/7 relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f9f5ff] via-[#ede9fe] to-[#e5e0ff]">
        <BubbleCanvas
          bubbleCount={35}
          colors={["#ffffff", "#8b5cf6", "#a78bfa", "#ede9fe", "#f3e8ff"]}
          minSize={15}
          maxSize={80}
          maxSpeed={1.2}
          blurPx={2}
        />

        {/* Decorative Gradient Orb - Top Left */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Gradient Orb - Bottom Right */}
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-[#7c3aed]/20 to-[#a78bfa]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Center Content */}
        <div className="relative z-10 text-center px-8 max-w-md">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-3">
            Account Created! 🎉
          </h2>
          <p className="text-[#5b4b9a] text-lg leading-relaxed">
            Your profile is all set. You&apos;re ready to start your learning
            journey!
          </p>
        </div>
      </div>

      {/* Right Side - Success Message */}
      <div className="w-full lg:w-3/7 h-screen bg-white/98 backdrop-blur-md shadow-2xl border-l border-white/40 overflow-y-auto flex flex-col relative">
        {/* Enhanced gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/4 via-[#7c3aed]/2 to-[#a78bfa]/3 pointer-events-none"></div>

        {/* Decorative Top Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#a78bfa]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Content Container */}
        <div
          ref={cardRef}
          className="relative z-10 flex-1 flex flex-col justify-center px-8 sm:px-12 py-12"
        >
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
                Welcome! ✨
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-1 bg-gradient-to-r from-[#6d28d9] to-transparent rounded-full w-12" />
                <p className="text-[#5b4b9a] text-sm font-medium">
                  Registration Complete
                </p>
              </div>
            </div>

            {/* Success Details Card */}
            <div className="bg-gradient-to-br from-[#f9f5ff] to-[#ede9fe] rounded-2xl p-8 border border-[#e5e0ff] space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#7c3aed]">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1b4b]">
                    Profile Completed Successfully
                  </h3>
                  <p className="text-sm text-[#5b4b9a] mt-1">
                    Your account is now fully set up and ready to use.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#d8d0e8]">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#7c3aed]">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1b4b]">
                    Email Verified
                  </h3>
                  <p className="text-sm text-[#5b4b9a] mt-1">
                    Your email address has been confirmed.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#1e1b4b]">
                What&apos;s Next?
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#5b4b9a]">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#ede9fe] text-[#6d28d9] text-sm font-bold">
                    1
                  </span>
                  <span>Log in with your credentials</span>
                </div>
                <div className="flex items-center gap-3 text-[#5b4b9a]">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#ede9fe] text-[#6d28d9] text-sm font-bold">
                    2
                  </span>
                  <span>Complete your dashboard setup</span>
                </div>
                <div className="flex items-center gap-3 text-[#5b4b9a]">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#ede9fe] text-[#6d28d9] text-sm font-bold">
                    3
                  </span>
                  <span>Start exploring learning resources</span>
                </div>
              </div>
            </div>

            {/* Countdown Message */}
            <div className="p-4 bg-[#f9f5ff] border border-[#e5e0ff] rounded-lg text-sm text-[#5b4b9a] text-center">
              Redirecting to login in{" "}
              <span className="font-bold text-[#6d28d9]">{countdown}</span>{" "}
              seconds...
            </div>

            {/* CTA Button */}
            <button
              onClick={handleContinueToLogin}
              className="w-full bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg hover:shadow-[#7c3aed]/30 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <span className="relative flex items-center justify-center gap-2">
                Go to Dashboard
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>

            {/* Footer Info */}
            <p className="text-center text-xs text-[#9b8bb4] pt-4">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-[#6d28d9] hover:underline font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#6d28d9] hover:underline font-medium"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
