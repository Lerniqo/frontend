/**
 * Socket.IO Event Types
 * 
 * Define your socket event types here for type safety across your application
 */

// ============================================================================
// Chat Events
// ============================================================================
export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
  room?: string;
}

export interface ChatTyping {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ChatSendData {
  text: string;
  userId: string;
  room?: string;
  timestamp: number;
}

// ============================================================================
// User Events
// ============================================================================
export interface UserOnline {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy';
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

// ============================================================================
// Notification Events
// ============================================================================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

// ============================================================================
// Dashboard Events
// ============================================================================
export interface DashboardStats {
  users: number;
  messages: number;
  activeRooms: number;
  uptime: number;
}

export interface DashboardUpdate {
  metric: string;
  value: number;
  change: number;
  timestamp: number;
}

// ============================================================================
// Room Events
// ============================================================================
export interface RoomData {
  room: string;
}

export interface RoomMessage {
  room: string;
  message: ChatMessage;
}

export interface RoomJoined {
  room: string;
  userId: string;
  userName: string;
}

export interface RoomLeft {
  room: string;
  userId: string;
}

// ============================================================================
// Form Events
// ============================================================================
export interface FormSubmission {
  name: string;
  email: string;
  message: string;
  timestamp?: number;
}

export interface FormResponse {
  success: boolean;
  message: string;
  id?: string;
}

// ============================================================================
// Real-time Collaboration Events
// ============================================================================
export interface DocumentUpdate {
  documentId: string;
  userId: string;
  content: string;
  cursor?: {
    line: number;
    column: number;
  };
  timestamp: number;
}

export interface CursorPosition {
  documentId: string;
  userId: string;
  userName: string;
  position: {
    line: number;
    column: number;
  };
}

// ============================================================================
// Game Events (Example)
// ============================================================================
export interface GameState {
  gameId: string;
  players: Array<{
    id: string;
    name: string;
    score: number;
  }>;
  status: 'waiting' | 'playing' | 'finished';
  currentTurn?: string;
}

export interface GameAction {
  gameId: string;
  playerId: string;
  action: string;
  data: any;
}

// ============================================================================
// Server Events
// ============================================================================
export interface ServerError {
  code: string;
  message: string;
  details?: any;
}

export interface ServerAcknowledgment {
  success: boolean;
  message?: string;
  data?: any;
}

// ============================================================================
// Socket Event Map
// Define all your socket events here for type-safe emit/on
// ============================================================================
export interface SocketEventMap {
  // Chat events
  'chat:message': ChatMessage;
  'chat:send': ChatSendData;
  'chat:typing': ChatTyping;
  
  // User events
  'user:online': UserOnline;
  'user:offline': string; // userId
  'user:status': UserStatus;
  'users:list': UserOnline[];
  
  // Notification events
  'notification': Notification;
  'notification:read': string; // notificationId
  
  // Dashboard events
  'dashboard:stats': DashboardStats;
  'dashboard:update': DashboardUpdate;
  'dashboard:user-count': number;
  'dashboard:request-stats': void;
  
  // Room events
  'join-room': RoomData;
  'leave-room': RoomData;
  'room:joined': RoomJoined;
  'room:left': RoomLeft;
  'room:message': RoomMessage;
  
  // Form events
  'form:submit': FormSubmission;
  'form:response': FormResponse;
  
  // Collaboration events
  'document:update': DocumentUpdate;
  'document:cursor': CursorPosition;
  
  // Game events
  'game:state': GameState;
  'game:action': GameAction;
  'game:join': { gameId: string; userId: string };
  'game:leave': { gameId: string; userId: string };
  
  // Server events
  'error': ServerError;
  'connect': void;
  'disconnect': string;
  'reconnect': number;
  'connect_error': Error;
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Extract event names from the event map
 */
export type SocketEventName = keyof SocketEventMap;

/**
 * Extract event data type for a specific event
 */
export type SocketEventData<T extends SocketEventName> = SocketEventMap[T];

/**
 * Type-safe callback for socket events
 */
export type TypedSocketCallback<T extends SocketEventName> = (
  data: SocketEventData<T>
) => void;

// ============================================================================
// Usage Example
// ============================================================================
/*
import ioClient from '@/services/ioClient';
import type { SocketEventData, TypedSocketCallback } from '@/types/socket.types';

// Type-safe subscribe
const handleChatMessage: TypedSocketCallback<'chat:message'> = (message) => {
  console.log(message.text); // TypeScript knows the shape of message
};

ioClient.subscribe('chat:message', handleChatMessage);

// Type-safe publish
const chatData: SocketEventData<'chat:send'> = {
  text: 'Hello',
  userId: '123',
  timestamp: Date.now(),
};

ioClient.publish('chat:send', chatData);
*/
