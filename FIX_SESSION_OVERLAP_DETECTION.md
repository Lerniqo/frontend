# Fix: Session Overlap Detection for "Already Booked" Indicator

## Problem

User's already booked sessions were not showing as "Already Booked" in the teacher availability modal.

## Root Cause

### The Issue

The original code was trying to find **exact matches** between session times and availability slot times:

```typescript
// OLD LOGIC - Exact Match
const timeKey = `${dateKey}-${startTime.getHours()}:${startTime.getMinutes()}-${endTime.getHours()}:${endTime.getMinutes()}`;
const isAlreadyBooked = bookedSessionTimes.has(timeKey);
```

### Why It Failed

Sessions and availability slots have **different durations**:

| Availability Slot             | Session Booked                  | Match? |
| ----------------------------- | ------------------------------- | ------ |
| Oct 16, 09:00-11:00 (2 hours) | Oct 16, 09:00-09:45 (45 min)    | ❌ No  |
| Oct 17, 13:00-15:00 (2 hours) | Oct 17, 13:00-14:00 (1 hour)    | ❌ No  |
| Oct 18, 07:30-10:30 (3 hours) | Oct 18, 10:00-11:30 (1.5 hours) | ❌ No  |

**Result**: The time keys never matched because end times were different!

## Solution

### New Approach: Time Overlap Detection

Instead of looking for exact matches, we now check if a session **overlaps** with an availability slot.

### Overlap Logic

Two time ranges overlap if:

```
sessionStart < availabilityEnd  AND  sessionEnd > availabilityStart
```

**Visual Example:**

```
Availability:  |-------09:00--------11:00-------|
Session:       |---09:00--09:45---|

Overlap? YES! ✅
- Session starts (09:00) < Availability ends (11:00) ✅
- Session ends (09:45) > Availability starts (09:00) ✅
```

## Implementation

### Changed Logic

**Before:**

```typescript
// Created a Set of exact time key strings
const bookedSessionTimes = new Set<string>();
mySessions.forEach((session) => {
  const timeKey = `${dateKey}-${startHour}:${startMin}-${endHour}:${endMin}`;
  bookedSessionTimes.add(timeKey);
});

// Checked for exact match
const isAlreadyBooked = bookedSessionTimes.has(timeKey);
```

**After:**

```typescript
// Create a Map of date -> sessions
const bookedSessionsByDate = new Map<string, Session[]>();
mySessions
  .filter(
    (session) =>
      session.teacher_id === teacherId && session.status === "SCHEDULED"
  )
  .forEach((session) => {
    const dateKey = new Date(session.start_time).toISOString().split("T")[0];
    if (!bookedSessionsByDate.has(dateKey)) {
      bookedSessionsByDate.set(dateKey, []);
    }
    bookedSessionsByDate.get(dateKey)?.push(session);
  });

// Helper function to check for overlap
const hasSessionOverlap = (
  availStart: Date,
  availEnd: Date,
  dateKey: string
): boolean => {
  const sessionsOnDate = bookedSessionsByDate.get(dateKey) || [];

  return sessionsOnDate.some((session) => {
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);

    // Check if times overlap
    const overlaps = sessionStart < availEnd && sessionEnd > availStart;
    return overlaps;
  });
};

// Use overlap detection
const isAlreadyBooked = hasSessionOverlap(startTime, endTime, dateKey);
```

## Test Cases

### Test Case 1: Session Within Availability

```
Availability: 09:00 - 11:00
Session:      09:00 - 09:45
Result: ✅ OVERLAP (Should show "Already Booked")
```

### Test Case 2: Session Partially Overlaps Start

```
Availability: 09:00 - 11:00
Session:      08:30 - 09:30
Result: ✅ OVERLAP (Should show "Already Booked")
```

### Test Case 3: Session Partially Overlaps End

```
Availability: 09:00 - 11:00
Session:      10:30 - 12:00
Result: ✅ OVERLAP (Should show "Already Booked")
```

### Test Case 4: Session Completely Contains Availability

```
Availability: 09:00 - 11:00
Session:      08:00 - 12:00
Result: ✅ OVERLAP (Should show "Already Booked")
```

### Test Case 5: No Overlap

```
Availability: 09:00 - 11:00
Session:      13:00 - 14:00
Result: ❌ NO OVERLAP (Should show "Available" or "Unavailable")
```

## Expected Results With Mock Data

### October 16, 2025

**Availability**: 09:00 AM - 11:00 AM  
**Session**: "Free Consultation" (09:00-09:45)  
**Status**: 🔵 **Already Booked** ✅

### October 17, 2025

**Availability**: 01:00 PM - 03:00 PM  
**Session**: "Mathematics Advanced Tutoring" (01:00-02:00)  
**Status**: 🔵 **Already Booked** ✅  
_Note: Also marked as unavailable because `is_booked: true`_

### October 18, 2025

**Availability**: 07:30 AM - 10:30 AM  
**Session**: "Algebra Crash Course" (10:00-11:30)  
**Status**: 🔵 **Already Booked** ✅  
_Partially overlaps (10:00-10:30 overlaps)_

### October 19, 2025

**Availability**: 03:00 PM - 05:00 PM  
**No matching session**  
**Status**: 🟢 **Available** ✅

### October 20, 2025

**Availability**: 10:00 AM - 12:00 PM  
**Session**: "Exam Revision - Geometry" (07:30-08:30)  
**Status**: 🔴 **Unavailable** (is_booked: true, but NO overlap with session)  
_Session is COMPLETED status, not SCHEDULED_

## Added Logging

For debugging, the code now logs:

```javascript
console.log("Added booked session:", {
  dateKey,
  title: session.title,
  start: session.start_time,
  end: session.end_time,
});

console.log("Found overlap:", {
  availability: { start: availStart, end: availEnd },
  session: {
    title: session.title,
    start: sessionStart,
    end: sessionEnd,
  },
});
```

## Benefits of New Approach

1. **Flexible Matching**: Works with any session duration
2. **More Accurate**: Detects partial overlaps
3. **Realistic**: Matches how real booking systems work
4. **Better UX**: Users see all their booked slots
5. **Easier to Debug**: Clear logging of overlaps

## Files Modified

- `components/TeacherProfile/TeacherBookingModal.tsx`
  - Replaced exact match logic with overlap detection
  - Changed from Set<string> to Map<string, Session[]>
  - Added `hasSessionOverlap()` helper function
  - Enhanced logging for debugging

## How to Verify

1. **Open Teacher Profile** for teacher with ID `cmey4gxpx0000jt01teghjwom`
2. **Click "Hire Teacher"** button
3. **Check October 16** - Should show time slot as 🔵 "Already Booked"
4. **Check October 17** - Should show time slot as 🔵 "Already Booked"
5. **Check October 18** - Should show time slot as 🔵 "Already Booked"
6. **Check Console Logs** - Should see "Found overlap" messages

### Console Output Should Show:

```
Added booked session: {dateKey: '2025-10-16', title: 'Free Consultation', ...}
Added booked session: {dateKey: '2025-10-17', title: 'Mathematics Advanced...', ...}
Added booked session: {dateKey: '2025-10-18', title: 'Algebra Crash Course', ...}
Found overlap: {availability: {...}, session: {title: 'Free Consultation', ...}}
Found overlap: {availability: {...}, session: {title: 'Mathematics...', ...}}
Found overlap: {availability: {...}, session: {title: 'Algebra...', ...}}
```

## Edge Cases Handled

✅ Session shorter than availability  
✅ Session longer than availability  
✅ Session starts before availability  
✅ Session ends after availability  
✅ Multiple sessions on same day  
✅ Sessions on different dates  
✅ Sessions with different teachers (filtered out)  
✅ Sessions with COMPLETED status (filtered out)

## Future Improvements

1. **Show Session Details**: Display which session is booked in tooltip
2. **Multiple Sessions**: Handle multiple overlapping sessions
3. **Partial Booking UI**: Show partially booked availability differently
4. **Time Remaining**: Display available time slots within partially booked availability
5. **Booking Conflicts**: Warn users about potential conflicts

## API Integration Notes

When connecting to real API, ensure:

- Sessions return with accurate timestamp data
- Timezone handling is consistent
- Filter by `status === "SCHEDULED"` on backend
- Consider using ISO 8601 timestamps for consistency
