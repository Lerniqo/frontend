'use client';

import React from 'react';
import Link from 'next/link';

const TeacherFooter: React.FC = () => {
  const quickLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Content Management", href: "/content-management" },
    { name: "Schedule Management", href: "/schedule-management" },
    { name: "Contests", href: "/contests" },
    { name: "Profile", href: "/profile" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Support", href: "/support" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="relative backdrop-blur-xl bg-white/10 border-t border-white/20 mt-auto">
      {/* Premium background pattern matching the teacher dashboard theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-600/5 to-indigo-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <div className="mb-4">
              <h3 className="text-xl font-extrabold tracking-wider font-sans bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Learniqo
              </h3>
              <p className="text-slate-300 mt-1 text-sm font-medium">
                Teacher Dashboard
              </p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Empowering educators with powerful tools to inspire and guide students to mathematical excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 hover:bg-white/5 rounded px-2 py-1 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="text-center md:text-left">
            <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">
              Support & Resources
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 hover:bg-white/5 rounded px-2 py-1 block"
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
              © 2025 Learniqo. All rights reserved.
            </div>
            <div className="text-slate-500 text-xs text-center md:text-right">
              Built for passionate educators shaping young minds
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
    </footer>
  );
};

export default TeacherFooter;
