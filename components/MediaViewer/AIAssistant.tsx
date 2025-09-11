"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageCircle, 
  Lightbulb,
  FileText,
  Clock,
  Zap
} from 'lucide-react';
import { AIAssistantProps, AIMessage } from '@/types/mediaViewer.types';
import { mediaAIService } from '@/services/mediaAIService';

export default function AIAssistant({ 
  isOpen, 
  onToggle, 
  currentContext, 
  resourceInfo 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load suggestions when context changes
    if (isOpen && resourceInfo) {
      loadSuggestions();
    }
  }, [isOpen, resourceInfo, currentContext, loadSuggestions]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = useCallback(async () => {
    try {
      const newSuggestions = await mediaAIService.getSuggestions(resourceInfo, currentContext);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  }, [resourceInfo, currentContext]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      context: currentContext
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await mediaAIService.sendMessage(
        text, 
        currentContext || { resourceId: resourceInfo.id }, 
        resourceInfo,
        messages
      );

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        context: currentContext
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getContextDisplay = () => {
    if (!currentContext) return null;

    const items = [];
    if (currentContext.currentTime !== undefined) {
      const mins = Math.floor(currentContext.currentTime / 60);
      const secs = Math.floor(currentContext.currentTime % 60);
      items.push(`Time: ${mins}:${secs.toString().padStart(2, '0')}`);
    }
    if (currentContext.currentPage !== undefined) {
      items.push(`Page: ${currentContext.currentPage}`);
    }
    if (currentContext.zoomLevel !== undefined) {
      items.push(`Zoom: ${currentContext.zoomLevel}%`);
    }

    return items.length > 0 ? items.join(' • ') : null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetContent side="right" className="w-[500px] sm:w-[540px] p-0 bg-gradient-to-b from-slate-50 to-blue-50 border-l border-slate-200">
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Learning Assistant
                </SheetTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Ask questions about &quot;{resourceInfo.title}&quot;
                </p>
              </div>
            </div>

            {/* Context Display */}
            {getContextDisplay() && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Current Context:</span>
                  <span className="text-sm text-slate-600">{getContextDisplay()}</span>
                </div>
              </div>
            )}
          </SheetHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Hi! I&apos;m your AI Learning Assistant
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">
                    I can help you understand the content, answer questions, and provide explanations about what you&apos;re viewing.
                  </p>

                  {/* Quick Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700 mb-3">Quick suggestions:</p>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className="block w-full p-3 text-left bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all duration-200 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.context && message.role === 'user' && (
                        <span className="text-blue-600">• Context captured</span>
                      )}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-slate-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 pt-4 bg-white/80 backdrop-blur-xl border-t border-slate-200">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about this content..."
                  className="pr-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Context-aware responses</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>Real-time assistance</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
