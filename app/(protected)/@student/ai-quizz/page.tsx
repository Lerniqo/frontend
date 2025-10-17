"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { getAIGeneratedQuizz, AIQuizQuestion } from "@/services/aiService";
import QuizzQuestionComponent from "@/components/CommonComponents/QuizzQuestionComponent";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";

type QuizPhase = "loading" | "quiz" | "results";

export default function AIQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get parameters from URL
  const topic = searchParams.get("topic") || "";
  const numQuestions = parseInt(searchParams.get("numQuestions") || "5");
  const difficulty =
    (searchParams.get("difficulty") as "easy" | "medium" | "hard") || "easy";

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

  // Load quiz questions when component mounts
  useEffect(() => {
    if (!topic) {
      router.push("/dashboard");
      return;
    }

    const initQuiz = async () => {
      await loadAIQuiz();
    };

    initQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, numQuestions, difficulty]);

  // GSAP animations when phase changes
  useEffect(() => {
    if (phase !== "loading") {
      // Reset elements to initial state
      gsap.set([titleRef.current, subtitleRef.current, contentRef.current], {
        opacity: 0,
        y: 30,
      });

      // Animate title and subtitle
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
  }, [phase]);

  const loadAIQuiz = async () => {
    try {
      setLoadingError("");
      const quizResponse = await getAIGeneratedQuizz({
        topic,
        num_questions: numQuestions,
        difficulty,
      });

      setQuizQuestions(quizResponse.questions);
      setPhase("quiz");
    } catch (error: unknown) {
      console.error("Error loading AI quiz:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate quiz. Please try again.";
      setLoadingError(errorMessage);
      setPhase("quiz"); // Show error in quiz phase
    }
  };

  const handleAnswer = (selectedAnswer: string, _isCorrect: boolean) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    // Determine correct answer
    const correctOption = currentQuestion.options.find((opt) => opt.is_correct);
    const correctAnswerText = correctOption ? correctOption.text : "";

    // Normalize and compare
    const normalizedSelected = selectedAnswer.toLowerCase().trim();
    const normalizedCorrect = correctAnswerText.toLowerCase().trim();
    const isAnswerCorrect = normalizedSelected === normalizedCorrect;

    if (isAnswerCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500);
    } else {
      // Quiz completed
      setTimeout(() => {
        setPhase("results");
      }, 500);
    }
  };

  const handleRetakeQuiz = async () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setPhase("loading");
    await loadAIQuiz();
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const getTitle = () => {
    switch (phase) {
      case "loading":
        return "";
      case "quiz":
        return "AI Generated Quiz";
      case "results":
        return "Quiz Results";
      default:
        return "AI Quiz";
    }
  };

  const getSubtitle = () => {
    switch (phase) {
      case "loading":
        return "";
      case "quiz":
        return `Topic: ${topic} • Difficulty: ${
          difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        }`;
      case "results":
        return "Great job! Here are your results.";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (phase) {
      case "loading":
        return (
          <GeneralLoadingComponent text="Generating your AI-powered quiz..." />
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
                onClick={handleBackToDashboard}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Back to Dashboard
              </button>
            </div>
          );
        }

        if (quizQuestions.length === 0) {
          return (
            <div className="max-w-2xl w-full">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading questions...</span>
              </div>
            </div>
          );
        }

        const currentQuestion = quizQuestions[currentQuestionIndex];
        // Get the correct answer
        const correctAnswerText =
          currentQuestion.options.find((opt) => opt.is_correct)?.text || "";

        return (
          <QuizzQuestionComponent
            question={currentQuestion.question_text}
            choices={currentQuestion.options.map((opt) => opt.text)}
            answer={correctAnswerText}
            onAnswer={(selectedAnswer: string, _isCorrect: boolean) => {
              // Normalize both answers to lowercase for case-insensitive comparison
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
        const scorePercentage = Math.round(
          (correctAnswers / (correctAnswers + incorrectAnswers)) * 100
        );
        const scoreColor =
          scorePercentage >= 70
            ? "text-green-700"
            : scorePercentage >= 50
            ? "text-yellow-700"
            : "text-red-700";
        const scoreBgColor =
          scorePercentage >= 70
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-gray-600">
                You&apos;ve completed the AI-generated quiz on {topic}.
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

            <div className="flex gap-4">
              <button
                onClick={handleRetakeQuiz}
                className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Retake Quiz
              </button>
              <button
                onClick={handleBackToDashboard}
                className="flex-1 px-8 py-3 bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-600 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Handle loading phase differently - full screen presentation
  if (phase === "loading") {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex justify-center">
        {/* White content div with titles inside */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
          {/* Header inside white div */}
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
