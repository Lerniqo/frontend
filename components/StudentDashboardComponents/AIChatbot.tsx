"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, Zap, MessageCircle, Plus, History, MoreVertical, Trash2, Edit3, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClickSpark from "@/components/reactbits/ClickSpark";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>("1");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Getting Started",
      lastActivity: new Date(),
      messages: [
        {
          id: "1",
          content: "Hi! I'm your AI tutor. How can I help you with your studies today?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = chatSessions.find(session => session.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: `Chat ${chatSessions.length + 1}`,
      lastActivity: new Date(),
      messages: [
        {
          id: "1",
          content: "Hi! I'm your AI tutor. How can I help you with your studies today?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setShowHistory(false);
  };

  const deleteChat = (sessionId: string) => {
    if (chatSessions.length <= 1) {
      alert("You must have at least one chat session.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      if (sessionId === currentSessionId) {
        const remainingSessions = chatSessions.filter(session => session.id !== sessionId);
        if (remainingSessions.length > 0) {
          setCurrentSessionId(remainingSessions[0].id);
        }
      }
    }
  };

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, title: newTitle }
          : session
      )
    );
  };

  const generateChatTitle = (firstMessage: string) => {
    return firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + "..." 
      : firstMessage;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    // Update current session with new message
    setChatSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, userMessage],
              lastActivity: new Date(),
              title: session.messages.length === 1 ? generateChatTitle(inputMessage) : session.title
            }
          : session
      )
    );

    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question. Let me help you with that concept. As your AI tutor, I'm here to provide personalized guidance on your learning journey.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { 
                ...session, 
                messages: [...session.messages, aiResponse],
                lastActivity: new Date()
              }
            : session
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Escape to close (only if not in middle of typing)
      if (e.key === "Escape" && !inputMessage.trim()) {
        setIsOpen(false);
      }
      
      // Ctrl/Cmd + N for new chat
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        createNewChat();
      }
      
      // Ctrl/Cmd + H for history
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setShowHistory(!showHistory);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, inputMessage, showHistory]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50">
          <ClickSpark
            sparkColor="#3b82f6"
            sparkCount={12}
            sparkRadius={25}
            duration={600}
            extraScale={1.2}
          >
            <Button
              size="lg"
              className="relative group w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 border-2 border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-600/30 animate-pulse" />
              
              {/* Glowing ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 animate-ping" />
              
              {/* Icon container */}
              <div className="relative z-10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-white group-hover:text-blue-100 transition-colors duration-300" />
                
                {/* Floating sparkle indicators */}
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              </div>
              
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">!</span>
              </div>
            </Button>
          </ClickSpark>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] h-[700px] bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950 border border-blue-400/30 shadow-2xl p-0 gap-0 focus:outline-none">
        {/* Enhanced backdrop for better focus */}
        <div 
          className="fixed inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/60 to-blue-900/60 backdrop-blur-md -z-10"
          onClick={(e) => e.stopPropagation()}
        />
        
        {showHistory ? (
          /* Chat History View */
          <div className="flex flex-col h-full">
            <div className="border-b border-blue-400/20 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="text-blue-200 hover:text-white hover:bg-blue-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <h3 className="font-bold text-lg text-blue-100">Chat History</h3>
                </div>
                <Button
                  onClick={createNewChat}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border border-blue-400/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-950/30 to-purple-950/30">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    session.id === currentSessionId
                      ? "bg-gradient-to-r from-blue-500/30 to-purple-600/30 border-blue-400/50 shadow-lg shadow-blue-500/20"
                      : "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-400/20 hover:from-blue-800/30 hover:to-purple-800/30 hover:border-blue-400/40"
                  }`}
                  onClick={() => {
                    setCurrentSessionId(session.id);
                    setShowHistory(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-blue-100 font-medium">{session.title}</h4>
                      <p className="text-blue-300/70 text-sm">
                        {session.messages.length} messages • {session.lastActivity.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTitle = prompt("Enter new title:", session.title);
                          if (newTitle) updateSessionTitle(session.id, newTitle);
                        }}
                        className="text-blue-300 hover:text-blue-100 hover:bg-blue-500/20"
                        title="Rename chat"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      {chatSessions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(session.id);
                          }}
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Keyboard shortcuts help */}
            <div className="border-t border-blue-400/20 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <div className="text-xs text-blue-200/70 space-y-1">
                <p><kbd className="bg-blue-500/20 border border-blue-400/30 px-1 rounded text-blue-200">Ctrl+N</kbd> New chat</p>
                <p><kbd className="bg-blue-500/20 border border-blue-400/30 px-1 rounded text-blue-200">Ctrl+H</kbd> Toggle history</p>
                <p><kbd className="bg-blue-500/20 border border-blue-400/30 px-1 rounded text-blue-200">Esc</kbd> Close</p>
              </div>
            </div>
          </div>
        ) : (
          /* Main Chat View */
          <div className="flex flex-col h-full">
            <DialogHeader className="border-b border-blue-400/20 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
              <DialogTitle className="flex items-center space-x-3 text-blue-100">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{currentSession?.title || "AI Tutor"}</h3>
                  <p className="text-sm text-blue-200/70 font-normal">
                    Your personal learning assistant • Press Esc to close
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(true)}
                      className="text-blue-300 hover:text-blue-100 hover:bg-blue-500/20"
                      title="View chat history (Ctrl+H)"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={createNewChat}
                      className="text-blue-300 hover:text-blue-100 hover:bg-blue-500/20"
                      title="Start new chat (Ctrl+N)"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-purple-300 hover:text-purple-100 hover:bg-purple-500/20"
                      title="Close chat"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gradient-to-b from-blue-950/30 to-purple-950/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm text-blue-100 border border-blue-400/20"
                    }`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-blue-400 font-medium">AI Tutor</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm text-blue-100 border border-blue-400/20 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-400 font-medium">AI Tutor</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-blue-400/20 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your studies..."
                    className="w-full p-3 pr-12 bg-blue-900/20 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-100 placeholder-blue-200/50 focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/30 resize-none"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <Sparkles className="absolute right-3 top-3 w-5 h-5 text-blue-300/60" />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl shadow-lg shadow-blue-500/20"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Quick action buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-blue-500/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400/50 hover:text-blue-100"
                  onClick={() => setInputMessage("Explain this concept to me")}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Explain Concept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-purple-500/10 border-purple-400/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-purple-100"
                  onClick={() => setInputMessage("Help me with practice problems")}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Practice Problems
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-blue-500/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400/50 hover:text-blue-100"
                  onClick={() => setInputMessage("Quiz me on this topic")}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Quiz Me
                </Button>
              </div>
              
              {/* Chat info footer */}
              <div className="flex justify-between items-center mt-2 text-xs text-blue-200/60">
                <span>{messages.length} messages</span>
                <span>Session {chatSessions.findIndex(s => s.id === currentSessionId) + 1} of {chatSessions.length}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
