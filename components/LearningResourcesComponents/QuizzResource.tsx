"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  getQuizzById,
  type QuizResponse,
  type QuizQuestion,
  type QuizOption,
} from "@/services/contentService";
import {
  FaPlay,
  FaCheck,
  FaTimes,
  FaRedo,
  FaTrophy,
  FaClock,
  FaQuestionCircle,
  FaChevronRight,
  FaChevronLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaBookOpen,
  FaStar,
  FaAward,
  FaThumbsUp,
  FaBrain,
} from "react-icons/fa";

interface QuizzResourceProps {
  resourceId: string | null;
}

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: string]: string };
  isCompleted: boolean;
  score: number;
  startTime: Date | null;
  endTime: Date | null;
  showResults: boolean;
}

interface QuestionResult {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
  questionText: string;
  difficulty: string;
}

export default function QuizzResource({ resourceId }: QuizzResourceProps) {
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isCompleted: false,
    score: 0,
    startTime: null,
    endTime: null,
    showResults: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load quiz data
  useEffect(() => {
    if (resourceId) {
      loadQuiz(resourceId);
    }
  }, [resourceId]);

  // Animate container entrance
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  // Animate question transitions
  useEffect(() => {
    if (questionRef.current && quizData) {
      gsap.fromTo(
        questionRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [quizState.currentQuestionIndex, quizData]);

  const loadQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuizzById(quizId);
      setQuizData(data);
    } catch (err) {
      setError("Failed to load quiz. Please try again.");
      console.error("Error loading quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      startTime: new Date(),
    }));

    // Animate start transition
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setQuizState((prev) => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [questionId]: optionId,
      },
    }));

    // Animate option selection
    const selectedOption = document.querySelector(
      `[data-option-id="${optionId}"]`
    );
    if (selectedOption) {
      gsap.to(selectedOption, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const nextQuestion = () => {
    if (!quizData) return;

    const nextIndex = quizState.currentQuestionIndex + 1;
    if (nextIndex < quizData.questions.length) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const finishQuiz = () => {
    if (!quizData) return;

    const endTime = new Date();
    let correctAnswers = 0;

    quizData.questions.forEach((question) => {
      const selectedAnswer = quizState.selectedAnswers[question.id];
      if (selectedAnswer === question.correctOptionId) {
        correctAnswers++;
      }
    });

    const score = Math.round(
      (correctAnswers / quizData.questions.length) * 100
    );

    setQuizState((prev) => ({
      ...prev,
      isCompleted: true,
      endTime,
      score,
      showResults: true,
    }));

    // Animate results appearance
    setTimeout(() => {
      if (resultsRef.current) {
        gsap.fromTo(
          resultsRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      }
    }, 100);
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isCompleted: false,
      score: 0,
      startTime: null,
      endTime: null,
      showResults: false,
    });

    // Animate restart
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  };

  const getQuestionResults = (): QuestionResult[] => {
    if (!quizData) return [];

    return quizData.questions.map((question) => {
      const selectedOptionId = quizState.selectedAnswers[question.id] || "";
      const isCorrect = selectedOptionId === question.correctOptionId;

      return {
        questionId: question.id,
        selectedOptionId,
        correctOptionId: question.correctOptionId,
        isCorrect,
        explanation: question.explanation,
        questionText: question.text,
        difficulty: question.difficulty,
      };
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <FaTrophy className="text-yellow-500" />;
    if (score >= 70) return <FaAward className="text-blue-500" />;
    if (score >= 50) return <FaThumbsUp className="text-green-500" />;
    return <FaBrain className="text-purple-500" />;
  };

  const getTimeTaken = () => {
    if (!quizState.startTime || !quizState.endTime) return "N/A";
    const timeDiff =
      quizState.endTime.getTime() - quizState.startTime.getTime();
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="text-green-600 mb-4 animate-spin">
            <FaSpinner size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Loading Quiz...
          </h3>
          <p className="text-gray-600 text-center">
            Please wait while we prepare your quiz.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="text-red-500 mb-4">
            <FaExclamationTriangle size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Quiz
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
          <button
            onClick={() => resourceId && loadQuiz(resourceId)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="text-gray-400 mb-4">
            <FaQuestionCircle size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Quiz Selected
          </h3>
          <p className="text-gray-600 text-center">
            Please select a quiz to get started.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[quizState.currentQuestionIndex];
  const selectedAnswer = quizState.selectedAnswers[currentQuestion?.id];
  const isAnswerSelected = Boolean(selectedAnswer);

  // Quiz start screen
  if (!quizState.startTime) {
    return (
      <div
        ref={containerRef}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex items-center gap-4">
            <div className="text-green-600">
              <FaBookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {quizData.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {quizData.questions.length} questions • Multiple choice
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <FaPlay className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Ready to Start?
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Test your knowledge with this interactive quiz. You'll get
              immediate feedback and explanations for each question.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 mb-2">
                <FaQuestionCircle size={20} />
              </div>
              <div className="text-sm font-medium text-gray-800">
                {quizData.questions.length} Questions
              </div>
              <div className="text-xs text-gray-600">
                Multiple choice format
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 mb-2">
                <FaClock size={20} />
              </div>
              <div className="text-sm font-medium text-gray-800">
                Self-paced
              </div>
              <div className="text-xs text-gray-600">Take your time</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 mb-2">
                <FaCheck size={20} />
              </div>
              <div className="text-sm font-medium text-gray-800">
                Instant Feedback
              </div>
              <div className="text-xs text-gray-600">With explanations</div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz results screen
  if (quizState.showResults) {
    const questionResults = getQuestionResults();
    const correctCount = questionResults.filter((r) => r.isCorrect).length;

    return (
      <div
        ref={containerRef}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-blue-600">
                {getScoreIcon(quizState.score)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Quiz Complete!
                </h2>
                <p className="text-gray-600 text-sm">{quizData.title}</p>
              </div>
            </div>
            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <FaRedo size={14} />
              Retry
            </button>
          </div>
        </div>

        <div ref={resultsRef} className="p-8">
          {/* Score Summary */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <span
                className={`text-3xl font-bold ${getScoreColor(
                  quizState.score
                )}`}
              >
                {quizState.score}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {quizState.score >= 90
                ? "Outstanding!"
                : quizState.score >= 70
                ? "Well Done!"
                : quizState.score >= 50
                ? "Good Try!"
                : "Keep Learning!"}
            </h3>
            <p className="text-gray-600">
              You got {correctCount} out of {quizData.questions.length}{" "}
              questions correct
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-green-600 mb-2">
                <FaCheck size={20} />
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {correctCount}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-red-600 mb-2">
                <FaTimes size={20} />
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {quizData.questions.length - correctCount}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-blue-600 mb-2">
                <FaClock size={20} />
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {getTimeTaken()}
              </div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Question Review & Explanations
            </h4>
            {questionResults.map((result, index) => {
              const question = quizData.questions.find(
                (q) => q.id === result.questionId
              );
              const selectedOption = question?.options.find(
                (o) => o.id === result.selectedOptionId
              );
              const correctOption = question?.options.find(
                (o) => o.id === result.correctOptionId
              );

              return (
                <div
                  key={result.questionId}
                  className={`p-6 rounded-lg border-2 ${
                    result.isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          result.isCorrect
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {result.isCorrect ? (
                          <FaCheck size={14} />
                        ) : (
                          <FaTimes size={14} />
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          Question {index + 1}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            result.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : result.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {result.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium mb-3">
                        {result.questionText}
                      </p>

                      {!result.isCorrect && (
                        <div className="mb-3">
                          <div className="text-sm text-red-700 mb-1">
                            Your Answer:
                          </div>
                          <div className="text-red-800 bg-red-100 px-3 py-2 rounded">
                            {selectedOption?.text || "No answer selected"}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="text-sm text-green-700 mb-1">
                          Correct Answer:
                        </div>
                        <div className="text-green-800 bg-green-100 px-3 py-2 rounded">
                          {correctOption?.text}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          💡 Explanation:
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-8">
            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaRedo size={16} />
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Progress Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              <FaQuestionCircle size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{quizData.title}</h3>
              <p className="text-sm text-gray-600">
                Question {quizState.currentQuestionIndex + 1} of{" "}
                {quizData.questions.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-lg font-semibold text-blue-600">
              {Math.round(
                ((quizState.currentQuestionIndex + 1) /
                  quizData.questions.length) *
                  100
              )}
              %
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                ((quizState.currentQuestionIndex + 1) /
                  quizData.questions.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div ref={questionRef} className="p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {quizState.currentQuestionIndex + 1}
            </span>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                currentQuestion.difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : currentQuestion.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>
          <h4 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {currentQuestion.text}
          </h4>
        </div>

        {/* Options */}
        <div ref={optionsRef} className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option.id;

            return (
              <button
                key={option.id}
                data-option-id={option.id}
                onClick={() => selectAnswer(currentQuestion.id, option.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-blue-100 border-blue-500 text-blue-800"
                    : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-400"
                    }`}
                  >
                    {isSelected ? (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    ) : (
                      <span className="text-xs font-medium text-gray-600">
                        {String.fromCharCode(65 + index)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousQuestion}
            disabled={quizState.currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FaChevronLeft size={14} />
            Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={nextQuestion}
              disabled={!isAnswerSelected}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {quizState.currentQuestionIndex ===
              quizData.questions.length - 1 ? (
                <>
                  <FaTrophy size={14} />
                  Finish Quiz
                </>
              ) : (
                <>
                  Next
                  <FaChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
