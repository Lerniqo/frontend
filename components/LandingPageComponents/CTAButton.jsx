"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const CTAButton = ({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  ...props
}) => {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const ripple = rippleRef.current;

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });

      if (variant === "primary") {
        gsap.to(ripple, {
          scale: 1,
          opacity: 0.8,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      if (variant === "primary") {
        gsap.to(ripple, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    // Click animation
    const handleClick = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create click ripple effect
      gsap.set(ripple, {
        x: x - 50,
        y: y - 50,
        scale: 0,
        opacity: 0.6,
      });

      gsap.to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Button bounce
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });

      if (onClick) onClick(e);
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick);
    };
  }, [variant, onClick]);

  const baseStyles = `
    relative overflow-hidden px-8 py-4 rounded-full font-semibold text-lg
    transition-all duration-300 transform cursor-pointer
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-lg hover:shadow-xl
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700
      text-white border-2 border-transparent
      hover:from-blue-700 hover:via-purple-700 hover:to-blue-800
      focus:ring-blue-500 focus:ring-offset-white
      shadow-blue-500/25 hover:shadow-blue-600/30
    `,
    secondary: `
      bg-white text-blue-700 border-2 border-blue-600
      hover:bg-blue-50 hover:border-blue-700
      focus:ring-blue-500 focus:ring-offset-white
      shadow-blue-200/50 hover:shadow-blue-300/60
    `,
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  const buttonContent = (
    <button ref={buttonRef} className={combinedClassName} {...props}>
      {/* Ripple effect overlay */}
      <div
        ref={rippleRef}
        className="absolute inset-0 bg-white rounded-full pointer-events-none"
        style={{
          width: "100px",
          height: "100px",
          opacity: 0,
          transform: "scale(0)",
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>

      {/* Gradient overlay for primary variant */}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-white/10 to-blue-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full" />
      )}
    </button>
  );

  // If href is provided, wrap in Link component
  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};

export default CTAButton;
