'use client';

import React, { useState } from 'react';
import { Question, addQuestion } from '@/services/teacherDashboardService';

interface QuestionBankManagerProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}

export default function QuestionBankManager({ questions, setQuestions }: QuestionBankManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: 0,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const questionData = {
        subject: formData.subject,
        question: formData.question,
        options: [formData.option1, formData.option2, formData.option3, formData.option4],
        correctAnswer: formData.correctAnswer,
        difficulty: formData.difficulty,
      };
      const result = await addQuestion(questionData);
      if (result.success && result.data) {
        setQuestions([...questions, result.data]);
        setFormData({
          subject: '',
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          correctAnswer: 0,
          difficulty: 'easy',
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/30';
      case 'medium': return 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/30';
      case 'hard': return 'from-red-500/20 to-rose-500/20 text-red-300 border-red-400/30';
      default: return 'from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-400/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="h-full space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl border border-emerald-400/30 shadow-lg">
            <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">Question Bank</h3>
            <p className="text-slate-400 text-lg">Create and manage premium educational content</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
        >
          {showCreateForm ? (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Question</span>
            </div>
          )}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/10 transition-all duration-500">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white">Create New Question</h4>
              <p className="text-slate-400">Build engaging questions for your students</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subject and Difficulty Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">Subject Category</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">Difficulty Level</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-lg"
                >
                  <option value="easy" className="bg-slate-800">🟢 Easy</option>
                  <option value="medium" className="bg-slate-800">🟡 Medium</option>
                  <option value="hard" className="bg-slate-800">🔴 Hard</option>
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">Question</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-lg resize-none"
                rows={4}
                placeholder="Enter your question here..."
                required
              />
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-300">Answer Options</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center text-emerald-300 font-bold text-sm">
                        {String.fromCharCode(64 + num)}
                      </span>
                      <label className="text-sm font-medium text-slate-300">Option {num}</label>
                    </div>
                    <input
                      type="text"
                      value={formData[`option${num}` as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [`option${num}`]: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder={`Enter option ${num}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">Correct Answer</label>
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-lg"
              >
                <option value={0} className="bg-slate-800">A - Option 1</option>
                <option value={1} className="bg-slate-800">B - Option 2</option>
                <option value={2} className="bg-slate-800">C - Option 3</option>
                <option value={3} className="bg-slate-800">D - Option 4</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-8 py-4 bg-slate-600/50 text-white rounded-2xl hover:bg-slate-600 transition-all duration-300 shadow-lg hover:scale-105 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                Create Question
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Questions Yet</h3>
            <p className="text-slate-400 text-lg mb-6">Start building your premium question bank</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              Create Your First Question
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white">Your Questions ({questions.length})</h4>
              <div className="text-sm text-slate-400">
                Total: {questions.length} | Easy: {questions.filter(q => q.difficulty === 'easy').length} | Medium: {questions.filter(q => q.difficulty === 'medium').length} | Hard: {questions.filter(q => q.difficulty === 'hard').length}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {questions.map((question, index) => (
                <div key={question.id} className="group backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <div className="p-8">
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center text-emerald-300 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 rounded-xl text-sm font-semibold border border-emerald-400/30">
                              {question.subject}
                            </span>
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getDifficultyColor(question.difficulty)}`}>
                              {getDifficultyIcon(question.difficulty)} {question.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Question ID</div>
                        <div className="text-xs text-slate-500 font-mono">#{question.id.slice(-6)}</div>
                      </div>
                    </div>

                    {/* Question Text */}
                    <h4 className="font-bold text-white text-xl mb-6 leading-relaxed">{question.question}</h4>

                    {/* Answer Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                            optionIndex === question.correctAnswer
                              ? 'border-emerald-400/50 bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-200 shadow-lg shadow-emerald-500/20'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                              optionIndex === question.correctAnswer
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/10 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span className="flex-1 text-lg">{option}</span>
                            {optionIndex === question.correctAnswer && (
                              <div className="flex items-center space-x-2">
                                <span className="text-emerald-400 font-bold text-sm">✓ Correct</span>
                                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
