"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { validateAIQuizParams } from "@/services/aiService";

interface AIQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIQuizModal({ isOpen, onClose }: AIQuizModalProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async () => {
    setError("");

    // Validate inputs
    const validation = validateAIQuizParams({
      topic,
      num_questions: numQuestions,
      difficulty,
    });

    if (!validation.isValid) {
      setError(validation.error || "Invalid input parameters");
      return;
    }

    try {
      setIsLoading(true);

      // Encode parameters and navigate to the AI quiz page
      const params = new URLSearchParams({
        topic: topic,
        numQuestions: numQuestions.toString(),
        difficulty: difficulty,
      });

      router.push(`ai-quizz?${params.toString()}`);
      onClose();
    } catch (err) {
      setError("Failed to start quiz. Please try again.");
      console.error("Error starting quiz:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] pointer-events-auto">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-purple-400/30 pointer-events-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">AI Quiz</h2>
          <p className="text-blue-200/80">
            Generate a custom quiz based on your topic and difficulty level
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Topic Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-white mb-2">
            Topic <span className="text-red-400">*</span>
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Algebra basics, Quadratic equations, Calculus..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 resize-none"
            rows={3}
            disabled={isLoading}
          />
          <p className="text-xs text-blue-200/60 mt-1">
            You can enter any topic, even a long paragraph
          </p>
        </div>

        {/* Number of Questions */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-white mb-2">
            Number of Questions <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={isLoading}
            />
            <div className="bg-white/10 px-3 py-1 rounded-lg border border-white/20 min-w-fit">
              <span className="text-white font-semibold">{numQuestions}</span>
            </div>
          </div>
          <p className="text-xs text-blue-200/60 mt-2">
            Select between 5 and 10 questions
          </p>
        </div>

        {/* Difficulty Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Difficulty Level <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                disabled={isLoading}
                className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 capitalize ${
                  difficulty === level
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleStartQuiz}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Starting..." : "Start Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
