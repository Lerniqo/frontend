# Concept View Visual Flow

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CONCEPT VIEW PAGE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                         [Back Button] │
│  Concept Name (Formatted)                                            │
│  Description                                                         │
│  [Type Badge]                                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────┐  ┌──────────────────────┐                   │
│  │ Prerequisites     │  │ Learning Resources   │  ← SubMenu Toggle  │
│  └───────────────────┘  └──────────────────────┘                   │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VIEW MODE: PREREQUISITES                                           │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │ Prerequisite 1           │  │ Prerequisite 2           │        │
│  │ • Name (formatted)       │  │ • Name (formatted)       │        │
│  │ • Description            │  │ • Description            │        │
│  │ • Type Badge             │  │ • Type Badge             │        │
│  │ [Click → Navigate]       │  │ [Click → Navigate]       │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                      │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │ Prerequisite 3           │  │ Prerequisite 4           │        │
│  │ • Name (formatted)       │  │ • Name (formatted)       │        │
│  │ • Description            │  │ • Description            │        │
│  │ • Type Badge             │  │ • Type Badge             │        │
│  │ [Click → Navigate]       │  │ [Click → Navigate]       │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                      │
│  [Scrollable if many items - 2 column grid layout]                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

OR

┌─────────────────────────────────────────────────────────────────────┐
│                         CONCEPT VIEW PAGE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                         [Back Button] │
│  Concept Name (Formatted)                                            │
│  Description                                                         │
│  [Type Badge]                                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────┐  ┌──────────────────────┐                   │
│  │ Prerequisites     │  │ Learning Resources   │  ← SubMenu Toggle  │
│  └───────────────────┘  └──────────────────────┘                   │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VIEW MODE: LEARNING RESOURCES                                      │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │ Resource 1               │  │ Resource 2               │        │
│  │ • Name                   │  │ • Name                   │        │
│  │ • Type Badge             │  │ • Type Badge             │        │
│  │ • Price/Free             │  │ • Price/Free             │        │
│  │ [Click → Resource View]  │  │ [Click → Resource View]  │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                      │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │ Resource 3               │  │ Resource 4               │        │
│  │ • Name                   │  │ • Name                   │        │
│  │ • Type Badge             │  │ • Type Badge             │        │
│  │ • Price/Free             │  │ • Price/Free             │        │
│  │ [Click → Resource View]  │  │ [Click → Resource View]  │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                      │
│  [Scrollable if many items - 2 column grid layout]                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Name Formatting Examples

### Input → Output

```
"area (PAR044)"                    → "Area"
"area-concept (PAR045)"            → "Area Concept"
"multiplication-of-fractions"      → "Multiplication Of Fractions"
"pythagorean-theorem"              → "Pythagorean Theorem"
"sum-of-interior-angles-triangle"  → "Sum Of Interior Angles Triangle"
```

## Navigation Flow Diagram

```
┌─────────────────────┐
│  Resource Library   │
│  Page               │
└──────────┬──────────┘
           │ Click Particle/Topic
           │
           ↓
┌─────────────────────┐
│  Concept View       │◄──────┐
│  Page               │       │
└──────────┬──────────┘       │
           │                  │
           ├──────────────────┤
           │ Click            │ Click
           │ Prerequisite     │ Another
           │                  │ Prerequisite
           │                  │
           └──────────────────┘
           │ Click
           │ Learning Resource
           │
           ↓
┌─────────────────────┐
│  Resource View      │
│  Page (Preview)     │
└─────────────────────┘
```

## Data Flow

```
┌────────────┐
│   User     │
└──────┬─────┘
       │ Clicks concept with conceptId
       ↓
┌──────────────────────────────┐
│   Concept View Page          │
│   - Gets conceptId from URL  │
└──────┬───────────────────────┘
       │ useEffect triggers
       ↓
┌──────────────────────────────┐
│   getConceptByConceptId()    │
│   - Calls API                │
└──────┬───────────────────────┘
       │ API Response
       ↓
┌──────────────────────────────┐
│   Backend API                │
│   GET /content-service/      │
│       concepts/:conceptId    │
└──────┬───────────────────────┘
       │ Returns JSON
       ↓
┌──────────────────────────────┐
│   Format & Display           │
│   - Format names             │
│   - Render prerequisites     │
│   - Render resources         │
└──────────────────────────────┘
```

## Color Scheme

### Main Theme

- **Primary**: Purple (#9333ea, #a855f7)
- **Secondary**: Blue (#3b82f6, #2563eb)
- **Accent**: Violet (#7c3aed, #8b5cf6)
- **Background**: White with gradient overlay
- **Text**: Gray (#374151, #6b7280)

### Component Colors

- **Prerequisites Cards**: Blue gradient (from-blue-50 to-blue-100)
- **Resources Cards**: Purple gradient (from-purple-50 to-purple-100)
- **Borders**: Purple-200 (#e9d5ff)
- **Hover States**: Darker gradients with shadow effects

## Responsive Behavior

### Desktop (≥768px)

- Two-column grid layout for items
- Each item takes approximately 50% width
- Full viewport height with scroll
- SubMenu displayed horizontally

### Tablet (640px - 767px)

- Two-column grid maintained
- Slightly adjusted padding
- Font sizes remain consistent

### Mobile (<640px)

- Single column layout (stacked)
- Items take full width
- SubMenu remains horizontal
- Better readability and touch targets

## Animation Effects

### Page Load

1. Fade in with blur effect
2. Animated background blobs moving slowly
3. Cards slide up with stagger effect

### View Mode Switch

1. Smooth 700ms transition between views
2. Fade out old content
3. Fade in new content
4. SubMenu underline animation

### Hover States

1. Scale up slightly (1.02x)
2. Shadow increases
3. Color gradient shifts
4. Smooth 300ms transition

### Click Interactions

1. Scale down briefly (0.98x)
2. Ripple effect from click point
3. Navigation transition fade

## SubMenu Component

### Features

- Tab-based navigation
- Active state indication with bottom border
- Smooth transitions between tabs
- Purple accent color for active tab
- Gray color for inactive tabs with hover effect

### Items Configuration

```typescript
[
  {
    id: "prerequisites",
    label: "Prerequisites",
    icon: "📚",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "resources",
    label: "Learning Resources",
    icon: "📄",
    color: "from-purple-600 to-purple-700",
  },
];
```

## Loading States

```
┌─────────────────────────────────┐
│                                 │
│    ⟳  Loading Concept Details  │
│                                 │
└─────────────────────────────────┘
```

## Error States

```
┌─────────────────────────────────┐
│  ❌ Error Loading Concept       │
│                                 │
│  [Error Message]                │
│                                 │
│  [Back to Learning Resources]   │
└─────────────────────────────────┘
```

## Empty States

### No Prerequisites

```
┌─────────────────────────────────┐
│                                 │
│  No prerequisites for this      │
│  concept                        │
│                                 │
└─────────────────────────────────┘
```

### No Resources

```
┌─────────────────────────────────┐
│                                 │
│  No learning resources          │
│  available                      │
│                                 │
└─────────────────────────────────┘
```
