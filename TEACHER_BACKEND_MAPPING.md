# Teacher Backend Field Mapping

This document shows how the backend teacher fields are mapped and displayed in the frontend UI.

## Backend Fields (Prisma Schema)

Based on your backend specification, here are the teacher fields:

```prisma
model Teacher {
  userId                String   @unique @map("user_id")
  birthday              DateTime
  address               String   @db.Text
  phoneNumber           String   @map("phone_number")
  nationalIdPassport    String   @map("national_id_passport")
  yearsOfExperience     Int      @map("years_of_experience")
  highestEducationLevel String   @map("highest_education_level")
  qualifications        String?  @db.Text
  shortBio              String?  @map("short_bio") @db.Text
}
```

## Frontend Type Mapping

### TeacherProfile Interface (`types/auth.types.ts`)

```typescript
export interface TeacherProfile extends User {
  role: 'Teacher';
  birthday?: string; // DateTime from backend
  address?: string; // Text from backend
  phoneNumber?: string; // phone_number from backend
  nationalIdPassport?: string; // national_id_passport from backend
  yearsOfExperience?: number; // years_of_experience from backend
  highestEducationLevel?: string; // highest_education_level from backend
  qualifications?: string; // Optional Text from backend
  shortBio?: string; // short_bio from backend
}
```

### TeacherProfileData Interface (Form Data)

```typescript
export interface TeacherProfileData {
  fullName: string;
  birthday?: string; // DateTime field
  address?: string; // Text field
  phoneNumber?: string; // phone_number field
  nationalIdPassport?: string; // national_id_passport field
  yearsOfExperience?: number; // years_of_experience field
  highestEducationLevel?: string; // highest_education_level field
  qualifications?: string; // Optional Text field
  shortBio?: string; // short_bio field
}
```

## UI Implementation

### 1. Teacher Profile Form (`TeacherProfileDetailsForm.tsx`)

All backend fields are properly implemented in the registration form:

- ✅ **Full Name** - Required field
- ✅ **Birthday** - Date picker (optional)
- ✅ **Address** - Text input (optional)
- ✅ **Phone Number** - Tel input with validation (optional)
- ✅ **National ID/Passport** - Text input (optional)
- ✅ **Years of Experience** - Number input (optional)
- ✅ **Highest Education Level** - Dropdown with options (optional)
- ✅ **Qualifications** - Textarea (optional)
- ✅ **Short Bio** - Textarea with 300 char limit (optional)

### 2. Teachers Page Display (`app/teachers/page.tsx`)

Mock data generation now includes all backend fields:

```typescript
return {
  // Core user fields
  userId: `teacher-${id}`,
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  role: 'Teacher',
  fullName,
  
  // Backend teacher fields matching the Prisma schema
  birthday, // DateTime field
  address: addresses[id % addresses.length], // Text field
  phoneNumber: `+1${Math.floor(Math.random() * 900000000) + 100000000}`, // phone_number
  nationalIdPassport: `ID${Math.floor(Math.random() * 900000000) + 100000000}`, // national_id_passport
  yearsOfExperience, // years_of_experience (Int)
  highestEducationLevel: educationLevels[Math.floor(Math.random() * educationLevels.length)], // highest_education_level
  qualifications: 'Bachelor of Education, Teaching Certification, Subject Matter Expert', // Optional Text
  shortBio: `Passionate educator with ${yearsOfExperience} years of experience...`, // short_bio
  
  // Additional UI enhancement fields
  // ... other display fields
};
```

### 3. Teacher Card Display (`TeacherCard.tsx`)

Enhanced to show backend fields in both grid and list views:

**List View:**
- Teacher name with verification badge
- Experience level and availability status
- Education level with graduation cap icon
- Years of experience with lightning icon
- Address with location icon
- Short bio/teaching philosophy
- Rating and student count
- Subjects taught
- Action buttons

**Grid View:**
- Compact teacher information
- Education level and years of experience
- Short bio
- Professional summary icons
- Rating and pricing
- Action buttons

### 4. Data Service Layer (`userService.ts`)

The `formatTeacherProfileData` function properly handles all backend fields:

```typescript
const formatTeacherProfileData = (data: TeacherProfileData): TeacherProfileData => {
  const formatOptionalString = (value: string | undefined): string | undefined => {
    if (!value || value.trim() === '') return undefined;
    return value.trim();
  };

  return {
    fullName: data.fullName.trim(),
    birthday: formatOptionalString(data.birthday),
    address: formatOptionalString(data.address),
    phoneNumber: formatOptionalString(data.phoneNumber),
    nationalIdPassport: formatOptionalString(data.nationalIdPassport),
    yearsOfExperience: data.yearsOfExperience,
    highestEducationLevel: formatOptionalString(data.highestEducationLevel),
    qualifications: formatOptionalString(data.qualifications),
    shortBio: formatOptionalString(data.shortBio)
  };
};
```

## Field Usage Summary

| Backend Field | Form Field | Display | Service Layer | Status |
|---------------|------------|---------|---------------|---------|
| `userId` | ✓ (Generated) | ✓ | ✓ | ✅ Complete |
| `birthday` | ✓ (Date picker) | ✓ (Age calculation) | ✓ (Format handling) | ✅ Complete |
| `address` | ✓ (Text input) | ✓ (Location display) | ✓ (Trim/validate) | ✅ Complete |
| `phoneNumber` | ✓ (Tel input) | ✓ (Contact info) | ✓ (Format/validate) | ✅ Complete |
| `nationalIdPassport` | ✓ (Text input) | ✓ (Verification) | ✓ (Trim/validate) | ✅ Complete |
| `yearsOfExperience` | ✓ (Number input) | ✓ (Experience badge) | ✓ (Number handling) | ✅ Complete |
| `highestEducationLevel` | ✓ (Dropdown) | ✓ (Education badge) | ✓ (Selection handling) | ✅ Complete |
| `qualifications` | ✓ (Textarea) | ✓ (Professional info) | ✓ (Text formatting) | ✅ Complete |
| `shortBio` | ✓ (Textarea, 300 chars) | ✓ (Bio display) | ✓ (Length validation) | ✅ Complete |

## API Integration Ready

The frontend is now fully prepared to integrate with your backend API. All field mappings are correct and consistent across:

1. **Type definitions** - Match backend schema exactly
2. **Form components** - Collect all required data
3. **Display components** - Show all relevant information
4. **Service layer** - Handle data formatting and validation
5. **Mock data** - Realistic data for testing

When you're ready to connect to the real backend, simply update the API endpoints in `userService.ts` and the data will flow seamlessly through the application.

## UI Updates - Removed Features

### Removed Elements

Based on user requirements, the following elements have been removed from the teachers page UI:

1. **Rating System** ❌
   - Star ratings display removed from teacher cards
   - Rating filter removed from search/filter options
   - Rating sorting option removed
   - Rating field set to 0 in mock data (kept for compatibility)

2. **Languages** ❌
   - Languages display removed from teacher cards
   - Languages filter removed from search/filter options
   - Languages field set to empty array in mock data (kept for compatibility)

3. **Heart/Favorite Icon** ❌
   - Favorite/heart icon button removed from teacher cards
   - Related state management and click handlers removed
   - Cleaner, more focused card layout

### Current Active Features

The teachers page now focuses on these key elements:

✅ **Teacher Information**
- Full name with verification badge
- Profile avatar with online status indicator
- Experience level badges
- Years of experience display
- Education level with icon
- Address/location display
- Short bio/teaching philosophy

✅ **Professional Details**
- Subjects taught
- Qualifications
- Availability status
- Hourly rate pricing
- Student count
- Response time

✅ **Filtering & Search**
- Experience level filter
- Subject filter
- Years of experience range
- Availability filter
- Verified teacher filter
- Hourly rate range filter
- Text search across multiple fields

## UI Updates - Latest Changes

### Recently Removed Elements

Based on latest user requirements, the following elements have been removed:

4. **Language Filtering** ❌
   - Languages filter completely removed from search/filter options
   - Language chips/buttons removed from advanced filters
   - Language-related filter logic removed from service
   - Languages array removed from mock data generation

5. **Sorting Options** ❌
   - Sort dropdown completely removed from UI
   - No more sorting by name, rating, experience, join date, or hourly rate
   - TeacherFilterService.sortTeachers method removed
   - SortOptions interface usage removed from components
   - Simplified filtering without complex sorting logic

6. **Advanced Filter Reorganization** ✅
   - "Available Now" and "Verified Only" promoted to primary filter buttons
   - Enhanced styling with icons and better visual feedback
   - Removed rating filter from advanced options
   - Streamlined filter interface focusing on key criteria

### Current Filter Interface

✅ **Primary Filter Buttons** (Always Visible)
- **Available Now** - Green button with clock icon
- **Verified Only** - Blue button with checkmark icon
- Results count display
- Advanced filters toggle
- Clear all filters (when active)

✅ **Advanced Filters** (Expandable)
- Experience Level (Beginner, Intermediate, Advanced, Expert)
- Subjects (Mathematics, Science, English, etc.)
- Years of Experience (Min/Max range)
- Hourly Rate (Min/Max range in USD)

❌ **Removed Filter Options**
- ~~Rating filter~~ (completely removed)
- ~~Languages filter~~ (completely removed)
- ~~Sorting options~~ (completely removed)