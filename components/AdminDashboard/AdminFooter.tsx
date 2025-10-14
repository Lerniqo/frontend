"use client";

import React from "react";
import Link from "next/link";

const AdminFooter: React.FC = () => {
  const quickLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "User Management", href: "/user-management" },
    { name: "Content Management", href: "/content" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "System Status", href: "/status" },
    { name: "Contact Support", href: "/support" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-800 mt-auto relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.3),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.3),transparent_60%)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <div className="mb-4">
              <h3 className="text-xl font-extrabold tracking-wider font-sans bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Learniqo Admin
              </h3>
              <p className="text-slate-400 mt-1 text-sm font-medium">
                Administrative Dashboard
              </p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Empowering administrators with comprehensive tools to manage and
              optimize educational platforms for the future of learning.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Support & Resources
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-xs text-center md:text-left">
              © 2025 Learniqo Admin Dashboard. All rights reserved.
            </div>
            <div className="text-slate-400 text-xs text-center md:text-right">
              Built for comprehensive educational platform management
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
