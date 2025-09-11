'use client';

import React, { useState } from 'react';
import { ArrowLeft, Trophy, Users, Calendar, Clock, Target, Award, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { StudentContest, joinContest, leaveContest } from '@/services/studentContestService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface ContestDetailsProps {
  contest: StudentContest;
  onBack: () => void;
  onUpdate: (contest: StudentContest) => void;
}

export default function ContestDetails({ contest, onBack, onUpdate }: ContestDetailsProps) {
  const [loading, setLoading] = useState(false);

  const handleJoinLeave = async () => {
    setLoading(true);
    try {
      const response = contest.isJoined 
        ? await leaveContest(contest.id)
        : await joinContest(contest.id);
      
      if (response.success && response.data) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error updating contest participation:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <Target className="w-4 h-4" />;
      case 'problem-solving':
        return <BookOpen className="w-4 h-4" />;
      case 'coding':
        return <CheckCircle className="w-4 h-4" />;
      case 'essay':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const endTime = new Date(contest.endDate).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        return `${days} days, ${hours} hours remaining`;
      } else if (hours > 0) {
        return `${hours} hours, ${minutes} minutes remaining`;
      } else {
        return `${minutes} minutes remaining`;
      }
    }
    return 'Contest has ended';
  };

  const participantProgress = (contest.participants / contest.maxParticipants) * 100;

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

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 text-white transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Contests</span>
            </button>

            {contest.status === 'active' || contest.status === 'upcoming' ? (
              <Button
                onClick={handleJoinLeave}
                disabled={loading}
                className={`${
                  contest.isJoined 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                } backdrop-blur-xl border transition-all duration-300`}
              >
                {loading ? 'Processing...' : contest.isJoined ? 'Leave Contest' : 'Join Contest'}
              </Button>
            ) : null}
          </motion.div>

          {/* Contest Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{contest.title}</h1>
                <p className="text-xl text-slate-300">{contest.subject}</p>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4 mb-6">
              <Badge className={getStatusColor(contest.status)}>
                {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
              </Badge>
              <Badge className={getDifficultyColor(contest.difficulty)}>
                {contest.difficulty.charAt(0).toUpperCase() + contest.difficulty.slice(1)}
              </Badge>
              {contest.isJoined && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Joined
                </Badge>
              )}
            </div>

            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {contest.description}
            </p>
          </motion.div>

          {/* Contest Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{contest.participants}</h3>
                    <p className="text-blue-300 text-sm">Participants</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={participantProgress} className="h-2 bg-white/10" />
                  <p className="text-xs text-slate-400 mt-1">
                    {contest.participants}/{contest.maxParticipants} joined
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{contest.tasks.length}</h3>
                    <p className="text-purple-300 text-sm">Tasks</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-slate-400">
                    Total Points: {contest.tasks.reduce((sum, task) => sum + task.points, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{formatDate(contest.startDate).split(',')[0]}</h3>
                    <p className="text-green-300 text-sm">Start Date</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{formatDate(contest.endDate).split(',')[0]}</h3>
                    <p className="text-red-300 text-sm">End Date</p>
                  </div>
                </div>
                {contest.status === 'active' && (
                  <div className="mt-2">
                    <p className="text-xs text-slate-400">{getTimeRemaining()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white/10 backdrop-blur-xl border border-white/20">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">Overview</TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-white/20">Tasks</TabsTrigger>
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/20">Leaderboard</TabsTrigger>
                <TabsTrigger value="rules" className="data-[state=active]:bg-white/20">Rules & Awards</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>Contest Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">Start</p>
                            <p className="text-slate-400 text-sm">{formatDate(contest.startDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">End</p>
                            <p className="text-slate-400 text-sm">{formatDate(contest.endDate)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Trophy className="w-5 h-5" />
                        <span>Top Awards</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🥇</span>
                        <div>
                          <p className="text-white font-medium">1st Place</p>
                          <p className="text-slate-400 text-sm">{contest.awards.first}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🥈</span>
                        <div>
                          <p className="text-white font-medium">2nd Place</p>
                          <p className="text-slate-400 text-sm">{contest.awards.second}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🥉</span>
                        <div>
                          <p className="text-white font-medium">3rd Place</p>
                          <p className="text-slate-400 text-sm">{contest.awards.third}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6">
                <div className="grid gap-6">
                  {contest.tasks.map((task) => (
                    <Card key={task.id} className="backdrop-blur-xl bg-white/10 border border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              {getTaskTypeIcon(task.type)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{task.title}</h3>
                              <p className="text-slate-400 text-sm capitalize">{task.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-4">
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {task.points} pts
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                {task.timeLimit}m
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span>Contest Leaderboard</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-slate-300">Rank</TableHead>
                          <TableHead className="text-slate-300">Student</TableHead>
                          <TableHead className="text-slate-300">Score</TableHead>
                          <TableHead className="text-slate-300">Progress</TableHead>
                          <TableHead className="text-slate-300">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contest.leaderboard.map((entry) => (
                          <TableRow key={entry.id} className="border-white/20">
                            <TableCell className="text-white">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{getRankIcon(entry.rank)}</span>
                                <span className="font-medium">#{entry.rank}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={entry.avatar} alt={entry.studentName} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                    {entry.studentName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-white font-medium">{entry.studentName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-bold">{entry.score}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <span className="text-slate-300 text-sm">
                                  {entry.completedTasks}/{entry.totalTasks} tasks
                                </span>
                                <Progress 
                                  value={(entry.completedTasks / entry.totalTasks) * 100} 
                                  className="h-1 bg-white/10"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">{entry.timeSpent}m</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Contest Rules</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {contest.rules.map((rule, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-300 leading-relaxed">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>Awards & Prizes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20">
                          <span className="text-3xl">🥇</span>
                          <div>
                            <p className="text-yellow-300 font-bold">1st Place Winner</p>
                            <p className="text-slate-300 text-sm">{contest.awards.first}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-400/10 to-gray-500/10 rounded-xl border border-gray-400/20">
                          <span className="text-3xl">🥈</span>
                          <div>
                            <p className="text-gray-300 font-bold">2nd Place Winner</p>
                            <p className="text-slate-300 text-sm">{contest.awards.second}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-amber-600/10 to-amber-700/10 rounded-xl border border-amber-600/20">
                          <span className="text-3xl">🥉</span>
                          <div>
                            <p className="text-amber-300 font-bold">3rd Place Winner</p>
                            <p className="text-slate-300 text-sm">{contest.awards.third}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
