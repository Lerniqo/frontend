"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Zap, Target, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlareHover from '@/components/ui/GlareHover';
import Countdown from './Countdown';
import QuestionTimer from './QuestionTimer';
import OpponentSearch from './OpponentSearch';
import ParticleEffect from './ParticleEffect';
import { gameSounds } from './GameSounds';

// Game states
type GameState = 'searching' | 'waiting' | 'countdown' | 'playing' | 'finished';

// Interfaces
interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isOnline: boolean;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

interface MatchResult {
  winner: Player;
  loser: Player;
  winnerScore: number;
  loserScore: number;
  totalQuestions: number;
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the smallest unit of matter?',
    options: ['Molecule', 'Atom', 'Electron', 'Proton'],
    correctAnswer: 1,
    timeLimit: 15
  },
  {
    id: '2',
    question: 'What is the process of converting a solid directly to gas?',
    options: ['Melting', 'Evaporation', 'Sublimation', 'Condensation'],
    correctAnswer: 2,
    timeLimit: 15
  },
  {
    id: '3',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    timeLimit: 15
  },
  {
    id: '4',
    question: 'What type of bond shares electrons between atoms?',
    options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'],
    correctAnswer: 1,
    timeLimit: 15
  },
  {
    id: '5',
    question: 'What is the pH of pure water?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 1,
    timeLimit: 15
  }
];

const DualMatchArena: React.FC = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>('searching');
  const [currentPlayer] = useState<Player>({
    id: '1',
    name: 'You',
    avatar: '👤',
    score: 0,
    isOnline: true
  });
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [countdownValue, setCountdownValue] = useState(3);
  const [showParticles, setShowParticles] = useState(false);
  const [particleType, setParticleType] = useState<'success' | 'error' | 'victory'>('success');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock opponent data
  const mockOpponents = useMemo(() => [
    { id: '2', name: 'Alex Chen', avatar: '🎓', score: 0, isOnline: true },
    { id: '3', name: 'Sarah Johnson', avatar: '📚', score: 0, isOnline: true },
    { id: '4', name: 'Mike Rodriguez', avatar: '🔬', score: 0, isOnline: true },
    { id: '5', name: 'Emma Wilson', avatar: '⚗️', score: 0, isOnline: true }
  ], []);

  // Function definitions
  const endGame = useCallback(() => {
    const winner = playerScore > opponentScore ? currentPlayer : opponent!;
    const loser = playerScore > opponentScore ? opponent! : currentPlayer;
    const playerWon = playerScore > opponentScore;
    
    setMatchResult({
      winner,
      loser,
      winnerScore: Math.max(playerScore, opponentScore),
      loserScore: Math.min(playerScore, opponentScore),
      totalQuestions: mockQuestions.length
    });
    
    // Play appropriate sound and particles
    if (soundEnabled) {
      if (playerWon) {
        gameSounds.victory();
      } else {
        gameSounds.defeat();
      }
    }
    
    if (playerWon) {
      setParticleType('victory');
      setShowParticles(true);
    }
    
    setGameState('finished');
  }, [currentPlayer, opponent, playerScore, opponentScore, soundEnabled]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex >= mockQuestions.length - 1) {
      endGame();
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setQuestionTimeLeft(15);
  }, [currentQuestionIndex, endGame]);

  // Search for opponent simulation
  useEffect(() => {
    if (gameState === 'searching') {
      const interval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const randomOpponent = mockOpponents[Math.floor(Math.random() * mockOpponents.length)];
            setOpponent(randomOpponent);
            setGameState('waiting');
            if (soundEnabled) gameSounds.matchFound();
            setTimeout(() => setGameState('countdown'), 2000);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [gameState, mockOpponents, soundEnabled]);

  // Countdown timer
  useEffect(() => {
    if (gameState === 'countdown') {
      const interval = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          if (soundEnabled && prev > 0) gameSounds.countdown();
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, soundEnabled]);

  const handleCountdownComplete = () => {
    setGameState('playing');
    setTimeLeft(300); // Reset to 5 minutes
    setQuestionTimeLeft(15);
    if (soundEnabled) gameSounds.gameStart();
  };

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, endGame]);

  // Question timer
  useEffect(() => {
    if (gameState === 'playing' && questionTimeLeft > 0) {
      const timer = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return 15;
          }
          // Play warning sound when time is running out
          if (soundEnabled && prev === 6) gameSounds.timerWarning();
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, questionTimeLeft, handleNextQuestion, soundEnabled]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setPlayerScore(prev => prev + 100);
      if (soundEnabled) gameSounds.correctAnswer();
      setParticleType('success');
      setShowParticles(true);
    } else {
      if (soundEnabled) gameSounds.incorrectAnswer();
      setParticleType('error');
      setShowParticles(true);
    }
    
    // Simulate opponent answer
    const opponentCorrect = Math.random() > 0.3; // 70% chance opponent is correct
    if (opponentCorrect) {
      setOpponentScore(prev => prev + 100);
    }
    
    setTimeout(() => {
      handleNextQuestion();
      setShowParticles(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handlePlayAgain = () => {
    setGameState('searching');
    setCurrentQuestionIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setTimeLeft(300);
    setQuestionTimeLeft(15);
    setSelectedAnswer(null);
    setMatchResult(null);
    setOpponent(null);
    setSearchProgress(0);
    setCountdownValue(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-3 text-white">
            <Target className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dual Match Arena
            </h1>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-blue-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-red-400" />
                )}
              </button>
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* Searching State */}
          {gameState === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white">Finding Your Opponent</h2>
                <p className="text-xl text-white/70">Preparing for an epic battle of minds...</p>
              </div>
              
              <OpponentSearch 
                progress={searchProgress} 
                onlineCount={1247} 
              />
            </motion.div>
          )}

          {/* Waiting State */}
          {gameState === 'waiting' && opponent && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <h2 className="text-4xl font-bold text-white">Opponent Found!</h2>
              
              <div className="flex items-center justify-center space-x-12">
                <GlareHover
                  width="200px"
                  height="200px"
                  borderRadius="20px"
                  background="rgba(30, 41, 59, 0.8)"
                  borderColor="rgb(59, 130, 246)"
                  glareColor="#3b82f6"
                  className="border-2"
                >
                  <div className="text-center space-y-3 p-6">
                    <div className="text-6xl">{currentPlayer.avatar}</div>
                    <div className="text-white font-bold text-xl">{currentPlayer.name}</div>
                    <div className="text-blue-400">Ready!</div>
                  </div>
                </GlareHover>

                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl text-purple-400 font-bold"
                >
                  VS
                </motion.div>

                <GlareHover
                  width="200px"
                  height="200px"
                  borderRadius="20px"
                  background="rgba(30, 41, 59, 0.8)"
                  borderColor="rgb(147, 51, 234)"
                  glareColor="#9333ea"
                  className="border-2"
                >
                  <div className="text-center space-y-3 p-6">
                    <div className="text-6xl">{opponent.avatar}</div>
                    <div className="text-white font-bold text-xl">{opponent.name}</div>
                    <div className="text-purple-400">Ready!</div>
                  </div>
                </GlareHover>
              </div>

              <p className="text-xl text-white/70">Both players ready - starting soon!</p>
            </motion.div>
          )}

          {/* Playing State */}
          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Scoreboard */}
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{currentPlayer.avatar}</div>
                  <div>
                    <div className="text-white font-bold text-lg">{currentPlayer.name}</div>
                    <div className="text-blue-400 font-bold text-2xl">{playerScore}</div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-white/60 text-sm">Question {currentQuestionIndex + 1} of {mockQuestions.length}</div>
                  <QuestionTimer 
                    timeLeft={questionTimeLeft}
                    totalTime={15}
                    isActive={gameState === 'playing'}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{opponent?.name}</div>
                    <div className="text-purple-400 font-bold text-2xl">{opponentScore}</div>
                  </div>
                  <div className="text-4xl">{opponent?.avatar}</div>
                </div>
              </div>

              {/* Question */}
              <GlareHover
                width="100%"
                height="auto"
                borderRadius="20px"
                background="rgba(30, 41, 59, 0.9)"
                borderColor="rgb(99, 102, 241)"
                className="border-2 p-8"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white text-center">
                    {mockQuestions[currentQuestionIndex]?.question}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {mockQuestions[currentQuestionIndex]?.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                        whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          selectedAnswer === null
                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer'
                            : selectedAnswer === index
                              ? index === mockQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500/20 border-green-500 text-green-300'
                                : 'bg-red-500/20 border-red-500 text-red-300'
                              : index === mockQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500/20 border-green-500 text-green-300'
                                : 'bg-white/5 text-white/60 border border-white/10'
                        }`}
                      >
                        <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </GlareHover>
            </motion.div>
          )}

          {/* Finished State */}
          {gameState === 'finished' && matchResult && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
                <h2 className="text-5xl font-bold text-white">Match Completed!</h2>
                
                {matchResult.winner.id === currentPlayer.id ? (
                  <div className="space-y-2">
                    <p className="text-3xl text-green-400 font-bold">🎉 Victory! 🎉</p>
                    <p className="text-xl text-white/70">Congratulations! You won the match!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-3xl text-red-400 font-bold">Defeat</p>
                    <p className="text-xl text-white/70">Better luck next time!</p>
                  </div>
                )}
              </div>

              <GlareHover
                width="100%"
                height="auto"
                borderRadius="20px"
                background="rgba(30, 41, 59, 0.9)"
                borderColor="rgb(168, 85, 247)"
                className="border-2 p-8"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Final Results</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{currentPlayer.avatar}</div>
                      <div>
                        <div className="text-white font-bold text-lg">{currentPlayer.name}</div>
                        <div className="text-blue-400 font-bold text-3xl">{playerScore}</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-white/60 text-sm">Final Score</div>
                      <div className="text-white text-2xl font-bold">
                        {playerScore} - {opponentScore}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">{opponent?.name}</div>
                        <div className="text-purple-400 font-bold text-3xl">{opponentScore}</div>
                      </div>
                      <div className="text-4xl">{opponent?.avatar}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-white/60 text-sm">Questions</div>
                      <div className="text-white text-2xl font-bold">{mockQuestions.length}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-white/60 text-sm">Accuracy</div>
                      <div className="text-white text-2xl font-bold">
                        {Math.round((playerScore / (mockQuestions.length * 100)) * 100)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-white/60 text-sm">XP Gained</div>
                      <div className="text-white text-2xl font-bold">+{playerScore / 10}</div>
                    </div>
                  </div>
                </div>
              </GlareHover>

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  <Zap className="w-5 h-5" />
                  <span>Play Again</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackToDashboard}
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Back to Dashboard
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Countdown Overlay */}
      {gameState === 'countdown' && (
        <Countdown 
          count={countdownValue} 
          onComplete={handleCountdownComplete}
        />
      )}

      {/* Particle Effects */}
      <ParticleEffect 
        trigger={showParticles}
        type={particleType}
        onComplete={() => setShowParticles(false)}
      />
    </div>
  );
};

export default DualMatchArena;
