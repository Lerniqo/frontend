# Tag Concept Mapping Implementation

## Summary

Implemented feature to display concept names (from particles and topics) as tags in the Question Bank instead of showing raw concept IDs, with pre-populated selections in the edit form.

## Changes Made

### 1. **Question Interface Update**

**File:** `services/teacherDashboardService.ts`

Added `tags` property to store concept IDs:

```typescript
export interface Question {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[]; // Array of concept IDs (particle and topic IDs)
}
```

### 2. **API Response Mapping**

**File:** `components/TeacherDashboard/ContentManagement.tsx`

Updated the question mapping to include tags from the API response:

```typescript
const mappedQuestions: Question[] = questionsFromApi.map(
  (q: QuestionResponse) => {
    // ... other mapping code ...
    return {
      // ... other properties ...
      tags: q.tags || [], // Include tags from API response
    };
  }
);
```

### 3. **Tag Name Resolution Function**

**File:** `components/TeacherDashboard/QuestionBankManager.tsx`

Added helper function to resolve concept IDs to their display names:

```typescript
const resolveTagNames = (tagIds: string[] | undefined): string[] => {
  if (!tagIds || tagIds.length === 0) return [];

  return tagIds
    .map((tagId) => {
      // Search in particles
      const particle = particles?.find((p) => p.conceptId === tagId);
      if (particle) return particle.name;

      // Search in topics
      const topic = topics?.find((t) => t.conceptId === tagId);
      if (topic) return topic.name;

      // If not found, return the ID itself as fallback
      return tagId;
    })
    .filter((name) => name !== undefined);
};
```

### 4. **Question Card Tag Display**

**File:** `components/TeacherDashboard/QuestionBankManager.tsx`

Added tag display section in the QuestionCard component:

```tsx
{
  question.tags && question.tags.length > 0 && (
    <div className="mt-3 flex flex-wrap gap-2">
      {resolveTagNames(question.tags).map((tagName, idx) => (
        <span
          key={idx}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
        >
          #{tagName}
        </span>
      ))}
    </div>
  );
}
```

### 5. **Edit Form Pre-population**

**File:** `components/TeacherDashboard/QuestionBankManager.tsx`

Added logic to separate tags by type and pre-populate selected concepts in the EditQuestionForm:

```typescript
// Helper function to separate tags into particles and topics
const separateTagsByType = (
  tags: string[] | undefined
): { particles: string[]; topics: string[] } => {
  if (!tags || tags.length === 0) return { particles: [], topics: [] };

  const particles_list: string[] = [];
  const topics_list: string[] = [];

  tags.forEach((tagId) => {
    // Check if tag is in particles
    if (particles?.find((p) => p.conceptId === tagId)) {
      particles_list.push(tagId);
    }
    // Check if tag is in topics
    else if (topics?.find((t) => t.conceptId === tagId)) {
      topics_list.push(tagId);
    }
  });

  return { particles: particles_list, topics: topics_list };
};

// Initialize particles and topics from question tags
const initialTags = separateTagsByType(
  question.tags || question.particles || []
);

const [selectedParticles, setSelectedParticles] = useState<string[]>(
  question.particles || initialTags.particles
);
const [selectedTopics, setSelectedTopics] = useState<string[]>(
  question.topics || initialTags.topics
);
```

## How It Works

1. **Fetching**: When questions are loaded from the API, each question includes a `tags` array containing concept IDs.

2. **Display**: In the Question Card, the `resolveTagNames()` function converts these concept IDs into readable names by:

   - Searching for the concept ID in the particles array
   - If not found, searching in the topics array
   - Displaying the name as a purple badge with a `#` prefix

3. **Editing**: When a question is opened for editing:
   - The `separateTagsByType()` function splits the tags into particles and topics
   - The edit form pre-populates the selected particles and topics checkboxes
   - Users can modify the selections as needed

## Features

✅ Concept IDs are resolved to readable names  
✅ Tags displayed as attractive badges in question cards  
✅ Edit form shows pre-selected concepts  
✅ Supports both particles and topics  
✅ Fallback to ID if concept not found  
✅ Clean, intuitive UI with visual feedback

## Testing Checklist

- [ ] Verify tags appear correctly in question cards
- [ ] Confirm tag names resolve properly from particles and topics
- [ ] Check that edit form shows pre-selected concepts
- [ ] Test adding new questions with selected concepts
- [ ] Verify updating questions preserves/updates concept mappings
- [ ] Check behavior with questions that have no tags
- [ ] Test with mixed particle and topic concepts
