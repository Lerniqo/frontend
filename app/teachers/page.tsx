"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DetailedTeacherProfile, FilterOptions, PaginationState, TeacherProfile } from '@/types/auth.types';
import { userService } from '@/services/userService';
import SearchAndFilter from '@/components/TeachersPage/SearchAndFilter';
import TeacherCard from '@/components/TeachersPage/TeacherCard';
import Pagination from '@/components/TeachersPage/Pagination';
import {
  TeachersGridLoading,
  SearchFilterLoading,
  EmptyState,
  ErrorState,
  GlobalLoading
} from '@/components/TeachersPage/LoadingStates';
import NavBar from '@/components/LandingPageComponents/NavBar';
import Footer from '@/components/LandingPageComponents/Footer';
import Link from 'next/link';

// Filter service class
class TeacherFilterService {
  static filterTeachers(
    teachers: DetailedTeacherProfile[],
    filters: FilterOptions,
    searchTerm: string
  ): DetailedTeacherProfile[] {
    return teachers.filter(teacher => {
      // Search term matching (multi-field)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          teacher.fullName.toLowerCase().includes(searchLower) ||
          teacher.subjectsTaught.some(subject => 
            subject.toLowerCase().includes(searchLower)
          ) ||
          (teacher.bioOrTeachingPhilosophy || '').toLowerCase().includes(searchLower) ||
          (teacher.qualifications || '').toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Experience level filter
      if (filters.experienceLevel.length > 0) {
        if (!filters.experienceLevel.includes(teacher.experienceLevel)) {
          return false;
        }
      }
      
      // Subject filter
      if (filters.subjects.length > 0) {
        const hasMatchingSubject = teacher.subjectsTaught.some(subject =>
          filters.subjects.includes(subject)
        );
        if (!hasMatchingSubject) return false;
      }
      
      // Years of experience range
      if (filters.yearsOfExperience.min > 0 || filters.yearsOfExperience.max < 50) {
        const experience = teacher.yearsOfExperience || 0;
        if (experience < filters.yearsOfExperience.min ||
            experience > filters.yearsOfExperience.max) {
          return false;
        }
      }
      
      // Availability filter
      if (filters.availability) {
        if (teacher.availability.status !== 'available') return false;
      }
      
      // Verified filter
      if (filters.verified) {
        if (!teacher.isVerified) return false;
      }
      
      // Hourly rate filter
      if (filters.hourlyRate && teacher.hourlyRate) {
        if (teacher.hourlyRate < filters.hourlyRate.min ||
            teacher.hourlyRate > filters.hourlyRate.max) {
          return false;
        }
      }
      
      return true;
    });
  }
}

// Pagination service
class PaginationService {
  static calculatePagination(
    totalItems: number,
    currentPage: number,
    itemsPerPage: number
  ): PaginationState {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage: Math.min(currentPage, totalPages || 1),
      itemsPerPage,
      totalItems,
      totalPages: totalPages || 1
    };
  }
  
  static paginateResults<T>(
    items: T[],
    currentPage: number,
    itemsPerPage: number
  ): T[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }
}

export default function TeachersPage(): React.ReactElement {
  const router = useRouter();
  // State management
  const [teachers, setTeachers] = useState<DetailedTeacherProfile[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<DetailedTeacherProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    experienceLevel: [],
    subjects: [],
    yearsOfExperience: { min: 0, max: 50 },
    rating: 0, // Keep for compatibility but not used
    availability: false,
    verified: false,
    hourlyRate: { min: 0, max: 1000 },
    languages: [] // Keep for compatibility but not used
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTeachers, setTotalTeachers] = useState(0);

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
      profileCompleted: teacher.profileCompleted,
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
      rating: 0, // Not implemented yet
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
  const loadTeachers = useCallback(async (page: number = 1, limit: number = 120) => {
    try {
      setIsLoading(true);
      setError(null);

      // Loading teachers from API...

      // Call the actual API
      const response = await userService.getTeachers(page, limit);

      // API Response:

      if (response.success && response.data) {
        // Teachers data:
        // Transform API response to DetailedTeacherProfile format
        const transformedTeachers = response.data.teachers.map(transformTeacherProfile);
        setTeachers(transformedTeachers);

        // Update total count from API response or use the length of returned teachers
        setTotalTeachers(response.data.total || transformedTeachers.length);
        // Loaded teachers count
      } else {
        throw new Error(response.message || 'Failed to load teachers');
      }
    } catch (err) {
      console.error('Failed to load teachers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
    } finally {
      setIsLoading(false);
    }
  }, [transformTeacherProfile]);  // Load teachers on component mount
  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  // Apply filters and search (removed sorting)
  const processedTeachers = useMemo(() => {
    return TeacherFilterService.filterTeachers(teachers, filters, searchTerm);
  }, [teachers, filters, searchTerm]);

  // Update filtered teachers when processed teachers change
  useEffect(() => {
    setFilteredTeachers(processedTeachers);
    setCurrentPage(1); // Reset to first page when filters change
  }, [processedTeachers]);

  // Calculate pagination using API total count
  const pagination = useMemo(() => {
    return PaginationService.calculatePagination(
      totalTeachers,
      currentPage,
      itemsPerPage
    );
  }, [totalTeachers, currentPage, itemsPerPage]);

  // Get current page teachers
  const currentPageTeachers = useMemo(() => {
    return PaginationService.paginateResults(
      filteredTeachers,
      currentPage,
      itemsPerPage
    );
  }, [filteredTeachers, currentPage, itemsPerPage]);

  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilter = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  }, []);

  const handleViewProfile = useCallback((teacherId: string) => {
    // Navigate to teacher profile page using dynamic route
    router.push(`/teachers/${teacherId}`);
  }, [router]);

  const handleBookLesson = useCallback((_teacherId: string) => {
    // Navigate to booking page
    // In a real app: router.push(`/book-lesson/${teacherId}`);
  }, []);

  const handleToggleFavorite = useCallback((_teacherId: string) => {
    // Toggle favorite status
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      experienceLevel: [],
      subjects: [],
      yearsOfExperience: { min: 0, max: 50 },
      rating: 0, // Keep for compatibility but not used
      availability: false,
      verified: false,
      hourlyRate: { min: 0, max: 1000 },
      languages: [] // Keep for compatibility but not used
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.experienceLevel.length > 0 ||
      filters.subjects.length > 0 ||
      filters.yearsOfExperience.min > 0 ||
      filters.yearsOfExperience.max < 50 ||
      filters.availability ||
      filters.verified ||
      (filters.hourlyRate ? (filters.hourlyRate.min > 0 || filters.hourlyRate.max < 1000) : false)
    );
  }, [filters]);

  // Show global loading on initial load
  if (isLoading && teachers.length === 0) {
    return <GlobalLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6 sm:mb-8 animate-fade-in" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 md:space-x-3">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-purple-600 hover:text-purple-700 transition-all duration-300 flex items-center text-sm sm:text-base transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-purple-700 font-medium text-sm sm:text-base">Browse Teachers</span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in animation-delay-500">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform hover:scale-105 transition-transform duration-500">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-purple-700 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Teacher
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Discover qualified educators who can help you achieve your learning goals.
            Browse through our extensive network of verified teachers.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end items-center mb-6 animate-fade-in animation-delay-1000">
          <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg p-1 flex shadow-lg hover:shadow-xl transition-shadow duration-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-700 to-blue-500 text-white shadow-md'
                  : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-700 to-blue-500 text-white shadow-md'
                  : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        {isLoading && teachers.length === 0 ? (
          <SearchFilterLoading />
        ) : (
          <div className="animate-fade-in animation-delay-1500">
            <SearchAndFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              searchTerm={searchTerm}
              activeFilters={filters}
              totalResults={totalTeachers}
            />
          </div>
        )}

        {/* Content Area */}
        {error ? (
          <ErrorState error={error} onRetry={loadTeachers} />
        ) : isLoading ? (
          <TeachersGridLoading viewMode={viewMode} count={itemsPerPage} />
        ) : totalTeachers === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        ) : (
          <>
            {/* Teachers Grid/List */}
            <div className={`mb-12 animate-fade-in animation-delay-2000 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }`}>
              {currentPageTeachers.map((teacher, index) => (
                <div
                  key={teacher.userId}
                  className="transform hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${2000 + index * 100}ms` }}
                >
                  <TeacherCard
                    teacher={teacher}
                    viewMode={viewMode}
                    onViewProfile={handleViewProfile}
                    onBookLesson={handleBookLesson}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="animate-fade-in animation-delay-2500">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={pagination.totalItems}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}