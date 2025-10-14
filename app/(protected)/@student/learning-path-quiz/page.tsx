"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  getInitialQuizz,
  setInitialQuizzResult,
  generateLearningPath,
  InitialQuizQuestion,
} from "@/services/contentService";
import QuizzGoalInputComponent from "@/components/StudentLearningPathComponents/QuizzGoalInputComponent";
import QuizzQuestionComponent from "@/components/CommonComponents/QuizzQuestionComponent";
import WelcomeLearningPathGeneration from "@/components/StudentLearningPathComponents/WelcomeLearningPathGeneration";

type QuizPhase = "welcome" | "goal" | "quiz" | "results" | "generating";

export default function LearningPathQuizPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<QuizPhase>("welcome");
  const [quizQuestions, setQuizQuestions] = useState<InitialQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<InitialQuizQuestion[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  // Refs for GSAP animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load quiz questions when component mounts
  useEffect(() => {
    loadQuizQuestions();
  }, []);

  // GSAP animations when phase changes
  useEffect(() => {
    if (phase !== "welcome") {
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

  const loadQuizQuestions = async () => {
    try {
      const questions = await getInitialQuizz();
      setQuizQuestions(questions);
    } catch (error) {
      console.error("Error loading quiz questions:", error);
    }
  };

  const handlePresentationComplete = () => {
    setPhase("goal");
  };

  const handleGoalSet = () => {
    setPhase("quiz");
  };

  const handleAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const answeredQuestion: InitialQuizQuestion = {
      ...currentQuestion,
      isCorrect,
    };

    setAnswers((prev) => [...prev, answeredQuestion]);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500); // Increased delay for smoother transition
    } else {
      // Quiz completed
      setTimeout(() => {
        setPhase("results");
      }, 500); // Increased delay for smoother transition
    }
  };

  const handleGenerateLearningPath = async () => {
    setPhase("generating");
    setIsLoading(true);

    try {
      // Submit quiz results
      await setInitialQuizzResult(answers);

      // Generate learning path
      await generateLearningPath();

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error generating learning path:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (phase) {
      case "welcome":
        return "";
      case "goal":
        return "Generating The Learning Path";
      case "quiz":
        return "Generating The Learning Path";
      case "results":
        return "Generating The Learning Path";
      case "generating":
        return "Generating The Learning Path";
      default:
        return "Generating The Learning Path";
    }
  };

  const getSubtitle = () => {
    switch (phase) {
      case "welcome":
        return "";
      case "goal":
        return "Tell us what you want to achieve, and we'll map out the way.";
      case "quiz":
        return "Let's measure your limits!";
      case "results":
        return "Great job! Here are your results.";
      case "generating":
        return "Creating your personalized learning path...";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (phase) {
      case "welcome":
        return (
          <WelcomeLearningPathGeneration
            onPresentationComplete={handlePresentationComplete}
          />
        );

      case "goal":
        return <QuizzGoalInputComponent onGoalSet={handleGoalSet} />;

      case "quiz":
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

        return (
          <QuizzQuestionComponent
            question={quizQuestions[currentQuestionIndex]?.question || ""}
            choices={quizQuestions[currentQuestionIndex]?.choices || []}
            answer={quizQuestions[currentQuestionIndex]?.answer || ""}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
          />
        );

      case "results":
        return (
          <div className="max-w-2xl w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-white"
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
                Congratulations!
              </h2>
              <p className="text-gray-600">
                You have successfully completed the assessment quiz.
              </p>
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

            <button
              onClick={handleGenerateLearningPath}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Generate Learning Path For Me
            </button>
          </div>
        );

      case "generating":
        return (
          <div className="max-w-2xl w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Creating Your Learning Path
              </h2>
              <p className="text-gray-600 mt-2">
                Please wait while we analyze your responses and create a
                personalized learning experience for you.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                This may take a few moments...
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Handle welcome phase differently - full screen presentation
  if (phase === "welcome") {
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
