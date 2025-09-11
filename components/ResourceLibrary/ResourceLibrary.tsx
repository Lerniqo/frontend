"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Grid, List } from 'lucide-react';
import { Resource, SearchFilters } from '@/types/resource.types';
import { ResourceService } from '@/services/resourceService';
import SearchAndFilterBar from '@/components/ResourceLibrary/SearchAndFilterBar';
import HierarchicalFilters from '@/components/ResourceLibrary/HierarchicalFilters';
import ResourceCard from '@/components/ResourceLibrary/ResourceCard';
import FadeIn from '@/components/ui/FadeIn';

const ResourceLibrary: React.FC = () => {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    filters: {
      particle: '',
      atom: '',
      molecule: '',
      matter: ''
    }
  });

  useEffect(() => {
    loadInitialResources();
  }, []);

  const loadInitialResources = async () => {
    try {
      setLoading(true);
      const allResources = await ResourceService.getAllResources();
      setResources(allResources);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchFilters: SearchFilters) => {
    try {
      setSearchLoading(true);
      setFilters(searchFilters);
      const filteredResources = await ResourceService.searchResources(searchFilters);
      setResources(filteredResources);
    } catch (error) {
      console.error('Error searching resources:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleHierarchicalFilterChange = async (level: string, value: string) => {
    const newFilters = {
      ...filters,
      filters: {
        ...filters.filters,
        [level]: value
      }
    };
    await handleSearch(newFilters);
  };

  const handleResourceClick = (resource: Resource) => {
    // Navigate to the learning resource page with the resource details
    const params = new URLSearchParams({
      resourceId: resource.id,
      type: resource.type,
      url: resource.url
    });
    router.push(`/learning-resource?${params.toString()}`);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Loading Resource Library</h3>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <FadeIn delay={100}>
        <div className="text-center mb-16">
          {/* Back Button */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 text-white transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Title Section */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-300 text-sm font-medium tracking-wide">Student Resource Center</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Resource Library
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover a vast collection of educational resources organized by subject, difficulty, and type. 
            Filter through our hierarchical system to find exactly what you need for your learning journey.
          </p>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-1 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
        </FadeIn>

        {/* Search and Filter Section */}
        <FadeIn delay={300}>
        <div className="mb-12">
          <SearchAndFilterBar
            onSearch={handleSearch}
            totalResults={resources.length}
            isLoading={searchLoading}
          />
        </div>
        </FadeIn>

        {/* Hierarchical Filters */}
        <FadeIn delay={500}>
        <div className="mb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <HierarchicalFilters
              filters={{
                particle: filters.filters.particle || '',
                atom: filters.filters.atom || '',
                molecule: filters.filters.molecule || '',
                matter: filters.filters.matter || ''
              }}
              onFilterChange={handleHierarchicalFilterChange}
            />
          </div>
        </div>
        </FadeIn>

        {/* Resources Grid/List */}
        <FadeIn delay={700}>
        <div className="mb-16">
          {resources.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <BookOpen className="w-16 h-16 text-blue-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">No Resources Found</h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to find the resources you're looking for.
              </p>
              <button
                onClick={() => handleSearch({
                  searchTerm: '',
                  filters: { particle: '', atom: '', molecule: '', matter: '' }
                })}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }>
              {resources.map((resource, index) => (
                <FadeIn key={resource.id} delay={800 + index * 100}>
                  <ResourceCard
                    resource={resource}
                    onClick={handleResourceClick}
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
        </FadeIn>

        {/* Load More Button (for future pagination) */}
        {resources.length > 0 && (
          <div className="text-center">
            <button
              disabled
              className="px-8 py-4 bg-white/10 text-slate-400 rounded-2xl border border-white/20 cursor-not-allowed font-semibold"
            >
              More resources coming soon...
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ResourceLibrary;
