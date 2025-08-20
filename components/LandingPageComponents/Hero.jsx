"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideContainerRef = useRef(null);
  const textContentRef = useRef(null);
  const ctaRef = useRef(null);
  const intervalRef = useRef(null);

  const slides = [
    {
      id: 1,
      headline: "Learn O/L Maths with Learniqo",
      subtitle: "Start your personalized learning journey today!",
      cta: { text: "Sign Up", link: "/register" },
      bgImage: "/images/hero-slide1-bg.jpg",
      badge: "Free to Start",
      bgColor: "from-blue-600 via-purple-600 to-blue-800",
    },
    {
      id: 2,
      headline: "Follow Your Own Study Path",
      subtitle:
        "Set your pace, track your progress, and focus on what you need.",
      cta: { text: "See How It Works", link: "#how-it-works" },
      bgImage: "/images/hero-slide2-bg.jpg",
      bgColor: "from-purple-600 via-blue-600 to-purple-800",
    },
    {
      id: 3,
      headline: "Learn Anything from Our Lesson Library",
      subtitle:
        "Access thousands of lessons and clear doubts instantly with our AI assistant.",
      cta: { text: "Explore Lessons", link: "#lessons" },
      bgImage: "/images/hero-slide3-bg.jpg",
      bgColor: "from-blue-700 via-purple-500 to-blue-600",
    },
    {
      id: 4,
      headline: "Get More Help from Teachers",
      subtitle:
        "Personal guidance and doubt-solving sessions when you need it.",
      cta: { text: "Connect with Teachers", link: "/teachers" },
      bgImage: "/images/hero-slide4-bg.jpg",
      bgColor: "from-purple-700 via-blue-500 to-purple-600",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000); // 6 seconds per slide
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  // GSAP animations for slide transitions
  useEffect(() => {
    const tl = gsap.timeline();

    // Animate out current content
    tl.to(textContentRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: "power2.inOut",
    })
      .to(
        ctaRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.2,
          ease: "power2.inOut",
        },
        "-=0.1"
      )
      // Animate in new content
      .to(
        textContentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "+=0.2"
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      );
  }, [currentSlide]);

  // Initial animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      textContentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prev);
  };

  const handleCTAClick = (link) => {
    if (link.startsWith("#")) {
      // Smooth scroll to section
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to external link
      window.location.href = link;
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      id="hero-section"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background with gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgColor} transition-all duration-1000 ease-in-out`}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-all duration-1000"
          style={{
            backgroundImage: `url(${currentSlideData.bgImage})`,
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        <div className="container mx-auto px-6 lg:px-8 flex items-center">
          <div className="w-full max-w-4xl mx-auto text-center">
            {/* Badge (only for first slide) */}
            {currentSlideData.badge && (
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
                  ✨ {currentSlideData.badge}
                </span>
              </div>
            )}

            {/* Text Content */}
            <div ref={textContentRef} className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {currentSlideData.headline}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* CTA Button */}
            <div ref={ctaRef} className="mb-12">
              <button
                onClick={() => handleCTAClick(currentSlideData.cta.link)}
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-purple-700 bg-white rounded-full hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {currentSlideData.cta.text}
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 transition-all duration-300 text-sm"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isAutoPlaying ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span>{isAutoPlaying ? "Auto" : "Manual"}</span>
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 left-6 z-20">
        <div className="px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
