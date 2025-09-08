import { FaRobot, FaComments } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface AITutorButtonProps {
  onClick: () => void;
}

export default function AITutorButton({ onClick }: AITutorButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (buttonRef.current) {
      // Initial animation - slide in from bottom right
      gsap.fromTo(
        buttonRef.current,
        {
          scale: 0,
          opacity: 0,
          x: 50,
          y: 50,
        },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 1, // Delay to appear after page load
        }
      );

      // Floating animation
      gsap.to(buttonRef.current, {
        y: -8,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleClick = () => {
    if (buttonRef.current) {
      // Click animation
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }

    onClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform-gpu
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:shadow-xl hover:from-purple-700 hover:to-blue-700
          active:scale-95
          flex items-center justify-center
          group
        `}
        title="AI Tutor Assistant"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-75 blur-lg scale-110 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon */}
        <div className="relative z-10 text-white">
          {isHovered ? (
            <FaComments size={24} className="transition-all duration-300" />
          ) : (
            <FaRobot size={24} className="transition-all duration-300" />
          )}
        </div>

        {/* Pulse effect on hover */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full border-2 border-white opacity-30 animate-ping"></div>
      </button>

      {/* Tooltip */}
      <div
        className={`
        absolute bottom-20 right-0 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap
        transition-all duration-300 transform
        ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }
      `}
      >
        Need help? Ask AI Tutor!
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
}
