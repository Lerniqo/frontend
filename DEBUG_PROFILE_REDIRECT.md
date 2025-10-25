# 🔍 Debug Guide: Profile Redirect Fix

## Problem Summary

**Issue:** User was not being redirected to the complete-profile page when logging in with an account that has an incomplete profile.

## Root Cause

The login page was attempting to call `userService.login()` a second time to extract userId and role, but the data was already available in the initial response from the `contextLogin()` call.

The backend API returns profile not completed errors with the following structure:

```json
{
  "success": false,
  "message": "Profile not completed. Please complete your profile to continue.",
  "data": {
    "user": {
      "userId": "uuid-string",
      "email": "user@example.com",
      "role": "Student",
      "fullName": "",
      "isVerified": true,
      "isProfileCompleted": false,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "accessToken": ""
  }
}
```

## Solution Implemented

### What Changed

**Before:** Calling `userService.login()` twice (redundant and error-prone)

```tsx
const response = await contextLogin(...); // First call
if (message.includes("profile not completed")) {
  const userResponse = await userService.login(...); // Second call - REMOVED
  // Extract from userResponse
}
```

**After:** Using data from the first response directly

```tsx
const response = await contextLogin(...); // Single call
if (message.includes("profile not completed")) {
  // Use response.data.user.userId and response.data.user.role directly
  if (response.data?.user?.userId && response.data?.user?.role) {
    // Extract and use
  }
}
```

### Key Changes in `/app/(auth)/login/page.tsx`

1. **Removed redundant API call**

   - Deleted the second `userService.login()` call
   - Now uses data from `response` (which comes from `contextLogin()`)

2. **Added debug logging**

   ```tsx
   console.log("📋 Profile not completed - Countdown starting...");
   console.log("User ID:", response.data.user.userId);
   console.log("Role:", response.data.user.role);
   console.log("🔄 Redirecting to:", redirectUrl);
   ```

3. **Simplified condition check**
   - Direct check: `response.data?.user?.userId && response.data?.user?.role`
   - No nested try-catch needed

## Testing the Fix

### Test Case 1: Student with Incomplete Profile

1. Register a student account (email, password verified)
2. **Skip** the complete-profile step
3. Try to log in with that account
4. **Expected Result:**
   - Yellow warning box appears: "⚠️ Please Complete Your Profile"
   - Countdown shows: "Redirecting in 3 seconds..."
   - Form inputs are disabled
   - After 3 seconds, automatically redirects to `/signup/complete-profile?userId=...&role=Student`

### Test Case 2: Teacher with Incomplete Profile

1. Register a teacher account (email, password verified)
2. **Skip** the complete-profile step
3. Try to log in with that account
4. **Expected Result:**
   - Yellow warning box appears
   - Countdown timer works
   - Redirects to `/signup/complete-profile?userId=...&role=Teacher`

### Test Case 3: User with Completed Profile

1. Register and complete full signup flow for a student
2. Log in with that account
3. **Expected Result:**
   - Login succeeds immediately
   - Redirects to dashboard
   - No warning message appears

### Test Case 4: User with Unverified Email

1. Register but don't verify email
2. Try to log in
3. **Expected Result:**
   - Redirects to `/signup/verify-email?email=...&fromLogin=true`
   - No profile incomplete message

## Console Logs to Monitor

When testing profile not completed redirect, check browser console for:

```
📋 Profile not completed - Countdown starting...
User ID: [uuid-string]
Role: [Student/Teacher]
🔄 Redirecting to: /signup/complete-profile?userId=[uuid]&role=[role]
```

If you see:

```
❌ Missing userId or role in response
```

Then there's still an issue with the response format.

## Redirect URL Format

The redirect URL should look like:

```
/signup/complete-profile?userId=550e8400-e29b-41d4-a716-446655440000&role=Student
```

Or for teacher:

```
/signup/complete-profile?userId=550e8400-e29b-41d4-a716-446655440000&role=Teacher
```

## Complete-Profile Page Validation

The complete-profile page extracts parameters like this:

```tsx
const userId = searchParams.get("userId");
const role = searchParams.get("role") as "Student" | "Teacher" | null;

// Redirect if invalid
if (!userId || !role || !["Student", "Teacher"].includes(role)) {
  router.push("/signup");
}
```

So the URL parameters MUST have:

- ✅ `userId` - Valid UUID string
- ✅ `role` - Exactly "Student" or "Teacher" (case-sensitive)

## Browser DevTools Checks

### 1. Network Tab

- Look for the login POST request
- Response should have `data.user.userId` and `data.user.role`
- Status should be 200 (not 401 or 500)

### 2. Console Tab

- Watch for the debug logs mentioned above
- No JavaScript errors
- Check for warnings about missing parameters

### 3. Application Tab

- `localStorage` should have `accessToken` (even though profile not completed)
- Refresh token should be in Cookies (HttpOnly)

## If Still Not Working

### Issue: Countdown shows but doesn't redirect

**Cause:** Router push might be failing
**Solution:**

1. Check browser console for router errors
2. Verify page path exists: `/app/(auth)/signup/complete-profile/page.tsx`
3. Check URL parameters are URL-encoded correctly

### Issue: No countdown appears at all

**Cause:** Condition `message.includes("profile not completed")` not matching
**Solution:**

1. Check actual error message from backend
2. Log the response message: `console.log("Response message:", response.message)`
3. Backend error message might be different

### Issue: Missing userId in response

**Cause:** Backend not returning userId in error response
**Solution:**

1. Verify backend is returning profile completion status
2. Check userService.ts login method is extracting error response correctly
3. Verify `errorResponse?.userId` is being captured

## Code File Locations

| File                                           | Purpose                     | Line Range               |
| ---------------------------------------------- | --------------------------- | ------------------------ |
| `/app/(auth)/login/page.tsx`                   | Login form & redirect logic | 95-130                   |
| `/app/(auth)/signup/complete-profile/page.tsx` | Profile completion form     | 1-30 (params extraction) |
| `/services/userService.ts`                     | Login API call              | 346-420                  |

## Next Steps

1. ✅ Test all 4 test cases above
2. ✅ Monitor console logs during redirect
3. ✅ Verify URL in address bar changes to complete-profile page
4. ✅ Confirm countdown timer displays correctly
5. ✅ Complete profile and verify successful redirect to dashboard

---

**Fix Applied:** October 25, 2025  
**Status:** ✅ Ready for Testing
