# 🧪 Step-by-Step Testing Guide: Profile Redirect

## Quick Test (5 minutes)

### Prerequisites

- Application running locally
- Browser DevTools open (F12)
- Console tab visible

### Step 1: Create Test Account

```
Email: test.profile@example.com
Password: TestPassword123
Role: Student
```

1. Go to `/signup`
2. Click "Student" → "Sign Up"
3. Enter email and password
4. Click "Create Account"
5. Verify email (use test code if available)
6. **IMPORTANT: Do NOT complete the profile - close this tab or navigate away**

### Step 2: Test Login with Incomplete Profile

1. Go to `/login`
2. Enter:
   - Email: `test.profile@example.com`
   - Password: `TestPassword123`
3. Click "Sign In"

### Step 3: Monitor Console Output

Watch for these logs:

```
✅ ✅ ✅ SUCCESS:
📋 Profile not completed - Countdown starting...
User ID: [some-uuid]
Role: Student
🔄 Redirecting to: /signup/complete-profile?userId=...&role=Student
```

### Step 4: Verify UI Changes

Look for:

- ✅ Yellow warning box appears
- ✅ Message: "⚠️ Please Complete Your Profile"
- ✅ Countdown: "Redirecting in 3 seconds..."
- ✅ Form inputs disabled (greyed out)
- ✅ Button text changes to "Redirecting..."

### Step 5: Wait for Redirect

- ✅ After 3 seconds, URL changes to `/signup/complete-profile?userId=...&role=Student`
- ✅ Profile form loads
- ✅ Role-specific fields display (Student fields for test)

### Step 6: Complete Profile and Verify

1. Fill in all required fields:
   - Full Name: Test User
   - Birthday: Select a date (age 5-25)
   - Grade Level: 10
   - Gender: Select option
2. Click "Complete Profile"
3. Should redirect to success page
4. Click "Continue to Login"

### Step 7: Log Back In

1. Enter same credentials
2. Should succeed immediately
3. Should redirect to dashboard
4. **No warning message should appear**

---

## Detailed Test Scenarios

### Scenario A: Teacher with Incomplete Profile

**Setup:**

1. Create account with role: Teacher
2. Skip profile completion

**Test:**

1. Login with teacher credentials
2. **Expected:** Yellow warning → 3-second countdown → Redirect to complete-profile with `role=Teacher`
3. Complete teacher profile (different fields than student)
4. Login again - should succeed without warning

**Console Output:**

```
📋 Profile not completed - Countdown starting...
User ID: [uuid]
Role: Teacher
🔄 Redirecting to: /signup/complete-profile?userId=...&role=Teacher
```

---

### Scenario B: Email Not Verified

**Setup:**

1. Register new account
2. Skip email verification
3. Skip profile completion

**Test:**

1. Try to login
2. **Expected:** Redirect to `/signup/verify-email?email=...&fromLogin=true`
3. Enter verification code
4. **Expected:** Redirect to `/signup/complete-profile?userId=...&role=...`
5. Complete profile
6. Login again - should succeed

**Console Output:**

```
// No profile incomplete message - goes directly to verify email
// After verifying email, on next login attempt:
📋 Profile not completed - Countdown starting...
```

---

### Scenario C: Successful Complete Signup and Login

**Setup:**

1. Start fresh signup
2. Complete ALL steps including profile

**Test:**

1. Complete entire flow to success page
2. Go to `/login`
3. Enter credentials
4. **Expected:** Immediate success, redirect to dashboard
5. **NO warning message should appear**

**Console Output:**

```
// Should show normal login success, NOT the profile incomplete message
```

---

## Troubleshooting

### Problem: Countdown doesn't appear

**Check:**

- [ ] Console for error logs
- [ ] Response message contains "profile not completed"
- [ ] Backend is returning this error
- [ ] Run test with fresh account

**Solution:**

```tsx
// Add to console to see actual message:
console.log("Response message:", response.message);
console.log("Full response:", response);
```

### Problem: Countdown appears but no redirect

**Check:**

- [ ] `setInterval` is running (countdown decrements)
- [ ] URL remains `/login`
- [ ] No JavaScript errors in console
- [ ] Router instance is active

**Solution:**

```tsx
// Verify router is available:
console.log("Router instance:", router);
// Check if path exists:
// File: /app/(auth)/signup/complete-profile/page.tsx
```

### Problem: Wrong role or userId

**Check:**

- [ ] Query params in URL
- [ ] Console logs show correct values
- [ ] Backend response has correct data

**Solution:**

```
Expected URL format:
/signup/complete-profile?userId=550e8400-e29b-41d4-a716-446655440000&role=Student

Check each part:
- userId: Valid UUID format? Copied correctly?
- role: Exactly "Student" or "Teacher"? Case-sensitive!
```

### Problem: Form inputs not disabled

**Check:**

- [ ] `profileIncompleteMessage` state is true
- [ ] Conditional rendering is working
- [ ] Disabled attribute applied to inputs

**Solution:**

```tsx
// Check state value:
console.log("profileIncompleteMessage:", profileIncompleteMessage);
console.log("redirectCountdown:", redirectCountdown);
```

---

## Network Tab Analysis

### When Testing Profile Not Completed:

**Expected Request:**

```
POST /user-service/users/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "test@example.com",
  "password": "TestPassword123"
}
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Profile not completed. Please complete your profile to continue.",
  "data": {
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "test@example.com",
      "role": "Student",
      "fullName": "",
      "isVerified": true,
      "isProfileCompleted": false,
      "createdAt": "2025-10-25T...",
      "updatedAt": "2025-10-25T..."
    },
    "accessToken": ""
  }
}
```

**Status Code:** 200 or 400 (depending on backend implementation)

---

## Visual Checklist

### Before Redirect

```
┌─────────────────────────────────────┐
│ Login Form (DISABLED)               │
│                                     │
│ ⚠️ Please Complete Your Profile    │
│ Your email has been verified...     │
│ Redirecting in 3 seconds...         │
│                                     │
│ Email: [DISABLED]                   │
│ Password: [DISABLED]                │
│                                     │
│ [Redirecting...] (DISABLED)         │
└─────────────────────────────────────┘
```

### After Redirect

```
┌─────────────────────────────────────┐
│ Complete Your Profile (Student)     │
│                                     │
│ Full Name: [INPUT]                  │
│ Birthday: [DATE]                    │
│ Grade Level: [SELECT 1-12]          │
│ Gender: [SELECT]                    │
│ School: [INPUT - optional]          │
│                                     │
│ [Complete Profile]                  │
└─────────────────────────────────────┘
```

---

## Success Indicators ✅

After completing the entire test:

- ✅ Account created successfully
- ✅ Email verified successfully
- ✅ Profile not completed message shown
- ✅ 3-second countdown displayed
- ✅ Auto-redirect to complete-profile occurred
- ✅ Profile form loaded with correct role fields
- ✅ Profile completion submitted successfully
- ✅ Login succeeded on second attempt without warning
- ✅ Dashboard loaded

---

## Debug Mode

To enable extra logging, find this section in login page:

```tsx
console.log("📋 Profile not completed - Countdown starting...");
console.log("User ID:", response.data.user.userId);
console.log("Role:", response.data.user.role);
console.log("🔄 Redirecting to:", redirectUrl);
```

These logs will appear in console during testing.

---

**Testing Guide Created:** October 25, 2025  
**Status:** ✅ Ready for QA Testing
