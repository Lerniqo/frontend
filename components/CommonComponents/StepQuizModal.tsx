"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getAIGeneratedQuizz, AIQuizQuestion } from "@/services/aiService";
import QuizzQuestionComponent from "@/components/CommonComponents/QuizzQuestionComponent";

interface StepQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (passed: boolean, score: number) => void;
  stepTitle: string;
  stepNumber: number;
}

type QuizPhase = "loading" | "quiz" | "results";

export default function StepQuizModal({
  isOpen,
  onClose,
  onComplete,
  stepTitle,
  stepNumber,
}: StepQuizModalProps) {
  const [phase, setPhase] = useState<QuizPhase>("loading");
  const [quizQuestions, setQuizQuestions] = useState<AIQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [loadingError, setLoadingError] = useState<string>("");

  // Refs for GSAP animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load quiz questions when modal opens
  useEffect(() => {
    if (isOpen) {
      resetQuiz();
      loadQuiz();
    }
  }, [isOpen]);

  // GSAP animations when phase changes
  useEffect(() => {
    if (phase !== "loading" && isOpen) {
      gsap.set([titleRef.current, subtitleRef.current, contentRef.current], {
        opacity: 0,
        y: 30,
      });

      const tl = gsap.timeline();
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
    }
  }, [phase, isOpen]);

  const resetQuiz = () => {
    setPhase("loading");
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setLoadingError("");
  };

  const loadQuiz = async () => {
    try {
      setLoadingError("");
      const quizResponse = await getAIGeneratedQuizz({
        topic: stepTitle,
        num_questions: 5,
        difficulty: "medium",
      });

      setQuizQuestions(quizResponse.questions);
      setPhase("quiz");
    } catch (error: unknown) {
      console.error("Error loading step quiz:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate quiz. Please try again.";
      setLoadingError(errorMessage);
      setPhase("quiz");
    }
  };

  const handleAnswer = (selectedAnswer: string, _isCorrect: boolean) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctOption = currentQuestion.options.find((opt) => opt.is_correct);
    const correctAnswerText = correctOption ? correctOption.text : "";

    const normalizedSelected = selectedAnswer.toLowerCase().trim();
    const normalizedCorrect = correctAnswerText.toLowerCase().trim();
    const isAnswerCorrect = normalizedSelected === normalizedCorrect;

    if (isAnswerCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setPhase("results");
      }, 500);
    }
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    loadQuiz();
  };

  const handleFinish = () => {
    const totalQuestions = correctAnswers + incorrectAnswers;
    const passed = correctAnswers >= 4; // Need 4 out of 5 to pass
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    onComplete(passed, scorePercentage);
    onClose();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (phase) {
      case "loading":
        return "Loading Quiz...";
      case "quiz":
        return `Step ${stepNumber} Quiz`;
      case "results":
        return "Quiz Results";
      default:
        return "Quiz";
    }
  };

  const getSubtitle = () => {
    switch (phase) {
      case "loading":
        return "Preparing your quiz questions...";
      case "quiz":
        return stepTitle;
      case "results":
        return "Let's see how you did!";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (phase) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Generating quiz questions...</p>
          </div>
        );

      case "quiz":
        if (loadingError) {
          return (
            <div className="max-w-2xl w-full text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Error Loading Quiz
                </h3>
                <p className="text-red-600 mb-4">{loadingError}</p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Close
              </button>
            </div>
          );
        }

        if (quizQuestions.length === 0) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading questions...</span>
              </div>
            </div>
          );
        }

        const currentQuestion = quizQuestions[currentQuestionIndex];
        const correctAnswerText =
          currentQuestion.options.find((opt) => opt.is_correct)?.text || "";

        return (
          <QuizzQuestionComponent
            question={currentQuestion.question_text}
            choices={currentQuestion.options.map((opt) => opt.text)}
            answer={correctAnswerText}
            onAnswer={(selectedAnswer: string, _isCorrect: boolean) => {
              const normalizedSelected = selectedAnswer.toLowerCase().trim();
              const normalizedCorrect = correctAnswerText.toLowerCase().trim();
              const isAnswerCorrect = normalizedSelected === normalizedCorrect;
              handleAnswer(selectedAnswer, isAnswerCorrect);
            }}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
          />
        );

      case "results":
        const totalQuestions = correctAnswers + incorrectAnswers;
        const scorePercentage = Math.round(
          (correctAnswers / totalQuestions) * 100
        );
        const passed = correctAnswers >= 4; // Need 4 out of 5 to pass
        const scoreColor = passed
          ? "text-green-700"
          : scorePercentage >= 50
          ? "text-yellow-700"
          : "text-red-700";
        const scoreBgColor = passed
          ? "bg-green-50"
          : scorePercentage >= 50
          ? "bg-yellow-50"
          : "bg-red-50";

        return (
          <div className="max-w-2xl w-full text-center">
            <div className="mb-6">
              <div
                className={`w-20 h-20 ${scoreBgColor} rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${scoreColor.replace(
                  "text",
                  "border"
                )}`}
              >
                <svg
                  className={`w-10 h-10 ${scoreColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      passed
                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        : "M6 18L18 6M6 6l12 12"
                    }
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {passed ? "Congratulations!" : "Keep Practicing!"}
              </h2>
              <p className="text-gray-600">
                {passed
                  ? `You've passed Step ${stepNumber}: ${stepTitle}`
                  : `You need at least 4 out of 5 to pass. You got ${correctAnswers}/5.`}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-8">
              <div className={`text-4xl font-bold ${scoreColor} mb-2`}>
                {scorePercentage}%
              </div>
              <p className="text-gray-700 font-medium">Overall Score</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-700">
                  {correctAnswers}
                </div>
                <div className="text-sm text-green-600">Correct Answers</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-700">
                  {incorrectAnswers}
                </div>
                <div className="text-sm text-red-600">Incorrect Answers</div>
              </div>
            </div>

            {passed ? (
              <button
                onClick={handleFinish}
                className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Continue to Next Step
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleRetakeQuiz}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-8 py-3 bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-600 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              ref={titleRef}
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              {getTitle()}
            </h1>
            <p ref={subtitleRef} className="text-lg text-gray-600">
              {getSubtitle()}
            </p>
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex justify-center">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
