# Registration Flow Update - Two-Step Registration Implementation

## Overview
This document outlines the changes made to implement the new two-step registration flow that aligns with the updated API endpoints.

## New Registration Flow

### Step 1: Basic Registration
- User selects role (student/teacher)
- User provides email and password
- System calls `/user-service/users/register` with basic info only
- User receives verification instructions

### Step 2: Email Verification
- User enters 6-digit verification code
- System calls `/user-service/users/verify-email` with the code
- Email is verified

### Step 3: Profile Completion
- User fills out role-specific profile information
- System calls `/user-service/users/complete-profile/:userId` with profile data
- User profile is completed and authentication token is issued

## Key Changes Made

### 1. UserService Updates (`services/userService.ts`)
- **New Methods:**
  - `basicRegister()` - Step 1 registration (email, password, role only)
  - `verifyEmail()` - Step 2 email verification
  - `completeProfile()` - Step 3 profile completion
  - `hasTempUserId()` - Check if user has temporary ID for profile completion

- **Updated Interfaces:**
  - `BasicRegisterData` - For step 1 registration
  - `StudentProfileData` - For student profile completion
  - `TeacherProfileData` - For teacher profile completion
  - `BasicRegisterResponse` - Response from basic registration

- **Temporary User ID Management:**
  - Stores temporary user ID in sessionStorage during profile completion
  - Clears temporary ID after successful profile completion

- **API Base URL Update:**
  - Base URL: `https://xzx0dtp51i.execute-api.us-east-1.amazonaws.com/dev/api`
  - All endpoints now include `/user-service` microservice prefix

### 2. Component Updates

#### ValidateEmail Component
- Updated to use new `verifyEmail(code)` method signature
- Removed email parameter (not needed in new API)
- Updated resend functionality to show helpful message

#### ProfileDetailsForm Component
- Updated to use new `completeProfile()` method
- Simplified data structure to match new API requirements
- Updated error handling and success flow

#### StudentProfileDetailsForm Component
- Made most fields optional (only fullName required)
- Removed profile picture upload functionality
- Added learning goals field
- Updated validation to be less strict

#### TeacherProfileDetailsForm Component
- Made most fields optional (only fullName required)
- Removed file upload functionality (ID proofs, certificates)
- Simplified validation requirements
- Added qualifications field

#### NavigationSection Component
- Updated to use new `basicRegister()` method
- Improved error handling for registration failures
- Better flow control between steps

#### Main SignUp Page
- Updated step descriptions to reflect new flow
- Improved success step with better UI and redirect to login
- Better step progression management

#### ProgressBar Component
- Added support for custom step descriptions
- Dynamic step generation from provided descriptions
- Maintains backward compatibility

## API Endpoint Mapping

| Step | Component | API Call | Purpose |
|------|-----------|----------|---------|
| 1 | UserTypeSelector | - | Role selection |
| 2 | RegisterEmail + NavigationSection | `POST /user-service/users/register` | Basic registration |
| 3 | ValidateEmail | `POST /user-service/users/verify-email` | Email verification |
| 4 | ProfileDetailsForm | `POST /user-service/users/complete-profile/:userId` | Profile completion |
| 5 | Success Page | - | Completion confirmation |

## Complete API Endpoints

### User Service Endpoints
- **POST** `/user-service/users/register` - Basic registration
- **POST** `/user-service/users/verify-email` - Email verification
- **POST** `/user-service/users/complete-profile/:userId` - Profile completion
- **POST** `/user-service/users/login` - User login
- **GET** `/user-service/users/me` - Get current user profile
- **PUT** `/user-service/users/me` - Update profile
- **POST** `/user-service/users/logout` - Logout
- **GET** `/user-service/users/teachers` - List all teachers (public)
- **GET** `/user-service/users/teachers/:id` - Get teacher profile (public)
- **PUT** `/user-service/user/change-password` - Change password
- **POST** `/user-service/user/upload-photo` - Upload profile photo
- **POST** `/user-service/auth/refresh` - Refresh access token

## Data Flow

1. **Role Selection** → User chooses student/teacher role
2. **Basic Registration** → Email/password sent to `/user-service/users/register`
3. **Temporary Storage** → User ID stored in sessionStorage
4. **Email Verification** → Code sent to `/user-service/users/verify-email`
5. **Profile Completion** → Profile data sent to `/user-service/users/complete-profile/:userId`
6. **Authentication** → Token issued and temporary ID cleared
7. **Success** → User redirected to login

## Benefits of New Flow

- **Better User Experience**: Users can start with minimal information
- **Improved Security**: Email verification before profile completion
- **Flexible Profile Building**: Users can complete profiles at their own pace
- **Cleaner API Design**: Separation of concerns between registration and profile management
- **Better Error Handling**: More granular error states and recovery options
- **Microservice Architecture**: Clear separation with `/user-service` prefix

## Migration Notes

- Existing users will need to complete the new flow
- Profile data structure has been simplified
- File uploads are no longer part of basic profile completion
- Most profile fields are now optional for better user adoption
- All API calls now include the `/user-service` microservice prefix

## Testing Considerations

- Test the complete flow from start to finish
- Verify temporary user ID management
- Test error scenarios at each step
- Ensure proper cleanup of temporary data
- Verify email verification flow
- Test profile completion with minimal data
- Verify all API endpoints with the new `/user-service` prefix
