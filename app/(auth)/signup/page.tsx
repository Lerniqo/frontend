"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "Student" | "Teacher" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    if (!selectedRole) return;
    setIsLoading(true);
    router.push(`/signup/register?role=${selectedRole}`);
  };

  const handleSignIn = () => {
    setIsLoading(true);
    router.push("/login");
  };

  const roleOptions = [
    {
      id: "student",
      name: "Student",
      description: "Learn from expert teachers",
      icon: <GraduationIcon />,
    },
    {
      id: "teacher",
      name: "Teacher",
      description: "Share your knowledge",
      icon: <TeacherIcon />,
    },
  ];

  // Determine bubble colors based on selected role
  const bubbleColors =
    selectedRole === "Student"
      ? ["#ffffff", "#3b82f6", "#60a5fa", "#dbeafe", "#eff6ff"] // Blue theme
      : selectedRole === "Teacher"
      ? ["#ffffff", "#8b5cf6", "#a78bfa", "#ede9fe", "#f3e8ff"] // Purple theme
      : ["#ffffff", "#6366f1", "#8b5cf6", "#e0e7ff", "#f3e8ff"]; // Default mix

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
            Welcome to <span className="text-white">Lerniqo</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Transform your learning journey with personalized education and
            expert guidance.
          </p>
        </div>
      </div>

      {/* Right content (3/7 width) */}
      <div className="flex-[3] relative flex flex-col justify-center items-center z-20 min-h-screen bg-white/95 backdrop-blur-md shadow-2xl border-l border-white/30 p-10 text-[#1e1b4b]">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/3 via-[#7c3aed]/3 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent text-center">
            Choose Your Role
          </h2>
          <p className="text-[#6d28d9] mb-10 text-lg text-center font-medium">
            Select your role to personalize your Lerniqo experience
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-10">
            {roleOptions.map((option) => (
              <AnimatedRoleCard
                key={option.id}
                title={option.name}
                caption={option.description}
                icon={option.icon}
                selected={selectedRole === option.name}
                onClick={() =>
                  setSelectedRole(option.name as "Student" | "Teacher")
                }
              />
            ))}
          </div>

          <button
            onClick={handleSignUp}
            disabled={!selectedRole || isLoading}
            className="w-full group relative bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] text-white font-semibold py-4 px-6 shadow-lg hover:shadow-2xl hover:shadow-purple-400/50 active:scale-95 transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            <span className="relative flex items-center justify-center transition-all duration-200">
              {isLoading ? (
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
                  Processing...
                </>
              ) : (
                <>
                  Continue
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ede9fe]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/95 text-[#6b7280] rounded-full">
                Or
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-[#4b5563]">
            Already have an account?{" "}
            <button
              onClick={handleSignIn}
              className="group relative bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity duration-200 underline underline-offset-2"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
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
  }, [prefersReduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

function AnimatedRoleCard({
  title,
  caption,
  icon,
  selected,
  onClick,
}: {
  title: string;
  caption: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center gap-3 border p-6 transition-all w-48 h-48 text-center shadow-sm hover:shadow-lg hover:-translate-y-2 active:translate-y-0 rounded-2xl ${
        selected
          ? "border-[#6d28d9] bg-gradient-to-br from-[#f3e8ff] to-[#ede9fe] ring-2 ring-[#6d28d9]/30 shadow-lg scale-105"
          : "border-[#d1d5db] bg-white hover:border-[#7c3aed]/50"
      }`}
    >
      <div
        className={`flex items-center justify-center w-16 h-16 transition-transform duration-300 rounded-full ${
          selected
            ? "bg-[#6d28d9]/10 text-[#6d28d9] scale-110"
            : "bg-[#f3e8ff] text-[#6d28d9] group-hover:scale-110"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#1e1b4b] group-hover:text-[#6d28d9] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[#6b7280]">{caption}</p>
      </div>
    </button>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor">
      <path d="M12 3L1 8l11 5 9-4.09V17h2V8L12 3z" />
      <path
        d="M11 12.84L3.44 9.2V14c0 2.21 3.58 4 8 4s8-1.79 8-4v-2.8L13 15l-2-.96z"
        opacity=".6"
      />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
      <path d="M2 21a10 10 0 0 1 20 0v1H2z" opacity=".6" />
    </svg>
  );
}
