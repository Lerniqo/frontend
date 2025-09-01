'use client';

import React, { useState } from 'react';
import SharedNavigation from './SharedNavigation';

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    subject: 'Mathematics',
    experience: '5+ years',
    location: 'New York, USA',
    bio: 'Passionate mathematics teacher with over 5 years of experience in making complex concepts simple and engaging for students.'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to an API
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.4),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.2),transparent_70%)]"></div>

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Navigation */}
      <SharedNavigation
        onLogout={() => {
          // Handle logout logic here
          console.warn('Logout functionality not implemented');
        }}
      />

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium tracking-wide">Teacher Profile</span>
            </div>
            <h1 className="text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">View and manage your teacher profile information with our premium interface</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                {!isEditing ? (
                  // View Mode
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <span className="text-white font-bold text-5xl">{profileData.firstName[0]}{profileData.lastName[0]}</span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-4xl font-bold text-white mb-3">{profileData.firstName} {profileData.lastName}</h3>
                    <p className="text-slate-400 mb-12 text-lg">{profileData.email}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
                      <div className="space-y-6">
                        <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                          <p className="text-white text-lg">{profileData.firstName} {profileData.lastName}</p>
                        </div>
                        <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                          <p className="text-white text-lg">{profileData.email}</p>
                        </div>
                        <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                          <p className="text-white text-lg">{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                          <p className="text-white text-lg">{profileData.subject}</p>
                        </div>
                        <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Experience</label>
                          <p className="text-white text-lg">{profileData.experience}</p>
                        </div>
                        <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                          <p className="text-white text-lg">{profileData.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-12 text-left">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                      <p className="text-white text-lg leading-relaxed">{profileData.bio}</p>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                    >
                      <span className="relative z-10">Edit Profile</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    </button>
                  </div>
                ) : (
                  // Edit Mode
                  <form className="space-y-8">
                    <div className="text-center mb-12">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <span className="text-white font-bold text-5xl">{profileData.firstName[0]}{profileData.lastName[0]}</span>
                      </div>
                      <button type="button" className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors duration-300">
                        Change Photo
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Subject</label>
                        <select
                          value={profileData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        >
                          <option value="Mathematics">Mathematics</option>
                          <option value="Science">Science</option>
                          <option value="English">English</option>
                          <option value="History">History</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Experience</label>
                        <select
                          value={profileData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        >
                          <option value="1-2 years">1-2 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5+ years">5+ years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex space-x-4 pt-8">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
