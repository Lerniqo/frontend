# Availability Edit - Quick Reference Guide

## Files Changed

### 1️⃣ Service Layer

**📁 `services/teacherDashboardService.ts`**

- ✅ Updated `AvailabilitySlot` interface (added isPaid, price, sessionDescription)
- ✅ Created `AvailabilityUpdateRequest` interface
- ✅ Implemented `updateAvailability()` - sends to API
- ✅ Added `transformSlotsToApiFormat()` - converts to ISO format

### 2️⃣ Component Layer

**📁 `components/TeacherDashboard/AvailabilityManager.tsx`**

- ✅ Added form fields: description, isPaid, price
- ✅ Integrated conflict detection
- ✅ Added error handling and loading states
- ✅ Enhanced UI for paid sessions display

**📁 `components/TeacherDashboard/TeacherDashboard.tsx`**

- ✅ Added session fetching
- ✅ Passed sessions to AvailabilityManager

### 3️⃣ Utility Layer

**📁 `utils/availabilityConflictDetector.ts`** (NEW)

- ✅ `detectAvailabilityConflicts()` - check slot overlaps
- ✅ `detectSessionConflicts()` - check session overlaps
- ✅ `detectAllConflicts()` - comprehensive check

## Key Features at a Glance

```
┌─ ADD AVAILABILITY ─────────────┐
│ • Date (future only)            │
│ • Start Time                    │
│ • End Time                      │
│ • Description (optional)        │
│ • Paid? (checkbox)              │
│ • Price (if paid)               │
└─────────────────────────────────┘

┌─ VALIDATIONS ──────────────────┐
│ ✓ Required fields filled        │
│ ✓ Future date                  │
│ ✓ End time > Start time        │
│ ✓ Valid price if paid          │
│ ✓ No conflicts!                │
└─────────────────────────────────┘

┌─ CONFLICT CHECKS ──────────────┐
│ ✗ Other availability slots     │
│ ✗ Group sessions               │
│ ✗ 1-on-1 sessions              │
│ = PREVENT OVERLAPS!            │
└─────────────────────────────────┘
```

## API Reference

### Fetch Availability

```
GET /scheduling-service/scheduling/teachers/{id}/availability
Response: AvailabilitySlot[]
```

### Fetch Sessions

```
GET /scheduling-service/scheduling/me/sessions
Response: TeacherSession[]
```

### Update Availability ⭐ NEW

```
PUT /scheduling-service/scheduling/availability
Request: AvailabilityUpdateRequest[]
Response: { success: boolean, message: string }

Example Request:
[
  {
    startTime: "2025-10-20T10:00:00Z",
    endTime: "2025-10-20T11:00:00Z",
    isPaid: true,
    price: 50.00,
    sessionDescription: "Math Tutoring"
  }
]
```

## Component Props

### AvailabilityManager

```typescript
interface AvailabilityManagerProps {
  availability: AvailabilitySlot[]; // Current slots
  setAvailability: (slots) => void; // Update parent
  sessions?: TeacherSession[]; // For conflict check
}
```

## Usage Example

```tsx
// In TeacherDashboard.tsx
const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
const [sessions, setSessions] = useState<TeacherSession[]>([]);

// Fetch data
useEffect(() => {
  const availRes = await getAvailability();
  const sessRes = await getAllTeachersSessions();

  setAvailability(availRes.data || []);
  setSessions(sessRes.data || []);
}, []);

// Render
<AvailabilityManager
  availability={availability}
  setAvailability={setAvailability}
  sessions={sessions}
/>;
```

## Data Format Conversion

### Frontend → API

```typescript
// Frontend (AvailabilitySlot)
{
  date: "2025-10-20",
  startTime: "10:00",
}

// Transforms to API (AvailabilityUpdateRequest)
{
  startTime: "2025-10-20T10:00:00.000Z",  // ISO format
}
```

## Error Messages

### Validation Errors

| Error                                          | Cause              |
| ---------------------------------------------- | ------------------ |
| "Please fill in all required fields"           | Missing date/time  |
| "Please select a future date"                  | Past date selected |
| "End time must be after start time"            | Invalid time range |
| "Please enter a valid price for paid sessions" | Paid but no price  |

### Conflict Errors

| Error                                              | Cause           |
| -------------------------------------------------- | --------------- |
| "This slot overlaps with existing availability..." | Overlaps slot   |
| "This slot overlaps with your 1-on-1 session..."   | Overlaps 1-on-1 |
| "This slot overlaps with your Group session..."    | Overlaps group  |

## Testing Scenarios

### ✅ Should Work

- Add free slot without conflicts
- Add paid slot with price
- Add slot with description
- Delete multiple slots
- Save multiple slots together
- Toggle availability status
- Cancel editing (reverts changes)

### ❌ Should Fail (Prevented)

- Add slot in past
- Add slot with end time before start time
- Add paid slot without price
- Add slot overlapping existing availability
- Add slot overlapping group session
- Add slot overlapping 1-on-1 session

## Common Issues & Solutions

### Issue: Price field not showing

**Solution:** Make sure "Is Paid" checkbox is checked

### Issue: Conflict not detected

**Solution:** Check that sessions are fetched correctly (verify API call in TeacherDashboard)

### Issue: API error on save

**Solution:** Verify AvailabilityUpdateRequest format is correct (ISO datetime strings)

### Issue: Changes reverted on save

**Solution:** Check error message, might be API-side validation

## Performance Tips

- Conflict detection runs only on "Add Slot" click (not on every keystroke)
- Single API call for all slots (not individual)
- Efficient O(n+m) complexity for typical schedules
- No UI lag with typical 10-50 slots

## Debug Mode

Add to AvailabilityManager to see state:

```typescript
console.log("Current slots:", tempAvailability);
console.log(
  "Conflict check:",
  detectAllConflicts(newSlot, tempAvailability, sessions)
);
console.log("API sending:", transformSlotsToApiFormat(tempAvailability));
```

## Browser Console Checks

```javascript
// Check if availability is loaded
localStorage.getItem("userData"); // User data

// Check network tab
// PUT /scheduling-service/scheduling/availability
// Should see request with array of slots
```

## State Diagram

```
┌─────────────┐
│  View Mode  │◀─────┐
└──────┬──────┘      │
       │ Edit        │ Save/Cancel
       ▼             │
┌─────────────┐      │
│  Edit Mode  │──────┘
│             │
│ Add Form    │
│ Show slots  │
│ Can delete  │
└─────────────┘
```

## Checklist Before Deployment

- [ ] No TypeScript errors
- [ ] Sessions fetched correctly
- [ ] Conflict detection working
- [ ] Form validation working
- [ ] API endpoint verified
- [ ] Error messages display correctly
- [ ] Loading state shows during save
- [ ] Can save and load persists
- [ ] Cancel button reverts changes
- [ ] UI responsive on mobile

## Quick Start for Developers

```typescript
// Add new field to slot (if needed)
1. Update AvailabilitySlot interface
2. Add state in AvailabilityManager
3. Add form field in JSX
4. Include in new slot creation
5. Include in transformSlotsToApiFormat
6. Update API type if needed

// Add new validation
1. Add check in handleAddSlot()
2. Set formError with message
3. Return early to prevent add
```

## Documentation Files

📄 `AVAILABILITY_EDIT_IMPLEMENTATION.md` - Full technical details
📄 `AVAILABILITY_ARCHITECTURE.md` - System design & flow diagrams
📄 `AVAILABILITY_EDIT_SUMMARY.md` - Overview & quick reference

---

**Last Updated:** October 17, 2025
**Status:** ✅ Ready for Testing
**No Breaking Changes:** ✅ Confirmed
