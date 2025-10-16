# Resource Library - Visual Flow Diagram

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Resource Library                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Header Section                          │  │
│  │  • Title: "Learning Resources"                            │  │
│  │  • Description                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Search Bar                              │  │
│  │  🔍 [Search for concepts, topics, or materials...]        │  │
│  │     └─> Dropdown Results (when typing)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    View Mode Tabs                          │  │
│  │  [ By Matter ]  [ By Grade ]                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────┬─────────────────────────────────────────────┐  │
│  │  Sidebar    │         Main Content Area                   │  │
│  │  (Sections) │                                             │  │
│  │             │                                             │  │
│  │ ┌─────────┐ │  Content varies based on view mode          │  │
│  │ │Section 1│ │  and selection state                        │  │
│  │ ├─────────┤ │                                             │  │
│  │ │Section 2│ │                                             │  │
│  │ ├─────────┤ │                                             │  │
│  │ │Section 3│ │                                             │  │
│  │ └─────────┘ │                                             │  │
│  └─────────────┴─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## By Matter View - State Flow

```
State: Initial
├─ selectedMatter: "First Matter ID"
├─ selectedMolecule: ""
└─ selectedAtom: ""

┌──────────────────────────────────────────────────────────┐
│ Main Content: Shows Molecules List                       │
│                                                           │
│ ▶ Molecule 1 (MOL001)                                    │
│   Description...                                         │
│                                                           │
│ ▶ Molecule 2 (MOL002)                                    │
│   Description...                                         │
└──────────────────────────────────────────────────────────┘
      │
      │ User clicks Molecule 1
      ▼
State: Molecule Expanded
├─ selectedMatter: "First Matter ID"
├─ selectedMolecule: "MOL001"
└─ selectedAtom: ""

┌──────────────────────────────────────────────────────────┐
│ Main Content: Shows Molecules List with Expanded View    │
│                                                           │
│ ▼ Molecule 1 (MOL001)                                    │
│   Description...                                         │
│   ┌────────────────────────────────────────────────────┐ │
│   │  • Atom 1 (ATM001)                                 │ │
│   │    Description...                                  │ │
│   │                                                    │ │
│   │  • Atom 2 (ATM002)                                 │ │
│   │    Description...                                  │ │
│   └────────────────────────────────────────────────────┘ │
│                                                           │
│ ▶ Molecule 2 (MOL002)                                    │
└──────────────────────────────────────────────────────────┘
      │
      │ User clicks Atom 1
      ▼
State: Atom Selected
├─ selectedMatter: "First Matter ID"
├─ selectedMolecule: "MOL001"
└─ selectedAtom: "ATM001"

┌──────────────────────────────────────────────────────────┐
│ Main Content: Shows Atom Details & Particles             │
│                                                           │
│ [← Back to Molecules]                                    │
│                                                           │
│ 🔹 Atom 1 (ATM001)                                       │
│    Description...                                        │
│                                                           │
│ Particles:                                               │
│ ┌────────────────────────────────────────────────────┐   │
│ │ → Particle 1 (PAR001)                              │   │
│ │   Description...                              [→]  │   │
│ └────────────────────────────────────────────────────┘   │
│ ┌────────────────────────────────────────────────────┐   │
│ │ → Particle 2 (PAR002)                              │   │
│ │   Description...                              [→]  │   │
│ └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
      │
      │ User clicks Particle 1
      ▼
Navigate to: /dashboard/@student/concept-view?conceptId=PAR001
```

## By Grade View - State Flow

```
State: Initial
├─ selectedGrade: "First Grade ID"
└─ selectedTopic: ""

┌──────────────────────────────────────────────────────────┐
│ Main Content: Shows Topics Grid                          │
│                                                           │
│ ┌────────────────┐  ┌────────────────┐                  │
│ │  Topic 1       │  │  Topic 2       │                  │
│ │  Description   │  │  Description   │                  │
│ │          [→]   │  │          [→]   │                  │
│ └────────────────┘  └────────────────┘                  │
│                                                           │
│ ┌────────────────┐  ┌────────────────┐                  │
│ │  Topic 3       │  │  Topic 4       │                  │
│ │  Description   │  │  Description   │                  │
│ │          [→]   │  │          [→]   │                  │
│ └────────────────┘  └────────────────┘                  │
└──────────────────────────────────────────────────────────┘
      │
      │ User clicks any Topic
      ▼
Navigate to: /dashboard/@student/concept-view?conceptId=TOPIC_ID
```

## Search Flow

```
User types: "slope"
      │
      ▼
┌──────────────────────────────────────────────────────────┐
│ Search Results Dropdown                                   │
├───────────────────────────────────────────────────────────┤
│ 📄 slope (PAR072)                                [Particle]│
│    Numbers > Algebra > Graphs > Slope of Lines           │
├───────────────────────────────────────────────────────────┤
│ 📄 application: find slope in graph (PAR073)     [Particle]│
│    Numbers > Algebra > Graphs > Slope of Lines           │
└──────────────────────────────────────────────────────────┘
      │
      │ User clicks "slope (PAR072)"
      ▼
Action: Navigate to concept-view
URL: /dashboard/@student/concept-view?conceptId=PAR072

─────────────────────────────────────────────────────────────

User types: "Linear Equations"
      │
      ▼
┌──────────────────────────────────────────────────────────┐
│ Search Results Dropdown                                   │
├───────────────────────────────────────────────────────────┤
│ 📄 Linear Equations (MOL015)                   [Molecule] │
│    Algebra > Linear Equations                             │
└──────────────────────────────────────────────────────────┘
      │
      │ User clicks result
      ▼
Action: Set State
├─ selectedMatter: "Algebra"
├─ selectedMolecule: "MOL015"
└─ selectedAtom: ""

Result: User stays on page, Molecule auto-selected
```

## Concept View Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Concept View Page                         │
│  URL: /dashboard/@student/concept-view?conceptId=PAR072     │
├─────────────────────────────────────────────────────────────┤
│  Header:                                                     │
│  • Title: "Concept View"                                    │
│  • Description: "Detailed view of the selected concept"     │
├─────────────────────────────────────────────────────────────┤
│  Content Card:                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🔹 Concept Details                                    │  │
│  │                                                       │  │
│  │ ┌─────────────────────────────────────────────────┐  │  │
│  │ │ Concept ID                                      │  │  │
│  │ │ PAR072                                          │  │  │
│  │ └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │ ┌─────────────────────────────────────────────────┐  │  │
│  │ │ 📚 Content Coming Soon                          │  │  │
│  │ │ • Concept information                           │  │  │
│  │ │ • Learning materials                            │  │  │
│  │ │ • Video explanations                            │  │  │
│  │ │ • Practice exercises                            │  │  │
│  │ └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │ ✅ Successfully Loaded                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Color Coding Legend

```
┌─────────────────────────────────────────────────────────┐
│ Color States                                             │
├─────────────────────────────────────────────────────────┤
│ 🟣 Purple Gradient    → Active/Selected Section         │
│ 🔵 Blue Gradient      → Expandable Items (Molecules)    │
│ 🟪 Light Purple       → Clickable Items (Particles)     │
│ ⚪ White Background   → Main Content Area               │
│ ⬜ Gray Background    → Inactive Sections               │
│ 🟢 Green Accent       → Success Messages                │
│ 🔴 Red Accent         → Error Messages                  │
└─────────────────────────────────────────────────────────┘
```

## Interaction Patterns

```
Sidebar Sections:
┌──────────────┐
│  Section 1   │ ← Inactive: Gray bg, dark text
├──────────────┤
│  Section 2   │ ← Active: Purple gradient, white text
├──────────────┤
│  Section 3   │ ← Inactive: Gray bg, dark text
└──────────────┘

Expandable Items (Molecules):
▶ Collapsed    → Click to expand
▼ Expanded     → Click to collapse

Clickable Items:
[ Item Name ]
Description...  [→]
     ↑              ↑
   Hover       Navigate Icon
```

## Key Features Visual Map

```
                    Resource Library
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
   🔍 Search                          📑 View Modes
        │                                   │
        ├─── Real-time results        ┌────┴────┐
        ├─── Smart navigation         │         │
        └─── Full path display    By Matter  By Grade
                                       │         │
                              ┌────────┴──┐      │
                              │           │      │
                         Hierarchical  Direct Topic
                         Navigation    Navigation
                              │           │
                    ┌─────────┴────┐      │
                    │              │      │
              Expand/Collapse  Navigate to
              Molecules/Atoms  Concept View
```

## User Journey Map

```
Entry Point: Resource Library
    │
    ├─── Option 1: Browse by Matter
    │    └─→ Select Matter → Browse Molecules → Expand Atom → View Particles
    │                                                               │
    │                                                          Click Particle
    │                                                               │
    │                                                               ▼
    │                                                        Concept View
    │
    ├─── Option 2: Browse by Grade
    │    └─→ Select Grade → Browse Topics → Click Topic
    │                                              │
    │                                              ▼
    │                                       Concept View
    │
    └─── Option 3: Search
         └─→ Type Query → View Results → Click Result
                                              │
                                              ├─→ If Particle/Topic → Concept View
                                              └─→ If Atom/Molecule → Auto-select in hierarchy
```

## Responsive Behavior

```
Desktop (> 768px):
┌─────────┬──────────────────────┐
│ Sidebar │   Main Content       │
│  256px  │     flex-1           │
└─────────┴──────────────────────┘

Mobile (< 768px):
┌──────────────────────────────┐
│       Sidebar (Full)         │
├──────────────────────────────┤
│    Main Content (Full)       │
└──────────────────────────────┘
```
