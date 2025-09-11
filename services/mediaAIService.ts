import { AIMessage, ViewerContext, MediaResource } from '@/types/mediaViewer.types';

class MediaAIService {
  private apiEndpoint = '/api/ai/media-assistant';

  async sendMessage(
    message: string, 
    context: ViewerContext, 
    resourceInfo: MediaResource,
    previousMessages: AIMessage[] = []
  ): Promise<string> {
    try {
      // Mock response for now - replace with actual API call
      const response = await this.mockAIResponse(message, context, resourceInfo);
      return response;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw new Error('Failed to get AI response');
    }
  }

  private async mockAIResponse(
    message: string, 
    context: ViewerContext, 
    resourceInfo: MediaResource
  ): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = this.generateContextualResponse(message, context, resourceInfo);
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateContextualResponse(
    message: string, 
    context: ViewerContext, 
    resourceInfo: MediaResource
  ): string[] {
    const messageLC = message.toLowerCase();
    
    // Context-aware responses based on resource type and current state
    if (resourceInfo.type === 'video' && context.currentTime !== undefined) {
      if (messageLC.includes('explain') || messageLC.includes('what')) {
        return [
          `Based on the video content at ${this.formatTime(context.currentTime)}, I can explain that concept in detail. What specific aspect would you like me to clarify?`,
          `At timestamp ${this.formatTime(context.currentTime)}, the video is covering an important topic. Let me break it down for you...`,
          `I notice you're watching "${resourceInfo.title}" at the ${this.formatTime(context.currentTime)} mark. This section typically covers fundamental concepts that are crucial for understanding.`
        ];
      }
      if (messageLC.includes('time') || messageLC.includes('when')) {
        return [
          `You're currently at ${this.formatTime(context.currentTime)} in the video "${resourceInfo.title}". Is there something specific about this timestamp you'd like to know?`,
          `The current video position is ${this.formatTime(context.currentTime)}. Based on typical video structure, this section usually covers important foundational material.`
        ];
      }
    }

    if (resourceInfo.type === 'pdf' && context.currentPage !== undefined) {
      if (messageLC.includes('page') || messageLC.includes('explain')) {
        return [
          `You're currently viewing page ${context.currentPage} of "${resourceInfo.title}". This page typically contains key information. What would you like me to explain?`,
          `Based on page ${context.currentPage}, I can help clarify the concepts presented here. What specific part needs explanation?`,
          `Page ${context.currentPage} of this document covers important material. Let me help you understand it better.`
        ];
      }
    }

    if (context.selectedText) {
      return [
        `I see you've selected the text: "${context.selectedText}". Let me explain this concept in detail and provide additional context.`,
        `The selected text "${context.selectedText}" is an important concept. Here's a comprehensive explanation...`,
        `Great selection! "${context.selectedText}" is a key point. Let me elaborate on this and show how it connects to other concepts.`
      ];
    }

    // Generic responses based on message content
    if (messageLC.includes('summary') || messageLC.includes('summarize')) {
      return [
        `Here's a comprehensive summary of "${resourceInfo.title}": This resource covers fundamental concepts that are essential for your learning journey. The key points include...`,
        `Let me provide a structured summary of this ${resourceInfo.type} resource. The main themes and concepts covered are...`
      ];
    }

    if (messageLC.includes('help') || messageLC.includes('how')) {
      return [
        `I'm here to help you understand "${resourceInfo.title}" better! I can explain concepts, provide summaries, answer questions about the content, and help you navigate through the material.`,
        `I can assist you with this ${resourceInfo.type} in many ways: explaining difficult concepts, providing context, suggesting related topics, and answering your questions. What would you like to explore?`
      ];
    }

    if (messageLC.includes('question') || messageLC.includes('quiz')) {
      return [
        `Based on "${resourceInfo.title}", here are some key questions to test your understanding: 1) What are the main concepts covered? 2) How do these relate to your broader learning goals? 3) What practical applications can you think of?`,
        `Let me create some practice questions based on this content to help reinforce your learning...`
      ];
    }

    // Default responses
    return [
      `I understand you're working with "${resourceInfo.title}". Based on the current context, I can help explain concepts, provide additional information, or answer specific questions about the content.`,
      `Thanks for your question about "${resourceInfo.title}". Let me provide some helpful insights based on the content you're currently viewing.`,
      `I'm analyzing the content of "${resourceInfo.title}" to provide you with the most relevant and helpful response. Here's what I can tell you...`,
      `Based on your current position in "${resourceInfo.title}", I can offer detailed explanations and help you understand the key concepts being presented.`
    ];
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async generateQuestions(resourceInfo: MediaResource, context?: ViewerContext): Promise<string[]> {
    // Mock question generation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      "What are the key concepts covered in this section?",
      "How does this material relate to previous learning?",
      "Can you explain the practical applications?",
      "What are the most important takeaways?",
      "How would you apply this knowledge in real scenarios?"
    ];
  }

  async getSuggestions(resourceInfo: MediaResource, context?: ViewerContext): Promise<string[]> {
    // Mock suggestions - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      "Explain this concept in simple terms",
      "Provide examples and applications",
      "Create a summary of key points",
      "Generate practice questions",
      "Show related learning resources"
    ];
  }
}

export const mediaAIService = new MediaAIService();
