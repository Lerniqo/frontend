export interface MediaResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'image' | 'audio' | 'document';
  url: string;
  description?: string;
  duration?: number; // For videos/audio in seconds
  size?: number; // File size in bytes
  createdAt?: string;
  updatedAt?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface ViewerContext {
  resourceId: string;
  currentPage?: number; // For PDFs
  currentTime?: number; // For videos/audio
  scrollPosition?: number; // For documents
  zoomLevel?: number; // For images/PDFs
  selectedText?: string; // For text selection
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: ViewerContext;
}

export interface AIAssistantState {
  isOpen: boolean;
  messages: AIMessage[];
  isLoading: boolean;
  currentContext?: ViewerContext;
}

export interface MediaViewerProps {
  resource: MediaResource;
  onClose?: () => void;
  showAIAssistant?: boolean;
  initialContext?: ViewerContext;
}

export interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  currentContext?: ViewerContext;
  resourceInfo: MediaResource;
}
