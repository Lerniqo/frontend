"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  UserPlusIcon,
  DocumentCheckIcon,
  MapIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const StepCard = ({
  step,
  title,
  description,
  icon: Icon,
  highlight,
  index,
}) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;

    if (!card || !icon) return;

    // Set initial state
    gsap.set(card, {
      opacity: 0,
      y: 50,
      scale: 0.95,
    });

    // Create scroll trigger animation
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      delay: index * 0.2,
    });

    // Icon hover animations
    const handleMouseEnter = () => {
      gsap.to(icon, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50 group"
    >
      {/* Step Number */}
      <div className="absolute -top-4 left-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
        {step}
      </div>

      {/* Icon Container */}
      <div className="mb-6 mt-4">
        <div
          ref={iconRef}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"
        >
          <Icon className="w-8 h-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed mb-4">{description}</p>

        {highlight && (
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-medium rounded-full">
            {highlight}
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

const CTAButton = () => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    gsap.set(button, { opacity: 0, y: 30 });

    gsap.to(button, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: button,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      delay: 0.6,
    });

    const handleMouseEnter = () => {
      gsap.to(button.querySelector(".arrow"), {
        x: 5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button.querySelector(".arrow"), {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={buttonRef} className="text-center mt-12">
      <button className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        Get Started
        <ArrowRightIcon className="w-5 h-5 arrow transition-transform duration-300" />
      </button>
    </div>
  );
};

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (!section || !title || !subtitle) return;

    // Initial animation for title and subtitle
    gsap.set([title, subtitle], { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    }).to(
      subtitle,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4"
    );
  }, []);

  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description:
        "Create your Learniqo account in seconds and start your personalized learning journey.",
      icon: UserPlusIcon,
      highlight: "Free to Start",
    },
    {
      step: 2,
      title: "Take Initial Assessment",
      description:
        "Complete a quick assessment to help us understand your current level and strengths.",
      icon: DocumentCheckIcon,
    },
    {
      step: 3,
      title: "Generate Your Learning Path",
      description:
        "Based on your assessment, receive a personalized study path to master topics efficiently.",
      icon: MapIcon,
    },
    {
      step: 4,
      title: "Start Learning",
      description:
        "Dive into your personalized lessons, complete quizzes, track your progress, and unlock rewards as you master O/L Maths.",
      icon: BookOpenIcon,
      highlight: "Your journey begins now!",
    },
  ];

  return (
    <section
      id="how-it-works-section"
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            How It{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Start your personalized O/L Maths learning journey in just three
            simple steps. Join thousands of students already mastering
            mathematics with Learniqo.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
          {steps.map((step, index) => (
            <StepCard key={step.step} {...step} index={index} />
          ))}
        </div>

        {/* CTA Button */}
        <CTAButton />
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent pointer-events-none" />
    </section>
  );
}
