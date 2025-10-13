"use client";

import React, { useState } from "react";
import { setGoal } from "@/services/contentService";

interface QuizzGoalInputComponentProps {
  onGoalSet: () => void;
}

const QuizzGoalInputComponent: React.FC<QuizzGoalInputComponentProps> = ({
  onGoalSet,
}) => {
  const [goal, setGoalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    try {
      await setGoal(goal.trim());
      onGoalSet();
    } catch (error) {
      console.error("Error setting goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="goal"
            className="block text-lg font-medium text-gray-700 mb-3"
          >
            What do you want to achieve?
          </label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Describe your learning goal... (e.g., 'I want to master algebra to prepare for my upcoming exams')"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!goal.trim() || isLoading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              !goal.trim() || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 shadow-lg"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Setting Goal...</span>
              </div>
            ) : (
              "Confirm Goal"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizzGoalInputComponent;
