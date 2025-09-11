"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Resource, SearchFilters } from '@/types/resource.types';

interface SearchAndFilterBarProps {
  onSearch: (filters: SearchFilters) => void;
  totalResults: number;
  isLoading: boolean;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  onSearch,
  totalResults,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    filters: {},
    type: undefined,
    difficulty: undefined,
    isPremium: undefined,
    subject: undefined
  });

  const resourceTypes: Resource['type'][] = ['Video', 'Note', 'Quiz', 'Interactive', 'Assignment'];
  const difficulties: Resource['difficulty'][] = ['Beginner', 'Intermediate', 'Advanced'];
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const newFilters = {
        ...filters,
        searchTerm: searchTerm
      };
      setFilters(newFilters);
      onSearch(newFilters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      searchTerm: searchTerm,
      filters: {},
      type: undefined,
      difficulty: undefined,
      isPremium: undefined,
      subject: undefined
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const hasActiveFilters = filters.type || filters.difficulty || filters.isPremium !== undefined || filters.subject;

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search for resources, topics, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Quick Filters and Advanced Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Results Count */}
          <div className="text-slate-300 text-sm">
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </span>
            ) : (
              <span>{totalResults} resources found</span>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange('type', filters.type === type ? undefined : type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  filters.type === type
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-600/50 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 text-sm flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          )}
          
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm flex items-center space-x-2 ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced Filters</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty Level</label>
              <select
                value={filters.difficulty || ''}
                onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Levels</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty} className="text-gray-900">
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
              <select
                value={filters.subject || ''}
                onChange={(e) => handleFilterChange('subject', e.target.value || undefined)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="text-gray-900">
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Premium Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Content Type</label>
              <select
                value={filters.isPremium === undefined ? '' : filters.isPremium ? 'premium' : 'free'}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('isPremium', value === '' ? undefined : value === 'premium');
                }}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Content</option>
                <option value="free" className="text-gray-900">Free Only</option>
                <option value="premium" className="text-gray-900">Premium Only</option>
              </select>
            </div>

            {/* Sort By (placeholder for future enhancement) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <select
                defaultValue="newest"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="newest" className="text-gray-900">Newest First</option>
                <option value="popular" className="text-gray-900">Most Popular</option>
                <option value="rating" className="text-gray-900">Highest Rated</option>
                <option value="downloads" className="text-gray-900">Most Downloaded</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterBar;
