"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  FaTimes,
  FaRobot,
  FaFileAlt,
  FaQuestionCircle,
  FaPaperPlane,
  FaSpinner,
  FaLightbulb,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaGraduationCap,
  FaBook,
} from "react-icons/fa";
import {
  sendChatMessage,
  validateChatMessage,
  generateNewMockTest,
} from "@/services/aiService";

interface AITutorModelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "questions" | "mocktest";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface MockTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface MockTestData {
  quizId: string;
  title: string;
  questions: MockTestQuestion[];
  estimatedTime?: number;
  difficulty?: string;
}

export default function AITutorModel({ isOpen, onClose }: AITutorModelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("questions");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mockTestData, setMockTestData] = useState<MockTestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      // Modal entrance animation
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.1,
        }
      );

      // Initial welcome message
      if (chatMessages.length === 0) {
        setTimeout(() => {
          setChatMessages([
            {
              id: "welcome",
              type: "ai",
              content:
                "Hello! I'm your AI Tutor. I'm here to help you with any questions about your study material or generate practice tests. What would you like to explore today?",
              timestamp: new Date(),
            },
          ]);
        }, 800);
      }
    }
  }, [isOpen, chatMessages.length]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages.length]);

  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: "power2.in",
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Validate the message
    if (!validateChatMessage(currentMessage)) {
      // You can add a toast notification here if needed
      console.warn("Invalid message: too long or empty");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage("");
    setIsTyping(true);

    try {
      // Use the AI service to get response
      const response = await sendChatMessage(messageToSend);

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);

      // Log suggested concepts if available (you can use these for UI enhancements later)
      if (response.suggestedConcepts && response.suggestedConcepts.length > 0) {
        // eslint-disable-next-line no-console
        console.log("Suggested concepts:", response.suggestedConcepts);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Show error message to user
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateMockTest = async () => {
    setIsGeneratingTest(true);

    try {
      // Use the generateNewMockTest function from aiService
      const mockTestResponse = await generateNewMockTest(
        "general-knowledge",
        10
      );

      setMockTestData(mockTestResponse);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error("Error generating mock test:", error);

      // Fallback to sample questions if service fails
      const fallbackQuestions: MockTestQuestion[] = [
        {
          id: "fallback-1",
          question: "What is the primary function of the respiratory system?",
          options: [
            "To digest food and absorb nutrients",
            "To transport blood throughout the body",
            "To exchange oxygen and carbon dioxide with the environment",
            "To filter waste products from the blood",
          ],
          correctAnswer: 2,
          explanation:
            "The respiratory system's primary function is to facilitate gas exchange - bringing oxygen into the body and removing carbon dioxide. This occurs in the alveoli of the lungs where oxygen enters the bloodstream and carbon dioxide is expelled.",
        },
        {
          id: "fallback-2",
          question: "Which of the following is a renewable energy source?",
          options: ["Coal", "Natural gas", "Solar power", "Nuclear fuel"],
          correctAnswer: 2,
          explanation:
            "Solar power is a renewable energy source because it harnesses energy from the sun, which is continuously available and naturally replenished. Unlike fossil fuels (coal, natural gas), solar energy doesn't deplete natural resources.",
        },
        {
          id: "fallback-3",
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correctAnswer: 2,
          explanation:
            "The chemical symbol for gold is Au, which comes from the Latin word 'aurum' meaning gold. This is different from silver (Ag) and other precious metals. Gold is element 79 on the periodic table.",
        },
      ];

      const fallbackMockTest: MockTestData = {
        quizId: `fallback-quiz-${Date.now()}`,
        title: "General Knowledge Mock Test",
        questions: fallbackQuestions,
        estimatedTime: 6,
        difficulty: "medium",
      };

      setMockTestData(fallbackMockTest);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (
      mockTestData &&
      currentQuestionIndex < mockTestData.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!mockTestData) return { correct: 0, total: 0 };

    let correct = 0;
    mockTestData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: mockTestData.questions.length };
  };

  const renderChatTab = () => (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50 to-white"
      >
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-[80%] p-4 rounded-2xl shadow-md
                ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }
              `}
            >
              {message.type === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <FaRobot className="text-blue-600" size={16} />
                  <span className="text-xs font-medium text-gray-500">
                    AI Tutor
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <FaRobot className="text-blue-600" size={16} />
                <span className="text-xs font-medium text-gray-500">
                  AI Tutor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin text-blue-600" size={14} />
                <span className="text-sm text-gray-600">Typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything about your study material..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            <FaPaperPlane size={14} />
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderMockTestTab = () => (
    <div className="flex flex-col h-full">
      {!mockTestData ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-green-600 mb-6">
              <FaFileAlt size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Generate Mock Test
            </h3>
            <p className="text-gray-600 mb-6">
              I&apos;ll create a personalized practice test based on your study
              material to help you assess your understanding.
            </p>
            <button
              onClick={generateMockTest}
              disabled={isGeneratingTest}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              {isGeneratingTest ? (
                <>
                  <FaSpinner className="animate-spin" size={16} />
                  Generating Test...
                </>
              ) : (
                <>
                  <FaLightbulb size={16} />
                  Generate Mock Test
                </>
              )}
            </button>
          </div>
        </div>
      ) : !showResults ? (
        <div className="flex flex-col h-full">
          {/* Question Progress */}
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of{" "}
                {mockTestData?.questions.length || 0}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock size={14} />
                <span>
                  {mockTestData?.estimatedTime
                    ? `~${mockTestData.estimatedTime} min`
                    : "No time limit"}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    mockTestData
                      ? ((currentQuestionIndex + 1) /
                          mockTestData.questions.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Scrollable Question Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Question */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    {mockTestData?.questions[currentQuestionIndex]?.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {mockTestData?.questions[currentQuestionIndex]?.options.map(
                      (option: string, index: number) => (
                        <label
                          key={index}
                          className={`
                          flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                          ${
                            selectedAnswers[currentQuestionIndex] === index
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }
                        `}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={index}
                            checked={
                              selectedAnswers[currentQuestionIndex] === index
                            }
                            onChange={() =>
                              handleAnswerSelect(currentQuestionIndex, index)
                            }
                            className="hidden"
                          />
                          <div
                            className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${
                            selectedAnswers[currentQuestionIndex] === index
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }
                        `}
                          >
                            {selectedAnswers[currentQuestionIndex] ===
                              index && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-700">{option}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Navigation at Bottom */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ← Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {mockTestData &&
                currentQuestionIndex === mockTestData.questions.length - 1
                  ? "Finish Test"
                  : "Next →"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Results */}
            <div className="text-center mb-8">
              <div className="text-green-600 mb-4">
                <FaCheckCircle size={64} className="mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                Test Complete!
              </h3>
              <p className="text-gray-600">Here&apos;s how you performed:</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {calculateScore().correct}/{calculateScore().total}
                </div>
                <div className="text-lg text-gray-600">
                  {Math.round(
                    (calculateScore().correct / calculateScore().total) * 100
                  )}
                  % Correct
                </div>
              </div>

              <div className="space-y-4">
                {mockTestData?.questions.map(
                  (question: MockTestQuestion, index: number) => {
                    const isCorrect =
                      selectedAnswers[index] === question.correctAnswer;
                    return (
                      <div
                        key={question.id}
                        className={`
                      p-4 rounded-xl border-2
                      ${
                        isCorrect
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }
                    `}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`
                          flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                          ${
                            isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }
                        `}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 mb-2">
                              {question.question}
                            </h4>
                            <div className="text-sm space-y-1">
                              <div className="text-gray-600">
                                Your answer:{" "}
                                <span
                                  className={
                                    isCorrect
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {question.options[selectedAnswers[index]]}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="text-gray-600">
                                  Correct answer:{" "}
                                  <span className="text-green-600">
                                    {question.options[question.correctAnswer]}
                                  </span>
                                </div>
                              )}
                              {question.explanation && (
                                <div className="text-gray-700 bg-blue-50 p-3 rounded-lg mt-2">
                                  <strong>Explanation:</strong>{" "}
                                  {question.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Actions */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setMockTestData(null);
                  setShowResults(false);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Generate New Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white border-opacity-30">
                <FaRobot className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                  AI Tutor Assistant
                </h2>
                <p className="text-purple-100">
                  Your intelligent learning companion
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors duration-200 text-white hover:text-white"
              title="Close AI Tutor"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab("questions")}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium
                ${
                  activeTab === "questions"
                    ? "bg-white text-purple-600 shadow-md border-2 border-transparent"
                    : "text-purple-100 hover:bg-white hover:bg-opacity-10 border-2 border-transparent hover:border-white hover:border-opacity-20"
                }
              `}
            >
              <FaQuestionCircle size={16} />
              Ask Questions
            </button>
            <button
              onClick={() => setActiveTab("mocktest")}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium
                ${
                  activeTab === "mocktest"
                    ? "bg-white text-purple-600 shadow-md border-2 border-transparent"
                    : "text-purple-100 hover:bg-white hover:bg-opacity-10 border-2 border-transparent hover:border-white hover:border-opacity-20"
                }
              `}
            >
              <FaGraduationCap size={16} />
              Mock Test
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "questions" ? renderChatTab() : renderMockTestTab()}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaUsers size={14} />
              <span>Powered by AI</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBook size={14} />
              <span>Personalized Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLightbulb size={14} />
              <span>Smart Assistance</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
