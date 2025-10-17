# Tag Concept Mapping - Flow Diagram

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      API RESPONSE                               │
│  Question {                                                     │
│    id: "q1",                                                    │
│    questionText: "What is gravity?",                           │
│    options: [...],                                              │
│    correctAnswer: "...",                                        │
│    tags: ["particle-123", "topic-456"]  ← Concept IDs         │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│               ContentManagement.tsx                             │
│  Maps API response and includes tags:                          │
│  {                                                              │
│    ...                                                          │
│    tags: q.tags || []  ← Stored in local state                │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────────┐      ┌──────────────────────────┐
│   Question Card      │      │  EditQuestionForm        │
│  (Display Tags)      │      │ (Pre-populate Tags)      │
└──────────────────────┘      └──────────────────────────┘


## Tag Resolution Process

┌─────────────────────────────────────────┐
│  tags: ["particle-123", "topic-456"]   │
└──────────────┬──────────────────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ resolveTagNames()        │
    │ For each tag ID:         │
    └──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    ┌─────────┐   ┌────────┐
    │Particles│   │ Topics │
    │ array   │   │ array  │
    └─────────┘   └────────┘
        │             │
        │   Match     │
        │   conceptId │
        │             │
        ▼             ▼
    ┌─────────┐   ┌────────┐
    │"Physics"│   │"Gravity"│  ← Resolved Names
    └─────────┘   └────────┘
        │             │
        └──────┬──────┘
               ▼
    ┌──────────────────────────┐
    │ Display as Tags:         │
    │ #Physics  #Gravity       │
    └──────────────────────────┘


## Edit Form Tag Pre-population

┌────────────────────────────────────┐
│  Question.tags:                    │
│  ["particle-123", "topic-456"]    │
└────────────────┬───────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ separateTagsByType()         │
    │ Categorize each tag by type  │
    └──────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    ┌─────────────┐   ┌──────────────┐
    │ Particles:  │   │ Topics:      │
    │[particle-123]│  │[topic-456]   │
    └─────────────┘   └──────────────┘
        │                 │
        │    Initialize   │
        │     useState    │
        │                 │
        ▼                 ▼
    ┌──────────────────────────────┐
    │ selectedParticles            │
    │ selectedTopics               │
    │ ✓ Checkboxes pre-checked     │
    └──────────────────────────────┘


## Component Hierarchy

ContentManagement
    ├── QuestionBankManager
    │   ├── resolveTagNames() ← Helper function
    │   │
    │   ├── QuestionCard (displays tags)
    │   │   └── Resolved tag names as badges
    │   │
    │   └── EditQuestionForm (pre-populates)
    │       ├── separateTagsByType() ← Helper function
    │       ├── selectedParticles (useState)
    │       └── selectedTopics (useState)


## State Management

┌─────────────────────────────────────────┐
│  ContentManagement.tsx                  │
│  State: questions, particles, topics    │
└─────────────────────────────────────────┘
              │
              │ passes as props
              ▼
┌─────────────────────────────────────────┐
│  QuestionBankManager.tsx                │
│  - questions (has tags property)        │
│  - particles (for tag resolution)       │
│  - topics (for tag resolution)          │
└─────────────────────────────────────────┘
              │
              │ uses for tag mapping
              ├─► QuestionCard (display)
              └─► EditQuestionForm (edit)


## Type Flow

Question interface:
  id: string
  subject: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  tags?: string[]  ← New property

ParticleOption:
  conceptId: string
  name: string

TopicOption:
  conceptId: string
  name: string

Tag resolution:
  "particle-123" ──┐
                  ├──► Search in particles/topics ──► Find match ──► Return name
  "topic-456" ────┘


## Visual Example

Question Card Display:
┌──────────────────────────────────────────┐
│ What is gravity?                         │
│                                          │
│ A) Force pulling objects down            │
│ B) Speed of movement                     │
│ C) Energy stored                         │
│ D) Motion of planets                     │
│                                          │
│ Physics   Easy                           │
│ #Particle-Physics  #Gravitational-Force │ ← Tags displayed
└──────────────────────────────────────────┘

Edit Form:
┌─────────────────────────────────────────┐
│ Edit Question                           │
│                                         │
│ [Particles] [Topics]                   │
│                                         │
│ ✓ Physics                               │ ← Pre-checked
│ ○ Chemistry                             │
│ ○ Biology                               │
│                                         │
│ Selected:                               │
│ [Physics] [Gravitational-Force]        │ ← Already selected
│                                         │
│ [Cancel] [Save Changes]                 │
└─────────────────────────────────────────┘
```
