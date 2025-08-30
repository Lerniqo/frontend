"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DetailedTeacherProfile, FilterOptions, PaginationState } from '@/types/auth.types';
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

// Mock data generator for demonstration (since we don't have real teacher data yet)
const generateMockTeacher = (id: number): DetailedTeacherProfile => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Computer Science', 'Arts'];
  const experienceLevels: ('beginner' | 'intermediate' | 'advanced' | 'expert')[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  const availabilityStatuses: ('available' | 'busy' | 'offline')[] = ['available', 'busy', 'offline'];
  const educationLevels = ['Bachelor\'s Degree', 'Master\'s Degree', 'PhD/Doctorate', 'Professional Certificate'];
  const addresses = [
    '123 Main Street, Cityville, State 12345',
    '456 Oak Avenue, Springfield, State 67890',
    '789 Pine Road, Riverside, State 11111',
    '321 Elm Street, Lakeside, State 22222'
  ];
  
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[(id * 3) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  const yearsOfExperience = Math.floor(Math.random() * 20) + 1;
  
  // Generate a realistic birthday (25-65 years old)
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - (25 + Math.floor(Math.random() * 40));
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1;
  const birthday = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
  
  return {
    userId: `teacher-${id}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    role: 'Teacher',
    fullName,
    profilePictureUrl: undefined,
    isVerified: Math.random() > 0.3,
    profileCompleted: true,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Backend teacher fields matching the Prisma schema
    birthday, // DateTime field
    address: addresses[id % addresses.length], // Text field
    phoneNumber: `+1${Math.floor(Math.random() * 900000000) + 100000000}`, // phone_number
    nationalIdPassport: `ID${Math.floor(Math.random() * 900000000) + 100000000}`, // national_id_passport
    yearsOfExperience, // years_of_experience (Int)
    highestEducationLevel: educationLevels[Math.floor(Math.random() * educationLevels.length)], // highest_education_level
    qualifications: 'Bachelor of Education, Teaching Certification, Subject Matter Expert', // Optional Text
    shortBio: `Passionate educator with ${yearsOfExperience} years of experience in teaching. Committed to helping students achieve their academic goals through innovative teaching methods.`, // short_bio
    
    // Additional UI-specific fields for enhanced display
    experienceLevel: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
    subjectsTaught: subjects.slice(0, Math.floor(Math.random() * 4) + 1),
    bioOrTeachingPhilosophy: `I believe in creating an engaging and supportive learning environment where every student can thrive. My teaching philosophy centers on making complex concepts accessible and fostering critical thinking skills.`,
    
    // Status
    isOnline: Math.random() > 0.5,
    availability: {
      status: availabilityStatuses[Math.floor(Math.random() * availabilityStatuses.length)],
      nextAvailable: Math.random() > 0.5 ? 'Available in 2 hours' : undefined
    },
    
    // Metrics (removed rating)
    rating: 0, // Not used
    totalStudents: Math.floor(Math.random() * 200) + 10,
    totalLessons: Math.floor(Math.random() * 500) + 50,
    responseTime: ['Usually responds in 1 hour', 'Usually responds in 2 hours', 'Usually responds in 4 hours'][Math.floor(Math.random() * 3)],
    
    // Professional Details (removed languages)
    hourlyRate: Math.floor(Math.random() * 80) + 20,
    currency: 'USD',
    languages: [], // Not used
    timezone: 'EST',
    
    // Metadata
    joinDate: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    
    // Additional Features
    badges: [],
    specializations: subjects.slice(0, Math.floor(Math.random() * 2) + 1),
    teachingStyle: ['Interactive', 'Visual', 'Hands-on', 'Discussion-based'].slice(0, Math.floor(Math.random() * 2) + 1)
  };
};

// Generate mock data
const MOCK_TEACHERS: DetailedTeacherProfile[] = Array.from({ length: 120 }, (_, i) => generateMockTeacher(i + 1));

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

  // Load teachers data
  const loadTeachers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, we'll use mock data
      // In a real application, this would call the API:
      // const response = await userService.getTeachers();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTeachers(MOCK_TEACHERS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
      console.error('Failed to load teachers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load teachers on component mount
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

  // Calculate pagination
  const pagination = useMemo(() => {
    return PaginationService.calculatePagination(
      filteredTeachers.length,
      currentPage,
      itemsPerPage
    );
  }, [filteredTeachers.length, currentPage, itemsPerPage]);

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
    // Navigate to teacher profile page
    console.log('View profile for teacher:', teacherId);
    // In a real app: router.push(`/teachers/${teacherId}`);
  }, []);

  const handleBookLesson = useCallback((teacherId: string) => {
    // Navigate to booking page
    console.log('Book lesson with teacher:', teacherId);
    // In a real app: router.push(`/book-lesson/${teacherId}`);
  }, []);

  const handleToggleFavorite = useCallback((teacherId: string) => {
    // Toggle favorite status
    console.log('Toggle favorite for teacher:', teacherId);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6 sm:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 md:space-x-3">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-700 font-medium text-sm sm:text-base">Browse Teachers</span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Teacher
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Discover qualified educators who can help you achieve your learning goals.
            Browse through our extensive network of verified teachers.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredTeachers.length}</span> teachers found
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchTerm={searchTerm}
            activeFilters={filters}
            totalResults={filteredTeachers.length}
          />
        )}

        {/* Content Area */}
        {error ? (
          <ErrorState error={error} onRetry={loadTeachers} />
        ) : isLoading ? (
          <TeachersGridLoading viewMode={viewMode} count={itemsPerPage} />
        ) : filteredTeachers.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        ) : (
          <>
            {/* Teachers Grid/List */}
            <div className={`mb-12 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }`}>
              {currentPageTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.userId}
                  teacher={teacher}
                  viewMode={viewMode}
                  onViewProfile={handleViewProfile}
                  onBookLesson={handleBookLesson}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}