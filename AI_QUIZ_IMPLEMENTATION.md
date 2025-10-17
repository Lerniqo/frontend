# AI-Generated Quiz Feature Implementation

## Overview

This feature allows students to generate custom AI-powered quizzes based on their chosen topic, number of questions, and difficulty level.

## Components Created/Modified

### 1. **AI Service** (`services/aiService.ts`)

Added new function `getAIGeneratedQuizz()` that:

- Accepts a request with `topic`, `num_questions` (5-10), and `difficulty` (easy/medium/hard)
- Makes a POST request to `/ai-service/llm/questions/generate`
- Returns an `AIGeneratedQuizResponse` containing quiz questions with multiple-choice options
- Includes proper error handling and validation

**New Types Added:**

- `AIQuizOption` - Individual answer option with correctness flag
- `AIQuizQuestion` - Full question structure with options, explanation, concepts
- `AIGeneratedQuizResponse` - Complete quiz response
- `AIQuizGenerationRequest` - Request parameters interface
- `validateAIQuizParams()` - Validation utility function

### 2. **AI Quiz Modal** (`components/CommonComponents/AIQuizModal.tsx`)

Created a modal component that collects quiz parameters:

- **Topic Input**: Text area accepting any string (paragraphs allowed)
- **Number of Questions**: Slider between 5-10 with visual feedback
- **Difficulty Level**: Three toggle buttons (Easy/Medium/Hard)
- Client-side validation before submission
- Modal passes parameters via URL query string to the quiz page

**Features:**

- Gradient styling matching the app theme
- Input validation with error messages
- Loading state during navigation
- Accessible and responsive design

### 3. **AI Quiz Page** (`app/(protected)/@student/ai-quizz/page.tsx`)

Created the main quiz page with three phases:

#### **Phase 1: Loading**

- Shows `GeneralLoadingComponent` while fetching questions from AI service
- Displays "Generating your AI-powered quiz..." message
- Redirects to dashboard if topic parameter is missing

#### **Phase 2: Quiz**

- Displays questions one at a time using `QuizzQuestionComponent`
- Shows question number and total question count
- Displays topic and difficulty level in header
- Handles answer selection and validation
- Tracks correct/incorrect answers
- Auto-advances after answer selection

#### **Phase 3: Results**

- Shows overall score percentage with color-coding:
  - Green: 70%+
  - Yellow: 50-69%
  - Red: <50%
- Displays count of correct and incorrect answers
- Provides two action buttons:
  - **Retake Quiz**: Regenerates the same quiz
  - **Back to Dashboard**: Returns to student dashboard

**Error Handling:**

- Catches API errors and displays error message
- Allows user to return to dashboard if quiz generation fails

### 4. **Updated Premium Navigation** (`components/StudentDashboardComponents/PremiumNavigation.tsx`)

- Removed `MessageCircle` import (no longer needed)
- Added `AIQuizModal` import and state management
- Added modal state: `showAIQuizModal`
- Updated `handleItemClick()` to open modal when "AI Quizzes" is clicked
- Integrated `AIQuizModal` component in return statement

**Changes:**

- Removed unused "Study Groups" button (already done)
- Connected "AI Quizzes" button to modal workflow

## User Flow

1. **Start Quiz**: Click "AI Quizzes" in the navigation panel
2. **Input Parameters**:
   - Enter topic (any string, supports long paragraphs)
   - Select number of questions (5-10)
   - Choose difficulty (easy/medium/hard)
3. **View Loading Screen**: Displays while AI generates questions
4. **Take Quiz**: Answer questions one by one
5. **View Results**: See score, correct/incorrect count, and options to retake or exit

## API Integration

### Endpoint

- **URL**: `/ai-service/llm/questions/generate`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "topic": "string (any length)",
    "num_questions": 5-10,
    "difficulty": "easy|medium|hard"
  }
  ```

### Response Structure

```json
{
  "topic": "string",
  "total_questions": number,
  "questions": [
    {
      "question_id": number,
      "question_type": "multiple_choice",
      "question_text": "string",
      "options": [
        {
          "option_id": "string",
          "text": "string",
          "is_correct": boolean
        }
      ],
      "correct_answer": "string",
      "explanation": "string",
      "difficulty": "easy|medium|hard",
      "concepts": ["string"]
    }
  ]
}
```

## Features Implemented

✅ Modal dialog for parameter collection
✅ Input validation (topic, num_questions range, difficulty)
✅ AI service integration with proper error handling
✅ Quiz page with loading, quiz, and results phases
✅ Question display using existing `QuizzQuestionComponent`
✅ Answer tracking and scoring
✅ Results display with percentage score
✅ Retake quiz functionality
✅ Navigation back to dashboard
✅ GSAP animations for smooth transitions
✅ Responsive design with gradient styling
✅ Error handling with user-friendly messages

## File Structure

```
frontend/
├── services/
│   └── aiService.ts (MODIFIED)
├── components/
│   ├── CommonComponents/
│   │   └── AIQuizModal.tsx (NEW)
│   └── StudentDashboardComponents/
│       └── PremiumNavigation.tsx (MODIFIED)
└── app/
    └── (protected)/
        └── @student/
            └── ai-quizz/
                └── page.tsx (NEW)
```

## Validation Rules

- **Topic**: Required, non-empty string
- **Number of Questions**: Integer between 5 and 10 (inclusive)
- **Difficulty**: Must be one of "easy", "medium", or "hard"

## Next Steps (Optional Enhancements)

- Add quiz history tracking
- Implement quiz performance analytics
- Add ability to save quiz results
- Create quiz difficulty recommendations based on performance
- Add more quiz customization options (time limit, question types, etc.)
