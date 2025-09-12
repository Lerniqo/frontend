"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentContestsPage from "@/components/StudentContests/StudentContestsPage";
import ResourceLibrary from "@/components/ResourceLibrary/ResourceLibrary";

// Teachers component wrapper - using dynamic import
const TeachersPageWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay for now - in real implementation this would be the dynamic import
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/70 animate-pulse">Loading teachers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading teachers: {error}</div>
      </div>
    );
  }

  // For now, show a placeholder - in real implementation, render the imported teachers page
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium">Expert Educators</span>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Meet Our Teachers
        </h3>
        <p className="text-white/70 max-w-2xl mx-auto">
          Connect with our experienced educators who are passionate about helping you succeed in your learning journey.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">8</div>
          <div className="text-xs text-white/60">Expert Teachers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">247</div>
          <div className="text-xs text-white/60">Students Taught</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">4.9</div>
          <div className="text-xs text-white/60">Average Rating</div>
        </div>
      </div>
        
      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              {/* Teacher Avatar */}
              <div className="relative mx-auto mb-4 w-20 h-20">
                <div className="w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:border-purple-400/50 transition-all duration-300">
                  <span className="text-white font-bold text-lg">T{i}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              {/* Teacher Info */}
              <div className="text-center space-y-2">
                <h4 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                  Dr. Teacher {i}
                </h4>
                <p className="text-purple-400/80 text-sm font-medium">
                  {i % 3 === 0 ? 'Mathematics' : i % 2 === 0 ? 'Physics' : 'Chemistry'} Expert
                </p>
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-3 h-3 bg-yellow-400 rounded-full opacity-80" />
                  ))}
                  <span className="text-white/60 text-xs ml-2">4.9</span>
                </div>
              </div>

              {/* Experience Badge */}
              <div className="mt-4 text-center">
                <span className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs text-blue-300">
                  {5 + i} years experience
                </span>
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]">
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400/30 rounded-xl text-white transition-all duration-300">
          <span>Load More Teachers</span>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </button>
      </div>
    </div>
  );
};

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContent: 'contests' | 'teachers' | 'resource-library' | null;
}

const NavigationModal: React.FC<NavigationModalProps> = ({
  isOpen,
  onClose,
  activeContent
}) => {
  const [currentContent, setCurrentContent] = useState<'contests' | 'teachers' | 'resource-library' | null>(activeContent);

  useEffect(() => {
    if (activeContent) {
      setCurrentContent(activeContent);
    }
  }, [activeContent]);

  const renderContent = () => {
    switch (currentContent) {
      case 'contests':
        return <StudentContestsPage />;
      case 'teachers':
        return <TeachersPageWrapper />;
      case 'resource-library':
        return <ResourceLibrary />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/70">Select a navigation item</div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (currentContent) {
      case 'contests':
        return 'Contests';
      case 'teachers':
        return 'Teachers';
      case 'resource-library':
        return 'Resource Library';
      default:
        return 'Navigation';
    }
  };

  const getIcon = () => {
    switch (currentContent) {
      case 'contests':
        return Trophy;
      case 'teachers':
        return Users;
      case 'resource-library':
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  const Icon = getIcon();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="fixed inset-4 z-[9999] flex items-center justify-center"
          >
            <div className="w-full h-full max-w-[95vw] max-h-[95vh] bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
              
              {/* Animated Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-600/5"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-2 h-2 bg-blue-400/40 rounded-full animate-pulse" />
                <div className="absolute top-[20%] right-[15%] w-1 h-1 bg-purple-400/40 rounded-full animate-ping" />
                <div className="absolute top-[60%] left-[5%] w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-bounce" />
                <div className="absolute bottom-[20%] right-[20%] w-2 h-2 bg-purple-300/40 rounded-full animate-pulse" />
                <div className="absolute top-[40%] right-[40%] w-1 h-1 bg-blue-500/40 rounded-full animate-ping" />
                <div className="absolute bottom-[40%] left-[30%] w-1.5 h-1.5 bg-purple-500/40 rounded-full animate-bounce" />
              </div>
              
              {/* Premium Border Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 p-[1px]">
                <div className="w-full h-full bg-transparent rounded-3xl" />
              </div>
              
              {/* Header */}
              <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                        <Icon className="text-white w-6 h-6" />
                      </div>
                      {/* Active Indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse border-2 border-slate-950" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {getTitle()}
                      </h2>
                      <p className="text-white/60 text-sm">Premium Learning Experience</p>
                    </div>
                    
                    {/* Content Stats */}
                    <div className="hidden md:flex items-center space-x-4 ml-8">
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">
                          {currentContent === 'contests' ? '12' : currentContent === 'teachers' ? '8' : '156'}
                        </div>
                        <div className="text-xs text-white/60">
                          {currentContent === 'contests' ? 'Active' : currentContent === 'teachers' ? 'Available' : 'Resources'}
                        </div>
                      </div>
                      <div className="w-px h-8 bg-white/20" />
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-400">98%</div>
                        <div className="text-xs text-white/60">Quality</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Navigation Pills */}
                    <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentContent('contests')}
                        className={`h-10 px-6 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                          currentContent === 'contests'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                        }`}
                      >
                        {currentContent === 'contests' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse rounded-xl" />
                        )}
                        <Trophy className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10 font-medium">Contests</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentContent('teachers')}
                        className={`h-10 px-6 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                          currentContent === 'teachers'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                        }`}
                      >
                        {currentContent === 'teachers' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 animate-pulse rounded-xl" />
                        )}
                        <Users className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10 font-medium">Teachers</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentContent('resource-library')}
                        className={`h-10 px-6 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                          currentContent === 'resource-library'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                        }`}
                      >
                        {currentContent === 'resource-library' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 animate-pulse rounded-xl" />
                        )}
                        <BookOpen className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10 font-medium">Resources</span>
                      </Button>
                    </div>

                    {/* Close Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-400/30 transition-all duration-300 group"
                    >
                      <X className="w-5 h-5 text-white/70 group-hover:text-red-400 transition-colors" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="relative h-[calc(100%-100px)] overflow-hidden">
                {/* Progress bar for active content */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-10">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{ width: currentContent ? '100%' : '0%' }}
                  />
                </div>
                
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-900/50 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 scrollbar-thumb-rounded-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentContent}
                      initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                      transition={{ 
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="p-6 relative"
                    >
                      {/* Content background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent pointer-events-none" />
                      
                      <div className="relative z-10">
                        {renderContent()}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationModal;
