/**
 * Tracking and Analytics Types
 * Defines event types and data structures for user activity tracking
 */

// Base event data interfaces for different activity types

export interface QuizAttemptEventData {
  quizId: string;
  quizTitle: string;
  questionId?: string;
  questionNumber?: number;
  selectedAnswer?: string;
  isCorrect?: boolean;
  score?: number;
  totalQuestions?: number;
  timeSpent?: number; // in seconds
  completionPercentage?: number;
}

export interface LoginEventData {
  loginMethod: 'email' | 'google' | 'oauth';
  deviceType?: string;
  browser?: string;
  ipAddress?: string;
  isSuccessful: boolean;
  failureReason?: string;
}

export interface SignupEventData {
  userRole: 'Student' | 'Teacher' | 'Admin';
  referralSource?: string;
  isSuccessful: boolean;
  completedProfile: boolean;
}

export interface DocumentViewEventData {
  documentId: string;
  documentTitle: string;
  documentType: 'pdf' | 'video' | 'image' | 'text' | 'audio' | '3d-model';
  duration?: number; // in seconds
  progressPercentage?: number;
  pageNumber?: number;
  totalPages?: number;
}

export interface LessonProgressEventData {
  lessonId: string;
  lessonTitle: string;
  courseId?: string;
  courseName?: string;
  progressPercentage: number;
  timeSpent: number; // in seconds
  completed: boolean;
  modulesCompleted?: number;
  totalModules?: number;
}

export interface ForumActivityEventData {
  forumId: string;
  threadId?: string;
  postId?: string;
  activityType: 'view' | 'post' | 'reply' | 'like' | 'share';
  contentLength?: number;
  tags?: string[];
}

export interface AITutorInteractionEventData {
  sessionId: string;
  messageId?: string;
  interactionType: 'question' | 'response' | 'feedback';
  subject?: string;
  topic?: string;
  messageLength?: number;
  responseTime?: number; // in milliseconds
  satisfactionRating?: number; // 1-5
}

export interface WebinarEventData {
  webinarId: string;
  webinarTitle: string;
  eventType: 'join' | 'leave' | 'interact' | 'complete';
  duration?: number; // in seconds
  attendancePercentage?: number;
  interactionCount?: number;
}

export interface ResourceAccessEventData {
  resourceId: string;
  resourceTitle: string;
  resourceType: 'document' | 'video' | 'audio' | 'interactive';
  accessType: 'view' | 'download' | 'share';
  categoryId?: string;
  categoryName?: string;
}

export interface NavigationEventData {
  fromPage: string;
  toPage: string;
  navigationMethod: 'link' | 'button' | 'breadcrumb' | 'back' | 'forward';
  timeOnPreviousPage?: number; // in seconds
}

export interface SearchEventData {
  searchQuery: string;
  searchType: 'lesson' | 'resource' | 'forum' | 'global';
  resultsCount: number;
  selectedResultIndex?: number;
  selectedResultId?: string;
}

export interface SettingsChangeEventData {
  settingCategory: 'profile' | 'privacy' | 'notifications' | 'preferences';
  settingKey: string;
  oldValue?: any;
  newValue: any;
}

// Union type for all possible event data types
export type TrackingEventData =
  | QuizAttemptEventData
  | LoginEventData
  | SignupEventData
  | DocumentViewEventData
  | LessonProgressEventData
  | ForumActivityEventData
  | AITutorInteractionEventData
  | WebinarEventData
  | ResourceAccessEventData
  | NavigationEventData
  | SearchEventData
  | SettingsChangeEventData;

// Event type enumeration
export enum TrackingEventType {
  QUIZ_ATTEMPT = 'quiz_attempt',
  LOGIN = 'login',
  SIGNUP = 'signup',
  DOCUMENT_VIEW = 'document_view',
  LESSON_PROGRESS = 'lesson_progress',
  FORUM_ACTIVITY = 'forum_activity',
  AI_TUTOR_INTERACTION = 'ai_tutor_interaction',
  WEBINAR_EVENT = 'webinar_event',
  RESOURCE_ACCESS = 'resource_access',
  NAVIGATION = 'navigation',
  SEARCH = 'search',
  SETTINGS_CHANGE = 'settings_change',
}

// Base tracking activity interface
export interface BaseTrackingActivity {
  type: TrackingEventType | string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// Specific tracking activity with typed event data
export interface TrackingActivity<T extends TrackingEventData = TrackingEventData> 
  extends BaseTrackingActivity {
  eventData?: T;
}

// API payload for tracking events
export interface TrackingEventPayload {
  type: TrackingEventType | string;
  timestamp: number;
  eventData?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

// Response from tracking API
export interface TrackingEventResponse {
  success: boolean;
  eventId?: string;
  message?: string;
}

// Hook input type for better type safety
export interface TrackEventInput<T extends TrackingEventData = TrackingEventData> {
  type: TrackingEventType | string;
  data?: T;
  userId?: string;
  sessionId?: string;
}
