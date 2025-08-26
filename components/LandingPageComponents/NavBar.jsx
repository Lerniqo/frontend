"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const ctaRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Navigation items
  const navItems = [
    { name: "Home", href: "#hero-section" },
    { name: "How It Works", href: "#how-it-works-section" },
    { name: "Testimonials", href: "#testimonials-section" },
    { name: "Get Started", href: "#cta-section" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    // Initial setup - hide elements
    gsap.set([logoRef.current, linksRef.current, ctaRef.current], {
      opacity: 0,
      y: -30,
    });

    // Navbar slide down animation
    tl.fromTo(
      navRef.current,
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }
    )
      // Animate logo
      .to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.5"
      )
      // Animate navigation links
      .to(
        linksRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      )
      // Animate CTA button
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isMenuOpen]);

  // Smooth scroll function
  const handleNavClick = (href, e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div ref={logoRef} className="flex-shrink-0">
              <a
                href="#hero-section"
                onClick={(e) => handleNavClick("#hero-section", e)}
                className="group flex items-center space-x-2"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg lg:text-xl">
                    L
                  </span>
                </div>
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                  Learniqo
                </span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div
              ref={linksRef}
              className="hidden lg:flex items-center space-x-8"
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 group py-2"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div ref={ctaRef} className="hidden lg:block">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.fullName}
                  </span>
                  <Link
                    href={user?.role === 'Student' ? '/Student/Dashboard' : '/Teacher/Dashboard'}
                    className="group relative px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:shadow-purple-500/25"
                  >
                    <span className="relative z-10">Dashboard</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/Login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/SignUp"
                    className="group relative px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:shadow-purple-500/25"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-purple-100 shadow-lg"
          >
            <div className="container mx-auto px-6 py-4">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 border-b border-gray-100 last:border-b-0"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="text-center text-gray-700 font-medium py-2 border-b border-gray-100">
                        Welcome, {user?.fullName}
                      </div>
                      <Link
                        href={user?.role === 'Student' ? '/Student/Dashboard' : '/Teacher/Dashboard'}
                        className="block w-full px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg transform hover:scale-105 text-center"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full px-6 py-3 text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 border border-gray-300 rounded-full hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/Login"
                        className="block w-full px-6 py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 border border-gray-300 rounded-full hover:bg-blue-50 text-center"
                      >
                        Login
                      </Link>
                      <Link
                        href="/SignUp"
                        className="block w-full px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg transform hover:scale-105 text-center"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default NavBar;