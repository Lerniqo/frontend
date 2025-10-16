# Contest Management Implementation - Admin Dashboard

## Overview

Created a comprehensive contest management system for the admin dashboard, allowing administrators to view, manage, and create student contests with leaderboards.

## Files Created/Modified

### 1. **Contest Service** (`services/contestService.ts`)

- **getAllContests()**: Fetches all contests with mock data
- **getTopRankersByContestId()**: Retrieves top 10 rankers for a specific contest
- **createNewContest()**: Creates a new contest with validation
- **checkWeekAvailability()**: Validates if a week is available for a new contest

**Interfaces:**

- `Contest`: Event structure with tasks, dates, and status
- `Task`: Individual task within a contest
- `TopRanker`: Ranking information with name and points
- `CreateContestData`: Form data structure for creating contests

### 2. **Contest Management Page** (`app/(protected)/@admin/contest-management/page.tsx`)

#### Key Features:

**List View (Default):**

- Two horizontal scrolling sections:
  - **Active & Past Contests**: Shows contests in progress (marked "In Progress") and completed contests
  - **Upcoming Contests**: Shows future contests with "Upcoming" badge
- Each contest card displays:
  - Banner image with gradient overlay
  - Event name and subtitle
  - Status badge (In Progress/Upcoming/Past)
  - Start date and task count
  - Gradient borders (purple/pink for active, gray for past, blue for upcoming)
  - Modern design with hover effects

**Detail View:**

- Triggered when clicking any contest card
- Shows:
  - Large banner with contest information
  - All contest tasks with goals, descriptions, and reward points
  - **Top 10 Rankers** (only for active/past contests):
    - Rank #1: Gold gradient badge
    - Rank #2: Silver gradient badge
    - Rank #3: Bronze gradient badge
    - Ranks 4-10: Standard gray badges
    - Points display with star icon
  - Back button to return to list view
  - Loading state while fetching rankers
  - Message for future contests (no rankings available)

**Create Contest Form:**

- Toggle form with "Create New Contest" button
- Fields:
  - Event name, subtitle, banner image URL
  - Start date (must be Monday) and end date (must be Sunday)
  - Up to 5 tasks maximum
- **Task Types:**
  1. **1v1 Battle**: Win X number of battles
  2. **AI Quiz**: Score X+ in quiz with difficulty (easy/medium/hard)
- **Validation:**
  - Required fields
  - Week must span Monday to Sunday
  - Week availability check (no overlapping contests)
  - Maximum 5 tasks
- On submit:
  - Shows loading screen (GeneralLoadingComponent)
  - Console logs the data
  - Reloads page to fetch updated data

**Design Elements:**

- Animated background blobs (purple, yellow, pink)
- Gradient borders on contest cards
- Smooth horizontal scrolling
- Responsive layout
- Modern card designs with hover effects
- Professional color scheme (purple, blue, gray gradients)

### 3. **Admin Layout Update** (`app/(protected)/@admin/layout.tsx`)

- Added "Contest Management" link to navigation menu
- Positioned between "Content Management" and "Analytics"
- Follows existing navigation pattern

## Contest Data Structure

### Sample Contest:

```json
{
  "eventId": "evt_2025_math_mania_week",
  "eventName": "Math Mania Week",
  "subtitle": "A full week of math challenges!",
  "bannerImage": "https://example.com/banner.jpg",
  "startDate": "2025-10-20T00:00:00Z",
  "endDate": "2025-10-26T23:59:59Z",
  "isActive": true,
  "tasks": [...]
}
```

### Contest Categorization:

- **Active**: `isActive: true` (current week, only one at a time)
- **Past**: `isActive: false` and start date in the past
- **Future**: `isActive: false` and start date in the future

## Key Business Rules

1. **Week Constraints:**

   - Contests run Monday to Sunday
   - Only one contest per week
   - No overlapping contests

2. **Task Limitations:**

   - Maximum 5 tasks per contest
   - Two task types: 1v1 battles and AI quizzes
   - Each task has reward points and status tracking

3. **Display Rules:**
   - Don't show future contests in "Active & Past" section
   - Show active contest first with pulsing badge
   - Hide rankings for future contests
   - Loading states for async operations

## Styling Features

- **Horizontal Scrolling**: Like student sessions page but with banner images
- **Gradient Borders**:
  - Purple/Pink for active contests
  - Gray for past contests
  - Blue for upcoming contests
- **Professional Design**: Modern card layouts with shadows and hover effects
- **Responsive**: Works on desktop and mobile
- **Animations**: Smooth transitions, pulsing badges, hover effects

## Integration Notes

- Uses mock data for now (ready for API integration)
- GeneralLoadingComponent for loading states
- Console logs contest creation data
- Page reload after contest creation to show updated data
- All icons from lucide-react

## Future Enhancements

- Connect to backend API
- Add edit/delete contest functionality
- Real-time contest status updates
- Student participation tracking
- Download contest reports
- Contest templates
