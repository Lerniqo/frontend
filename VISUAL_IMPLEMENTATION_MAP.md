# 🗺️ Sign-Up & Login Flow - Visual Implementation Map

## 📍 Complete Route Architecture

```
ROOT
│
├── /signup (Role Selection)
│   ├── Select: Student | Teacher
│   ├── Actions: Sign Up → /signup/register?role=Student|Teacher
│   └── Actions: Sign In → /login
│
├── /signup/register (Registration)
│   ├── Fields: Email, Password, Confirm Password
│   ├── Validation: Email format, Email unique, Password 6+ chars, Match
│   ├── API: POST /users/register
│   ├── Success: → /signup/verify-email?email=...
│   └── Error: Duplicate email → Show error + link to /login
│
├── /signup/verify-email (Email Verification)
│   ├── Fields: 6-digit code input
│   ├── Validation: Exactly 6 digits
│   ├── API: POST /users/verify-email
│   ├── Success: → /signup/complete-profile?userId=...&role=...
│   ├── Error: Code expired → Show resend button
│   ├── API Resend: POST /users/resend-verification
│   └── Actions: Start over → /signup
│
├── /signup/complete-profile (Profile Completion)
│   ├── Role: Student
│   │   ├── Required: Full Name, Birthday (age 5-25), Grade Level, Gender
│   │   ├── Optional: School, Learning Goals, Parent Info, City
│   │   └── API: POST /users/complete-profile/:userId
│   │
│   ├── Role: Teacher
│   │   ├── Required: Full Name, Birthday (age 21-80), Address, Phone, National ID, Years Exp, Education
│   │   ├── Optional: Qualifications, Bio
│   │   └── API: POST /users/complete-profile/:userId
│   │
│   ├── Success: → /signup/success
│   └── Error: Validation error → Show field-level errors
│
├── /signup/success (Success Page)
│   ├── Message: 🎉 Profile completed successfully!
│   ├── Next steps information
│   └── Action: "Continue to Login" → /login
│
└── /login (Authentication)
    ├── Fields: Email, Password
    ├── API: POST /users/login
    │
    ├── Response 1: ✅ Success
    │   └── Actions: Store token → Update AuthContext → Redirect to /dashboard
    │
    ├── Response 2: ❌ Email not verified
    │   └── Actions: Redirect → /signup/verify-email?email=...&fromLogin=true
    │
    ├── Response 3: ❌ Profile not completed (NEW!)
    │   ├── Show: Yellow warning box
    │   ├── Show: "⚠️ Please Complete Your Profile"
    │   ├── Show: Countdown timer (3 seconds)
    │   ├── Disable: All form inputs
    │   └── Then: Auto-redirect → /signup/complete-profile?userId=...&role=...
    │
    ├── Response 4: ❌ Invalid credentials
    │   └── Actions: Show error message
    │
    └── Actions: "Sign Up" → /signup

```

---

## 🔄 User Flow Sequences

### **Sequence 1: New Student Complete Signup**

```
START
  │
  ├─→ GET /signup
  │   User: Select "Student" card
  │   Click: "Sign Up" button
  │
  ├─→ GET /signup/register?role=Student
  │   User: Enter email, password, confirm password
  │   Click: "Create Account" button
  │   System: Validate inputs
  │   System: Call API: POST /users/register
  │   Response: { userId, email, role, message }
  │
  ├─→ GET /signup/verify-email?email=user@domain.com
  │   System: Redirect user
  │   User: Check email for 6-digit code
  │   User: Enter code in form
  │   Click: "Verify Email" button
  │   System: Call API: POST /users/verify-email
  │   Response: { userId, role, message }
  │
  ├─→ GET /signup/complete-profile?userId=uuid&role=Student
  │   System: Redirect with userId and role
  │   User: Fill out student profile (name, birthday, grade, gender, etc.)
  │   Click: "Complete Profile" button
  │   System: Validate student profile fields
  │   System: Call API: POST /users/complete-profile/uuid
  │   Response: { userId, email, role, fullName, message }
  │
  ├─→ GET /signup/success
  │   System: Redirect user
  │   User: See success message and next steps
  │   Click: "Continue to Login" button
  │
  ├─→ GET /login
  │   System: Redirect user
  │   User: Enter email and password
  │   Click: "Sign In" button
  │   System: Call API: POST /users/login
  │   Response: { success, data: { accessToken, user }, message }
  │
  └─→ GET /dashboard
      System: Store token, update AuthContext
      System: Role-based redirect (Student Dashboard)
      User: Sees student dashboard
      END
```

---

### **Sequence 2: Email Not Verified During Login**

```
START
  │
  ├─→ GET /login
  │   User: Enter email, password
  │   Click: "Sign In"
  │   System: Call API: POST /users/login
  │   Response: { message: "Email not verified..." }
  │
  ├─→ GET /signup/verify-email?email=...&fromLogin=true
  │   System: Auto-redirect
  │   User: Check email for code
  │   User: Enter 6-digit code
  │   Click: "Verify Email"
  │   System: Call API: POST /users/verify-email
  │   Response: { userId, role, message }
  │
  ├─→ GET /signup/complete-profile?userId=...&role=...
  │   System: Auto-redirect
  │   User: Complete profile form
  │   Click: "Complete Profile"
  │   System: Call API: POST /users/complete-profile
  │   Response: { userId, email, role, fullName, message }
  │
  ├─→ GET /login
  │   System: Redirect (or user navigates manually)
  │   User: Enter email and password again
  │   Click: "Sign In"
  │   System: Call API: POST /users/login
  │   Response: { success, data: { accessToken, user }, message }
  │
  └─→ GET /dashboard
      System: Store token, update AuthContext
      User: Sees dashboard
      END
```

---

### **Sequence 3: Profile Not Completed During Login (NEW!)**

```
START
  │
  ├─→ GET /login
  │   User: Enter email, password
  │   Click: "Sign In"
  │   System: Call API: POST /users/login
  │   Response: { message: "Profile not completed..." }
  │
  ├─→ SHOW WARNING (Same page)
  │   System: Show yellow warning box:
  │   "⚠️ Please Complete Your Profile
  │    Your email has been verified. Now you need to
  │    complete your profile to access your account.
  │    Redirecting in 3 seconds..."
  │   System: Disable all form inputs
  │   System: Show countdown: 3 → 2 → 1 → 0
  │
  ├─→ GET /signup/complete-profile?userId=...&role=...
  │   System: Auto-redirect after countdown
  │   User: See profile form (with their role's fields)
  │   User: Fill required fields
  │   Click: "Complete Profile"
  │   System: Validate form
  │   System: Call API: POST /users/complete-profile
  │   Response: { userId, email, role, fullName, message }
  │
  ├─→ GET /signup/success
  │   System: Auto-redirect
  │   User: See success message
  │   Click: "Continue to Login"
  │
  ├─→ GET /login
  │   System: Redirect
  │   User: Enter email and password
  │   Click: "Sign In"
  │   System: Call API: POST /users/login
  │   Response: { success, data: { accessToken, user }, message }
  │
  └─→ GET /dashboard
      System: Store token, update AuthContext
      User: Sees dashboard
      END
```

---

## 📊 State Management Flow

```
┌─────────────────────────────────────┐
│     Component State (Local)         │
├─────────────────────────────────────┤
│ ✅ formData (email, password, etc)  │
│ ✅ errors (field-level errors)      │
│ ✅ isLoading (API call status)      │
│ ✅ showPassword (toggle)            │
│ ✅ profileIncompleteMessage (flag)  │
│ ✅ redirectCountdown (timer)        │
└─────────────────────────────────────┘
         ↓         ↓         ↓
    ┌────────────────────────────────┐
    │    API Responses               │
    ├────────────────────────────────┤
    │ POST /users/register           │
    │ POST /users/verify-email       │
    │ POST /users/resend-verification│
    │ POST /users/complete-profile   │
    │ POST /users/login              │
    └────────────────────────────────┘
         ↓         ↓         ↓
    ┌────────────────────────────────┐
    │   AuthContext (Global)         │
    ├────────────────────────────────┤
    │ ✅ user (authenticated user)   │
    │ ✅ isAuthenticated (boolean)   │
    │ ✅ accessToken (bearer token)  │
    │ ✅ login() (method)            │
    │ ✅ logout() (method)           │
    │ ✅ refreshToken() (method)     │
    └────────────────────────────────┘
         ↓         ↓         ↓
    ┌────────────────────────────────┐
    │   Browser Storage              │
    ├────────────────────────────────┤
    │ localStorage:                  │
    │   - accessToken (string)       │
    │   - userData (JSON)            │
    │ Cookies:                       │
    │   - refreshToken (HttpOnly)    │
    └────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App Root
│
├── AuthProvider
│   └── Layout
│       └── (auth) Group
│           │
│           ├── /signup Layout
│           │   ├── SignUpPage
│           │   │   └── SignUpPageContent
│           │   │       ├── Card Container
│           │   │       ├── Header
│           │   │       ├── Role Selection Section
│           │   │       │   └── Role Option Cards (×2)
│           │   │       └── Action Buttons
│           │   │
│           │   ├── /signup/register Layout
│           │   │   ├── RegisterPage
│           │   │   │   └── RegisterPageContent
│           │   │   │       ├── Card Container
│           │   │   │       ├── Header
│           │   │   │       ├── Form
│           │   │   │       │   ├── Email Field
│           │   │   │       │   ├── Password Field
│           │   │   │       │   ├── Confirm Password Field
│           │   │   │       │   └── Submit Button
│           │   │   │       └── Footer Link
│           │   │   │
│           │   ├── /signup/verify-email Layout
│           │   │   ├── VerifyEmailPage
│           │   │   │   └── VerifyEmailPageContent
│           │   │   │       ├── Card Container
│           │   │   │       ├── Header
│           │   │   │       ├── Form
│           │   │   │       │   ├── Code Input Field
│           │   │   │       │   ├── Submit Button
│           │   │   │       │   └── Resend Section
│           │   │   │       └── Footer
│           │   │   │
│           │   ├── /signup/complete-profile Layout
│           │   │   ├── CompleteProfilePage
│           │   │   │   └── CompleteProfilePageContent
│           │   │   │       ├── Card Container
│           │   │   │       ├── Header
│           │   │   │       └── Form (Dynamic based on role)
│           │   │   │           ├── [Student Fields]
│           │   │   │           │   ├── Full Name
│           │   │   │           │   ├── Birthday
│           │   │   │           │   ├── Grade Level
│           │   │   │           │   ├── Gender
│           │   │   │           │   └── ... (optional fields)
│           │   │   │           │
│           │   │   │           └── [Teacher Fields]
│           │   │   │               ├── Full Name
│           │   │   │               ├── Birthday
│           │   │   │               ├── Address
│           │   │   │               ├── Phone
│           │   │   │               └── ... (other fields)
│           │   │   │
│           │   └── /signup/success Layout
│           │       ├── SignupSuccessPage
│           │       ├── Card Container
│           │       ├── Success Icon
│           │       ├── Success Message
│           │       ├── Next Steps Section
│           │       └── Continue Button
│           │
│           └── /login Layout
│               ├── LoginPage
│               │   └── LoginPageContent
│               │       ├── Card Container
│               │       ├── Header
│               │       ├── Form
│               │       │   ├── [Profile Incomplete Warning] (Conditional)
│               │       │   ├── Email Field
│               │       │   ├── Password Field
│               │       │   ├── Forgot Password Link
│               │       │   └── Submit Button
│               │       └── Sign Up Link
│               │
│               └── (on success)
│                   └── /dashboard (via router.push)
```

---

## 🔐 Data Flow Diagram

```
USER INPUT
    ↓
┌───────────────────────────┐
│ Component State Update    │
│ (formData, errors)        │
└────────────┬──────────────┘
             ↓
┌───────────────────────────┐
│ Form Validation           │
│ (Frontend validation)     │
└────────────┬──────────────┘
             ↓
      ❌ Invalid? ──→ Show Error Messages
             │
             ↓ ✅ Valid

┌───────────────────────────┐
│ API Request               │
│ (userService call)        │
└────────────┬──────────────┘
             ↓
        API Server
        (Backend)
             ↓
┌───────────────────────────┐
│ API Response              │
│ (success or error)        │
└────────────┬──────────────┘
             ↓
      ❌ Error? ──→ Show Error Message
             │
             ↓ ✅ Success

┌───────────────────────────┐
│ Handle Response           │
│ - Store data              │
│ - Update state            │
│ - Redirect user           │
└────────────┬──────────────┘
             ↓
    NEXT PAGE or ACTION
```

---

## 📱 Responsive Layout Zones

```
Desktop (1024px+)
┌─────────────────────────────────────┐
│                                     │
│      ┌─────────────────────┐        │
│      │   Page Content      │        │
│      │   (max-width: 2xl)  │        │
│      │                     │        │
│      │  ┌───────────────┐  │        │
│      │  │   Card        │  │        │
│      │  │ (Centered)    │  │        │
│      │  └───────────────┘  │        │
│      │                     │        │
│      └─────────────────────┘        │
│                                     │
└─────────────────────────────────────┘

Tablet (641px - 1024px)
┌──────────────────────────────┐
│                              │
│     ┌──────────────────┐     │
│     │   Card           │     │
│     │  (Full width-p4) │     │
│     └──────────────────┘     │
│                              │
└──────────────────────────────┘

Mobile (320px - 640px)
┌──────────────────┐
│  ┌────────────┐  │
│  │  Card      │  │
│  │ (p-4)      │  │
│  └────────────┘  │
└──────────────────┘
```

---

## 🔄 API Call Sequence

```
┌─ Registration Flow ──────────────────┐
│                                      │
│  1. POST /users/register             │
│     Body: {email, password, role}    │
│     Response: {userId, email, role}  │
│  ↓                                   │
│  2. POST /users/verify-email         │
│     Body: {email, code}              │
│     Response: {userId, role}         │
│  ↓                                   │
│  3. POST /users/complete-profile/:id │
│     Body: {fullName, ...role fields} │
│     Response: {userId, email, role}  │
│  ↓                                   │
│  4. POST /users/login                │
│     Body: {email, password}          │
│     Response: {accessToken, user}    │
│                                      │
└──────────────────────────────────────┘

┌─ Resend Code (if needed) ────────────┐
│                                      │
│  POST /users/resend-verification     │
│  Body: {email}                       │
│  Response: {success, message}        │
│                                      │
└──────────────────────────────────────┘

┌─ Token Management ───────────────────┐
│                                      │
│  Store: accessToken (localStorage)   │
│  Store: refreshToken (HttpOnly)      │
│  Use: Bearer <accessToken> in header │
│                                      │
└──────────────────────────────────────┘
```

---

## ✅ Implementation Completeness

```
┌─────────────────────────────────────────┐
│   SIGNUP FLOW (100% COMPLETE)           │
├─────────────────────────────────────────┤
│ ✅ Role Selection Page                  │
│ ✅ Registration Page                    │
│ ✅ Email Verification Page              │
│ ✅ Profile Completion Page              │
│ ✅ Success Page                         │
│ ✅ All Validations                      │
│ ✅ All API Integrations                 │
│ ✅ All Error Handling                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   LOGIN FLOW (100% COMPLETE)            │
├─────────────────────────────────────────┤
│ ✅ Login Page                           │
│ ✅ Email Not Verified Handling          │
│ ✅ Profile Not Completed Handling       │
│ ✅ Invalid Credentials Handling         │
│ ✅ 3-Second Countdown Warning (NEW!)    │
│ ✅ Automatic Redirect Logic             │
│ ✅ Token Storage & Management           │
│ ✅ All Error Handling                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   UI/UX (100% COMPLETE)                 │
├─────────────────────────────────────────┤
│ ✅ Responsive Design                    │
│ ✅ GSAP Animations                      │
│ ✅ Loading States                       │
│ ✅ Error Messages                       │
│ ✅ Success Messages                     │
│ ✅ Form Validation Display              │
│ ✅ Countdown Timer                      │
│ ✅ Accessibility Features               │
└─────────────────────────────────────────┘
```

---

**Complete Visual Map Generated:** October 25, 2025  
**Implementation Status:** ✅ READY FOR TESTING
