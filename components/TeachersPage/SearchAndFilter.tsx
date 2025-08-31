"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FilterOptions } from '@/types/auth.types';

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filters: FilterOptions) => void;
  searchTerm: string;
  activeFilters: FilterOptions;
  totalResults: number;
}

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function SearchAndFilter({
  onSearch,
  onFilter,
  searchTerm,
  activeFilters,
  totalResults
}: SearchAndFilterProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Available options for filters
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];



  // Update search when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch, searchTerm]);

  const handleFilterChange = useCallback(<K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    const newFilters = { ...activeFilters, [key]: value };
    onFilter(newFilters);
  }, [activeFilters, onFilter]);

  const handleExperienceLevelToggle = (level: 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
    const currentLevels = activeFilters.experienceLevel;
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level];
    handleFilterChange('experienceLevel', newLevels);
  };



  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {
      experienceLevel: [],
      subjects: [],
      yearsOfExperience: { min: 0, max: 50 },
      rating: 0,
      availability: false,
      verified: false,
      hourlyRate: { min: 0, max: 1000 },
      languages: []
    };
    onFilter(emptyFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.experienceLevel.length > 0) count++;

    if (activeFilters.yearsOfExperience.min > 0 || activeFilters.yearsOfExperience.max < 50) count++;
    if (activeFilters.availability) count++;
    if (activeFilters.verified) count++;
    if (activeFilters.hourlyRate && (activeFilters.hourlyRate.min > 0 || activeFilters.hourlyRate.max < 1000)) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search teachers by name, subject, or qualifications..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results and Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <span className="text-sm text-gray-600">{totalResults} teachers found</span>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              showAdvancedFilters
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </button>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          {/* Availability and Verification */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Availability & Verification</h3>
            <div className="flex flex-wrap gap-3">
              {/* Available Now */}
              <button
                onClick={() => handleFilterChange('availability', !activeFilters.availability)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeFilters.availability
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Available Now
              </button>

              {/* Verified Only */}
              <button
                onClick={() => handleFilterChange('verified', !activeFilters.verified)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeFilters.verified
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Only
              </button>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Experience Level</h3>
            <div className="flex flex-wrap gap-2">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleExperienceLevelToggle(level.value as 'beginner' | 'intermediate' | 'advanced' | 'expert')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilters.experienceLevel.includes(level.value as 'beginner' | 'intermediate' | 'advanced' | 'expert')
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>



          {/* Years of Experience Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Years of Experience</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Min:</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={activeFilters.yearsOfExperience.min}
                  onChange={(e) => handleFilterChange('yearsOfExperience', {
                    ...activeFilters.yearsOfExperience,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Max:</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={activeFilters.yearsOfExperience.max}
                  onChange={(e) => handleFilterChange('yearsOfExperience', {
                    ...activeFilters.yearsOfExperience,
                    max: parseInt(e.target.value) || 50
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Minimum Rating - Removed */}
          {/* This section has been removed as rating is no longer used */}

          {/* Hourly Rate Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Hourly Rate (USD)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Min:</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={activeFilters.hourlyRate?.min || 0}
                  onChange={(e) => handleFilterChange('hourlyRate', {
                    min: parseInt(e.target.value) || 0,
                    max: activeFilters.hourlyRate?.max || 1000
                  })}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Max:</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={activeFilters.hourlyRate?.max || 1000}
                  onChange={(e) => handleFilterChange('hourlyRate', {
                    min: activeFilters.hourlyRate?.min || 0,
                    max: parseInt(e.target.value) || 1000
                  })}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}