# Scheduling Service Sessions Update

## Overview

This document describes the implementation of the session management feature and the enhancement of the booking modal to show already booked sessions.

## Changes Summary

### 1. **services/schedulingService.ts** (Modified)

#### Added Session Interface

```typescript
export interface Session {
  session_id: string;
  teacher_id: string;
  session_type: "ONE_ON_ONE" | "GROUP";
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  is_paid: boolean;
  price: number | null;
  max_attendees: number;
  video_conference_link: string;
  attendees_count: number;
  zoom_meeting_id: string;
  zoom_join_url: string;
  zoom_start_url: string;
  zoom_password: string;
}
```

#### Added Mock Sessions Data

- 5 sample sessions with various configurations
- Mix of ONE_ON_ONE and GROUP sessions
- Different teachers (teacher-uuid-123 and teacher-uuid-456)
- Mix of free and paid sessions ($60, $75, $250)
- Different statuses (SCHEDULED, COMPLETED)
- Zoom meeting integration details

#### Added `getMySessions()` Function

- Fetches the current user's booked sessions
- Returns mock data with simulated 300ms delay
- Ready for API integration

### 2. **components/TeacherProfile/TeacherProfileContainer.tsx** (Modified)

#### New Imports

- Added `getTeacherAvailability`, `getMySessions`, `TeacherAvailability`, `Session` from scheduling service

#### New State Variables

```typescript
const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>([]);
const [mySessions, setMySessions] = useState<Session[]>([]);
const [loadingAvailability, setLoadingAvailability] = useState(false);
```

#### New useEffect for Data Fetching

- Fetches both teacher availability AND user sessions when teacher data loads
- Uses `Promise.all()` for parallel fetching
- Stores data in state variables
- Passes data as props to TeacherBookingModal

#### Updated Modal Props

```typescript
<TeacherBookingModal
  isOpen={isBookingModalOpen}
  onClose={() => setIsBookingModalOpen(false)}
  teacherName={teacher.fullName || "Unknown Teacher"}
  teacherId={teacher.userId}
  onSlotSelect={handleSlotSelect}
  availabilities={availabilities} // NEW
  mySessions={mySessions} // NEW
  loading={loadingAvailability} // NEW
/>
```

### 3. **components/TeacherProfile/TeacherBookingModal.tsx** (Modified)

#### Updated Props Interface

```typescript
interface TeacherBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherId: string;
  onSlotSelect: (slot: SelectedSlot) => void;
  availabilities: TeacherAvailability[]; // NEW
  mySessions: Session[]; // NEW
  loading: boolean; // NEW
}
```

#### Removed Internal Data Fetching

- Removed local `loading`, `availabilities` state
- Removed `useEffect` that called `getTeacherAvailability()`
- Now receives all data as props from parent

#### Enhanced `convertAvailabilityToSchedule()` Function

- Now accepts `mySessions` and `teacherId` parameters
- Creates a Set of booked session times for the current teacher
- Marks time slots as `isBookedByUser` if they match a user's scheduled session
- Compares dates and times to detect matches

#### Updated UI for Booked Sessions

**Time Slot Display:**

- Blue gradient background for already booked slots
- "Already Booked" status text
- Checkmark icon instead of info icon
- Disabled from selection (can't book twice)
- No price display for already booked slots

**Legend Updated:**

- Added "Already Booked" indicator with blue styling and checkmark

**Styling:**

```css
Already Booked: bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-800 border-blue-300
```

### 4. **types/auth.types.ts** (Modified)

#### Updated TimeSlot Interface

```typescript
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price?: number | null;
  description?: string;
  isPaid?: boolean;
  isBookedByUser?: boolean; // NEW: Indicates if user already booked this slot
}
```

## Data Flow

```
TeacherProfileContainer
  ↓ (on mount/teacher change)
  ├── getTeacherAvailability(teacherId)
  └── getMySessions()
  ↓ (store in state)
  ├── availabilities[]
  └── mySessions[]
  ↓ (pass as props)
TeacherBookingModal
  ↓
  convertAvailabilityToSchedule(availabilities, currentDate, mySessions, teacherId)
  ↓ (matches session times with availability times)
  ├── Creates timeSlots with isBookedByUser flag
  └── Renders calendar with visual indicators
```

## Session Matching Logic

The system matches user sessions with teacher availability using this logic:

1. **Filter Sessions**: Only SCHEDULED sessions for the current teacher
2. **Create Time Keys**: Format as `date-startHour:startMin-endHour:endMin`
3. **Check Each Slot**: Compare availability time key with booked session keys
4. **Mark as Booked**: Set `isBookedByUser: true` if match found

Example:

```typescript
// Session: 2025-10-16T09:00:00Z to 2025-10-16T09:45:00Z
// Creates key: "2025-10-16-9:0-9:45"

// Availability: 2025-10-16T09:00:00Z to 2025-10-16T11:00:00Z
// Creates key: "2025-10-16-9:0-11:0"

// No match (different end times) - slot shows as Available
```

## Mock Session Data Details

### Session 1 - Free Consultation

- **Teacher**: teacher-uuid-123
- **Type**: ONE_ON_ONE
- **Time**: Oct 16, 2025, 9:00-9:45 AM UTC
- **Status**: SCHEDULED
- **Price**: Free
- **Should match** with availability slot 550e8400-e29b-41d4-a716-446655440000

### Session 2 - Mathematics Advanced Tutoring

- **Teacher**: teacher-uuid-123
- **Type**: ONE_ON_ONE
- **Time**: Oct 17, 2025, 1:00-2:00 PM UTC
- **Status**: SCHEDULED
- **Price**: $75
- **Should match** with availability slot 550e8400-e29b-41d4-a716-446655440001

### Session 3 - Algebra Crash Course

- **Teacher**: teacher-uuid-123
- **Type**: GROUP
- **Time**: Oct 18, 2025, 10:00-11:30 AM UTC
- **Status**: SCHEDULED
- **Price**: Free
- **Attendees**: 12/25

### Session 4 - Physics Deep Dive

- **Teacher**: teacher-uuid-456 (different teacher)
- **Type**: GROUP
- **Time**: Oct 19, 2025, 2:00-4:00 PM UTC
- **Status**: SCHEDULED
- **Price**: $250
- **Won't show** as booked on teacher-uuid-123's calendar

### Session 5 - Exam Revision

- **Teacher**: teacher-uuid-123
- **Type**: ONE_ON_ONE
- **Time**: Oct 20, 2025, 7:30-8:30 AM UTC
- **Status**: COMPLETED (not SCHEDULED)
- **Won't show** as booked (only SCHEDULED sessions are marked)

## UI Visual States

### Time Slot States

1. **Available** - Green gradient, "Available" text, can be selected
2. **Unavailable** - Gray, "Unavailable" text, disabled
3. **Already Booked** - Blue gradient, "Already Booked" text, checkmark, disabled
4. **Selected** - Purple gradient, user's current selection

### Calendar Day Indicators

- Green dot: Has available slots
- No dot: No available slots or all booked

## Benefits

1. **User Awareness**: Users can see which sessions they've already booked
2. **Prevent Double Booking**: Booked slots are disabled
3. **Visual Clarity**: Clear color coding for different states
4. **Data Efficiency**: Fetch all data once in parent component
5. **Better Performance**: Parallel data fetching with Promise.all()
6. **Zoom Integration**: Session data includes Zoom meeting details

## API Integration Notes

### When connecting to real API:

#### Update `getMySessions()`:

```typescript
export async function getMySessions(): Promise<Session[]> {
  const response = await fetch("/api/sessions/my-sessions", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  const data = await response.json();
  return data;
}
```

#### Expected API Response:

```json
[
  {
    "session_id": "uuid",
    "teacher_id": "uuid",
    "session_type": "ONE_ON_ONE",
    "title": "Session Title",
    "description": "Session description",
    "start_time": "2025-10-16T09:00:00Z",
    "end_time": "2025-10-16T09:45:00Z",
    "status": "SCHEDULED",
    "is_paid": true,
    "price": 75.0,
    "max_attendees": 1,
    "video_conference_link": "https://zoom.us/j/123",
    "attendees_count": 1,
    "zoom_meeting_id": "123456789",
    "zoom_join_url": "https://zoom.us/j/123",
    "zoom_start_url": "https://zoom.us/s/123",
    "zoom_password": "pass123"
  }
]
```

## Testing Scenarios

1. **View Teacher with No Bookings**: All availability shows as green (available)
2. **View Teacher with Existing Booking**: Matching slot shows as blue (already booked)
3. **Try to Select Booked Slot**: Should be disabled, no click action
4. **Switch Months**: Booked status persists across navigation
5. **Different Teacher**: Booked sessions from other teachers don't interfere

## Future Enhancements

1. Add "View My Session" button on already booked slots
2. Show session details popup on hover for booked slots
3. Add cancel/reschedule option for booked sessions
4. Filter calendar to show only booked vs available slots
5. Add session reminders and notifications
6. Implement calendar sync (Google Calendar, Outlook)
7. Add session notes and materials access
