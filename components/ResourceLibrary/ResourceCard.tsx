"use client";

import React from "react";
import {
  Clock,
  Download,
  Star,
  Crown,
  Play,
  FileText,
  Brain,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import { Resource } from "@/types/resource.types";
import GlareHover from "@/components/ui/GlareHover";

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "Video":
        return <Play className="w-5 h-5" />;
      case "Note":
        return <FileText className="w-5 h-5" />;
      case "Quiz":
        return <HelpCircle className="w-5 h-5" />;
      case "Interactive":
        return <Brain className="w-5 h-5" />;
      case "Assignment":
        return <ClipboardList className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "Video":
        return "from-red-500 to-pink-500";
      case "Note":
        return "from-blue-500 to-indigo-500";
      case "Quiz":
        return "from-green-500 to-emerald-500";
      case "Interactive":
        return "from-purple-500 to-violet-500";
      case "Assignment":
        return "from-orange-500 to-amber-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getDifficultyColor = (difficulty: Resource["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-700 bg-green-100 border border-green-200";
      case "Intermediate":
        return "text-yellow-700 bg-yellow-100 border border-yellow-200";
      case "Advanced":
        return "text-red-700 bg-red-100 border border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border border-gray-200";
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
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
    <div
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 group h-full flex flex-col cursor-pointer"
      onClick={() => onClick(resource)}
    >
      {/* Card Header */}
      <div className="relative pb-4 flex-shrink-0">
        {/* Premium Badge */}
        {resource.isPremium && (
          <div className="absolute top-0 right-0 z-10">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              <Crown className="w-3 h-3" />
              <span>PREMIUM</span>
            </div>
          </div>
        )}

        {/* Type Badge */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getTypeColor(
              resource.type
            )} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
          >
            {getTypeIcon(resource.type)}
            <span>{resource.type}</span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 min-h-[4rem]">
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(resource.duration)}</span>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              resource.difficulty
            )}`}
          >
            {resource.difficulty}
          </div>
          <div className="text-gray-500 text-xs">{resource.subject}</div>
        </div>

        {/* Category Path */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center space-x-1">
              <span className="text-purple-600 font-medium">
                {resource.category.particle}
              </span>
              {resource.category.atom && (
                <>
                  <span>→</span>
                  <span className="text-blue-600 font-medium">
                    {resource.category.atom}
                  </span>
                </>
              )}
            </div>
            {(resource.category.molecule || resource.category.matter) && (
              <div className="flex items-center space-x-1">
                {resource.category.molecule && (
                  <>
                    <span className="text-indigo-600 font-medium">
                      {resource.category.molecule}
                    </span>
                    {resource.category.matter && (
                      <>
                        <span>→</span>
                        <span className="text-teal-600 font-medium">
                          {resource.category.matter}
                        </span>
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
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md border border-purple-200"
            >
              #{tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md border border-purple-200">
              +{resource.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Spacer to push footer to bottom */}
      <div className="flex-1"></div>

      {/* Card Footer */}
      <div className="px-0 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t-2 border-purple-200 flex-shrink-0 -mx-6 -mb-6 rounded-b-2xl">
        <div className="px-6">
          <div className="flex items-center justify-between">
            {/* Teacher Info */}
            <div className="text-xs text-gray-600">
              by{" "}
              <span className="text-gray-800 font-medium">
                {resource.teacherName}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>{formatNumber(resource.downloads)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-yellow-600 font-medium">
                  {resource.rating}
                </span>
                <span>({resource.totalRatings})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
