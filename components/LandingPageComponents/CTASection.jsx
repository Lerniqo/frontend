"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTAButton from "./CTAButton";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonsRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subtext = subtextRef.current;
    const buttons = buttonsRef.current;
    const background = backgroundRef.current;

    // Set initial states - keep buttons visible by default
    gsap.set([headline, subtext], {
      opacity: 0,
      y: 50,
    });

    // Don't hide buttons initially - they should be visible
    // gsap.set(buttons.children, {
    //   opacity: 0,
    //   y: 50,
    // });

    gsap.set(background, {
      scale: 0.8,
      opacity: 0,
    });

    // Create timeline for entrance animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        onRefresh: () => {
          // If section is already in view on page load, play immediately
          if (ScrollTrigger.isInViewport(section)) {
            tl.play();
          }
        },
      },
    });

    // Fallback animation - play immediately if section is in viewport on load
    const checkInView = () => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

      if (isInView) {
        tl.play();
      }
    };

    // Check immediately and after a short delay
    checkInView();
    setTimeout(checkInView, 100);

    // Animate background first
    tl.to(background, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
    })
      // Animate headline
      .to(
        headline,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      )
      // Animate subtext
      .to(
        subtext,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );
    // Animate buttons with stagger - commented out since buttons are visible by default
    // .to(
    //   buttons.children,
    //   {
    //     opacity: 1,
    //     y: 0,
    //     duration: 0.6,
    //     ease: "back.out(1.7)",
    //     stagger: 0.2,
    //   },
    //   "-=0.3"
    // );

    // Floating animation for background shapes
    gsap.to(".floating-shape", {
      y: -15,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5,
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="cta-section"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100"
    >
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-800/10"></div>

        {/* Floating shapes */}
        <div className="floating-shape absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
        <div className="floating-shape absolute top-1/3 right-16 w-32 h-32 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full opacity-15 blur-2xl"></div>
        <div className="floating-shape absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full opacity-20 blur-xl"></div>
        <div className="floating-shape absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full opacity-25 blur-lg"></div>

        {/* Geometric patterns */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border border-blue-200/30 rounded-full"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
          <div className="w-48 h-48 border border-purple-200/30 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center z-10">
        {/* Free Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium mb-8 shadow-lg">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Free to Start - No Hidden Costs
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Start your journey to{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            mastering Maths
          </span>{" "}
          today!
        </h2>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Join thousands of O/L students who are already improving their Maths
          skills.
          <span className="font-semibold text-purple-700">
            {" "}
            It's free to start and easy to join!
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <CTAButton variant="primary" href="/SignUp" className="group">
            Sign Up Now
            <svg
              className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
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
          </CTAButton>

          <CTAButton variant="secondary" href="/demo">
            Learn More
          </CTAButton>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <p className="text-sm text-gray-600 mb-4">
            Trusted by 1000+ students
          </p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">4.9/5</span>
            </div>
            <div className="text-sm text-gray-600">Free Trial</div>
            <div className="text-sm text-gray-600">No Credit Card</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
