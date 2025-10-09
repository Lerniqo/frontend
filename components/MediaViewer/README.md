# MediaViewer Component Suite

A comprehensive, premium media viewer component with AI-powered assistance for React/Next.js applications. Built with TypeScript, Tailwind CSS, shadcn/ui components, and enhanced with ReactBits animations.

## 🌟 Features

### Core Functionality
- **Multi-format Support**: PDF, Video (including YouTube), Images, Audio, and Documents
- **AI Assistant Integration**: Context-aware AI that understands what you're viewing
- **Advanced Controls**: Zoom, rotate, navigate, fullscreen, and more
- **Responsive Design**: Beautiful UI that works on all devices
- **Premium Animations**: Smooth transitions and ReactBits components

### AI Assistant Capabilities
- **Context Awareness**: Knows your current page, timestamp, zoom level, and selected text
- **Real-time Help**: Get explanations and answers based on your current viewing context
- **Smart Suggestions**: AI provides relevant questions and guidance
- **Multi-modal Understanding**: Works with PDFs, videos, images, and more

### Viewer-Specific Features

#### PDF Viewer
- Page navigation with thumbnails
- Zoom controls (50% - 200%)
- Rotation support
- Text selection detection
- Download and external viewing options

#### Video Viewer
- YouTube embed support
- Custom video controls
- Playback speed adjustment (0.5x - 2x)
- Volume control and muting
- Fullscreen mode
- Timeline scrubbing

#### Image Viewer
- Pan and zoom functionality
- Rotation support
- High-quality display
- Drag to move when zoomed
- Grid overlay for precision viewing

## 🚀 Quick Start

### 1. Installation

The component uses several dependencies that should already be installed in your project:

```bash
# Core dependencies (should already be installed)
npm install react react-dom next

# UI components (install shadcn components)
npx shadcn@latest add dialog sheet resizable textarea input scroll-area button card

# Styling
npm install tailwindcss lucide-react
```

### 2. Basic Usage

```tsx
import { MediaViewer } from '@/components/MediaViewer';
import { MediaResource } from '@/types/mediaViewer.types';

const resource: MediaResource = {
  id: '1',
  title: 'Sample PDF Document',
  type: 'pdf',
  url: 'https://example.com/document.pdf',
  description: 'A sample document for demonstration'
};

function MyComponent() {
  const [selectedResource, setSelectedResource] = useState<MediaResource | null>(null);

  return (
    <div>
      <button onClick={() => setSelectedResource(resource)}>
        Open Media Viewer
      </button>
      
      {selectedResource && (
        <MediaViewer
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          showAIAssistant={true}
        />
      )}
    </div>
  );
}
```

### 3. Using the Context Provider

For better state management across your application:

```tsx
import { MediaViewerProvider, useMediaViewerContext } from '@/contexts/MediaViewerContext';

// Wrap your app
function App() {
  return (
    <MediaViewerProvider>
      <YourApplication />
    </MediaViewerProvider>
  );
}

// Use in components
function ResourceCard({ resource }: { resource: MediaResource }) {
  const { openViewer } = useMediaViewerContext();
  
  return (
    <div onClick={() => openViewer(resource)}>
      {resource.title}
    </div>
  );
}
```

## 🎨 Theming

The component uses a consistent blue-500 and purple-600 color scheme matching your application theme:

```css
/* Primary colors used */
--blue-500: #3b82f6
--purple-600: #9333ea

/* Gradient combinations */
bg-gradient-to-r from-blue-500 to-purple-600
bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900
```

## 📱 Components Overview

### MediaViewer (Main Component)
The primary component that orchestrates all viewer types and the AI assistant.

**Props:**
```tsx
interface MediaViewerProps {
  resource: MediaResource;
  onClose?: () => void;
  showAIAssistant?: boolean;
  initialContext?: ViewerContext;
}
```

### Individual Viewers

#### PDFViewer
- Handles PDF document display and navigation
- Provides page controls, zoom, and rotation
- Captures text selection for AI context

#### VideoViewer  
- Supports both direct video files and YouTube URLs
- Custom controls with playback speed options
- Timeline tracking for AI context

#### ImageViewer
- High-quality image display with zoom and pan
- Rotation and position controls
- Optimized for various image formats

### AIAssistant
- Context-aware chat interface
- Real-time message handling
- Smart suggestions based on content type

## 🔧 Advanced Usage

### Custom AI Service Integration

Replace the mock AI service with your actual implementation:

```tsx
// services/mediaAIService.ts
class MediaAIService {
  async sendMessage(message: string, context: ViewerContext, resource: MediaResource) {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, resource })
    });
    return response.json();
  }
}
```

### Context Tracking

The viewer automatically tracks user context:

```tsx
interface ViewerContext {
  resourceId: string;
  currentPage?: number;     // PDF page number
  currentTime?: number;     // Video timestamp
  scrollPosition?: number;  // Document scroll
  zoomLevel?: number;       // Zoom percentage
  selectedText?: string;    // Selected text
}
```

### Resource Metadata

Enrich your resources with metadata for better AI responses:

```tsx
const resource: MediaResource = {
  id: '1',
  title: 'Advanced Mathematics',
  type: 'pdf',
  url: '/path/to/file.pdf',
  metadata: {
    subject: 'Mathematics',
    grade: 'Grade 11',
    difficulty: 'Advanced',
    keywords: ['algebra', 'equations', 'functions']
  }
};
```

## 🎯 Demo Page

Visit the demo page to see all features in action:

```
/media-viewer-demo
```

The demo includes:
- Sample resources of different types
- Filter functionality
- Animated cards with ReactBits
- Live AI assistant demonstration

## 🛠️ File Structure

```
components/MediaViewer/
├── MediaViewer.tsx          # Main component
├── PDFViewer.tsx           # PDF viewer
├── VideoViewer.tsx         # Video viewer  
├── ImageViewer.tsx         # Image viewer
├── AIAssistant.tsx         # AI chat interface
└── index.ts                # Exports

types/
└── mediaViewer.types.ts    # TypeScript definitions

services/
└── mediaAIService.ts       # AI service implementation

contexts/
└── MediaViewerContext.tsx  # React context provider

hooks/
└── useMediaViewer.ts       # Custom hook

utils/
└── sampleData.ts          # Demo data
```

## 🎨 Styling Notes

The component uses:
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistent UI elements
- **ReactBits** for premium animations
- **Lucide React** for icons
- **Custom gradients** matching the blue-500/purple-600 theme

## 🚀 Performance Considerations

- **Lazy Loading**: Components render only when needed
- **Context Optimization**: Updates are debounced to prevent excessive API calls
- **Memory Management**: Proper cleanup of event listeners and observers
- **Progressive Enhancement**: Core functionality works even if AI features fail

## 📝 License

This component suite is part of the Learniqo educational platform.

---

## 🤝 Contributing

When extending the MediaViewer:

1. Follow the existing TypeScript patterns
2. Maintain the blue-500/purple-600 color scheme
3. Add proper error handling
4. Include loading states
5. Test with various file types and sizes
6. Ensure AI context is properly captured

---

**Built with ❤️ for the Learniqo platform**
