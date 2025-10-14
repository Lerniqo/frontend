"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { gsap } from "gsap";

interface WelcomeLearningPathGenerationProps {
  onPresentationComplete: () => void;
}

const WelcomeLearningPathGeneration: React.FC<
  WelcomeLearningPathGenerationProps
> = ({ onPresentationComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(
    () => [
      {
        header: "Welcome to the Lerniqo Learning Path Generator!",
        body: "Get ready to unlock a personalized learning journey tailored just for you!\nBefore we create your learning path, we need to understand your current knowledge through a short quiz.",
        buttonText: "Start Quiz",
        showTooltip: false,
        showButton: true,
      },
      {
        header: "Quick Knowledge Check",
        body: "This quiz will help us understand your strengths and areas to focus on.\nIt's short, fun, and will take only a few minutes. Don't worry—there are no wrong answers!",
        buttonText: "Begin Quiz",
        showTooltip: true,
        showButton: true,
      },
      {
        header:
          "Your learning adventure begins here—let's discover the best path for you!",
        body: "",
        buttonText: "",
        showTooltip: false,
        showButton: false,
      },
    ],
    []
  );

  const animateSlideIn = useCallback(() => {
    const tl = gsap.timeline();

    // Reset positions
    gsap.set(
      [
        headerRef.current,
        bodyRef.current,
        buttonRef.current,
        tooltipRef.current,
      ],
      {
        opacity: 0,
        y: 50,
      }
    );

    // Animate in sequence
    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)",
    })
      .to(
        bodyRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // Show tooltip if needed
    if (slides[currentSlide].showTooltip) {
      tl.to(
        tooltipRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }
  }, [currentSlide, slides]);

  useEffect(() => {
    // Initial animation for the first slide
    animateSlideIn();
  }, [animateSlideIn]);

  const animateSlideOut = () => {
    const tl = gsap.timeline();

    tl.to(
      [
        headerRef.current,
        bodyRef.current,
        buttonRef.current,
        tooltipRef.current,
      ],
      {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power2.in",
        stagger: 0.1,
      }
    );

    return tl;
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const slideOutTl = animateSlideOut();

      slideOutTl.call(() => {
        setCurrentSlide((prev) => prev + 1);
      });

      slideOutTl.call(() => {
        setTimeout(() => {
          animateSlideIn();

          // If it's the motivational slide (last slide), auto-proceed after 2 seconds
          if (currentSlide + 1 === slides.length - 1) {
            setTimeout(() => {
              // Animation before completing presentation
              const completeTl = gsap.timeline();

              completeTl
                .to(slideRef.current, {
                  opacity: 0,
                  scale: 0.9,
                  duration: 0.8,
                  ease: "power2.inOut",
                })
                .call(() => {
                  onPresentationComplete();
                });
            }, 2000);
          }
        }, 100);
      });
    } else {
      // Animation before completing presentation
      const completeTl = gsap.timeline();

      completeTl
        .to(slideRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power2.inOut",
        })
        .call(() => {
          onPresentationComplete();
        });
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div
        ref={slideRef}
        className="w-full h-full flex flex-col items-center justify-center text-center relative"
      >
        {/* Main Header */}
        <h1
          ref={headerRef}
          className="text-4xl md:text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 bg-clip-text text-transparent mb-8 leading-tight px-4"
        >
          {currentSlideData.header}
        </h1>

        {/* Body Content */}
        {currentSlideData.body && (
          <div ref={bodyRef} className="mb-8 max-w-3xl mx-auto px-4">
            {currentSlideData.body.split("\n").map((line, index) => (
              <p
                key={index}
                className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Action Button */}
        {currentSlideData.showButton && (
          <button
            ref={buttonRef}
            onClick={handleNext}
            className="px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            {currentSlideData.buttonText}
          </button>
        )}

        {/* Motivational Tooltip */}
        {currentSlideData.showTooltip && (
          <div
            ref={tooltipRef}
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 opacity-0 px-4"
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-2xl px-6 py-3 shadow-lg">
                <p className="text-purple-700 font-semibold text-lg">
                  &ldquo;Your learning adventure begins here&mdash;let&apos;s
                  discover the best path for you!&rdquo;
                </p>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-100 border-r-2 border-b-2 border-purple-300 rotate-45"></div>
            </div>
          </div>
        )}

        {/* Progress Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 scale-125"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-300 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute bottom-60 right-10 w-14 h-14 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
      </div>
    </div>
  );
};

export default WelcomeLearningPathGeneration;
