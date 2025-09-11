'use client';

import React from 'react';
import { Calendar, Users, Clock, Trophy, Award, Target } from 'lucide-react';
import { StudentContest } from '@/services/studentContestService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface ContestCardProps {
  contest: StudentContest;
  onClick: () => void;
}

export default function ContestCard({ contest, onClick }: ContestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const endTime = new Date(contest.endDate).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        return `${days}d ${hours}h left`;
      } else {
        return `${hours}h left`;
      }
    }
    return 'Ended';
  };

  const participantProgress = (contest.participants / contest.maxParticipants) * 100;

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 group-hover:from-blue-500/20 group-hover:to-purple-600/20"></div>
      
      <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {contest.title}
                </h3>
                <p className="text-sm text-slate-400">{contest.subject}</p>
              </div>
            </div>
            {contest.isJoined && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Joined
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getStatusColor(contest.status)}>
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </Badge>
            <Badge className={getDifficultyColor(contest.difficulty)}>
              {contest.difficulty.charAt(0).toUpperCase() + contest.difficulty.slice(1)}
            </Badge>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
            {contest.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contest Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">
                {contest.participants}/{contest.maxParticipants}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">
                {contest.tasks.length} Tasks
              </span>
            </div>
          </div>

          {/* Participant Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Participants</span>
              <span className="text-slate-300">{Math.round(participantProgress)}%</span>
            </div>
            <Progress 
              value={participantProgress} 
              className="h-2 bg-white/10"
            />
          </div>

          {/* Date Information */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">
                {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
              </span>
            </div>
          </div>

          {/* Time Remaining for Active Contests */}
          {contest.status === 'active' && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-medium">
                {getTimeRemaining()}
              </span>
            </div>
          )}

          {/* Top Performers Preview */}
          {contest.leaderboard.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Top Performers</span>
                <Award className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-center space-x-2">
                {contest.leaderboard.slice(0, 3).map((entry, index) => (
                  <div key={entry.id} className="flex items-center space-x-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={entry.avatar} alt={entry.studentName} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {entry.studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {index < 2 && <span className="text-slate-500">•</span>}
                  </div>
                ))}
                {contest.leaderboard.length > 3 && (
                  <span className="text-xs text-slate-400">+{contest.leaderboard.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {/* Awards Preview */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-slate-300">Prizes</span>
            </div>
            <div className="text-xs text-slate-400 line-clamp-1">
              🥇 {contest.awards.first}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
