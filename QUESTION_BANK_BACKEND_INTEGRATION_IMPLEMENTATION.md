# Question Bank Backend Integration Implementation

## Overview

This document describes the implementation of backend integration for the teacher's question bank functionality, allowing teachers to create questions and retrieve them from the database.

## Implementation Date

October 16, 2025

## Changes Made

### 1. Content Service (`services/contentService.ts`)

#### New Types Added

```typescript
export interface CreateQuestionDto {
  questionText: string;
  options: string[];
  correctAnswer: string;
  tags: string[];
}

export interface QuestionResponse {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

#### New Functions

**`createQuestion(data: CreateQuestionDto): Promise<QuestionResponse>`**

- **Purpose**: Creates a new question in the database
- **API Endpoint**: `POST /api/content-service/questions`
- **Request Body**:
  - `questionText`: The question text
  - `options`: Array of answer options
  - `correctAnswer`: The correct answer text (not index)
  - `tags`: Array of concept IDs (from particles and topics)
- **Returns**: Created question with ID and metadata

**`getAllQuestionsByTeacher(): Promise<QuestionResponse[]>`**

- **Purpose**: Retrieves all questions created by the logged-in teacher
- **API Endpoint**: `GET /api/content-service/teacher`
- **Authentication**: Automatically uses logged-in teacher's credentials
- **Returns**: Array of questions with all their details
- **404 Handling**: Returns empty array `[]` when no questions exist yet (instead of throwing error)

### 2. Question Bank Manager (`components/TeacherDashboard/QuestionBankManager.tsx`)

#### Updated `handleAddQuestionSave` Function

- **Key Changes**:

  1. Maps selected particles and topics to a single `tags` array containing concept IDs
  2. Converts the correct answer from index to actual answer text for the API
  3. Calls `createQuestion()` from contentService instead of mock `addQuestion()`
  4. Maps the API response back to the local Question type for UI display
  5. Handles errors with user-friendly alerts

- **Tag Mapping**: Combines both particles and topics selected by the teacher into a single tags array

  ```typescript
  const tags = [
    ...(newQuestion.particles || []),
    ...(newQuestion.topics || []),
  ];
  ```

- **Correct Answer Conversion**: Converts from option index to option text
  ```typescript
  const correctAnswerText = newQuestion.options[newQuestion.correctAnswer];
  ```

### 3. Content Management (`components/TeacherDashboard/ContentManagement.tsx`)

#### Updated Data Loading

- **Key Changes**:

  1. Replaced `getQuestions()` with `getAllQuestionsByTeacher()`
  2. Added mapping logic to convert API response to UI format
  3. Finds correct answer index from correct answer text
  4. Sets default difficulty level (API doesn't provide this yet)

- **Response Mapping**:
  ```typescript
  const mappedQuestions: Question[] = questionsFromApi.map(
    (q: QuestionResponse) => {
      const correctAnswerIndex = q.options.findIndex(
        (option) => option === q.correctAnswer
      );

      return {
        id: q.id,
        subject: q.tags && q.tags.length > 0 ? q.tags[0] : "General",
        question: q.questionText,
        options: q.options,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
        difficulty: "easy" as "easy" | "medium" | "hard",
      };
    }
  );
  ```

## Data Flow

### Creating a Question

1. Teacher fills out the question form in `QuestionBankManager`
2. Teacher selects particles and/or topics for tagging
3. On save, the component:
   - Combines particles and topics into a tags array
   - Converts correct answer from index to text
   - Calls `createQuestion()` API
4. API returns the created question with ID
5. Question is mapped to UI format and added to the list

### Retrieving Questions

1. `ContentManagement` component loads on mount
2. Calls `getAllQuestionsByTeacher()` API
3. API returns all questions for the logged-in teacher
4. Questions are mapped from API format to UI format:
   - `questionText` → `question`
   - Correct answer text → correct answer index
   - First tag → subject
   - Default difficulty applied
5. Mapped questions are displayed in the UI

## Important Notes

### Particles and Topics Integration

- **Preserved Functionality**: The particle and topic fetching logic remains unchanged
- **Usage**: Teachers can still browse and select particles/topics when creating questions
- **Mapping**: Selected particles and topics are combined into the `tags` array for the API

### Data Format Differences

- **API Format**: Uses `questionText`, correct answer as string, tags array
- **UI Format**: Uses `question`, correct answer as index, subject string
- **Mapping**: Automatic conversion happens in both directions

### Error Handling

- All API calls include comprehensive error handling
- Errors are logged to console with detailed information
- User-friendly error messages are displayed when operations fail

## API Endpoints Used

| Endpoint                         | Method | Purpose                     | Authentication     |
| -------------------------------- | ------ | --------------------------- | ------------------ |
| `/api/content-service/questions` | POST   | Create new question         | Required (Teacher) |
| `/api/content-service/teacher`   | GET    | Get all teacher's questions | Required (Teacher) |

## Testing Recommendations

1. **Create Question**: Test creating questions with various combinations of particles and topics
2. **Retrieve Questions**: Verify that all created questions appear in the list
3. **Tag Display**: Check that tags are properly associated with questions
4. **Error Cases**: Test with network failures, invalid data, etc.
5. **Multiple Teachers**: Verify that teachers only see their own questions

## Future Enhancements

1. **Difficulty Level**: Add difficulty field to API response
2. **Explanation Field**: Support for question explanations
3. **Bulk Operations**: Support for creating multiple questions at once
4. **Question Analytics**: Track usage and performance of questions
5. **Question Sharing**: Allow teachers to share questions with other teachers
