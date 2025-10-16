# Admin Routes Structure

This document outlines the restructured admin routes for the Lerniqo platform.

## Route Structure

The admin section has been broken down into the following protected routes

### `/dashboard`
- **Location**: `app/(protected)/@admin/dashboard/page.tsx`
- **Component**: `AdminOverview`
- **Description**: Main dashboard overview with statistics, quick actions, recent activity, and system health metrics

### `/user-management`
- **Location**: `app/(protected)/@admin/user-management/page.tsx`
- **Component**: `UserManagement`
- **Description**: Manage users, roles, and permissions across the platform

### `/content`
- **Location**: `app/(protected)/@admin/content/page.tsx`
- **Component**: `ContentManagement`
- **Description**: Manage courses, lessons, and learning graph structure

### `/analytics`
- **Location**: `app/(protected)/@admin/analytics/page.tsx`
- **Component**: `PlatformAnalytics`
- **Description**: Monitor platform performance, user engagement, and key metrics

## Layout Structure

### Admin Layout
- **Location**: `app/(protected)/@admin/layout.tsx`
- **Features**:
  - Responsive navigation bar with route links
  - Premium background with animated gradient mesh
  - Mobile-friendly sidebar navigation
  - Notification and profile dropdowns
  - Consistent styling across all admin routes

### Main Admin Page
- **Location**: `app/(protected)/@admin/page.tsx`
- **Behavior**: Automatically redirects to `/dashboard` after a loading animation

## Components

### AdminOverview
- **Location**: `components/AdminDashboard/AdminOverview.tsx`
- **Purpose**: Extracted from the original AdminDashboard for the dashboard route
- **Features**: Statistics grid, quick actions, recent activity, system health

### Individual Components
- `UserManagement` - User and role management functionality
- `ContentManagement` - Content and curriculum management
- `PlatformAnalytics` - Analytics and reporting dashboard

## Navigation

The admin layout provides:
- Desktop navigation with highlighted active routes
- Mobile hamburger menu for responsive design
- Direct navigation between admin sections
- Consistent branding and premium styling

## Usage

To navigate to admin routes, users can:
1. Access the main admin page (redirects to dashboard)
2. Use the navigation bar to switch between sections
3. Direct URL access to specific admin routes

All routes are protected and maintain the existing authentication system.
