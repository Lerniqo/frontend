# Availability Edit - Technical Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TEACHER DASHBOARD                                │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  TeacherDashboard.tsx  │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌───────────────────────┐  ┌──────────────────────┐
        │  Fetch Availability   │  │  Fetch All Sessions  │
        │  getAvailability()    │  │  getAllTeachers...() │
        └───────────────────────┘  └──────────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │ AvailabilityManager.tsx    │
                    │                            │
                    │  State:                    │
                    │  - tempAvailability[]      │
                    │  - isPaid: boolean         │
                    │  - price: number|null      │
                    │  - sessionDescription: str │
                    │  - formError: string|null  │
                    │  - saveError: string|null  │
                    └────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
         ┌──────────▼──────────┐  ┌──────────▼─────────┐
         │  User Actions       │  │ Validation Checks  │
         │  - Add Slot         │  │ - Date validation  │
         │  - Delete Slot      │  │ - Time validation  │
         │  - Edit Slot        │  │ - Price validation │
         │  - Toggle Status    │  │ - Conflict check   │
         │  - Save Changes     │  └────────────────────┘
         │  - Cancel           │
         └──────────┬──────────┘
                    │
                    ▼
        ┌──────────────────────────────┐
        │ CONFLICT DETECTION           │
        │                              │
        │ availabilityConflict         │
        │ Detector.ts                  │
        │                              │
        │ 1. detectAvailability        │
        │    Conflicts()               │
        │    - Check existing slots    │
        │                              │
        │ 2. detectSession             │
        │    Conflicts()               │
        │    - Check all sessions      │
        │                              │
        │ 3. detectAll                 │
        │    Conflicts()               │
        │    - Combined check          │
        └──────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
      NO CONFLICT         CONFLICT FOUND
         │                     │
         ▼                     ▼
    ┌────────┐          ┌──────────┐
    │ Add to │          │ Show     │
    │ temp   │          │ Error    │
    └────────┘          │ Message  │
         │              └──────────┘
         │                     │
         └─────────┬───────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Save Changes Click  │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────────────────┐
        │ updateAvailability()            │
        │ - Transform to API format       │
        │ - Convert dates to ISO string   │
        │ - Send PUT request              │
        └─────────────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │ API: PUT /scheduling-service/        │
    │          scheduling/availability     │
    │                                      │
    │ Request:                             │
    │ [{                                   │
    │   startTime: ISO string,             │
    │   endTime: ISO string,               │
    │   isPaid: boolean,                   │
    │   price: number|null,                │
    │   sessionDescription: string|null    │
    │ }]                                   │
    └──────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
      SUCCESS           ERROR
         │                   │
         ▼                   ▼
    ┌────────┐          ┌──────────┐
    │ Update │          │ Show     │
    │ State  │          │ Error    │
    │ Exit   │          │ Message  │
    │ Edit   │          └──────────┘
    └────────┘
```

## Data Flow Diagram

### Add Slot Flow

```
┌─────────────┐
│ User clicks │
│ "Add Slot"  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ Form displayed:             │
│ - Date input               │
│ - Start Time input         │
│ - End Time input           │
│ - Description textarea     │
│ - Paid checkbox           │
│ - Price input             │
└──────┬──────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ User fills form & clicks     │
│ "Add Slot"                  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────┐     ┌─────────────────┐
│ Frontend Validation      │     │ Error?          │
│ ✓ Required fields       │────▶│ Show message &  │
│ ✓ Future date           │     │ Stop            │
│ ✓ Valid time range      │     └─────────────────┘
│ ✓ Valid price if paid   │
└──────┬───────────────────┘
       │ OK
       ▼
┌──────────────────────────────────┐
│ Create new AvailabilitySlot      │
│ {                                │
│   id, date, day,                 │
│   startTime, endTime,            │
│   isAvailable: true,             │
│   isPaid, price,                 │
│   sessionDescription             │
│ }                                │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐    ┌──────────────┐
│ Conflict Detection              │    │ Conflict?   │
│                                 │───▶│ Show message│
│ 1. Check vs existing slots      │    │ & Stop      │
│ 2. Check vs sessions            │    └──────────────┘
└──────┬──────────────────────────┘
       │ No conflict
       ▼
┌──────────────────────────────┐
│ Add to tempAvailability[]    │
│ Clear form                   │
│ Show success visual (added)  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ User can:                │
│ - Add more slots        │
│ - Delete slots          │
│ - Click "Save Changes"  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ "Save Changes" clicked           │
│ transformSlotsToApiFormat()      │
│ updateAvailability()            │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ API Request to Backend      │
│ PUT endpoint                │
│ with transformed data       │
└──────┬──────────────────────┘
       │
    ┌──┴──┐
    │     │
   YES   NO
    │     │
    ▼     ▼
SUCCESS  ERROR
    │     │
    ▼     ▼
  Exit    Show
  Edit    Error
  Mode    Message
```

## State Management

### AvailabilityManager State Variables

```typescript
// Availability data
tempAvailability: AvailabilitySlot[]  // Working copy during edit

// Form fields
selectedDate: string                  // YYYY-MM-DD
startTime: string                     // HH:mm
endTime: string                       // HH:mm
isPaid: boolean                       // true/false
price: number | null                  // USD amount
sessionDescription: string            // User description

// UI state
isEditing: boolean                    // Edit mode toggle
showAddForm: boolean                  // Add slot form toggle
saveLoading: boolean                  // Save in progress
formError: string | null              // Add form error
saveError: string | null              // Save error
```

## Component Props Flow

```
TeacherDashboard
    ↓
    ├─ availability: AvailabilitySlot[]
    ├─ setAvailability: (slots) => void
    └─ sessions: TeacherSession[]
                ↓
        AvailabilityManager
            ├─ Uses availability for display
            ├─ Uses sessions for conflict detection
            └─ Calls setAvailability to update parent
```

## API Integration Points

### 1. Fetch Data

```
TeacherDashboard.tsx
    │
    ├─ getAvailability()
    │  └─ GET /scheduling-service/scheduling/teachers/{id}/availability
    │     └─ Response: AvailabilitySlot[]
    │
    └─ getAllTeachersSessions()
       └─ GET /scheduling-service/scheduling/me/sessions
          └─ Response: TeacherSession[]
```

### 2. Update Data

```
AvailabilityManager.tsx
    │
    └─ handleSave()
       └─ updateAvailability(slots)
          └─ PUT /scheduling-service/scheduling/availability
             Request: AvailabilityUpdateRequest[]
             Response: { success: boolean, message: string }
```

## Conflict Detection Algorithm

```
detectAllConflicts(newSlot, existingSlots, sessions)
    │
    ├─ Step 1: Parse newSlot to TimeRange
    │  └─ Extract: startTime (Date), endTime (Date)
    │
    ├─ Step 2: Check Availability Conflicts
    │  │
    │  ├─ For each existingSlot:
    │  │  └─ Parse to TimeRange
    │  │  └─ If ranges overlap:
    │  │     └─ RETURN: conflict found
    │  │
    │  └─ No conflicts found
    │
    ├─ Step 3: Check Session Conflicts
    │  │
    │  ├─ Filter: Only SCHEDULED or COMPLETED sessions
    │  │
    │  ├─ For each session:
    │  │  └─ Compare timeranges
    │  │  └─ If overlap:
    │  │     └─ RETURN: conflict found + session details
    │  │
    │  └─ No conflicts found
    │
    └─ RETURN: No conflicts

Time Range Overlap Detection:
    range1.startTime < range2.endTime
    AND
    range1.endTime > range2.startTime
    = OVERLAP ✓
```

## Error Handling Flow

```
┌─────────────────────────────────┐
│ Error Occurs                    │
└────────┬────────────────────────┘
         │
         ├─ Frontend Validation Error
         │  └─ formError state updated
         │  └─ Message shown in form
         │  └─ Add Slot button blocked
         │
         ├─ Conflict Detection Error
         │  └─ formError state updated
         │  └─ Message shows which slot/session conflicts
         │  └─ Add Slot blocked
         │
         └─ API Error
            └─ Try/catch in handleSave()
            └─ saveError state updated
            └─ Error message displayed
            └─ User can retry or cancel
```

## Type Safety

```typescript
// Interfaces used

export interface AvailabilitySlot {
  id: string;
  date: string; // YYYY-MM-DD
  day: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
  isPaid?: boolean; // Optional
  price?: number | null; // Optional
  sessionDescription?: string | null; // Optional
}

export interface AvailabilityUpdateRequest {
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  isPaid: boolean;
  price: number | null;
  sessionDescription: string | null;
}

export interface TeacherSession {
  session_id: string;
  session_type: "ONE_ON_ONE" | "GROUP";
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  title: string;
  // ... other fields
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

## Performance Characteristics

| Operation                     | Complexity | Notes                       |
| ----------------------------- | ---------- | --------------------------- |
| Detect availability conflicts | O(n)       | n = existing slots (~10-50) |
| Detect session conflicts      | O(m)       | m = sessions (~5-30)        |
| Transform slots to API format | O(n)       | n = slots being saved       |
| Total conflict check          | O(n+m)     | Fast for typical schedules  |
| API call                      | 1 request  | Single PUT for all slots    |

## Responsive Design

```
Mobile (< 640px)
    │
    ├─ Form: 1 column
    ├─ Date/Time fields stack vertically
    └─ Cards: 1 column grid

Tablet (640px - 1024px)
    │
    ├─ Form: 2 columns on larger tablets
    └─ Cards: 2 column grid

Desktop (> 1024px)
    │
    ├─ Form: 3 columns (Date, Start, End on one row)
    ├─ Description below
    ├─ Price section below
    └─ Cards: 3 column grid
```

---

This architecture ensures:
✅ Type safety throughout
✅ No conflicts with existing/booked sessions
✅ Clear user feedback
✅ Proper error handling
✅ Efficient data operations
✅ Responsive design
