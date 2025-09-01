'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Globe, BarChart3, Users, BookOpen, Settings } from 'lucide-react';

const AdminFooter: React.FC = () => {
  const adminLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "User Management", href: "/user-management" },
    { name: "Content Management", href: "/content" },
    { name: "Analytics", href: "/analytics" },
    { name: "System Settings", href: "/settings" },
  ];

  const supportLinks = [
    { name: "Documentation", href: "/docs" },
    { name: "System Status", href: "/status" },
    { name: "Security Center", href: "/security" },
    { name: "Contact Support", href: "/support" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative backdrop-blur-xl bg-white/10 border-t border-white/20 mt-auto">
      {/* Premium background effects matching admin theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-600/5 to-pink-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-wider font-sans bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Lerniqo Admin
                </h3>
                <p className="text-slate-300 text-sm font-medium">
                  Administrative Dashboard
                </p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              Empowering administrators with comprehensive tools to manage and optimize 
              educational platforms for the future of learning. Monitor, analyze, and enhance 
              the learning experience for all users.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <Globe className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              </div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <Shield className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              </div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <BarChart3 className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Admin Navigation */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Admin Tools</span>
            </h4>
            <ul className="space-y-2">
              {adminLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-all duration-200 hover:bg-white/5 rounded px-2 py-1 block hover:pl-3 hover:scale-105"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Support & Security</span>
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-all duration-200 hover:bg-white/5 rounded px-2 py-1 block hover:pl-3 hover:scale-105"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white">2,456</div>
            <div className="text-xs text-slate-400">Total Users</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white">1,234</div>
            <div className="text-xs text-slate-400">Active Content</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mx-auto mb-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-lg font-bold text-white">98.5%</div>
            <div className="text-xs text-slate-400">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-pink-500/20 rounded-lg mx-auto mb-2">
              <Shield className="w-5 h-5 text-pink-400" />
            </div>
            <div className="text-lg font-bold text-white">100%</div>
            <div className="text-xs text-slate-400">Security Score</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} Lerniqo Admin Dashboard. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-slate-400 text-sm">Powered by</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-slate-400 text-sm">Advanced Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent transform translate-y-0.5"></div>
    </footer>
  );
};

export default AdminFooter;
