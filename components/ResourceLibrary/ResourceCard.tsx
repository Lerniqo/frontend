"use client";

import React from 'react';
import { Clock, Download, Star, Crown, Play, FileText, Brain, ClipboardList, HelpCircle } from 'lucide-react';
import { Resource } from '@/types/resource.types';
import GlareHover from '@/components/ui/GlareHover';

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'Video':
        return <Play className="w-5 h-5" />;
      case 'Note':
        return <FileText className="w-5 h-5" />;
      case 'Quiz':
        return <HelpCircle className="w-5 h-5" />;
      case 'Interactive':
        return <Brain className="w-5 h-5" />;
      case 'Assignment':
        return <ClipboardList className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'Video':
        return 'from-red-500 to-pink-500';
      case 'Note':
        return 'from-blue-500 to-indigo-500';
      case 'Quiz':
        return 'from-green-500 to-emerald-500';
      case 'Interactive':
        return 'from-purple-500 to-violet-500';
      case 'Assignment':
        return 'from-orange-500 to-amber-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400 bg-green-400/20';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <GlareHover
      width="100%"
      height="auto"
      background="rgba(255, 255, 255, 0.1)"
      borderRadius="1rem"
      borderColor="rgba(255, 255, 255, 0.2)"
      glareColor="#3b82f6"
      glareOpacity={0.3}
      glareAngle={-45}
      glareSize={150}
      transitionDuration={500}
      className="backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden cursor-pointer"
      onClick={() => onClick(resource)}
    >
      <div className="w-full">
      {/* Card Header */}
      <div className="relative p-6 pb-4">
        {/* Premium Badge */}
        {resource.isPremium && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              <Crown className="w-3 h-3" />
              <span>PREMIUM</span>
            </div>
          </div>
        )}

        {/* Type Badge */}
        <div className="mb-4">
          <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getTypeColor(resource.type)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {getTypeIcon(resource.type)}
            <span>{resource.type}</span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(resource.duration)}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </div>
          <div className="text-slate-400 text-xs">
            {resource.subject}
          </div>
        </div>

        {/* Category Path */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-1">
              <span className="text-blue-300 font-medium">{resource.category.particle}</span>
              {resource.category.atom && (
                <>
                  <span>→</span>
                  <span className="text-purple-300 font-medium">{resource.category.atom}</span>
                </>
              )}
            </div>
            {(resource.category.molecule || resource.category.matter) && (
              <div className="flex items-center space-x-1">
                {resource.category.molecule && (
                  <>
                    <span className="text-indigo-300 font-medium">{resource.category.molecule}</span>
                    {resource.category.matter && (
                      <>
                        <span>→</span>
                        <span className="text-teal-300 font-medium">{resource.category.matter}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-md">
              +{resource.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between">
          {/* Teacher Info */}
          <div className="text-xs text-slate-400">
            by <span className="text-slate-300 font-medium">{resource.teacherName}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{formatNumber(resource.downloads)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-medium">{resource.rating}</span>
              <span>({resource.totalRatings})</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </GlareHover>
  );
};

export default ResourceCard;
