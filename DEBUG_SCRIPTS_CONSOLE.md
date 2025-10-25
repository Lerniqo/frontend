# 🧪 Debugging Script - Run in Browser Console

## Before You Start
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear localStorage: `localStorage.clear()`
4. Refresh page

---

## Script 1: Check localStorage Structure (Run After Registration)

```javascript
console.log("=== CHECKING AFTER REGISTRATION ===");
const regData = localStorage.getItem("userRegistrationData");
console.log("Raw data:", regData);

if (regData) {
  try {
    const parsed = JSON.parse(regData);
    console.log("✅ Parsed successfully:");
    console.log("  Email:", parsed.email);
    console.log("  Role:", parsed.role);
    console.log("  UserId:", parsed.userId || "❌ Not yet (expected)");
  } catch (e) {
    console.log("❌ Failed to parse:", e.message);
  }
} else {
  console.log("❌ userRegistrationData not found in localStorage");
}
```

---

## Script 2: Check localStorage After Email Verification

```javascript
console.log("=== CHECKING AFTER EMAIL VERIFICATION ===");
const verifyData = localStorage.getItem("userRegistrationData");
console.log("Raw data:", verifyData);

if (verifyData) {
  try {
    const parsed = JSON.parse(verifyData);
    console.log("✅ Parsed successfully:");
    console.log("  Email:", parsed.email);
    console.log("  Role:", parsed.role);
    console.log("  UserId:", parsed.userId);
    
    // Verify all required fields
    if (parsed.email && parsed.role && parsed.userId) {
      console.log("✅ ALL REQUIRED FIELDS PRESENT");
    } else {
      console.log("❌ MISSING FIELDS:");
      if (!parsed.email) console.log("  - email");
      if (!parsed.role) console.log("  - role");
      if (!parsed.userId) console.log("  - userId");
    }
  } catch (e) {
    console.log("❌ Failed to parse:", e.message);
  }
} else {
  console.log("❌ userRegistrationData not found in localStorage");
  console.log("⚠️  This will cause redirect to fail!");
}
```

---

## Script 3: Simulate Error Response Handling

```javascript
console.log("=== SIMULATING ERROR RESPONSE HANDLING ===");

// Simulate what userService does
const errorResponse = {
  userId: "cmh6jtl6v000pp301ejnvp306",
  profileCompleted: false,
  message: "Profile not completed. Please complete your profile first."
};

console.log("Backend error response:", errorResponse);
console.log("Role in response?", errorResponse.role ? "✅ YES" : "❌ NO");

// Check localStorage fallback
const storedData = localStorage.getItem("userRegistrationData");
let userRole = "Student"; // default

if (storedData) {
  try {
    const parsed = JSON.parse(storedData);
    if (parsed.role) {
      userRole = parsed.role;
      console.log("📋 Retrieved role from localStorage:", userRole);
    }
  } catch (e) {
    console.log("❌ Could not parse stored data");
  }
} else {
  console.log("❌ No stored data found, using default role");
}

console.log("Final user role:", userRole);
console.log("Will redirect with:", { userId: errorResponse.userId, role: userRole });
```

---

## Script 4: Check AuthContext Response

```javascript
console.log("=== CHECKING AUTHCONTEXT RESPONSE STRUCTURE ===");

// After login attempt, check what's being returned
// This would be logged internally, but you can verify:

const mockContextResponse = {
  success: false,
  message: "Please complete your profile to continue.",
  data: {
    user: {
      userId: "cmh6jtl6v000pp301ejnvp306",
      role: "Student", // <-- This should now be present
      email: "test@example.com"
    }
  }
};

console.log("Expected response structure:");
console.log(JSON.stringify(mockContextResponse, null, 2));

// Check if data exists
if (mockContextResponse.data?.user?.userId && mockContextResponse.data?.user?.role) {
  console.log("✅ Response structure is CORRECT");
  console.log("✅ Login page can access userId:", mockContextResponse.data.user.userId);
  console.log("✅ Login page can access role:", mockContextResponse.data.user.role);
} else {
  console.log("❌ Response structure is INCOMPLETE");
}
```

---

## Script 5: Monitor Login Attempt

```javascript
console.log("=== MONITORING LOGIN ATTEMPT ===");
console.log("Step 1: User enters credentials and clicks Sign In");
console.log("Step 2: Watch for one of these outcomes:\n");

console.log("EXPECTED OUTCOME (✅):");
console.log("  📋 Profile not completed - Countdown starting...");
console.log("  User ID: [uuid]");
console.log("  Role: Student");
console.log("  🔄 Redirecting to: /signup/complete-profile?userId=...&role=Student\n");

console.log("PROBLEM OUTCOME (❌):");
console.log("  ❌ Missing userId or role in response");
console.log("  Error: Unable to retrieve profile information\n");

console.log("CHECK IN DEVTOOLS:");
console.log("1. Watch Console tab for these logs");
console.log("2. Check Network tab - POST /users/login should be 401");
console.log("3. Check Application tab - localStorage should have userRegistrationData");
```

---

## Script 6: Full Diagnostic (Run After Everything)

```javascript
console.log("=== FULL DIAGNOSTIC CHECK ===\n");

// 1. Check localStorage
console.log("1️⃣  LocalStorage Check:");
const stored = localStorage.getItem("userRegistrationData");
if (stored) {
  const data = JSON.parse(stored);
  console.log("  ✅ userRegistrationData exists");
  console.log("     - email:", data.email ? "✅" : "❌");
  console.log("     - role:", data.role ? `✅ (${data.role})` : "❌");
  console.log("     - userId:", data.userId ? "✅" : "❌");
} else {
  console.log("  ❌ userRegistrationData NOT FOUND");
}

// 2. Check URL parameters
console.log("\n2️⃣  Current URL Check:");
const url = new URL(window.location.href);
const urlRole = url.searchParams.get("role");
const urlUserId = url.searchParams.get("userId");
console.log("  Role param:", urlRole ? `✅ (${urlRole})` : "❌ missing");
console.log("  UserId param:", urlUserId ? `✅ (${urlUserId})` : "❌ missing");

// 3. Check current page
console.log("\n3️⃣  Current Page Check:");
const pathname = window.location.pathname;
if (pathname.includes("complete-profile")) {
  console.log("  ✅ On complete-profile page");
} else if (pathname.includes("login")) {
  console.log("  ⏳ On login page");
} else {
  console.log("  📍 On:", pathname);
}

// 4. Summary
console.log("\n4️⃣  Summary:");
if (stored && JSON.parse(stored).role && urlRole === JSON.parse(stored).role) {
  console.log("  ✅ EVERYTHING LOOKS GOOD!");
} else {
  console.log("  ⚠️  CHECK ITEMS MARKED ❌ ABOVE");
}
```

---

## How to Use These Scripts

### Step 1: After Registration
Run Script 1 & 2 to verify role is stored

### Step 2: After Email Verification
Run Script 2 again to verify userId is added

### Step 3: During Login
Run Script 3 & 4 to verify response structure

### Step 4: After Redirect
Run Script 5 & 6 to verify complete flow

---

## Expected Console Output

### Good Flow ✅
```
=== CHECKING AFTER REGISTRATION ===
Raw data: {"email":"test@example.com","role":"Student"}
✅ Parsed successfully:
  Email: test@example.com
  Role: Student
  UserId: ❌ Not yet (expected)
```

### Problem Flow ❌
```
=== CHECKING AFTER REGISTRATION ===
❌ userRegistrationData not found in localStorage
⚠️  This will cause redirect to fail!
```

---

## Troubleshooting Commands

```javascript
// Clear all data
localStorage.clear()

// Clear specific data
localStorage.removeItem("userRegistrationData")

// View all localStorage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key + ":", localStorage.getItem(key));
}

// Check if localStorage is available
console.log("localStorage available:", typeof localStorage !== 'undefined')
```

---

## Real-Time Monitoring

```javascript
// Monitor localStorage changes
window.addEventListener('storage', (e) => {
  console.log("🔔 Storage changed:", e.key);
  console.log("   New value:", e.newValue);
});
```

---

## One-Click Test

Copy and run this entire script:

```javascript
console.clear();
console.log("🧪 RUNNING FULL TEST...\n");

// Test 1: localStorage
const test1 = () => {
  const data = localStorage.getItem("userRegistrationData");
  return data ? JSON.parse(data) : null;
};

// Test 2: Check email
const test2 = () => {
  const data = test1();
  return data?.email ? true : false;
};

// Test 3: Check role
const test3 = () => {
  const data = test1();
  return data?.role ? true : false;
};

// Test 4: Check userId
const test4 = () => {
  const data = test1();
  return data?.userId ? true : false;
};

const results = [
  { name: "localStorage exists", pass: test1() !== null },
  { name: "email stored", pass: test2() },
  { name: "role stored", pass: test3() },
  { name: "userId stored (after verification)", pass: test4() }
];

results.forEach((r, i) => {
  const icon = r.pass ? "✅" : "❌";
  console.log(`${i + 1}. ${icon} ${r.name}`);
});

const passCount = results.filter(r => r.pass).length;
console.log(`\n${passCount}/${results.length} tests passed`);

if (passCount === results.length) {
  console.log("🎉 ALL TESTS PASSED!");
} else if (passCount >= 2) {
  console.log("⚠️  PARTIAL SUCCESS - Some data missing");
} else {
  console.log("❌ TESTS FAILED - Check localStorage setup");
}
```

---

**Script Version:** 1.0  
**Last Updated:** October 25, 2025  
**Purpose:** Debug and verify profile redirect fix
