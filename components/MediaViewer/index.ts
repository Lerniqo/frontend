export { default as MediaViewer } from './MediaViewer';
export { default as PDFViewer } from './PDFViewer';
export { default as VideoViewer } from './VideoViewer';
export { default as ImageViewer } from './ImageViewer';
export { default as AIAssistant } from './AIAssistant';

// Re-export types
export type { 
  MediaResource, 
  ViewerContext, 
  AIMessage, 
  AIAssistantState, 
  MediaViewerProps, 
  AIAssistantProps 
} from '@/types/mediaViewer.types';
