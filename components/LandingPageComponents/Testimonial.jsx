"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial, isActive }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`testimonial-card flex-shrink-0 w-full md:w-96 p-8 bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 ${
        isActive ? "scale-105 shadow-xl" : ""
      }`}
    >
      <div className="text-center">
        {/* Profile Photo */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {!imageError ? (
                <Image
                  src={testimonial.photo}
                  alt={testimonial.name}
                  width={76}
                  height={76}
                  className="rounded-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <StarRating rating={testimonial.rating} />

        {/* Review Text */}
        <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
          "{testimonial.review}"
        </blockquote>

        {/* Student Name */}
        <cite className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {testimonial.name}
        </cite>
      </div>
    </div>
  );
};

// Navigation Dots Component
const NavigationDots = ({ total, current, onDotClick }) => {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {[...Array(total)].map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === current
              ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          aria-label={`Go to testimonial ${index + 1}`}
        />
      ))}
    </div>
  );
};

// Main Testimonials Section Component
const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Anika Perera",
      photo: "/students/anika.jpg",
      review:
        "Learniqo made O/L Maths so much fun! I can learn at my own pace and track my progress easily.",
      rating: 5,
    },
    {
      id: 2,
      name: "Rohan Silva",
      photo: "/students/rohan.jpg",
      review:
        "The personalized study path really helped me focus on the topics I struggled with.",
      rating: 4,
    },
    {
      id: 3,
      name: "Samantha Jayasuriya",
      photo: "/students/samantha.jpg",
      review:
        "I love the 3D study room! It makes learning so interactive and fun.",
      rating: 5,
    },
  ];

  // Initialize GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial carousel position
      if (carouselRef.current) {
        gsap.set(carouselRef.current, { x: 0 });
      }

      // Section fade-in animation
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Testimonial cards stagger animation
      gsap.fromTo(
        ".testimonial-card",
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Navigation functions
  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;

    setIsAnimating(true);
    setCurrentIndex(index);

    // Animate carousel movement using GSAP for smooth transitions
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        x: -(index * (100 / testimonials.length)) + "%",
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => setIsAnimating(false),
      });
    } else {
      setIsAnimating(false);
    }
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex =
      (currentIndex - 1 + testimonials.length) % testimonials.length;
    goToSlide(prevIndex);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        goToSlide(nextIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, testimonials.length]);

  return (
    <section
      id="testimonials-section"
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how Learniqo is transforming O/L Mathematics education
            through personalized learning experiences
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
          </div>
        </div>

        {/* Desktop Carousel View */}
        <div className="hidden md:block relative">
          <div className="overflow-hidden rounded-3xl">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-600 ease-out"
              style={{
                width: `${testimonials.length * 100}%`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex justify-center px-8"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    isActive={index === currentIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Navigation Dots */}
          <NavigationDots
            total={testimonials.length}
            current={currentIndex}
            onDotClick={goToSlide}
          />
        </div>

        {/* Mobile Stacked View */}
        <div className="md:hidden space-y-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex justify-center">
              <TestimonialCard testimonial={testimonial} isActive={true} />
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-25 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
    </section>
  );
};

export default TestimonialsSection;
