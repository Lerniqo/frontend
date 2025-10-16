/**
 * Example React Components demonstrating Socket.IO usage
 * with the custom hooks
 */

'use client';

import { useState } from 'react';
import {
  useSocket,
  useSocketEvent,
  useSocketPublish,
  useSocketRoom,
  useSocketStatus,
} from '@/hooks/useSocket';

// ============================================================================
// Example 1: Simple Chat Component
// ============================================================================
export function SimpleChatComponent() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const { isConnected } = useSocket();
  const { publish } = useSocketPublish();

  // Subscribe to incoming messages
  useSocketEvent('chat:message', (message) => {
    setMessages((prev) => [...prev, message]);
  });

  const sendMessage = () => {
    if (inputText.trim()) {
      publish('chat:send', {
        text: inputText,
        userId: 'current-user',
        timestamp: Date.now(),
      });
      setInputText('');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-2">
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      <div className="border rounded p-4 mb-4 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-bold">{msg.userId}: </span>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 2: Real-time Notifications
// ============================================================================
export function NotificationComponent() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { isConnected } = useSocket();

  // Subscribe to notifications
  useSocketEvent('notification', (notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Keep last 10
  });

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
          {isConnected ? '● Online' : '● Offline'}
        </span>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <>
          <div className="space-y-2">
            {notifications.map((notif, idx) => (
              <div key={idx} className="border rounded p-3 bg-blue-50">
                <div className="font-semibold">{notif.title}</div>
                <div className="text-sm text-gray-600">{notif.message}</div>
              </div>
            ))}
          </div>
          <button
            onClick={clearNotifications}
            className="mt-4 text-sm text-blue-500 hover:underline"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Example 3: Room-based Chat
// ============================================================================
export function RoomChatComponent() {
  const [room, setRoom] = useState('general');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  
  const { isConnected } = useSocket();
  const { publish } = useSocketPublish();
  const { isJoined } = useSocketRoom(room);

  // Subscribe to room messages
  useSocketEvent(`room:${room}:message`, (message) => {
    setMessages((prev) => [...prev, message]);
  });

  const sendMessage = () => {
    if (inputText.trim() && isJoined) {
      publish(`room:${room}:send`, {
        text: inputText,
        userId: 'current-user',
        timestamp: Date.now(),
      });
      setInputText('');
    }
  };

  const changeRoom = (newRoom: string) => {
    setMessages([]);
    setRoom(newRoom);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => changeRoom('general')}
            className={`px-4 py-2 rounded ${
              room === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            General
          </button>
          <button
            onClick={() => changeRoom('tech')}
            className={`px-4 py-2 rounded ${
              room === 'tech' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Tech
          </button>
          <button
            onClick={() => changeRoom('random')}
            className={`px-4 py-2 rounded ${
              room === 'random' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Random
          </button>
        </div>
        <div className="text-sm">
          {isConnected && isJoined
            ? `✓ Connected to ${room}`
            : '✗ Not connected'}
        </div>
      </div>

      <div className="border rounded p-4 mb-4 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-bold">{msg.userId}: </span>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
          disabled={!isJoined}
        />
        <button
          onClick={sendMessage}
          disabled={!isJoined}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Dashboard with Real-time Stats
// ============================================================================
export function DashboardComponent() {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    activeRooms: 0,
  });
  const { isConnected, socketId } = useSocketStatus();

  // Subscribe to dashboard updates
  useSocketEvent('dashboard:stats', (newStats) => {
    setStats(newStats);
  });

  useSocketEvent('dashboard:user-count', (count) => {
    setStats((prev) => ({ ...prev, users: count }));
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm">
          <div>Status: {isConnected ? '🟢 Online' : '🔴 Offline'}</div>
          <div className="text-gray-500">Socket ID: {socketId}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded p-4 bg-blue-50">
          <div className="text-3xl font-bold">{stats.users}</div>
          <div className="text-gray-600">Online Users</div>
        </div>
        <div className="border rounded p-4 bg-green-50">
          <div className="text-3xl font-bold">{stats.messages}</div>
          <div className="text-gray-600">Messages Sent</div>
        </div>
        <div className="border rounded p-4 bg-purple-50">
          <div className="text-3xl font-bold">{stats.activeRooms}</div>
          <div className="text-gray-600">Active Rooms</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Form with Acknowledgment
// ============================================================================
export function FormWithAckComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const { publishWithAck, isLoading, error } = useSocketPublish();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      const response = await publishWithAck('form:submit', {
        name,
        email,
        message,
      });

      console.log('Server response:', response);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Failed to submit:', err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Contact Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Submit'}
        </button>

        {error && (
          <div className="text-red-500 text-sm">
            Error: {error.message}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm">
            ✓ Form submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
}

// ============================================================================
// Example 6: Online Users List
// ============================================================================
export function OnlineUsersComponent() {
  const [users, setUsers] = useState<any[]>([]);
  const { isConnected } = useSocket();

  // Subscribe to user events
  useSocketEvent('user:online', (user) => {
    setUsers((prev) => [...prev, user]);
  });

  useSocketEvent('user:offline', (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  });

  useSocketEvent('users:list', (userList) => {
    setUsers(userList);
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Online Users ({users.length})</h2>
      
      {!isConnected && (
        <div className="text-red-500 mb-4">Not connected to server</div>
      )}

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 p-2 border rounded">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-green-500">● Online</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
