"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Users, BookOpen, Star, MapPin, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import StudentContestsPage from "@/components/StudentContests/StudentContestsPage";
import ResourceLibrary from "@/components/ResourceLibrary/ResourceLibrary";
import { DetailedTeacherProfile, TeacherProfile } from "@/types/auth.types";
import { userService } from "@/services/userService";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

// Teachers component wrapper - now fetches real data from API
const TeachersPageWrapper = ({ onDataLoad }: { onDataLoad?: (teachers: DetailedTeacherProfile[], total: number) => void }) => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<DetailedTeacherProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTeachers, setTotalTeachers] = useState(0);

  const handleViewProfile = useCallback((teacherId: string) => {
    // Navigate to teacher profile page using dynamic route
    router.push(`/teachers/${teacherId}`);
  }, [router]);

  // Transformation function to convert TeacherProfile to DetailedTeacherProfile
  const transformTeacherProfile = useCallback((teacher: TeacherProfile): DetailedTeacherProfile => {
    // Determine experience level based on years of experience
    const getExperienceLevel = (years: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
      if (years < 2) return 'beginner';
      if (years < 5) return 'intermediate';
      if (years < 10) return 'advanced';
      return 'expert';
    };

    // Generate subjects taught (this might come from a separate API call in the future)
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Computer Science', 'Arts'];
    const subjectsTaught = subjects.slice(0, Math.floor(Math.random() * 3) + 1);

    return {
      // Core user fields
      userId: teacher.userId,
      email: teacher.email,
      role: teacher.role,
      fullName: teacher.fullName,
      profileImage: teacher.profileImage,
      isVerified: teacher.isVerified,
      isProfileCompleted: teacher.isProfileCompleted,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,

      // Teacher-specific fields
      birthday: teacher.birthday,
      address: teacher.address,
      phoneNumber: teacher.phoneNumber,
      nationalIdPassport: teacher.nationalIdPassport,
      yearsOfExperience: teacher.yearsOfExperience || 0,
      highestEducationLevel: teacher.highestEducationLevel,
      qualifications: teacher.qualifications,
      shortBio: teacher.shortBio,

      // Additional UI fields
      experienceLevel: getExperienceLevel(teacher.yearsOfExperience || 0),
      subjectsTaught,
      bioOrTeachingPhilosophy: teacher.shortBio,

      // Status
      isOnline: Math.random() > 0.5, // This could come from a real-time API
      availability: {
        status: Math.random() > 0.3 ? 'available' : 'busy',
        nextAvailable: Math.random() > 0.5 ? 'Available in 2 hours' : undefined
      },

      // Metrics (these might come from separate API endpoints)
      rating: Math.floor(Math.random() * 15 + 35) / 10, // Random rating between 3.5-5.0
      totalStudents: Math.floor(Math.random() * 200) + 10,
      totalLessons: Math.floor(Math.random() * 500) + 50,
      responseTime: ['Usually responds in 1 hour', 'Usually responds in 2 hours', 'Usually responds in 4 hours'][Math.floor(Math.random() * 3)],

      // Professional Details
      hourlyRate: Math.floor(Math.random() * 80) + 20,
      currency: 'USD',
      languages: [], // Not implemented yet
      timezone: 'EST',

      // Metadata
      joinDate: teacher.createdAt,
      lastActive: teacher.updatedAt,

      // Additional Features
      badges: [],
      specializations: subjectsTaught.slice(0, Math.floor(Math.random() * 2) + 1),
      teachingStyle: ['Interactive', 'Visual', 'Hands-on', 'Discussion-based'].slice(0, Math.floor(Math.random() * 2) + 1)
    };
  }, []);

  // Load teachers data from API
  const loadTeachers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.getTeachers(1, 12);

      if (response.success && response.data) {
        const transformedTeachers = response.data.teachers.map(transformTeacherProfile);
        setTeachers(transformedTeachers);
        setTotalTeachers(response.data.total || transformedTeachers.length);
        
        // Notify parent component of data load
        if (onDataLoad) {
          onDataLoad(transformedTeachers, response.data.total || transformedTeachers.length);
        }
      } else {
        throw new Error(response.message || 'Failed to load teachers');
      }
    } catch (err) {
      console.error('Failed to load teachers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
    } finally {
      setIsLoading(false);
    }
  }, [transformTeacherProfile, onDataLoad]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const getExperienceLevelVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'beginner':
        return 'outline';
      case 'intermediate':
        return 'secondary';
      case 'advanced':
        return 'default';
      case 'expert':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getAvailabilityVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'available':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'offline':
        return 'outline';
      default:
        return 'outline';
    }
  };

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
          <div className="text-2xl font-bold text-blue-400">{totalTeachers}</div>
          <div className="text-xs text-white/60">Expert Teachers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{teachers.reduce((sum, t) => sum + (t.totalStudents || 0), 0)}</div>
          <div className="text-xs text-white/60">Students Taught</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {teachers.length > 0 ? (teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length).toFixed(1) : '0.0'}
          </div>
          <div className="text-xs text-white/60">Average Rating</div>
        </div>
      </div>
        
      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher, index) => {
          return (
            <motion.div 
              key={teacher.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <SpotlightCard
                className="rounded-2xl"
                spotlightColor="rgba(139, 92, 246, 0.3)"
                spotlightSize={250}
                intensity={0.4}
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 w-full h-full">
                  {/* Teacher Avatar */}
                  <div className="relative mx-auto mb-4 w-20 h-20">
                    {teacher.profileImage ? (
                      <img 
                        src={teacher.profileImage} 
                        alt={teacher.fullName}
                        className="w-full h-full rounded-full object-cover border-2 border-white/20 group-hover:border-purple-400/50 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:border-purple-400/50 transition-all duration-300">
                        <span className="text-white font-bold text-lg">
                          {teacher.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </span>
                      </div>
                    )}
                    {teacher.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Teacher Info */}
                  <div className="text-center space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors flex items-center justify-center gap-2">
                        {teacher.fullName}
                        {teacher.isVerified && (
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                        )}
                      </h4>
                      <p className="text-purple-400/80 text-sm font-medium">
                        {teacher.subjectsTaught.slice(0, 2).join(', ')} Expert
                      </p>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= Math.floor(teacher.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                        />
                      ))}
                      <span className="text-white/60 text-xs ml-2">{teacher.rating.toFixed(1)}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1 text-white/60">
                        <Users className="w-3 h-3" />
                        <span>{teacher.totalStudents} students</span>
                      </div>
                      <div className="flex items-center space-x-1 text-white/60">
                        <Clock className="w-3 h-3" />
                        <span>{teacher.yearsOfExperience}y exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Availability Badges */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge 
                      variant={getExperienceLevelVariant(teacher.experienceLevel)}
                      className="text-xs font-medium bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      {teacher.experienceLevel.charAt(0).toUpperCase() + teacher.experienceLevel.slice(1)}
                    </Badge>
                    <Badge 
                      variant={getAvailabilityVariant(teacher.availability.status)}
                      className={`text-xs font-medium ${
                        teacher.availability.status === 'available' 
                          ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                          : teacher.availability.status === 'busy'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                          : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                      }`}
                    >
                      {teacher.availability.status.charAt(0).toUpperCase() + teacher.availability.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Location & Rate */}
                  {(teacher.address || teacher.hourlyRate) && (
                    <div className="mt-3 text-center space-y-1">
                      {teacher.address && (
                        <div className="flex items-center justify-center space-x-1 text-white/60 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{teacher.address.split(',')[0]}</span>
                        </div>
                      )}
                      {teacher.hourlyRate && (
                        <div className="text-purple-400 text-sm font-semibold">
                          ${teacher.hourlyRate}/hr
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button 
                    onClick={() => handleViewProfile(teacher.userId)}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]"
                  >
                    View Profile
                  </button>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>

      {/* Load More Button */}
      {teachers.length > 0 && (
        <div className="text-center">
          <button 
            onClick={() => router.push('/teachers')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400/30 rounded-xl text-white transition-all duration-300"
          >
            <span>View All Teachers</span>
            <Users className="w-4 h-4" />
          </button>
        </div>
      )}
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
  const [teachersData, setTeachersData] = useState<{ teachers: DetailedTeacherProfile[]; total: number }>({ teachers: [], total: 0 });

  useEffect(() => {
    if (activeContent) {
      setCurrentContent(activeContent);
    }
  }, [activeContent]);

  const handleTeachersDataLoad = useCallback((teachers: DetailedTeacherProfile[], total: number) => {
    setTeachersData({ teachers, total });
  }, []);

  const renderContent = () => {
    switch (currentContent) {
      case 'contests':
        return <StudentContestsPage />;
      case 'teachers':
        return <TeachersPageWrapper onDataLoad={handleTeachersDataLoad} />;
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
                          {currentContent === 'contests' ? '12' : currentContent === 'teachers' ? teachersData.total : '156'}
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
