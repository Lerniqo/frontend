"use client";

import React, { useState } from "react";
import { Question, addQuestion } from "@/services/teacherDashboardService";
import { updateQuestion, deleteQuestion } from "@/services/contentService";

interface QuestionBankManagerProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
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
}: QuestionBankManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        setShowCreateForm(false);
        setIsAddingQuestion(false);
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleEditQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
  };

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

  const handleAddNewQuestion = () => {
    setIsAddingQuestion(true);
    setEditingQuestionId(null);
  };

  const handleAddQuestionSave = async (newQuestion: any) => {
    try {
      const questionData = {
        subject: newQuestion.topic,
        question: newQuestion.questionText,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        difficulty: newQuestion.difficulty,
      };
      const result = await addQuestion(questionData);
      if (result.success && result.data) {
        setQuestions([...questions, result.data]);
        setIsAddingQuestion(false);
      }
    } catch (error) {
      console.error("Error adding question:", error);
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

  const getDifficultyColor = (difficulty: string) => {
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

  const getDifficultyIcon = (difficulty: string) => {
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
          {question.options.map((option: string, index: number) => (
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
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {question.topic || question.subject}
            </span>
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
      </div>
    );
  };

  // Edit Question Form Component
  const EditQuestionForm = ({
    question,
    onSave,
    onCancel,
    isNew = false,
  }: {
    question: any;
    onSave: (q: any) => void;
    onCancel: () => void;
    isNew?: boolean;
  }) => {
    const [editedQuestion, setEditedQuestion] = useState(question);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={editedQuestion.topic || editedQuestion.subject}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-4 py-3"
              placeholder="Enter topic or subject..."
            />
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
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-purple-200">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedQuestion)}
            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            {isNew ? "Add Question" : "Save Changes"}
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
          className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New
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
