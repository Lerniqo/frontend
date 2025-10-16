# Content Management - Particles and Topics Integration

## Overview

This document describes the implementation of the particles and topics integration for the teacher content management system, allowing teachers to map questions to specific particles and topics from the syllabus.

## Implementation Date

October 16, 2025

## Changes Made

### 1. Content Service (`services/contentService.ts`)

#### New Types Added

```typescript
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

#### New Function: `getParticlesAndTopics()`

- **Purpose**: Retrieves all particles and topics from the syllabus hierarchy
- **How it works**:
  1. Calls `retrieveWholeSyllabuses()` to get the complete syllabus data
  2. Recursively traverses the syllabus tree structure
  3. Filters nodes by type: "Particle" and "Topic"
  4. Returns two separate lists of particles and topics
- **Returns**: `Promise<ParticlesAndTopicsResponse>`

### 2. Content Management Page (`components/TeacherDashboard/ContentManagement.tsx`)

#### State Management

- Added `particles` state: `useState<ParticleOption[]>([])`
- Added `topics` state: `useState<TopicOption[]>([])`

#### Data Fetching

- Updated `useEffect` to fetch particles and topics on component mount
- Uses `Promise.all` to fetch questions, resources, and particles/topics concurrently
- Passes particles and topics to QuestionBankManager component

### 3. Question Bank Manager (`components/TeacherDashboard/QuestionBankManager.tsx`)

#### Props Updated

```typescript
interface QuestionBankManagerProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  particles: ParticleOption[]; // NEW
  topics: TopicOption[]; // NEW
}
```

#### Enhanced EditQuestionForm Component

##### New Features

1. **Mapping Type Selection**

   - Teachers can toggle between "Particles" and "Topics" views
   - Clean tab-like interface for switching

2. **Particle Selection**

   - Searchable list of all available particles
   - Checkbox selection for multiple particles
   - Real-time search filtering
   - Visual badges showing selected particles
   - Easy removal of selected items

3. **Topic Selection**

   - Searchable list of all available topics
   - Checkbox selection for multiple topics
   - Real-time search filtering
   - Visual badges showing selected topics (in indigo color)
   - Easy removal of selected items

4. **State Management**

   - `mappingType`: Tracks whether user is viewing particles or topics
   - `selectedParticles`: Array of selected particle IDs
   - `selectedTopics`: Array of selected topic IDs
   - `particleSearch`: Search term for filtering particles
   - `topicSearch`: Search term for filtering topics

5. **UI Features**
   - Scrollable lists with max-height constraint
   - Color-coded badges (purple for particles, indigo for topics)
   - Hover effects for better UX
   - Empty state messages when no items found
   - Quick remove buttons on selected badges

## Usage Guide for Teachers

### Adding a New Question with Concept Mapping

1. **Click "Add New" button** in the Question Bank section

2. **Fill in Question Details**

   - Enter the question text
   - Add 4 answer options
   - Select the correct answer
   - Set difficulty level

3. **Map to Concepts**
   - Choose between "Particles" or "Topics" tab
4. **If selecting Particles:**

   - Use the search box to find specific particles
   - Check the boxes next to particles you want to map
   - Multiple particles can be selected
   - Remove selections by clicking the × on badges

5. **If selecting Topics:**

   - Use the search box to find specific topics
   - Check the boxes next to topics you want to map
   - Multiple topics can be selected
   - Remove selections by clicking the × on badges

6. **Save the Question**
   - Click "Add Question" button
   - The question will be saved with all selected particles and topics

### Editing Existing Questions

1. **Hover over a question card** and click the edit icon
2. **Update any fields** as needed
3. **Modify concept mappings** in the "Map to Concepts" section
4. **Save changes** by clicking "Save Changes"

## API Response Structure

The `retrieveWholeSyllabuses()` API returns a nested structure like:

```json
{
  "syllabus": [
    {
      "conceptId": "...",
      "name": "Subject Name",
      "type": "Subject",
      "children": [
        {
          "conceptId": "...",
          "name": "Matter Name",
          "type": "Matter",
          "children": [
            {
              "conceptId": "...",
              "name": "Molecule Name",
              "type": "Molecule",
              "children": [
                {
                  "conceptId": "...",
                  "name": "Atom Name",
                  "type": "Atom",
                  "children": [
                    {
                      "conceptId": "...",
                      "name": "Particle Name",
                      "type": "Particle"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "conceptId": "...",
          "name": "Grade Level",
          "type": "Grade",
          "children": [
            {
              "conceptId": "...",
              "name": "Topic Name",
              "type": "Topic"
            }
          ]
        }
      ]
    }
  ]
}
```

## Technical Notes

### Recursive Tree Traversal

The `traverseNode` function recursively walks the entire syllabus tree to extract particles and topics regardless of their nesting level.

### Performance Considerations

- Data is fetched once on page load
- Search filtering is done client-side for instant results
- Component uses controlled inputs for optimal React rendering

### Flexibility

- Questions can be mapped to:
  - Only particles
  - Only topics
  - Both particles AND topics
  - No restrictions on quantity

### Data Structure in Questions

When a question is saved, it includes:

```typescript
{
  ...questionData,
  particles: ["conceptId1", "conceptId2", ...],
  topics: ["conceptId3", "conceptId4", ...]
}
```

## Future Enhancements

### Potential Improvements

1. **Hierarchical Display**: Show particles/topics in a tree structure
2. **Quick Filters**: Pre-defined filters for common mappings
3. **Bulk Operations**: Map multiple questions at once
4. **Analytics**: Show which concepts have the most/least questions
5. **Auto-suggestions**: AI-based suggestions for concept mappings based on question content

## Error Handling

- If API call fails, empty arrays are returned
- Search with no results shows "No [particles/topics] found" message
- Loading state is shown while fetching data
- Console errors logged for debugging

## Testing Checklist

- [x] Particles list loads correctly
- [x] Topics list loads correctly
- [x] Search functionality works for both
- [x] Multiple selections can be made
- [x] Selected items show as badges
- [x] Removal of selected items works
- [x] Question saves with particle/topic mappings
- [x] Edit mode preserves existing mappings
- [x] UI is responsive and user-friendly

## Related Files

- `/services/contentService.ts` - Core API and data functions
- `/components/TeacherDashboard/ContentManagement.tsx` - Main page component
- `/components/TeacherDashboard/QuestionBankManager.tsx` - Question management UI

## Support

For issues or questions, refer to the main documentation or contact the development team.
