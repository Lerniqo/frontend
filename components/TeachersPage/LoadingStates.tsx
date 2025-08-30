"use client";

import React from 'react';

// Skeleton loader for teacher cards
export function TeacherCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 animate-pulse">
        <div className="flex items-start gap-6">
          {/* Avatar skeleton */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>

          {/* Content skeleton */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="flex gap-3 mb-2">
                  <div className="h-5 bg-gray-300 rounded w-24"></div>
                  <div className="h-5 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="text-right">
                <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <div className="h-6 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
              <div className="h-6 bg-gray-300 rounded w-24"></div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>

            <div className="flex gap-3">
              <div className="h-10 bg-gray-300 rounded w-28"></div>
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 animate-pulse h-full flex flex-col">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
        
        <div className="flex gap-2 mb-3">
          <div className="h-5 bg-gray-300 rounded w-20"></div>
          <div className="h-5 bg-gray-300 rounded w-16"></div>
        </div>

        <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>

        <div className="flex gap-1 mb-3">
          <div className="h-5 bg-gray-300 rounded w-16"></div>
          <div className="h-5 bg-gray-300 rounded w-14"></div>
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="mt-auto">
        <div className="h-6 bg-gray-300 rounded w-20 mx-auto mb-3"></div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

// Loading state for the entire teachers grid
export function TeachersGridLoading({ viewMode, count = 12 }: { viewMode: 'grid' | 'list'; count?: number }) {
  return (
    <div className={`${
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
        : 'space-y-6'
    }`}>
      {Array.from({ length: count }, (_, index) => (
        <TeacherCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  );
}

// Loading state for search and filter component
export function SearchFilterLoading() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 animate-pulse">
      {/* Search bar skeleton */}
      <div className="mb-6">
        <div className="h-14 bg-gray-300 rounded-xl w-full"></div>
      </div>

      {/* Quick filters skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 bg-gray-300 rounded w-32"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 bg-gray-300 rounded w-24"></div>
          <div className="h-10 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

// Empty state when no teachers are found
export function EmptyState({ 
  searchTerm, 
  hasActiveFilters, 
  onClearFilters 
}: { 
  searchTerm: string; 
  hasActiveFilters: boolean; 
  onClearFilters: () => void; 
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Title and description */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {searchTerm || hasActiveFilters ? 'No teachers found' : 'No teachers available'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {searchTerm 
            ? `We couldn't find any teachers matching "${searchTerm}".`
            : hasActiveFilters
            ? 'Try adjusting your filters to see more teachers.'
            : 'There are currently no teachers available in our database.'
          }
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {(searchTerm || hasActiveFilters) && (
            <button
              onClick={onClearFilters}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Clear all filters
            </button>
          )}
          
          <p className="text-sm text-gray-500">
            Try searching with different keywords or{' '}
            <button 
              onClick={onClearFilters}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              browse all teachers
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Error state component
export function ErrorState({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry: () => void; 
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="max-w-md mx-auto">
        {/* Error icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Error message */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {error || 'Failed to load teachers. Please try again.'}
        </p>

        {/* Retry button */}
        <button
          onClick={onRetry}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try again
        </button>
      </div>
    </div>
  );
}

// Global loading overlay
export function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading teachers...</p>
      </div>
    </div>
  );
}