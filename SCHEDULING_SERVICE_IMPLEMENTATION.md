# Scheduling Service Implementation

## Overview

This document describes the implementation of the teacher scheduling service and its integration with the TeacherBookingModal component.

## Files Created/Modified

### 1. **services/schedulingService.ts** (New File)

Created a new service file for handling teacher availability scheduling.

**Key Features:**

- `TeacherAvailability` interface defining the structure of availability data
- `mockAvailabilities` array containing sample teacher availability data
- `getTeacherAvailability()` function that fetches teacher availability (currently returns mock data)

**Mock Data Structure:**

```typescript
{
  availability_id: string;
  teacher_id: string;
  start_time: Date;
  end_time: Date;
  is_booked: boolean;
  is_paid: boolean;
  price_per_session: number | null;
  session_description: string;
  created_at: Date;
  updated_at: Date;
}
```

**Sample Data Includes:**

- Free introductory sessions (no price)
- Paid tutoring sessions with various price points ($50, $75, $100)
- Mix of booked and available slots
- Different session types (Q&A, exam prep, advanced tutoring, etc.)
- Time slots spanning multiple days (Oct 16-20, 2025)

### 2. **types/auth.types.ts** (Modified)

Updated the `TimeSlot` interface to include additional fields:

```typescript
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price?: number | null; // NEW: Optional price per session
  description?: string; // NEW: Optional session description
  isPaid?: boolean; // NEW: Whether it's a paid session
}
```

### 3. **components/TeacherProfile/TeacherBookingModal.tsx** (Modified)

Enhanced the booking modal to fetch and display real availability data.

**Key Changes:**

#### State Management

- Added `loading` state for data fetching
- Added `availabilities` state to store fetched data
- Updated `teacherId` usage (no longer ignored)

#### Data Fetching

- Added `useEffect` hook to fetch teacher availability when modal opens
- Converts API data format to calendar format using `convertAvailabilityToSchedule()`
- Handles loading and error states

#### UI Enhancements

- **Loading State**: Displays a spinner with "Loading availability..." message
- **Error Display**: Shows error messages in a styled alert box
- **Price Display**:
  - Shows price for paid sessions (e.g., "$75.00")
  - Shows "Free" badge for free sessions
- **Description Tooltip**:
  - Adds info icon for slots with descriptions
  - Full description appears on hover (title attribute)
- **Enhanced Footer**:
  - Displays session description when a slot is selected
  - Shows price information or "Free Session" badge

#### Visual Features

- Free sessions display "Free" badge in green
- Paid sessions show formatted price
- Info icon indicates slots with descriptions
- Color-coded slots (green for available, gray for booked)

## Data Flow

1. **Modal Opens** → `useEffect` triggers
2. **Fetch Data** → `getTeacherAvailability(teacherId)` called
3. **Loading State** → Spinner displayed
4. **Data Received** → `availabilities` state updated
5. **Convert Format** → `convertAvailabilityToSchedule()` transforms data
6. **Render Calendar** → Schedule displayed with availability indicators
7. **User Interaction** → Click date → Show time slots with prices
8. **Selection** → Click time slot → Show details in footer
9. **Confirmation** → User confirms → `onSlotSelect()` callback fired

## Helper Functions

### `convertAvailabilityToSchedule()`

Transforms API availability data into calendar-compatible format:

- Groups availability by date
- Formats times (24hr → 12hr with AM/PM)
- Maps availability status (is_booked → isAvailable)
- Includes price, description, and paid status
- Generates full calendar grid with empty slots for days without availability

### Time Formatting

```typescript
formatTime(date: Date): string
// Input: Date object
// Output: "09:00 AM" or "02:30 PM"
```

## API Integration (Future)

The service is ready for API integration. To connect to a real API:

1. Update `getTeacherAvailability()` in `schedulingService.ts`:

```typescript
export async function getTeacherAvailability(
  teacherId: string
): Promise<TeacherAvailability[]> {
  const response = await fetch(`/api/teachers/${teacherId}/availability`);

  if (!response.ok) {
    throw new Error("Failed to fetch teacher availability");
  }

  const data = await response.json();
  return data;
}
```

2. Expected API Response Format:

```json
[
  {
    "availability_id": "uuid",
    "teacher_id": "uuid",
    "start_time": "2025-10-16T09:00:00Z",
    "end_time": "2025-10-16T11:00:00Z",
    "is_booked": false,
    "is_paid": false,
    "price_per_session": null,
    "session_description": "Session description",
    "created_at": "2025-10-15T12:00:00Z",
    "updated_at": "2025-10-15T12:00:00Z"
  }
]
```

## Testing Scenarios

### Mock Data Scenarios Covered

1. **Free Sessions**: availability_id ending in 0000 and 0003
2. **Paid Sessions**: availability_id ending in 0001, 0002, 0004
3. **Booked Slots**: availability_id ending in 0001 and 0004 (show as unavailable)
4. **Available Slots**: availability_id ending in 0000, 0002, 0003 (show as available)
5. **Different Prices**: $50, $75, $100
6. **Various Durations**: 2-3 hour sessions

### User Experience Flow

1. Open modal → See loading spinner
2. Data loads → Calendar appears with dates highlighted
3. Click date with availability → See time slots
4. Hover over slot with info icon → See description
5. See price/free badge on each slot
6. Click available slot → Slot highlights, details show in footer
7. Try to click booked slot → Shows error message
8. Confirm selection → Booking proceeds

## Benefits

1. **Real Data**: Fetches actual teacher availability from service
2. **Better UX**: Loading states and error handling
3. **Transparency**: Shows prices and session details upfront
4. **Flexibility**: Easy to switch from mock to real API
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Scalability**: Service pattern allows easy extension

## Future Enhancements

1. Add filtering by price range
2. Add session type filtering (free vs paid)
3. Implement booking confirmation API call
4. Add calendar view persistence (remember selected month)
5. Add recurring availability patterns
6. Implement booking history view
7. Add conflict detection for overlapping bookings
8. Implement payment integration for paid sessions
