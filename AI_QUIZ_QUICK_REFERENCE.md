# AI Quiz Feature - Quick Reference

## Summary
A complete AI-powered quiz generation system for students to create custom quizzes based on topics, difficulty levels, and preferred number of questions.

## What Was Created

### 1. **getAIGeneratedQuizz()** Function
Location: `services/aiService.ts`

```typescript
export const getAIGeneratedQuizz = async (
  request: AIQuizGenerationRequest
): Promise<AIGeneratedQuizResponse>
```

Makes POST request to: `/ai-service/llm/questions/generate`

Validates:
- Topic is not empty
- Number of questions is between 5-10
- Difficulty is one of: "easy", "medium", "hard"

### 2. **AIQuizModal Component**
Location: `components/CommonComponents/AIQuizModal.tsx`

Collects from user:
- 📝 **Topic**: Any text string (supports long paragraphs)
- 🔢 **Number of Questions**: Slider control (5-10)
- 📊 **Difficulty**: Toggle buttons (Easy/Medium/Hard)

Navigates to: `/student/ai-quizz?topic=...&numQuestions=...&difficulty=...`

### 3. **AI Quiz Page**
Location: `app/(protected)/@student/ai-quizz/page.tsx`

**Three Phases:**
1. **Loading**: Shows animated loading screen while fetching questions
2. **Quiz**: Displays questions one by one, tracks answers
3. **Results**: Shows score percentage, correct/incorrect counts

**Features:**
- Smooth GSAP animations
- Error handling with fallback
- Retake quiz option
- Back to dashboard button

### 4. **Updated Navigation**
Location: `components/StudentDashboardComponents/PremiumNavigation.tsx`

- "AI Quizzes" button now opens the modal
- Modal state management integrated

## User Interaction Flow

```
Click "AI Quizzes" Button
    ↓
AIQuizModal Opens
    ↓
User Enters: Topic, Number, Difficulty
    ↓
Submit Form
    ↓
Navigate to /student/ai-quizz with URL params
    ↓
Page Fetches Quiz from API (Loading Phase)
    ↓
Display Questions (Quiz Phase)
    ↓
User Answers All Questions
    ↓
Show Results (Results Phase)
    ↓
Retake or Return to Dashboard
```

## API Call Format

```typescript
const response = await getAIGeneratedQuizz({
  topic: "Algebra basics",
  num_questions: 8,
  difficulty: "medium"
});
```

## Testing Checklist

- [ ] Click "AI Quizzes" in navigation opens modal
- [ ] Modal validates topic is not empty
- [ ] Slider correctly limits questions to 5-10
- [ ] Difficulty selection works (easy/medium/hard)
- [ ] Form submission navigates to quiz page
- [ ] Loading screen appears while fetching
- [ ] Questions display correctly
- [ ] Answers are tracked
- [ ] Results show correct score
- [ ] Retake button regenerates quiz
- [ ] Dashboard button returns to home

## Parameter Constraints

| Parameter | Type | Min | Max | Required |
|-----------|------|-----|-----|----------|
| topic | string | 1 char | ∞ | Yes |
| num_questions | number | 5 | 10 | Yes |
| difficulty | enum | - | - | Yes |

## Response Includes

For each question:
- ✅ Question ID and text
- 🔘 Multiple choice options with correctness flag
- 📝 Explanation for correct answer
- 📂 Concept tags
- 📈 Difficulty level

## Component Dependencies

- `AIQuizModal` → Uses `validateAIQuizParams()`
- `AIQuizPage` → Uses `getAIGeneratedQuizz()`, `GeneralLoadingComponent`, `QuizzQuestionComponent`
- `PremiumNavigation` → Uses `AIQuizModal`

## Error Handling

**Validation errors:**
- Empty topic → "Topic is required"
- Invalid question count → "Must be between 5 and 10"
- Invalid difficulty → "Must be easy, medium, or hard"

**API errors:**
- Failed to fetch → Shows error message
- Invalid response → Shows error message
- User can retry or return to dashboard

## Styling & Theme

- Gradient backgrounds: purple-600 to blue-600
- Loading animations: Spinning circles with pulses
- Result colors:
  - Green (70%+): Good performance
  - Yellow (50-69%): Average performance
  - Red (<50%): Below average
