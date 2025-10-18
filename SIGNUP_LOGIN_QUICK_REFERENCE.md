# Signup & Login Flow - Quick Reference

## 🎯 User Flows

### Signup: Student/Teacher

```
/signup
  ↓ (Select role: Student or Teacher)
/signup/register?role=student
  ↓ (Enter email, password)
/signup/verify-email?email=...&role=student
  ↓ (Enter 6-digit code)
/signup/complete-profile?userId=...&role=Student
  ↓ (Fill profile details)
/signup/success
  ↓ (Click "Continue to Login")
/login
  ↓ (Login with credentials)
/dashboard
```

### Login: Email Not Verified

```
/login
  ↓ (Enter credentials)
❌ Error: "Email not verified"
  ↓ (Auto-resend verification code)
/signup/verify-email?email=...&fromLogin=true
  ↓ (Enter code)
/signup/complete-profile?userId=...&role=...
  ↓ (Fill profile)
/signup/success
  ↓
/login
  ↓
/dashboard
```

### Login: Profile Not Complete

```
/login
  ↓ (Enter credentials)
❌ Error: "Profile not completed"
  ↓ (Auto-redirect with userId)
/signup/complete-profile?userId=...&role=...
  ↓ (Fill profile)
/signup/success
  ↓
/login
  ↓
/dashboard
```

## 📝 API Requests

### Register

```typescript
POST /user-service/users/register
{
  "email": "user@example.com",    // lowercase
  "password": "SecurePassword123",
  "role": "Student" | "Teacher"
}
```

### Verify Email

```typescript
POST /user-service/users/verify-email
{
  "email": "user@example.com",    // lowercase
  "code": "123456"
}
```

### Resend Verification

```typescript
POST /user-service/users/resend-verification
{
  "email": "user@example.com"    // lowercase
}
```

### Complete Profile - Student

```typescript
POST /user-service/users/complete-profile/:userId
{
  "fullName": "John Doe",
  "birthday": "2010-05-15",
  "gradeLevel": 9,
  "gender": "Male",
  "school": "ABC High School",
  "learningGoals": "Improve mathematics",
  "parentGuardianName": "Jane Doe",
  "relationship": "Mother",
  "parentContact": "jane.doe@example.com",
  "addressCity": "New York"
}
```

### Complete Profile - Teacher

```typescript
POST /user-service/users/complete-profile/:userId
{
  "fullName": "Dr. Smith Johnson",
  "birthday": "1985-08-20",
  "address": "123 Education Lane",
  "phoneNumber": "0912345678",
  "nationalIdPassport": "ABC123456789",
  "yearsOfExperience": 8,
  "highestEducationLevel": "Master's Degree",
  "qualifications": "Certified Cloud Architect",
  "shortBio": "Experienced software engineer..."
}
```

### Login

```typescript
POST /user-service/users/login
{
  "email": "user@example.com",    // lowercase
  "password": "SecurePassword123"
}
```

## 🎨 Using Toast Notifications

```typescript
import { useToast } from "@/components/CommonComponents/ToastContainer";

const toast = useToast();

// Success message
toast.success("Profile completed successfully!");

// Error message
toast.error("Invalid credentials");

// Warning message
toast.warning("Please verify your email");

// Info message
toast.info("Verification code sent");

// Custom duration (default: 5000ms)
toast.success("Saved!", 3000);
```

## 🔑 Key Rules

1. ✅ **Always lowercase emails** before sending to API
2. ✅ **Use toast notifications** instead of `alert()`
3. ✅ **No admin signup** - Admin accounts created by admins only
4. ✅ **Verify email** before profile completion
5. ✅ **Complete profile** before accessing dashboard
6. ✅ **Auto-resend** verification code when redirected from login
7. ✅ **Success page** always redirects to login, not dashboard

## 📂 Important Files

| File                                             | Purpose                |
| ------------------------------------------------ | ---------------------- |
| `components/CommonComponents/ToastContainer.tsx` | Toast system           |
| `app/(auth)/signup/page.tsx`                     | Role selection         |
| `app/(auth)/signup/register/page.tsx`            | Registration           |
| `app/(auth)/signup/verify-email/page.tsx`        | Email verification     |
| `app/(auth)/signup/complete-profile/page.tsx`    | Profile completion     |
| `app/(auth)/signup/success/page.tsx`             | Success message        |
| `app/(auth)/login/page.tsx`                      | Login page             |
| `components/forms/LoginForm.tsx`                 | Login form             |
| `services/userService.ts`                        | Auth API calls         |
| `contexts/AuthContext.tsx`                       | Auth state & redirects |

## 🐛 Common Issues & Solutions

| Issue                            | Solution                                                       |
| -------------------------------- | -------------------------------------------------------------- |
| "User already exists"            | User trying to register with existing email - show error toast |
| "Invalid verification code"      | Wrong code entered - show error, allow resend                  |
| "Email not verified" on login    | Auto-resend code, redirect to verify-email page                |
| "Profile not completed" on login | Redirect to complete-profile with userId                       |
| Email case mismatch              | All emails converted to lowercase automatically                |
| Missing userId in error response | Check API response format, ensure userId is included           |

## 🧪 Test Scenarios

### Happy Path

1. Signup → Verify → Complete Profile → Success → Login → Dashboard

### Error Paths

1. **Existing Email:** Register with existing email → Error toast shown
2. **Wrong Code:** Enter wrong verification code → Error toast, can resend
3. **Unverified Login:** Login without verifying email → Redirect to verify
4. **Incomplete Profile:** Login without completing profile → Redirect to complete
5. **Invalid Credentials:** Wrong password → Error toast shown

## 📊 Response Codes

| Status  | Scenario                                   |
| ------- | ------------------------------------------ |
| 200/201 | Success                                    |
| 400     | Bad request (validation errors)            |
| 401     | Invalid credentials                        |
| 403     | Email not verified / Profile not completed |
| 409     | User already exists                        |
| 500     | Server error                               |

---

**Quick Tip:** When testing, check the browser console for detailed API response logs.
