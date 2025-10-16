# API Integration Guide - Particles & Topics

## Quick Reference

### 1. New Function in contentService.ts

```typescript
/**
 * Retrieves particles and topics from the whole syllabus
 * @returns Promise<ParticlesAndTopicsResponse> - Lists of particles and topics
 */
export async function getParticlesAndTopics(): Promise<ParticlesAndTopicsResponse>;
```

### 2. Function Implementation

```typescript
export async function getParticlesAndTopics(): Promise<ParticlesAndTopicsResponse> {
  try {
    // Step 1: Get syllabus data from API
    const syllabusData = await retrieveWholeSyllabuses();

    const particles: ParticleOption[] = [];
    const topics: TopicOption[] = [];

    // Step 2: Recursive traversal function
    const traverseNode = (node: WholeSyllabusNode) => {
      // Extract Particles
      if (node.type === "Particle") {
        particles.push({
          conceptId: node.conceptId,
          name: node.name,
        });
      }

      // Extract Topics
      if (node.type === "Topic") {
        topics.push({
          conceptId: node.conceptId,
          name: node.name,
        });
      }

      // Recursively check children
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverseNode(child));
      }
    };

    // Step 3: Traverse both hierarchies
    syllabusData.syllabusByMatter.forEach((node) => traverseNode(node));
    syllabusData.syllabusByGrade.forEach((node) => traverseNode(node));

    // Step 4: Return filtered lists
    return { particles, topics };
  } catch (error: any) {
    console.error("Error retrieving particles and topics:", error);
    throw new Error(
      `Failed to retrieve particles and topics: ${error.message}`
    );
  }
}
```

## API Response Example

### Input (from retrieveWholeSyllabuses API):

```json
{
  "syllabus": [
    {
      "conceptId": "root-id",
      "name": "Mathematics",
      "type": "Subject",
      "children": [
        {
          "conceptId": "algebra-id",
          "name": "Algebra",
          "type": "Matter",
          "children": [
            {
              "conceptId": "expressions-id",
              "name": "Algebraic Expressions",
              "type": "Molecule",
              "children": [
                {
                  "conceptId": "manipulation-id",
                  "name": "Manipulating Expressions",
                  "type": "Atom",
                  "children": [
                    {
                      "conceptId": "particle-1",
                      "name": "algebra symbolization",
                      "type": "Particle"
                    },
                    {
                      "conceptId": "particle-2",
                      "name": "algebraic-manipulation",
                      "type": "Particle"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "conceptId": "grade-10",
          "name": "Grade10",
          "type": "Grade",
          "children": [
            {
              "conceptId": "topic-1",
              "name": "Algebraic Fractions",
              "type": "Topic"
            },
            {
              "conceptId": "topic-2",
              "name": "Area",
              "type": "Topic"
            }
          ]
        }
      ]
    }
  ]
}
```

### Output (from getParticlesAndTopics):

```json
{
  "particles": [
    {
      "conceptId": "particle-1",
      "name": "algebra symbolization"
    },
    {
      "conceptId": "particle-2",
      "name": "algebraic-manipulation"
    }
  ],
  "topics": [
    {
      "conceptId": "topic-1",
      "name": "Algebraic Fractions"
    },
    {
      "conceptId": "topic-2",
      "name": "Area"
    }
  ]
}
```

## Type Definitions

```typescript
// Input types
export interface WholeSyllabusNode {
  conceptId: string;
  name: string;
  type: string;
  description: string;
  children?: WholeSyllabusNode[];
  createdAt: string;
}

// Output types
export interface ParticleOption {
  conceptId: string;
  name: string;
}

export interface TopicOption {
  conceptId: string;
  name: string;
}

export interface ParticlesAndTopicsResponse {
  particles: ParticleOption[];
  topics: TopicOption[];
}
```

## Usage in Components

### In ContentManagement.tsx:

```typescript
const [particles, setParticles] = useState<ParticleOption[]>([]);
const [topics, setTopics] = useState<TopicOption[]>([]);

useEffect(() => {
  const loadData = async () => {
    try {
      const particlesAndTopics = await getParticlesAndTopics();
      setParticles(particlesAndTopics.particles);
      setTopics(particlesAndTopics.topics);
    } catch (error) {
      console.error("Error loading particles and topics:", error);
    }
  };
  loadData();
}, []);
```

### In QuestionBankManager.tsx:

```typescript
interface QuestionBankManagerProps {
  particles: ParticleOption[];
  topics: TopicOption[];
  // ... other props
}

// In EditQuestionForm:
const [selectedParticles, setSelectedParticles] = useState<string[]>([]);
const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

// When saving:
const handleSave = () => {
  onSave({
    ...editedQuestion,
    particles: selectedParticles, // Array of conceptIds
    topics: selectedTopics, // Array of conceptIds
  });
};
```

## Key Points

✅ **Single API Call**: `getParticlesAndTopics()` calls `retrieveWholeSyllabuses()` once  
✅ **Recursive Traversal**: Handles nested structures of any depth  
✅ **Type Safety**: Filters by `node.type === "Particle"` or `node.type === "Topic"`  
✅ **Dual Hierarchy**: Processes both `syllabusByMatter` and `syllabusByGrade`  
✅ **Error Handling**: Try-catch with descriptive error messages  
✅ **Clean Output**: Returns only `conceptId` and `name` for each item

## Testing

```typescript
// Example test
const result = await getParticlesAndTopics();

console.log(`Found ${result.particles.length} particles`);
console.log(`Found ${result.topics.length} topics`);

// Expected:
// Found 103 particles
// Found 200+ topics
```

## Error Handling

```typescript
try {
  const data = await getParticlesAndTopics();
  // Use data
} catch (error) {
  console.error("Failed to fetch concepts:", error);
  // Show user-friendly error message
  // Fall back to empty arrays if needed
}
```

---

**File**: `services/contentService.ts`  
**Function**: `getParticlesAndTopics()`  
**Status**: ✅ Implemented and Working
