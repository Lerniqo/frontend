"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface QuizzQuestionComponentProps {
  question: string;
  choices: string[];
  answer: string;
  onAnswer: (selectedAnswer: string, isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizzQuestionComponent: React.FC<QuizzQuestionComponentProps> = ({
  question,
  choices,
  answer,
  onAnswer,
  questionNumber,
  totalQuestions,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const choicesRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Reset state when question changes
  useEffect(() => {
    setSelectedChoice(null);
    setShowResult(false);
    setIsAnswered(false);
  }, [question, questionNumber]);

  // GSAP animations on component mount and question change
  useEffect(() => {
    if (containerRef.current) {
      // Set initial state
      gsap.set([progressRef.current, questionRef.current, choicesRef.current], {
        opacity: 0,
        y: 30,
      });

      // Animate elements in sequence
      const tl = gsap.timeline();
      tl.to(progressRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          questionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          choicesRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
    }
  }, [question, questionNumber]);

  // Animate result feedback when it appears
  useEffect(() => {
    if (showResult && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [showResult]);

  const handleChoiceSelect = (choice: string) => {
    if (isAnswered) return;

    setSelectedChoice(choice);
    setShowResult(true);
    setIsAnswered(true);

    // Normalize both answers to lowercase for case-insensitive comparison
    const normalizedChoice = choice.toLowerCase().trim();
    const normalizedAnswer = answer.toLowerCase().trim();
    const isCorrect = normalizedChoice === normalizedAnswer;

    // Call the callback after a short delay to show the result
    setTimeout(() => {
      onAnswer(choice, isCorrect);
    }, 2000);
  };

  const getChoiceStyle = (choice: string) => {
    if (!showResult) {
      return "bg-white border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all duration-200";
    }

    // Normalize for comparison
    const normalizedChoice = choice.toLowerCase().trim();
    const normalizedAnswer = answer.toLowerCase().trim();

    if (normalizedChoice === normalizedAnswer) {
      // Correct answer - light blue
      return "bg-blue-100 border-2 border-blue-400 text-blue-800";
    }

    if (
      normalizedChoice === selectedChoice?.toLowerCase().trim() &&
      normalizedChoice !== normalizedAnswer
    ) {
      // Wrong selected answer - red
      return "bg-red-100 border-2 border-red-400 text-red-800";
    }

    // Unselected choices
    return "bg-gray-100 border-2 border-gray-300 text-gray-600";
  };

  return (
    <div ref={containerRef} className="max-w-4xl w-full">
      {/* Progress indicator */}
      <div ref={progressRef} className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span>
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div ref={questionRef} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question}
        </h2>
      </div>

      {/* Choices */}
      <div ref={choicesRef} className="grid gap-4 mb-6">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceSelect(choice)}
            disabled={isAnswered}
            className={`p-4 rounded-lg text-left text-lg font-medium transition-all duration-200 ${getChoiceStyle(
              choice
            )}`}
          >
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold mr-4">
                {String.fromCharCode(65 + index)}
              </span>
              {choice}
            </div>
          </button>
        ))}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div
          ref={resultRef}
          className="mt-6 p-4 rounded-lg bg-gray-50 border-l-4 border-purple-500"
        >
          <div className="flex items-center space-x-2">
            {selectedChoice?.toLowerCase().trim() ===
            answer.toLowerCase().trim() ? (
              <>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-green-700 font-semibold">Correct!</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <span className="text-red-700 font-semibold">
                  Incorrect. The correct answer is: {answer}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzQuestionComponent;
