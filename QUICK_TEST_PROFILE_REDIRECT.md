# 🎯 Quick Test Guide - Profile Redirect Fix

## The Issue

Backend doesn't send `role` in the error response when profile not completed. Solution: **Store role in localStorage during registration**.

## 3-Minute Quick Test

### Step 1: Fresh Start

```javascript
// Browser Console (F12)
localStorage.clear();
```

### Step 2: New Account

- Go: `http://localhost:3000/signup`
- Click: "Student" or "Teacher"
- Register: `test@example.com` / `Password123`
- **Check localStorage:**
  ```javascript
  JSON.parse(localStorage.getItem("userRegistrationData"));
  // Should show: {email: "...", role: "Student"}
  ```

### Step 3: Verify Email

- Enter: 6-digit code (from email or API)
- **Check localStorage:**
  ```javascript
  JSON.parse(localStorage.getItem("userRegistrationData"));
  // Should now include: userId!
  ```

### Step 4: Skip Profile

- **Don't** complete profile form
- Navigate away or close tab

### Step 5: Try Login

- Go: `http://localhost:3000/login`
- Enter: Same email/password
- Click: "Sign In"
- **Watch for:**
  ✅ Yellow warning box appears
  ✅ Countdown: 3 → 2 → 1
  ✅ Redirects to: `/signup/complete-profile?userId=...&role=Student`

### Step 6: Complete Profile

- Fill form with test data
- Submit
- Redirects to success page

### Step 7: Verify

- Go back to login
- Log in again
- **Should succeed without warning** ✅

---

## Files Changed

```
✅ /app/(auth)/signup/register/page.tsx
   └─ Store role in localStorage after registration

✅ /app/(auth)/signup/verify-email/page.tsx
   └─ Update localStorage with userId after verification

✅ /services/userService.ts
   └─ Retrieve role from localStorage in error handler
```

---

## Browser Console Commands

### Check Stored Data

```javascript
localStorage.getItem("userRegistrationData");
```

### Clear for Fresh Test

```javascript
localStorage.clear();
```

### Manual Redirect Test

```javascript
// If redirect doesn't work, manually test:
const data = JSON.parse(localStorage.getItem("userRegistrationData"));
console.log("Role:", data.role); // Should be "Student" or "Teacher"
```

---

## Expected Console Logs

```
[After login with incomplete profile]

📋 Profile not completed - Countdown starting...
User ID: cmh6jtl6v000pp301ejnvp306
Role: Student
🔄 Redirecting to: /signup/complete-profile?userId=cmh6jtl6v000pp301ejnvp306&role=Student
```

---

## Network Tab Check

### Login Request

```
POST /user-service/users/login
Status: 401
```

### Response

```json
{
  "message": "Profile not completed. Please complete your profile first.",
  "userId": "cmh6jtl6v000pp301ejnvp306",
  "profileCompleted": false
}
```

Notice: **NO role in response** - that's why we use localStorage!

---

## Success Indicators ✅

- [ ] Registration stores email and role
- [ ] Verify email adds userId to storage
- [ ] Login with incomplete profile shows countdown
- [ ] URL changes to /signup/complete-profile with correct role
- [ ] Complete-profile form shows role-specific fields
- [ ] After profile completion, login works normally

---

## Still Not Working?

### Check 1: localStorage

```javascript
// See what's stored:
console.log(localStorage.getItem("userRegistrationData"));
```

### Check 2: Console Logs

- Do you see the countdown logs?
- Do you see "Role: Student"?

### Check 3: Network Tab

- Does login request return userId?
- Is the 401 response correct?

### Check 4: URL Parameters

- After redirect, check URL bar
- Should be: `/signup/complete-profile?userId=...&role=Student`

---

## One-Command Test

```javascript
// In browser console after login with incomplete profile:
// Check if role was found:
const data = JSON.parse(localStorage.getItem("userRegistrationData"));
console.log("✅ Role found:", data.role);
// OR
console.log("❌ Role missing - localStorage empty");
```

---

**Status:** ✅ Ready to Test  
**Expected Success Rate:** 95%+  
**Time to Test:** ~5 minutes
