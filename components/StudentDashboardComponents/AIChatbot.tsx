"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Bot, Send, X, Sparkles, Zap, MessageCircle, Plus, History, Trash2, Edit3, Target, Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { IOClient } from "@/services/ioClient";
import userService from "@/services/userService";

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

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting';

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
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;

  const currentSession = chatSessions.find(session => session.id === currentSessionId);
  const messages = useMemo(() => currentSession?.messages || [], [currentSession]);
  const ioClient = IOClient.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);
  
  // Get fresh token each time we need it (in case it gets refreshed)
  const getToken = useCallback(() => userService.getToken(), []);

  // Connection management with exponential backoff
  const connectSocket = useCallback(async () => {
    if (ioClient.isConnected()) {
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
      return;
    }

    // Get fresh token and validate before attempting connection
    const currentToken = getToken();
    if (!currentToken) {
      setConnectionStatus('error');
      setConnectionError('No authentication token found. Please log in again.');
      return;
    }

    try {
      setConnectionStatus(reconnectAttemptsRef.current > 0 ? 'reconnecting' : 'connecting');
      setConnectionError(null);
      
      await ioClient.connect({
        options: {
          auth: {
            token: currentToken
          },
          // Alternative authentication methods (choose one that matches your backend):
          // 1. Query parameter: query: { token: currentToken }
          // 2. Extra headers: extraHeaders: { Authorization: `Bearer ${currentToken}` }
          // 3. Custom header: extraHeaders: { 'x-auth-token': currentToken }
        }
      });
      
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
      
      // Set up authentication error handlers after successful connection
      // Note: These would need to be implemented in the IOClient service
      // to expose socket-level events, for now we handle auth errors in the catch block
    } catch (error) {
      console.error('Socket connection failed:', error);
      reconnectAttemptsRef.current += 1;
      
      // Check if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      const isAuthError = errorMessage.toLowerCase().includes('unauthorized') || 
                         errorMessage.toLowerCase().includes('authentication') ||
                         errorMessage.toLowerCase().includes('token');
      
      if (isAuthError) {
        setConnectionStatus('error');
        setConnectionError('Authentication failed. Please log in again.');
        return; // Don't retry on auth errors
      }
      
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        setConnectionStatus('error');
        setConnectionError('Failed to connect after multiple attempts. Please check your internet connection.');
        return;
      }
      
      setConnectionStatus('error');
      setConnectionError(errorMessage);
      
      // Exponential backoff: 2^attempt * 1000ms (1s, 2s, 4s, 8s, 16s)
      const retryDelay = Math.min(Math.pow(2, reconnectAttemptsRef.current) * 1000, 30000);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isOpen) {
          connectSocket();
        }
      }, retryDelay);
    }
  }, [ioClient, getToken, isOpen, maxReconnectAttempts]);

  // Reset connection attempts when modal opens
  useEffect(() => {
    if (isOpen) {
      reconnectAttemptsRef.current = 0;
    }
  }, [isOpen]);

  // Socket event subscriptions
  useEffect(() => {
    if (!isOpen) return;

    connectSocket();

    // Subscribe to new messages
    const handleNewMessage = (data: {message: string; sessionId: string; timestamp?: string; metadata?: unknown}) => {
      console.warn('Received new message:', data);
      console.warn('Current session ID:', currentSessionId);
      console.warn('Message session ID:', data.sessionId);
      console.warn('Session ID match:', currentSessionId === data.sessionId);
      
      // Transform backend message format to frontend Message format
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.message || '', // Backend sends 'message', frontend expects 'content'
        isUser: false, // AI messages are never from user
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
      };
      
      setChatSessions(prev => {
        const updated = prev.map(session => 
          session.id === data.sessionId
            ? { 
                ...session, 
                messages: [...session.messages, aiMessage],
                lastActivity: new Date()
              }
            : session
        );
        console.warn('Updated sessions:', updated);
        return updated;
      });
      setIsTyping(false);
      
      // Scroll to bottom after receiving message
      setTimeout(scrollToBottom, 100);
    };



    // Handle chat errors from backend
    const handleChatError = (error: {message?: string; code?: string; details?: string}) => {
      console.error('Chat error received:', error);
      setIsTyping(false);
      setConnectionError(error?.message || 'Chat error occurred');
      
      // Add error message to current chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `Error: ${error?.message || 'Something went wrong. Please try again.'}`,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId
            ? { 
                ...session, 
                messages: [...session.messages, errorMessage],
                lastActivity: new Date()
              }
            : session
        )
      );
    };

    // Set up subscriptions when connected
    if (ioClient.isConnected()) {
      unsubscribeRef.current = ioClient.subscribe("chat:newMessage", handleNewMessage);
      
      // Also subscribe to chat errors
      const errorUnsubscribe = ioClient.subscribe("chat:error", handleChatError);
      
      // Store both unsubscribe functions
      const originalUnsubscribe = unsubscribeRef.current;
      unsubscribeRef.current = () => {
        originalUnsubscribe();
        errorUnsubscribe();
      };
    }

    return () => {
      // Clean up subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [ioClient, isOpen, connectSocket]);

  // Re-subscribe when connection is established
  useEffect(() => {
    if (connectionStatus === 'connected' && !unsubscribeRef.current) {
      const messageUnsubscribe = ioClient.subscribe("chat:newMessage", (data: {message: string; sessionId: string; timestamp?: string; metadata?: unknown}) => {
        console.warn('Re-subscription received new message:', data);
        console.warn('Current session ID at re-subscription:', currentSessionId);
        console.warn('Message session ID:', data.sessionId);
        console.warn('Session ID match at re-subscription:', currentSessionId === data.sessionId);
        
        // Transform backend message format to frontend Message format
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: data.message || '', // Backend sends 'message', frontend expects 'content'
          isUser: false, // AI messages are never from user
          timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
        };
        
        setChatSessions(prev => {
          const updated = prev.map(session => 
            session.id === data.sessionId
              ? { 
                  ...session, 
                  messages: [...session.messages, aiMessage],
                  lastActivity: new Date()
                }
              : session
          );
          console.warn('Updated sessions at re-subscription:', updated);
          return updated;
        });
        setIsTyping(false);
        
        // Scroll to bottom after receiving message
        setTimeout(scrollToBottom, 100);
      });

      const errorUnsubscribe = ioClient.subscribe("chat:error", (error: {message?: string; code?: string; details?: string}) => {
        console.error('Chat error received:', error);
        setIsTyping(false);
        setConnectionError(error?.message || 'Chat error occurred');
        
        // Add error message to current chat
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `Error: ${error?.message || 'Something went wrong. Please try again.'}`,
          isUser: false,
          timestamp: new Date()
        };
        
        setChatSessions(prev => 
          prev.map(session => 
            session.id === currentSessionId
              ? { 
                  ...session, 
                  messages: [...session.messages, errorMessage],
                  lastActivity: new Date()
                }
              : session
          )
        );
      });

      // Store combined unsubscribe function
      unsubscribeRef.current = () => {
        messageUnsubscribe();
        errorUnsubscribe();
      };
    }
  }, [connectionStatus, ioClient]);

  const createNewChat = useCallback(() => {
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
  }, [chatSessions.length]);

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
    
    // Ensure connection before sending
    if (!ioClient.isConnected()) {
      await connectSocket();
      if (!ioClient.isConnected()) {
        setConnectionError('Unable to connect. Please try again.');
        return;
      }
    }

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        isUser: true,
        timestamp: new Date(),
      };

      // Update current session with new message immediately
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

      // Send message to server
      console.warn('Sending message with sessionId:', currentSessionId);
      ioClient.publish("chat:sendMessage", {
        message: inputMessage,
        sessionId: currentSessionId,
        detailed: true,
      });

      setInputMessage("");
      setIsTyping(true);
      setConnectionError(null);
      
      // Scroll to bottom after sending message
      setTimeout(scrollToBottom, 100);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setConnectionError('Failed to send message. Please try again.');
      setIsTyping(false);
    }
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
  }, [isOpen, inputMessage, showHistory, createNewChat]);

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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Disconnect socket when component unmounts
      if (ioClient.isConnected()) {
        ioClient.disconnect();
      }
    };
  }, [ioClient]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>
        <div className="fixed overflow-x-hidden bottom-6 right-6 z-50">
          <ClickSpark
            sparkColor="#3b82f6"
            sparkCount={12}
            sparkRadius={25}
            duration={600}
            extraScale={1.2}
          >
            <Button
              size="lg"
              className="relative group w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 overflow-hidden"
            >
              {/* Subtle pulse effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
              
              {/* Icon container */}
              <div className="relative z-10 flex items-center justify-center">
                <Bot className="w-10 h-10 text-white transition-transform duration-300 group-hover:scale-110" />
                
                {/* Floating sparkle indicator */}
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-purple-200 animate-pulse" />
              </div>
              
              {/* Connection status indicator */}
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? 'bg-yellow-400 animate-pulse' :
                connectionStatus === 'error' ? 'bg-red-400' :
                'bg-gray-400'
              }`} />
            </Button>
          </ClickSpark>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] h-4/5 overflow-y-scroll bg-white border border-gray-200 shadow-2xl p-0 gap-0 focus:outline-none">
        {/* Clean light backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm -z-10"
          onClick={(e) => e.stopPropagation()}
        />
        
        {showHistory ? (
          /* Chat History View */
          <div className="flex flex-col h-full">
            <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <h3 className="font-bold text-lg text-gray-800">Chat History</h3>
                </div>
                <Button
                  onClick={createNewChat}
                  className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    session.id === currentSessionId
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 shadow-md"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                  onClick={() => {
                    setCurrentSessionId(session.id);
                    setShowHistory(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-gray-800 font-medium">{session.title}</h4>
                      <p className="text-gray-500 text-sm">
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
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
                          className="text-purple-500 hover:text-purple-600 hover:bg-purple-50"
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
            <div className="border-t w-full border-gray-200 p-4 bg-white">
              <div className="text-xs text-gray-600 flex justify-around items-center">
                <p><kbd className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-700 font-medium">Ctrl+N</kbd> New chat</p>
                <p><kbd className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-700 font-medium">Ctrl+H</kbd> Toggle history</p>
                <p><kbd className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-700 font-medium">Esc</kbd> Close</p>
              </div>
            </div>
          </div>
        ) : (
          /* Main Chat View */
          <div className="flex flex-col h-full">
            <DialogHeader className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <DialogTitle className="flex items-center space-x-3 text-gray-800">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{currentSession?.title || "AI Tutor"}</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600 font-normal">
                      Your personal learning assistant • Press Esc to close
                    </p>
                    {/* Connection Status Indicator */}
                    <div className="flex items-center space-x-1">
                      {connectionStatus === 'connecting' && (
                        <>
                          <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />
                          <span className="text-xs text-yellow-600">Connecting...</span>
                        </>
                      )}
                      {connectionStatus === 'connected' && (
                        <>
                          <Wifi className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">Connected</span>
                        </>
                      )}
                      {connectionStatus === 'disconnected' && (
                        <>
                          <WifiOff className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Disconnected</span>
                        </>
                      )}
                      {connectionStatus === 'error' && (
                        <>
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-600">Connection Error</span>
                          <button
                            onClick={() => {
                              reconnectAttemptsRef.current = 0;
                              connectSocket();
                            }}
                            className="text-xs text-red-600 hover:text-red-800 underline ml-1"
                          >
                            Retry
                          </button>
                        </>
                      )}
                      {connectionStatus === 'reconnecting' && (
                        <>
                          <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                          <span className="text-xs text-blue-600">Reconnecting...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(true)}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      title="View chat history (Ctrl+H)"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={createNewChat}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      title="Start new chat (Ctrl+N)"
                    >
                      <Plus className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      title="Close chat"
                    >
                    </Button>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? "bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-md"
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">AI Tutor</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className={`text-xs mt-1 block ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 shadow-sm p-3 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">AI Tutor</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              {/* Connection Error Display */}
              {connectionError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{connectionError}</span>
                  <button
                    onClick={() => {
                      setConnectionError(null);
                      connectSocket();
                    }}
                    className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      connectionStatus === 'connected' 
                        ? "Ask me anything about your studies..." 
                        : connectionStatus === 'connecting'
                        ? "Connecting to AI tutor..."
                        : "Disconnected - please wait..."
                    }
                    disabled={connectionStatus !== 'connected'}
                    className="w-full p-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <Sparkles className="absolute right-3 top-3 w-5 h-5 text-purple-500" />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={connectionStatus !== 'connected' || !inputMessage.trim() || isTyping}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl shadow-md"
                  title={connectionStatus !== 'connected' ? 'Connect first to send messages' : 'Send message'}
                >
                  {connectionStatus === 'connecting' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              {/* Quick action buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                  onClick={() => setInputMessage("Explain this concept to me")}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Explain Concept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300"
                  onClick={() => setInputMessage("Help me with practice problems")}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Practice Problems
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                  onClick={() => setInputMessage("Quiz me on this topic")}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Quiz Me
                </Button>
              </div>
              
              {/* Chat info footer */}
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
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
