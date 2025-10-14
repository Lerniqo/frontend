"use client";

import React from "react";
import { Calendar, Users, Clock, Trophy, Award, Target } from "lucide-react";
import { StudentContest } from "@/services/studentContestService";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface ContestCardProps {
  contest: StudentContest;
  onClick: () => void;
}

export default function ContestCard({ contest, onClick }: ContestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const endTime = new Date(contest.endDate).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (days > 0) {
        return `${days}d ${hours}h left`;
      } else {
        return `${hours}h left`;
      }
    }
    return "Ended";
  };

  const participantProgress =
    (contest.participants / contest.maxParticipants) * 100;

  return (
    <div onClick={onClick} className="group cursor-pointer relative h-full">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 group h-full flex flex-col">
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-1">
                  {contest.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {contest.subject}
                </p>
              </div>
            </div>
            {contest.isJoined && (
              <Badge className="bg-green-100 text-green-800 border-green-200 flex-shrink-0">
                Joined
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getStatusColor(contest.status)}>
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </Badge>
            <Badge className={getDifficultyColor(contest.difficulty)}>
              {contest.difficulty.charAt(0).toUpperCase() +
                contest.difficulty.slice(1)}
            </Badge>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
            {contest.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          {/* Contest Stats */}
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-700">
                {contest.participants}/{contest.maxParticipants}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">
                {contest.tasks.length} Tasks
              </span>
            </div>
          </div>

          {/* Participant Progress */}
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Participants</span>
              <span className="text-gray-700">
                {Math.round(participantProgress)}%
              </span>
            </div>
            <Progress
              value={participantProgress}
              className="h-2 bg-purple-100"
            />
          </div>

          {/* Date Information */}
          <div className="flex items-center justify-between text-sm flex-shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-gray-700 line-clamp-1">
                {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
              </span>
            </div>
          </div>

          {/* Time Remaining for Active Contests */}
          {contest.status === "active" && (
            <div className="flex items-center space-x-2 text-sm flex-shrink-0">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">
                {getTimeRemaining()}
              </span>
            </div>
          )}

          {/* Spacer to push bottom content down */}
          <div className="flex-1"></div>

          {/* Top Performers Preview */}
          {contest.leaderboard.length > 0 && (
            <div className="pt-4 border-t border-purple-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Top Performers
                </span>
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex items-center space-x-2">
                {contest.leaderboard.slice(0, 3).map((entry, index) => (
                  <div key={entry.id} className="flex items-center space-x-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={entry.avatar} alt={entry.studentName} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-purple-600 to-blue-500 text-white">
                        {entry.studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {index < 2 && <span className="text-gray-400">•</span>}
                  </div>
                ))}
                {contest.leaderboard.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{contest.leaderboard.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Awards Preview */}
          <div className="pt-4 border-t border-purple-200 flex-shrink-0">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Prizes</span>
            </div>
            <div className="text-xs text-gray-600 line-clamp-1">
              🥇 {contest.awards.first}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
