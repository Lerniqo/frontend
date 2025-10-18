"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Zap, Target, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlareHover from '@/components/ui/GlareHover';
import Countdown from './Countdown';
import QuestionTimer from './QuestionTimer';
import OpponentSearch from './OpponentSearch';
import ParticleEffect from './ParticleEffect';
import { gameSounds } from './GameSounds';
import useIOClient from '@/hooks/useIOClient';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';

// Game states
type GameState = 'searching' | 'waiting' | 'countdown' | 'playing' | 'finished';

// Interfaces
interface Player {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isOnline: boolean;
}

interface Question {
  id: string | number;
  question: string;
  options: string[];
  correctAnswer?: number; // Optional since backend doesn't send it initially
  timeLimit?: number;
}

interface MatchResult {
  winner: Player;
  loser: Player;
  winnerScore: number;
  loserScore: number;
  totalQuestions: number;
}

// Add typed payload interfaces for socket events to avoid `any`
interface MatchFoundPayload {
  opponentIsBot?: boolean;
  isBot?: boolean;
  opponentUserId?: string;
  opponent?: {
    id?: string;
    name?: string;
    avatar?: string;
    score?: number;
    type?: string;
  };
  opponentName?: string;
  opponentAvatar?: string;
  matchId?: string;
  playerRole?: 'playerA' | 'playerB';
  questions?: Question[];
}

interface MatchStateUpdatePayload {
  playerA?: { score?: number };
  playerB?: { score?: number };
  isMatchComplete?: boolean;
}

interface MatchAnswerResultPayload {
  isCorrect?: boolean;
}

interface MatchmakingErrorPayload {
  message?: string;
}

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const IOClient = useIOClient();
  const { user } = useAuth()
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isPlayerA, setIsPlayerA] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Enforce human-only matchmaking by default and track bot rejections
  const searchStartRef = useRef<number | null>(null);
  const botRejectionsRef = useRef<number>(0);
  const MAX_BOT_REJECTIONS = 20; // safety cap to avoid endless loops
  // Only the current value is used — remove the unused setter to satisfy lint rules
  const [requireHuman] = useState<boolean>(true);

  // Initialize socket connection and join matchmaking
  useEffect(() => {
    if (gameState !== 'searching') return;

    let unsubscribeMatchFound: (() => void) | null = null;
    let unsubscribeError: (() => void) | null = null;
    let searchProgressInterval: NodeJS.Timeout | null = null;

    const initializeMatchmaking = async () => {
      try {
        // Get JWT token for authentication
        const token = userService.getToken();
        if (!token) {
          setError('No authentication token found. Please log in.');
          console.error('No authentication token found');
          return;
        }

        // Connect with authentication
        await IOClient.connect({
          options: {
            auth: { token }
          }
        });

        // Use warn to keep logs allowed by eslint configuration (warn/error are permitted)
        console.warn('Socket connected, joining matchmaking...');

        // Join matchmaking queue (include human-only preference when supported by server)
        // mark when we started searching so very-early "bot" matches can be handled
        searchStartRef.current = Date.now();
        botRejectionsRef.current = 0;
        IOClient.publish('matchmaking:join', {
          userId: user?.userId,
          gameType: "1v1_rapid_quiz",
          requireHuman: requireHuman
        });

        // Simulate search progress animation
        searchProgressInterval = setInterval(() => {
          setSearchProgress(prev => {
            if (prev >= 95) return 95; // Cap at 95% until match found
            return prev + Math.random() * 10;
          });
        }, 500);

        // Subscribe to match found event and reject bot matches when human-only mode is enabled
        unsubscribeMatchFound = IOClient.subscribe('match:found', (data: MatchFoundPayload) => {
          console.warn('Match found (raw):', data);

          // Heuristic detection for bot opponents — servers may expose flags like isBot/opponentIsBot
          const opponentIsBot =
            !!data?.opponentIsBot ||
            !!data?.isBot ||
            (typeof data?.opponentUserId === 'string' && /bot/i.test(data.opponentUserId)) ||
            (typeof data?.opponent?.name === 'string' && /bot/i.test(data.opponent.name)) ||
            (data?.opponent && data.opponent.type === 'bot');

          if (requireHuman && opponentIsBot) {
            // Reject bot match and re-queue until a human is found (with a retry cap)
            console.warn('Detected bot opponent while in human-only mode — rejecting and re-queuing.', data);
            botRejectionsRef.current += 1;

            if (data?.matchId) {
              IOClient.publish('match:leave', { matchId: data.matchId });
            } else {
              IOClient.publish('matchmaking:leave', { userId: user?.userId });
            }

            // Reset visual progress and keep searching unless we've hit the safety cap
            setSearchProgress(0);
            if (botRejectionsRef.current >= MAX_BOT_REJECTIONS) {
              setError('Unable to find a real opponent after multiple attempts. Please try again later or allow bot matches.');
              return;
            }

            // Re-join the queue after a short delay
            setTimeout(() => {
              searchStartRef.current = Date.now();
              IOClient.publish('matchmaking:join', {
                userId: user?.userId,
                gameType: '1v1_rapid_quiz',
                requireHuman: requireHuman
              });
            }, 1200);

            return;
          }

          // Accept the match normally
          if (searchProgressInterval) {
            clearInterval(searchProgressInterval);
          }
          setSearchProgress(100);

          setQuestions(data.questions || []);
          // Ensure matchId is explicitly null when not provided
          setMatchId(data.matchId ?? null);

          // Backend now tells us which player we are
          const weArePlayerA = data.playerRole === 'playerA';
          setIsPlayerA(weArePlayerA);

          // Construct a complete Player object from the payload (fill defaults if fields are missing)
          const opp: Player = {
            id: data.opponent?.id ?? data.opponentUserId ?? 'opponent',
            name: data.opponent?.name ?? data.opponentName ?? 'Opponent',
            avatar: data.opponent?.avatar ?? data.opponentAvatar ?? '🎯',
            score: data.opponent?.score ?? 0,
            isOnline: true,
          };
          setOpponent(opp);

          // Transition to waiting state, then countdown
          setGameState('waiting');
          if (soundEnabled) gameSounds.matchFound();
          setTimeout(() => setGameState('countdown'), 2000);
        });

        // Subscribe to matchmaking errors
        unsubscribeError = IOClient.subscribe('matchmaking:error', (data: MatchmakingErrorPayload) => {
          console.error('Matchmaking error:', data);
           setError(data.message || 'An error occurred during matchmaking');
           if (searchProgressInterval) {
             clearInterval(searchProgressInterval);
           }
         });
       } catch (error) {
         console.error('Error initializing matchmaking:', error);
         setError('Failed to connect to matchmaking service');
         if (searchProgressInterval) {
           clearInterval(searchProgressInterval);
         }
       }
     };

     initializeMatchmaking();

     // Cleanup on unmount or state change
     return () => {
       if (unsubscribeMatchFound) {
         unsubscribeMatchFound();
       }
       if (unsubscribeError) {
         unsubscribeError();
       }
       if (searchProgressInterval) {
         clearInterval(searchProgressInterval);
       }
     };
   }, [IOClient, user, gameState, soundEnabled, requireHuman]);

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
       totalQuestions: questions.length
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
   }, [currentPlayer, opponent, playerScore, opponentScore, soundEnabled, questions.length]);

   const handleNextQuestion = useCallback(() => {
     if (currentQuestionIndex >= questions.length - 1) {
       endGame();
       return;
     }
     
     setCurrentQuestionIndex(prev => prev + 1);
     setSelectedAnswer(null);
     setQuestionTimeLeft(15);
   }, [currentQuestionIndex, questions.length, endGame]);

   // Subscribe to match state updates for real-time opponent progress
   useEffect(() => {
     if (gameState !== 'playing' || !matchId) return;

    const unsubscribeStateUpdate = IOClient.subscribe('match:stateUpdate', (data: MatchStateUpdatePayload) => {
      console.warn('Match state update:', data);
       
       // Update scores based on which player we are
       if (data.playerA && data.playerB) {
         if (isPlayerA) {
           // We are playerA
           setPlayerScore(data.playerA.score ?? 0);
           setOpponentScore(data.playerB.score ?? 0);
         } else {
           // We are playerB
           setPlayerScore(data.playerB.score ?? 0);
           setOpponentScore(data.playerA.score ?? 0);
         }
       }

       // Check if match is complete
       if (data.isMatchComplete) {
         endGame();
       }
     });

     // Subscribe to answer feedback
    const unsubscribeAnswerResult = IOClient.subscribe('match:answerResult', (data: MatchAnswerResultPayload) => {
      console.warn('Answer result:', data);
       
       // Show appropriate feedback based on correctness
       if (data.isCorrect) {
         setParticleType('success');
         if (soundEnabled) gameSounds.correctAnswer();
       } else {
         setParticleType('error');
         if (soundEnabled) gameSounds.incorrectAnswer();
       }
     });

     return () => {
       unsubscribeStateUpdate();
       unsubscribeAnswerResult();
     };
   }, [gameState, matchId, IOClient, isPlayerA, soundEnabled, endGame]);

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
     if (selectedAnswer !== null || !matchId) return;
     
     setSelectedAnswer(answerIndex);
     const currentQuestion = questions[currentQuestionIndex];
     const selectedOption = currentQuestion.options[answerIndex];
     
     // Submit answer to backend
     IOClient.publish('match:submitAnswer', {
       matchId: matchId,
       questionId: currentQuestion.id,
       answer: selectedOption,
       timer: questionTimeLeft
     });

     // Show feedback animation
     setShowParticles(true);
     if (soundEnabled) gameSounds.correctAnswer();
     
     // The backend will send match:stateUpdate with updated scores
     // Move to next question after delay
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
     // Leave matchmaking/match if still active
     if (matchId) {
       IOClient.publish('match:leave', { matchId });
     } else if (gameState === 'searching' || gameState === 'waiting') {
       IOClient.publish('matchmaking:leave', { userId: user?.userId });
     }
     
     // Clear all subscriptions
     IOClient.clearAllSubscriptions();
     
     router.push('/dashboard');
   };

   const handlePlayAgain = () => {
     // Ensure previous subscriptions and any active match are cleaned up before re-searching
     if (matchId) {
       IOClient.publish('match:leave', { matchId });
     } else {
       IOClient.publish('matchmaking:leave', { userId: user?.userId });
     }
     IOClient.clearAllSubscriptions();
     botRejectionsRef.current = 0;
     setError(null);
     // Reset all state
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
     setMatchId(null);
     setQuestions([]);
   };

   // Cleanup on unmount
   useEffect(() => {
     return () => {
       // Leave matchmaking/match if still active
       if (matchId) {
         IOClient.publish('match:leave', { matchId });
       } else if (gameState === 'searching' || gameState === 'waiting') {
         IOClient.publish('matchmaking:leave', { userId: user?.userId });
       }
       
       // Clear all subscriptions
       IOClient.clearAllSubscriptions();
     };
   }, [matchId, gameState, user, IOClient]);

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
          <motion.button
            onClick={handleBackToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 backdrop-blur-md border border-red-400/30 hover:border-red-400/50 text-white/90 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-1.5 rounded-lg group-hover:from-red-400 group-hover:to-pink-400 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Exit Arena</span>
          </motion.button>
          
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
              
              {error ? (
                <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-red-300 text-lg mb-4">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setError(null);
                      setSearchProgress(0);
                      setGameState('searching');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </motion.button>
                </div>
              ) : (
                <div>
                  <OpponentSearch 
                    progress={searchProgress} 
                    onlineCount={1247} 
                  />
                  {requireHuman && (
                    <div className="mt-4 text-sm text-white/70">Searching only for real (human) opponents — bot matches will be rejected.</div>
                  )}
                </div>
              )}
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
                  <div>
                    <div className="text-white font-bold text-lg">{currentPlayer.name}</div>
                    <div className="text-blue-400 font-bold text-2xl">{playerScore}</div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-white/60 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</div>
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
                </div>
              </div>

              {/* Question */}
              {questions[currentQuestionIndex] ? (
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
                      {questions[currentQuestionIndex].question}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {questions[currentQuestionIndex].options.map((option: string, index: number) => (
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
                                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                : 'bg-white/5 text-white/60 border border-white/10'
                          }`}
                        >
                          <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </GlareHover>
              ) : (
                <div className="text-center text-white/70 p-8">
                  Loading question...
                </div>
              )}
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
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-white/60 text-sm">Questions</div>
                      <div className="text-white text-2xl font-bold">{questions.length}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-white/60 text-sm">Accuracy</div>
                      <div className="text-white text-2xl font-bold">
                        {Math.round((playerScore / (questions.length * 100)) * 100)}%
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
