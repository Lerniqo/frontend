# Concept View Implementation

## Overview

This document outlines the implementation of the Concept View feature, which allows students to view detailed information about educational concepts, including their prerequisites and learning resources.

## Implementation Details

### 1. Content Service Function (`services/contentService.ts`)

#### New Function: `getConceptByConceptId`

```typescript
export async function getConceptByConceptId(
  conceptId: string
): Promise<ConceptDetailResponse>;
```

**Purpose**: Fetches detailed information about a concept from the backend API.

**Parameters**:

- `conceptId`: The unique identifier of the concept

**Returns**: A promise containing:

- `conceptId`: The concept's unique ID
- `name`: The concept name
- `type`: The concept type (e.g., "Topic", "Particle")
- `description`: A description of the concept
- `prerequisites`: Array of prerequisite concepts
- `learningResources`: Array of learning resources
- `createdAt`: Timestamp information

**API Endpoint**: `/content-service/concepts/${conceptId}`

**Example Response**:

```json
{
  "conceptId": "a6865533-ed0a-4987-9976-e39dcf7e40bc",
  "name": "Area",
  "type": "Topic",
  "description": "Calculating area of shapes",
  "prerequisites": [
    {
      "conceptId": "PAR044",
      "name": "area (PAR044)",
      "type": "Particle",
      "description": "General area calculations"
    }
  ],
  "learningResources": [
    {
      "resourceId": "0cc38575-b1db-405d-8064-4ec05a0cae9f",
      "name": null,
      "type": "Notes",
      "url": "https://...",
      "price": 0
    }
  ]
}
```

### 2. Concept View Page (`app/(protected)/@student/concept-view/page.tsx`)

#### Features:

1. **Dynamic Data Fetching**: Automatically fetches concept data based on the `conceptId` URL parameter
2. **Name Formatting**: Implements the following formatting rules:
   - Removes content within parentheses (e.g., "area (PAR044)" → "area")
   - Replaces hyphens with spaces
   - Capitalizes the first letter of each word
3. **View Mode Toggle**: SubMenu component to switch between:
   - **Prerequisites**: View all prerequisite concepts
   - **Learning Resources**: View all learning resources
4. **Grid Layout**: Items displayed in a responsive 2-column grid (1 column on mobile)
5. **Navigation**:
   - Click on a prerequisite → Navigate to that concept's view page
   - Click on a learning resource → Navigate to resource-view page
   - Back button → Returns to previous page
6. **Styling**: Uses the same design pattern as the resource-library page with:
   - Animated background blobs
   - Purple/blue gradient theme
   - Custom scrollbars
   - Smooth hover effects
   - Smooth transitions between view modes

#### URL Structure:

```
/concept-view?conceptId=<concept-id>
```

#### Error Handling:

- Shows error message if concept ID is missing
- Displays error details if API call fails
- Provides "Back" button for easy navigation

### 3. Resource View Page (`app/(protected)/@student/resource-view/page.tsx`)

#### Features:

1. **URL Parameter Handling**: Receives `resourceId` from URL
2. **Placeholder Implementation**: Currently shows:
   - Resource ID display
   - Preview of planned features
   - Success confirmation
   - Development status notice
3. **Future Features** (to be implemented):
   - PDF viewer for document resources
   - Video player for video content
   - Interactive quiz interfaces
   - Resource download options
   - Progress tracking
   - Bookmarking and notes

#### URL Structure:

```
/resource-view?resourceId=<resource-id>
```

## Helper Functions

### `formatName(name: string): string`

Formats concept and resource names by:

1. Removing parentheses and their contents
2. Replacing hyphens with spaces
3. Capitalizing the first letter of each word

**Examples**:

- "area (PAR044)" → "Area"
- "area-concept" → "Area Concept"
- "multiplication-of-fractions" → "Multiplication Of Fractions"

## Navigation Flow

```
Resource Library Page
    ↓ (Click on Particle/Topic)
Concept View Page
    ↓ (Click on Prerequisite)
Another Concept View Page (recursive navigation)
    OR
    ↓ (Click on Learning Resource)
Resource View Page (preview)
```

## Styling Consistency

All pages follow the same design pattern:

- **Background**: Gradient with animated blobs
- **Cards**: White with backdrop blur, rounded corners, purple borders
- **Buttons**: Gradient hover effects, smooth transitions
- **Scrollbars**: Custom purple-gradient styled scrollbars
- **Typography**: Purple gradient headings, gray body text

## API Integration

### Required Backend Endpoint:

```
GET /content-service/concepts/:conceptId
```

### Expected Response Format:

```typescript
{
  conceptId: string;
  name: string;
  type: string;
  description: string;
  prerequisites: Array<{
    conceptId: string;
    name: string;
    type: string;
    description: string;
  }>;
  learningResources: Array<{
    resourceId: string;
    name: string | null;
    type: string;
    url: string;
    price: number;
  }>;
  createdAt: any;
}
```

## Testing Checklist

- [ ] Concept data fetches correctly from API
- [ ] Name formatting works for all edge cases
- [ ] Prerequisites display correctly
- [ ] Learning resources display correctly
- [ ] Navigation to prerequisite concepts works
- [ ] Navigation to resource view works
- [ ] Back button functions properly
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Responsive design works on different screen sizes
- [ ] Scrolling works smoothly with custom scrollbars

## Future Enhancements

1. **Resource View Page**: Implement full resource viewer functionality
2. **Progress Tracking**: Add ability to mark concepts/resources as completed
3. **Bookmarking**: Allow users to bookmark concepts and resources
4. **Search**: Add search functionality within concept view
5. **Related Concepts**: Show related or similar concepts
6. **User Notes**: Allow users to add personal notes to concepts
7. **Share**: Add ability to share concept links

## Notes

- The concept view page uses the same styling patterns as the resource-library page for consistency
- All navigation is handled using Next.js router for smooth transitions
- The implementation follows the existing code structure and patterns
- Error handling is comprehensive and user-friendly
- The design is fully responsive and accessible
