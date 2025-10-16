# Availability Edit Implementation Guide

## Overview

This document describes the implementation of the availability editing functionality for teachers. The system allows teachers to add, delete, and manage their availability slots with support for paid sessions and conflict detection.

## Files Modified/Created

### 1. **services/teacherDashboardService.ts**

**Changes:**

- Updated `AvailabilitySlot` interface to include optional fields for paid sessions:

  ```typescript
  export interface AvailabilitySlot {
    id: string;
    date: string;
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    isPaid?: boolean; // New
    price?: number | null; // New
    sessionDescription?: string | null; // New
  }
  ```

- Created `AvailabilityUpdateRequest` interface for API communication:

  ```typescript
  export interface AvailabilityUpdateRequest {
    startTime: string; // ISO datetime string
    endTime: string; // ISO datetime string
    isPaid: boolean;
    price: number | null;
    sessionDescription: string | null;
  }
  ```

- Implemented `transformSlotsToApiFormat()` function:

  - Converts frontend slot format (date + time strings) to ISO datetime strings
  - Prepares data in the exact format required by the backend

- Completely implemented `updateAvailability()` function:
  - Calls `/scheduling-service/scheduling/availability` API endpoint (PUT request)
  - Sends all availability slots in the new format
  - Backend will delete all existing slots and save the new ones
  - Returns proper ApiResponse with success/error handling

### 2. **components/TeacherDashboard/AvailabilityManager.tsx**

**Changes:**

- Added new state variables:

  ```typescript
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [sessionDescription, setSessionDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  ```

- Added `sessions` prop to component:

  ```typescript
  interface AvailabilityManagerProps {
    availability: AvailabilitySlot[];
    setAvailability: (slots: AvailabilitySlot[]) => void;
    sessions?: TeacherSession[]; // New
  }
  ```

- Enhanced `handleAddSlot()` function:

  - Validates price for paid sessions
  - Calls `detectAllConflicts()` to check for overlaps
  - Shows error messages for conflicting slots
  - Prevents slot creation if conflicts exist

- Improved `handleSave()` function:

  - Added loading state during save
  - Shows error messages if save fails
  - Handles API responses properly

- Updated form with new fields:

  - **Session Description** textarea field
  - **Paid Session** checkbox
  - **Price per Session** input field (conditionally shown when paid is selected)
  - Error message display for form validation
  - Save/loading state indicators

- Updated slot display to show:
  - Session description in a blue info box
  - Price with currency symbol for paid sessions
  - Visual indicator for paid vs. free sessions

### 3. **components/TeacherDashboard/TeacherDashboard.tsx**

**Changes:**

- Added import for `getAllTeachersSessions` and `TeacherSession` type
- Added `sessions` state variable:

  ```typescript
  const [sessions, setSessions] = useState<TeacherSession[]>([]);
  ```

- Updated `useEffect` to fetch sessions:

  ```typescript
  const sessionsRes = await getAllTeachersSessions();
  if (sessionsRes.success) setSessions(sessionsRes.data || []);
  ```

- Passed `sessions` prop to AvailabilityManager components in both overview and schedule sections

### 4. **utils/availabilityConflictDetector.ts** (NEW FILE)

**Purpose:** Utility functions to detect conflicts between availability slots and sessions

**Key Functions:**

1. **`detectAvailabilityConflicts()`**

   - Checks if a new slot overlaps with existing availability slots
   - Returns conflict status and message

2. **`detectSessionConflicts()`**

   - Checks if a new slot overlaps with any scheduled or completed sessions
   - Distinguishes between 1-on-1 and group sessions in error messages
   - Only checks scheduled/completed sessions (ignores cancelled ones)

3. **`detectAllConflicts()`**
   - Comprehensive check combining both availability and session conflicts
   - Returns first encountered conflict (availability first, then sessions)
   - Provides clear, user-friendly error messages

**Helper Functions:**

- `parseSlotToTimeRange()` - Converts slot date/time to Date objects
- `doTimeRangesOverlap()` - Checks if two time ranges overlap

## Data Flow

### Adding a New Availability Slot:

```
User clicks "Add Slot"
    ↓
Form displayed with fields
    ↓
User fills: Date, Start Time, End Time, Description (optional),
            Is Paid (optional), Price (if paid)
    ↓
User clicks "Add Slot"
    ↓
Frontend validation:
- Check all required fields filled
- Check future date
- Check end time > start time
- Check price for paid sessions
    ↓
Conflict detection:
- detectAvailabilityConflicts() with existing slots
- detectSessionConflicts() with all sessions
    ↓
If conflict → Show error message, prevent addition
If no conflict → Add to tempAvailability state
    ↓
User clicks "Save Changes"
    ↓
updateAvailability() sends to API
    ↓
Backend processes (delete all, insert new)
    ↓
Success → Update local state, exit edit mode
Failure → Show error message
```

## API Integration

### Endpoint: PUT `/scheduling-service/scheduling/availability`

**Request Format:**

```typescript
[
  {
    startTime: "2025-10-20T10:00:00.000Z",
    endTime: "2025-10-20T11:00:00.000Z",
    isPaid: true,
    price: 50.0,
    sessionDescription: "Advanced Math Tutoring",
  },
  {
    startTime: "2025-10-21T14:00:00.000Z",
    endTime: "2025-10-21T15:00:00.000Z",
    isPaid: false,
    price: null,
    sessionDescription: "Free consultation",
  },
];
```

**Response Format:**

```typescript
{
  success: true,
  message: "Availability updated successfully",
  data: true
}
```

## Validation & Constraints

### Frontend Validations:

1. **Date Validation:**

   - Must be a future date (cannot set availability in the past)
   - Minimum date is today

2. **Time Validation:**

   - Start time must be before end time
   - Times are in HH:mm format

3. **Price Validation:**

   - Required if "Is Paid" is checked
   - Must be a positive number
   - Accepts decimal values (e.g., 50.99)

4. **Conflict Detection:**
   - **Cannot add** if overlaps with existing availability slots
   - **Cannot add** if overlaps with scheduled/completed sessions
   - **Cannot add** if overlaps with group sessions
   - **Cannot add** if overlaps with 1-on-1 sessions

### Error Messages:

- "Please fill in all required fields"
- "Please select a future date"
- "End time must be after start time"
- "Please enter a valid price for paid sessions"
- "This slot overlaps with existing availability on [day] from [time] to [time]"
- "This slot overlaps with your [type] session '[title]' scheduled from [time] to [time]"

## User Interface Features

### Availability Manager Component:

1. **View Mode:**

   - Displays all availability slots in a card grid
   - Shows session description (if provided)
   - Shows price with $ symbol for paid sessions
   - Color-coded availability status (green for available, red for unavailable)

2. **Edit Mode:**

   - "Add New Availability Slot" button
   - Form with collapsible add slot section
   - Ability to toggle availability status per slot
   - Delete button for each slot
   - Save Changes and Cancel buttons

3. **Form Fields:**

   - Date picker (min date = today)
   - Start Time picker (HH:mm)
   - End Time picker (HH:mm)
   - Session Description textarea
   - Is Paid checkbox
   - Price input (only shown when paid is checked)

4. **Feedback:**
   - Form validation errors displayed inline
   - Save loading indicator with spinner
   - Save errors displayed prominently
   - Success feedback (user is returned to view mode)

## Backend Expectations

The backend's handling of availability updates:

1. Receives PUT request with array of new availability slots
2. Deletes ALL existing availability slots for the teacher
3. Inserts all new slots from the request
4. Returns success/error response

This approach ensures:

- No orphaned slots
- Clean state management
- Easy rollback (just send empty array to clear all)
- No partial update issues

## Type Safety

All functions are fully typed:

- `AvailabilitySlot` - Frontend slot representation
- `AvailabilityUpdateRequest` - API request format
- `TeacherSession` - Session data structure
- `ApiResponse<T>` - Standard API response wrapper

## Error Handling

1. **Validation Errors:**

   - Form field validation on client side
   - Error messages displayed to user
   - Save button remains disabled until form is valid

2. **API Errors:**

   - Network errors caught and displayed
   - Backend error messages forwarded to user
   - Retry available (cancel and try again)

3. **Conflict Errors:**
   - Detected before API call
   - Clear, actionable error messages
   - User can modify time and retry

## Performance Considerations

1. **Conflict Detection:**

   - O(n\*m) complexity where n = existing slots, m = sessions
   - Efficient for typical teacher schedule (usually < 50 sessions)
   - Only runs on form submission, not on every keystroke

2. **API Calls:**

   - Single PUT request to save all slots (not individual creates)
   - Reduces network overhead
   - Atomic operation on backend

3. **State Management:**
   - Temp availability used during editing
   - Prevents concurrent edit conflicts
   - Rollback on cancel is instant

## Testing Checklist

- [ ] Can add new availability slot without conflicts
- [ ] Cannot add slot that overlaps with existing availability
- [ ] Cannot add slot that overlaps with group session
- [ ] Cannot add slot that overlaps with 1-on-1 session
- [ ] Can mark slot as paid with price
- [ ] Can add free slot without price
- [ ] Can add session description
- [ ] Can delete slots
- [ ] Can toggle availability status
- [ ] Save button is disabled during loading
- [ ] Error messages display correctly
- [ ] Cancel reverts all changes
- [ ] Price field only shows when "Is Paid" is checked
- [ ] Slots display with prices and descriptions
- [ ] Edit mode and view mode toggle correctly
- [ ] Multiple slots can be saved together
- [ ] Backend receives correct ISO datetime format

## Future Enhancements

1. **Bulk Operations:**

   - Copy availability pattern from one week to another
   - Add recurring availability slots

2. **Calendar View:**

   - Calendar interface instead of form
   - Visual conflict indication

3. **Student Bookings:**

   - Show which slots have pending bookings
   - Handle cancellations

4. **Notifications:**
   - Alert when availability is modified
   - Reminder before scheduled sessions
