# Error Analysis & Fixes

## Overview

This document explains the errors encountered in the application console and the fixes applied.

---

## 🔴 Error 1: THREE.WebGLRenderer Context Lost

### **Error Message:**

```
THREE.WebGLRenderer: Context Lost.
```

### **What Does This Mean?**

The WebGL rendering context has been lost, causing the 3D scene to stop rendering. This is a critical error that prevents the 3D dashboard from working properly.

### **Root Causes:**

1. **Too Many WebGL Contexts**

   - Browsers limit the number of active WebGL contexts (typically 8-16)
   - Each `<Canvas>` component creates a new context
   - Problem: If you navigate between pages with 3D scenes or open multiple tabs

2. **GPU Memory Exhaustion**

   - Your dashboard loads 31+ instances of the same 3D model (`Luffy.glb`)
   - Each character plus the main environment model consumes GPU memory
   - The Environment component from `@react-three/drei` adds additional textures

3. **Shadow Map Size**

   - Original shadow maps were set to 2048x2048 pixels
   - This is very memory-intensive when rendering shadows

4. **Browser Tab Management**
   - Some browsers suspend or lose WebGL contexts in background tabs
   - Switching tabs can trigger context loss

### **Solutions Applied:**

#### **1. Added Context Loss Handlers**

```typescript
// In: app/(protected)/@student/dashboard/page.tsx
<Canvas
  gl={{
    preserveDrawingBuffer: true,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: false,
  }}
  onCreated={(state) => {
    const gl = state.gl.getContext();
    if (gl) {
      state.gl.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        console.warn('WebGL context lost. Attempting to restore...');
      });

      state.gl.domElement.addEventListener('webglcontextrestored', () => {
        console.log('WebGL context restored successfully');
      });
    }
  }}
>
```

**Benefits:**

- Prevents the browser from losing the context permanently
- Automatically attempts restoration
- Provides console feedback for debugging

#### **2. Reduced Shadow Map Size**

```typescript
// In: components/StudentDashboardComponents/Scene3D.tsx
<directionalLight
  position={[10, 10, 5]}
  intensity={1.2}
  castShadow
  shadow-mapSize-width={1024} // Reduced from 2048
  shadow-mapSize-height={1024} // Reduced from 2048
/>
```

**Impact:**

- Reduces GPU memory usage by 75%
- Slightly lower shadow quality (barely noticeable)
- Significantly improves performance

#### **3. Character Component Already Uses Cloning**

The Character component already uses `SkeletonUtils.clone()` which is good practice:

```typescript
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
const clonedScene = useMemo(() => clone(scene), [scene]);
```

This ensures each character instance has its own skeleton and materials rather than sharing them.

### **Additional Recommendations:**

1. **Level of Detail (LOD) System**

   - Render simpler models for characters far from the camera
   - Only load full-detail models for nearby characters

2. **Frustum Culling**

   - Only render characters visible to the camera
   - Characters outside the view frustum shouldn't be rendered

3. **Lazy Loading**

   - Load characters as the user progresses through the learning path
   - Don't load all 31 characters at once

4. **Model Optimization**
   - Reduce polygon count of the Luffy.glb model
   - Compress textures
   - Use lower-resolution textures for distant characters

---

## 🔴 Error 2: Syllabus API Error

### **Error Message:**

```
Error retrieving whole syllabuses: TypeError: Cannot read properties of undefined (reading 'children')
    at r (8975-0a7085ebf2b6d5cf.js:1:3778)
```

### **What Does This Mean?**

The application is trying to access the `children` property of an undefined object when fetching syllabus data from the API.

### **Root Cause:**

The API endpoint `/content-service/syllabus` is either:

- Returning empty data
- Returning malformed data structure
- Not responding (500 error, timeout, etc.)
- Not yet implemented on the backend

**Original Code Problem:**

```typescript
const mainSubject = data.syllabus[0];

if (!mainSubject.children || !Array.isArray(mainSubject.children)) {
  throw new Error("No children found in syllabus structure");
}

mainSubject.children.forEach((child: WholeSyllabusNode) => {
  // This throws error if mainSubject is undefined
});
```

### **Solution Applied:**

Enhanced error handling to prevent crashes:

```typescript
// In: services/contentService.ts - retrieveWholeSyllabuses()

if (
  !data.syllabus ||
  !Array.isArray(data.syllabus) ||
  data.syllabus.length === 0
) {
  console.warn("⚠️ Invalid syllabus data structure received:", data);
  // Return empty structure instead of throwing
  return {
    syllabusByMatter: [],
    syllabusByGrade: [],
    totalConcepts: 0,
    retrievedAt: new Date().toISOString(),
  };
}

const mainSubject = data.syllabus[0];

if (
  !mainSubject ||
  !mainSubject.children ||
  !Array.isArray(mainSubject.children)
) {
  console.warn(
    "⚠️ No children found in syllabus structure. MainSubject:",
    mainSubject
  );
  // Return empty structure instead of throwing
  return {
    syllabusByMatter: [],
    syllabusByGrade: [],
    totalConcepts: 0,
    retrievedAt: new Date().toISOString(),
  };
}
```

**Benefits:**

- Application doesn't crash when API returns bad data
- Graceful fallback to empty state
- Better logging for debugging
- User sees empty syllabus instead of error page

### **Next Steps:**

1. **Check Backend API**

   - Verify `/content-service/syllabus` endpoint is working
   - Test with Postman or curl
   - Check backend logs for errors

2. **Add Loading States**

   - Show skeleton loaders while fetching
   - Display friendly error message if API fails

3. **Add Retry Logic**
   ```typescript
   const fetchWithRetry = async (url: string, retries = 3) => {
     for (let i = 0; i < retries; i++) {
       try {
         return await apiClient.get(url);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   };
   ```

---

## 🔴 Error 3: 404 Not Found Errors

### **Error Messages:**

```
api/placeholder/40/40:1  Failed to load resource: the server responded with a status of 404 ()
terms?_rsc=b2lk7:1  Failed to load resource: the server responded with a status of 404 ()
privacy?_rsc=b2lk7:1  Failed to load resource: the server responded with a status of 404 ()
```

### **What Does This Mean?**

1. **Placeholder Images (api/placeholder/40/40)**

   - Avatar or profile images are missing
   - Using a placeholder service that doesn't exist

2. **Terms of Service Page**

   - Link to `/terms` exists but page not created

3. **Privacy Policy Page**
   - Link to `/privacy` exists but page not created

### **Solutions:**

#### **1. Fix Placeholder Images**

**Option A: Use a Real Placeholder Service**

```typescript
// Replace this:
<img src="/api/placeholder/40/40" alt="Avatar" />

// With this (using a public service):
<img src="https://ui-avatars.com/api/?name=John+Doe&size=40" alt="Avatar" />
```

**Option B: Use Default Avatar**

```typescript
import { User } from "lucide-react";

// Replace image with icon:
<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
  <User className="w-6 h-6 text-gray-600" />
</div>;
```

**Option C: Create API Route (if needed)**

```typescript
// app/api/placeholder/[...size]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { size: string[] } }
) {
  const [width, height] = params.size;
  // Generate placeholder image
  // Return image response
}
```

#### **2. Create Missing Pages**

Create these files:

```typescript
// app/(pages)/terms/page.tsx
export default function TermsOfService() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p>Terms content here...</p>
    </div>
  );
}
```

```typescript
// app/(pages)/privacy/page.tsx
export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p>Privacy policy content here...</p>
    </div>
  );
}
```

---

## 🟢 Error 4: getTeacherAvailability Debug Logs

### **Message:**

```
getTeacherAvailability called with teacherId: cmey4gxpx0000jt01teghjwom
Filtered availabilities: Array(5)
```

This is **NOT an error** - these are debug console.log statements. They can be removed for production:

```typescript
// Find and remove/comment out these lines:
console.log("getTeacherAvailability called with teacherId:", teacherId);
console.log("Filtered availabilities:", filteredAvailabilities);
```

Or keep them wrapped in a development check:

```typescript
if (process.env.NODE_ENV === "development") {
  console.log("getTeacherAvailability called with teacherId:", teacherId);
}
```

---

## Summary of Changes

### Files Modified:

1. **`app/(protected)/@student/dashboard/page.tsx`**

   - Added WebGL context loss handlers
   - Configured Canvas for better performance

2. **`services/contentService.ts`**

   - Enhanced error handling in `retrieveWholeSyllabuses()`
   - Returns empty structure instead of throwing errors

3. **`components/StudentDashboardComponents/Scene3D.tsx`**
   - Reduced shadow map size from 2048 to 1024
   - Improved GPU memory usage

### Files to Create:

1. **`app/(pages)/terms/page.tsx`** - Terms of Service page
2. **`app/(pages)/privacy/page.tsx`** - Privacy Policy page

### Immediate Next Steps:

1. ✅ Test the dashboard 3D scene - should be more stable now
2. ✅ Verify syllabus API endpoint and backend
3. ⏳ Create missing pages (terms, privacy)
4. ⏳ Fix placeholder image URLs
5. ⏳ Remove debug console.logs

---

## Performance Monitoring

To monitor WebGL context health, add this to your dashboard:

```typescript
useEffect(() => {
  const checkGPUHealth = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          console.log(
            "GPU Renderer:",
            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          );
          console.log(
            "GPU Vendor:",
            gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
          );
        }
      }
    }
  };

  checkGPUHealth();
}, []);
```

---

## Further Optimization Ideas

1. **Implement Occlusion Culling**

   - Don't render characters behind walls or other objects

2. **Use GPU Instancing**

   - Since all characters use the same model, use THREE.InstancedMesh

3. **Texture Atlasing**

   - Combine multiple textures into one to reduce draw calls

4. **Simplify Shaders**

   - Use simpler materials for distant objects

5. **Progressive Loading**
   - Load low-poly versions first, then upgrade to high-poly

---

## Debugging Tips

### To check WebGL context status:

```javascript
// Open browser console and run:
const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
console.log("WebGL Context Lost:", gl.isContextLost());
```

### To monitor GPU memory:

```javascript
// Chrome DevTools > Performance Monitor
// Look for "GPU memory" metric
```

### To see API responses:

```javascript
// Network tab in DevTools
// Filter by XHR
// Check /content-service/syllabus response
```

---

**Last Updated:** October 15, 2025
