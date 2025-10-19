"use client";

import React, { useState } from "react";
import { Question, addQuestion } from "@/services/teacherDashboardService";
import {
  updateQuestion,
  deleteQuestion,
  createQuestion,
  CreateQuestionDto,
} from "@/services/contentService";
import { ParticleOption, TopicOption } from "@/services/contentService";

interface QuestionBankManagerProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  particles: ParticleOption[];
  topics: TopicOption[];
}

// Search icon component
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// Plus icon component
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

// Edit icon component
const EditIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

// Delete icon component
const DeleteIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function QuestionBankManager({
  questions,
  setQuestions,
  particles,
  topics,
}: QuestionBankManagerProps) {
  const [_showCreateForm, _setShowCreateForm] = useState(false);
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: 0,
    difficulty: "easy" as "easy" | "medium" | "hard",
  });

  // Helper function to resolve tag IDs to their names
  const resolveTagNames = (tagIds: string[] | undefined): string[] => {
    if (!tagIds || tagIds.length === 0) return [];

    return tagIds
      .map((tagId) => {
        // Search in particles
        const particle = particles?.find((p) => p.conceptId === tagId);
        if (particle) return particle.name;

        // Search in topics
        const topic = topics?.find((t) => t.conceptId === tagId);
        if (topic) return topic.name;

        // If not found, return the ID itself as fallback
        return tagId;
      })
      .filter((name) => name !== undefined);
  };

  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const questionData = {
        subject: formData.subject,
        question: formData.question,
        options: [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4,
        ],
        correctAnswer: formData.correctAnswer,
        difficulty: formData.difficulty,
      };
      const result = await addQuestion(questionData);
      if (result.success && result.data) {
        setQuestions([...questions, result.data]);
        setFormData({
          subject: "",
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctAnswer: 0,
          difficulty: "easy",
        });
        _setShowCreateForm(false);
        setIsAddingQuestion(false);
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleEditQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveQuestion = async (editedQuestion: any) => {
    try {
      const result = await updateQuestion(editedQuestion);
      if (result.success) {
        const updatedQuestions = questions.map((q) =>
          q.id === editedQuestion.id
            ? {
                ...editedQuestion,
                questionText: editedQuestion.question,
                options: editedQuestion.options,
                topic: editedQuestion.subject,
              }
            : q
        );
        setQuestions(updatedQuestions);
        setEditingQuestionId(null);
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const result = await deleteQuestion(questionId);
      if (result.success) {
        const updatedQuestions = questions.filter((q) => q.id !== questionId);
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setIsAddingQuestion(false);
  };

  const _handleAddNewQuestion = () => {
    setIsAddingQuestion(true);
    setEditingQuestionId(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddQuestionSave = async (newQuestion: any) => {
    try {
      setIsSubmittingQuestion(true);
      // Map selected particles and topics to tags array (conceptIds)
      const tags = [
        ...(newQuestion.particles || []),
        ...(newQuestion.topics || []),
      ];

      // Get the correct answer text from the options array
      const correctAnswerText = newQuestion.options[newQuestion.correctAnswer];

      const questionData: CreateQuestionDto = {
        questionText: newQuestion.questionText,
        options: newQuestion.options,
        correctAnswer: correctAnswerText,
        tags: tags,
      };

      const result = await createQuestion(questionData);

      // Map the API response to the local Question type for UI display
      // Ensure options is always an array
      const mappedQuestion: Question = {
        id: result.id,
        subject: newQuestion.topic || "General",
        question: result.questionText,
        options: Array.isArray(result.options)
          ? result.options
          : newQuestion.options || [],
        correctAnswer: newQuestion.correctAnswer, // Keep as index for UI
        difficulty: newQuestion.difficulty || "easy",
        tags: result.tags || tags,
      };

      setQuestions([...questions, mappedQuestion]);
      setIsAddingQuestion(false);
      setIsSubmittingQuestion(false);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
      setIsSubmittingQuestion(false);
    }
  };

  // Filter questions based on search term
  const filteredQuestions = questions.filter(
    (question) =>
      question.question
        ?.toLowerCase()
        .includes(questionSearchTerm.toLowerCase()) ||
      question.subject?.toLowerCase().includes(questionSearchTerm.toLowerCase())
  );

  const _getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/30";
      case "medium":
        return "from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/30";
      case "hard":
        return "from-red-500/20 to-rose-500/20 text-red-300 border-red-400/30";
      default:
        return "from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-400/30";
    }
  };

  const _getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "🟢";
      case "medium":
        return "🟡";
      case "hard":
        return "🔴";
      default:
        return "⚪";
    }
  };

  // Question Card Component
  const QuestionCard = ({
    question,
    onEdit,
    onDelete,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    question: any;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }) => {
    const difficultyColors: { [key: string]: string } = {
      Easy: "bg-green-100 text-green-800 border-green-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Hard: "bg-red-100 text-red-800 border-red-200",
      easy: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      hard: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 group animate-fadeIn">
        <div className="flex justify-between items-start">
          <p className="text-gray-800 font-medium pr-4 leading-relaxed">
            {question.question || question.questionText}
          </p>
          <div className="flex space-x-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(question.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
            >
              <EditIcon />
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {question.options && Array.isArray(question.options) ? (
            question.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  index === question.correctAnswer
                    ? "bg-green-50 text-green-800 font-semibold border-l-4 border-green-500 shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      index === question.correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                  {index === question.correctAnswer && (
                    <svg
                      className="w-4 h-4 text-green-600 ml-auto"
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
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No options available</p>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                difficultyColors[question.difficulty]
              }`}
            >
              {question.difficulty}
            </span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            ID: {question.id?.slice(-6)}
          </div>
        </div>
        {question.tags && question.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {resolveTagNames(question.tags).map((tagName, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
              >
                #{tagName}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Edit Question Form Component
  const EditQuestionForm = ({
    question,
    onSave,
    onCancel,
    isNew = false,
    isSubmitting = false,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    question: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (q: any) => void;
    onCancel: () => void;
    isNew?: boolean;
    isSubmitting?: boolean;
  }) => {
    // Helper function to separate tags into particles and topics
    const separateTagsByType = (
      tags: string[] | undefined
    ): { particles: string[]; topics: string[] } => {
      if (!tags || tags.length === 0) return { particles: [], topics: [] };

      const particles_list: string[] = [];
      const topics_list: string[] = [];

      tags.forEach((tagId) => {
        // Check if tag is in particles
        if (particles?.find((p) => p.conceptId === tagId)) {
          particles_list.push(tagId);
        }
        // Check if tag is in topics
        else if (topics?.find((t) => t.conceptId === tagId)) {
          topics_list.push(tagId);
        }
      });

      return { particles: particles_list, topics: topics_list };
    };

    // Initialize particles and topics from question tags
    const initialTags = separateTagsByType(
      question.tags || question.particles || []
    );

    const [editedQuestion, setEditedQuestion] = useState(question);
    const [mappingType, setMappingType] = useState<"particle" | "topic">(
      "particle"
    );
    const [selectedParticles, setSelectedParticles] = useState<string[]>(
      question.particles || initialTags.particles
    );
    const [selectedTopics, setSelectedTopics] = useState<string[]>(
      question.topics || initialTags.topics
    );
    const [particleSearch, setParticleSearch] = useState("");
    const [topicSearch, setTopicSearch] = useState("");

    // Debug: Log particles and topics availability
    console.warn(
      "EditQuestionForm - Particles available:",
      particles?.length || 0
    );
    console.warn("EditQuestionForm - Topics available:", topics?.length || 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (e: any, index?: number) => {
      const { name, value } = e.target;
      if (name === "option") {
        const newOptions = [...editedQuestion.options];
        newOptions[index!] = value;
        setEditedQuestion({ ...editedQuestion, options: newOptions });
      } else {
        setEditedQuestion({ ...editedQuestion, [name]: value });
      }
    };

    const handleCorrectAnswerChange = (index: number) =>
      setEditedQuestion({ ...editedQuestion, correctAnswer: index });

    const handleParticleToggle = (conceptId: string) => {
      setSelectedParticles((prev) =>
        prev.includes(conceptId)
          ? prev.filter((id) => id !== conceptId)
          : [...prev, conceptId]
      );
    };

    const handleTopicToggle = (conceptId: string) => {
      setSelectedTopics((prev) =>
        prev.includes(conceptId)
          ? prev.filter((id) => id !== conceptId)
          : [...prev, conceptId]
      );
    };

    const handleSave = () => {
      onSave({
        ...editedQuestion,
        particles: selectedParticles,
        topics: selectedTopics,
      });
    };

    const filteredParticles =
      particles?.filter((p) =>
        p.name.toLowerCase().includes(particleSearch.toLowerCase())
      ) || [];

    const filteredTopics =
      topics?.filter((t) =>
        t.name.toLowerCase().includes(topicSearch.toLowerCase())
      ) || [];

    return (
      <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-lg border-2 border-purple-200 space-y-6 mb-6 animate-slideDown">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {isNew ? "Add New Question" : "Edit Question"}
          </h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Question
          </label>
          <textarea
            name="questionText"
            value={editedQuestion.questionText || editedQuestion.question}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-4 py-3"
            rows={3}
            placeholder="Enter your question here..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Answer Options
          </label>
          <div className="space-y-3">
            {editedQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200"
              >
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={editedQuestion.correctAnswer === index}
                  onChange={() => handleCorrectAnswerChange(index)}
                  className="h-5 w-5 text-purple-600 border-gray-300 focus:ring-purple-500 transition-all duration-200"
                />
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    editedQuestion.correctAnswer === index
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <input
                  type="text"
                  name="option"
                  value={option}
                  onChange={(e) => handleInputChange(e, index)}
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-3 py-2"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Difficulty
          </label>
          <select
            name="difficulty"
            value={editedQuestion.difficulty}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-4 py-3"
          >
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>
        </div>

        {/* Concept Mapping Section */}
        <div className="space-y-4 border-t border-purple-200 pt-6">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Map to Concepts
          </label>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setMappingType("particle")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                mappingType === "particle"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🔬 Particles
            </button>
            <button
              type="button"
              onClick={() => setMappingType("topic")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                mappingType === "topic"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📚 Topics
            </button>
          </div>

          {mappingType === "particle" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search particles..."
                value={particleSearch}
                onChange={(e) => setParticleSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
              <div className="max-h-48 overflow-y-auto bg-white rounded-lg border border-gray-200 p-2 space-y-1">
                {filteredParticles.length > 0 ? (
                  filteredParticles.map((particle) => (
                    <label
                      key={particle.conceptId}
                      className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticles.includes(particle.conceptId)}
                        onChange={() =>
                          handleParticleToggle(particle.conceptId)
                        }
                        className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        {particle.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No particles found
                  </p>
                )}
              </div>
              {selectedParticles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedParticles.map((conceptId) => {
                    const particle = particles?.find(
                      (p) => p.conceptId === conceptId
                    );
                    return particle ? (
                      <span
                        key={conceptId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {particle.name}
                        <button
                          type="button"
                          onClick={() => handleParticleToggle(conceptId)}
                          className="ml-1 hover:text-purple-900"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          {mappingType === "topic" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search topics..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
              <div className="max-h-48 overflow-y-auto bg-white rounded-lg border border-gray-200 p-2 space-y-1">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <label
                      key={topic.conceptId}
                      className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic.conceptId)}
                        onChange={() => handleTopicToggle(topic.conceptId)}
                        className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        {topic.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No topics found
                  </p>
                )}
              </div>
              {selectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTopics.map((conceptId) => {
                    const topic = topics?.find(
                      (t) => t.conceptId === conceptId
                    );
                    return topic ? (
                      <span
                        key={conceptId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                      >
                        {topic.name}
                        <button
                          type="button"
                          onClick={() => handleTopicToggle(conceptId)}
                          className="ml-1 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-purple-200">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 border ${
              isSubmitting
                ? "text-gray-500 bg-gray-100 cursor-not-allowed opacity-50 border-gray-300"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200 hover:scale-105 border-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 shadow-md ${
              isSubmitting
                ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white cursor-not-allowed opacity-70 hover:shadow-md"
                : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:scale-105 hover:shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isNew ? "Adding..." : "Saving..."}
              </>
            ) : isNew ? (
              "Add Question"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-400 transition-colors duration-200" />
          </span>
          <input
            type="text"
            placeholder="Search questions by title or topic..."
            value={questionSearchTerm}
            onChange={(e) => setQuestionSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>
        <button
          onClick={() => {
            setIsAddingQuestion(true);
            setEditingQuestionId(null);
          }}
          disabled={isSubmittingQuestion || isAddingQuestion}
          className={`flex items-center justify-center px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-sm ${
            isSubmittingQuestion || isAddingQuestion
              ? "bg-purple-400 text-white cursor-not-allowed opacity-70"
              : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          {isSubmittingQuestion ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New
            </>
          )}
        </button>
      </div>

      {isAddingQuestion && (
        <div className="animate-slideDown">
          <EditQuestionForm
            question={{
              questionText: "",
              options: ["", "", "", ""],
              correctAnswer: 0,
              topic: "",
              difficulty: "easy",
            }}
            onSave={handleAddQuestionSave}
            onCancel={handleCancelEdit}
            isNew={true}
            isSubmitting={isSubmittingQuestion}
          />
        </div>
      )}

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-20 animate-fadeIn">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
            <svg
              className="w-10 h-10 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {questionSearchTerm
              ? "No matching questions found"
              : "No Questions Yet"}
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            {questionSearchTerm
              ? "Try adjusting your search terms"
              : "Start building your premium question bank"}
          </p>
          {!questionSearchTerm && (
            <button
              onClick={() => setIsAddingQuestion(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              Create Your First Question
            </button>
          )}
        </div>
      ) : (
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
          {filteredQuestions.map((q, index) => (
            <div
              key={q.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-slideUp"
            >
              {editingQuestionId === q.id ? (
                <EditQuestionForm
                  question={q}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  isSubmitting={isSubmittingQuestion}
                />
              ) : (
                <QuestionCard
                  question={q}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
