# Implementation Code Examples

## 1. Question Interface with Tags

**File:** `services/teacherDashboardService.ts`

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

---

## 2. API Response Mapping with Tags

**File:** `components/TeacherDashboard/ContentManagement.tsx`

```typescript
const loadData = async () => {
  try {
    const [questionsFromApi, resourcesRes, particlesAndTopics] =
      await Promise.all([
        getAllQuestionsByTeacher(),
        getResources(),
        getParticlesAndTopics(),
      ]);

    // Map API response to Question format for UI
    const mappedQuestions: Question[] = questionsFromApi.map(
      (q: QuestionResponse) => {
        // Find the index of the correct answer in the options array
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
          tags: q.tags || [], // Include tags from API response ← NEW
        };
      }
    );

    setQuestions(mappedQuestions);
    setParticles(particlesAndTopics.particles);
    setTopics(particlesAndTopics.topics);
  } catch (error) {
    console.error("Error loading content management data:", error);
  }
};
```

---

## 3. Tag Resolution Helper Function

**File:** `components/TeacherDashboard/QuestionBankManager.tsx`

```typescript
// Helper function to resolve tag IDs to their names
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

**Usage:**

```typescript
resolveTagNames(["particle-123", "topic-456"]);
// Returns: ["Physics", "Gravitational-Force"]
```

---

## 4. Question Card Display with Tags

**File:** `components/TeacherDashboard/QuestionBankManager.tsx`

```tsx
const QuestionCard = ({
  question,
  onEdit,
  onDelete,
}: {
  question: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const difficultyColors: { [key: string]: string } = {
    Easy: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Hard: "bg-red-100 text-red-800 border-red-200",
    easy: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    hard: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <p className="text-gray-800 font-medium pr-4 leading-relaxed">
          {question.question || question.questionText}
        </p>
        {/* Edit/Delete buttons */}
      </div>

      {/* Options display */}
      <div className="mt-5 space-y-3">
        {question.options.map((option: string, index: number) => (
          <div key={index} className="...">
            {/* Option content */}
          </div>
        ))}
      </div>

      {/* Metadata footer */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
            {question.topic || question.subject}
          </span>
          <span
            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
              difficultyColors[question.difficulty]
            }`}
          >
            {question.difficulty}
          </span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          ID: {question.id?.slice(-6)}
        </div>
      </div>

      {/* ← NEW: Tags display section */}
      {question.tags && question.tags.length > 0 && (
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
      )}
    </div>
  );
};
```

---

## 5. Edit Form Pre-population Logic

**File:** `components/TeacherDashboard/QuestionBankManager.tsx`

```typescript
const EditQuestionForm = ({
  question,
  onSave,
  onCancel,
  isNew = false,
}: {
  question: any;
  onSave: (q: any) => void;
  onCancel: () => void;
  isNew?: boolean;
}) => {
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

  const [editedQuestion, setEditedQuestion] = useState(question);
  const [selectedParticles, setSelectedParticles] = useState<string[]>(
    question.particles || initialTags.particles // ← Pre-populated
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    question.topics || initialTags.topics // ← Pre-populated
  );
  const [particleSearch, setParticleSearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");

  // ... rest of form logic
};
```

---

## 6. Data Flow Example

### Scenario: Loading and Displaying a Question

**Step 1: API Response**

```json
{
  "id": "q1",
  "questionText": "What is gravity?",
  "options": ["Force", "Speed", "Energy", "Motion"],
  "correctAnswer": "Force",
  "tags": ["particle-physics", "topic-gravitational-force"],
  "createdAt": "2025-10-17T10:00:00Z"
}
```

**Step 2: Mapping in ContentManagement.tsx**

```typescript
const mappedQuestion = {
  id: "q1",
  subject: "particle-physics", // First tag
  question: "What is gravity?",
  options: ["Force", "Speed", "Energy", "Motion"],
  correctAnswer: 0, // Index of "Force"
  difficulty: "easy",
  tags: ["particle-physics", "topic-gravitational-force"], // ← Stored
};
```

**Step 3: Resolution in QuestionCard**

```typescript
resolveTagNames(["particle-physics", "topic-gravitational-force"]);
// Searches particles array: finds "Physics"
// Searches topics array: finds "Gravitational Force"
// Returns: ["Physics", "Gravitational Force"]
```

**Step 4: Rendered Output**

```
┌─────────────────────────────────┐
│ What is gravity?                │
│ A) Force ← correct answer       │
│ B) Speed                        │
│ C) Energy                       │
│ D) Motion                       │
│                                 │
│ Physics     Easy                │
│ #Physics  #Gravitational Force  │ ← Displayed tags
└─────────────────────────────────┘
```

---

## 7. Event Handlers for Edit

```typescript
const handleEditQuestion = (questionId: string) => {
  setEditingQuestionId(questionId);
};

const handleSaveQuestion = async (editedQuestion: any) => {
  try {
    const result = await updateQuestion(editedQuestion);
    if (result.success) {
      const updatedQuestions = questions.map((q) =>
        q.id === editedQuestion.id
          ? {
              ...editedQuestion,
              questionText: editedQuestion.question,
              options: editedQuestion.options,
              topic: editedQuestion.subject,
              tags: editedQuestion.tags, // ← Include tags
            }
          : q
      );
      setQuestions(updatedQuestions);
      setEditingQuestionId(null);
    }
  } catch (error) {
    console.error("Error updating question:", error);
  }
};
```

---

## 8. Props and Type Definitions

```typescript
interface QuestionBankManagerProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  particles: ParticleOption[]; // Used for tag resolution
  topics: TopicOption[]; // Used for tag resolution
}

interface ParticleOption {
  conceptId: string;
  name: string;
}

interface TopicOption {
  conceptId: string;
  name: string;
}

interface Question {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[]; // ← Concept IDs to be resolved to names
}
```

---

## Testing Example

```typescript
// Test data
const particles = [
  { conceptId: "particle-physics", name: "Physics" },
  { conceptId: "particle-chemistry", name: "Chemistry" },
];

const topics = [
  { conceptId: "topic-gravitational-force", name: "Gravitational Force" },
  { conceptId: "topic-acceleration", name: "Acceleration" },
];

const question = {
  id: "q1",
  tags: ["particle-physics", "topic-gravitational-force"],
};

// Test
const resolvedTags = resolveTagNames(question.tags);
console.log(resolvedTags);
// Output: ["Physics", "Gravitational Force"]
```
