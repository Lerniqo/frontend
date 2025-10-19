/**
 * Socket.IO Demo Page
 * 
 * Test page to demonstrate Socket.IO client functionality
 * Visit this page to test real-time communication
 */

'use client';

import { useState, useEffect } from 'react';
import {
  useSocket,
  useSocketEvent,
  useSocketPublish,
  useSocketStatus,
} from '@/hooks/useSocket';
import ioClient from '@/services/ioClient';

export default function SocketDemoPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [testEvent, setTestEvent] = useState('test:message');
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  
  const { isConnected, error } = useSocket();
  const { socketId } = useSocketStatus();
  const { publish, publishWithAck, isLoading } = useSocketPublish();

  // Add log helper
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  // Monitor connection status
  useEffect(() => {
    if (isConnected) {
      addLog('✅ Connected to Socket.IO server');
    } else {
      addLog('❌ Disconnected from server');
    }
  }, [isConnected]);

  // Monitor errors
  useEffect(() => {
    if (error) {
      addLog(`❌ Error: ${error.message}`);
    }
  }, [error]);

  // Update subscriptions list
  useEffect(() => {
    const interval = setInterval(() => {
      setSubscriptions(ioClient.getActiveSubscriptions());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Test event subscriber
  useSocketEvent('test:message', (data) => {
    addLog(`📨 Received test:message - ${JSON.stringify(data)}`);
  });

  useSocketEvent('test:response', (data) => {
    addLog(`📨 Received test:response - ${JSON.stringify(data)}`);
  });

  // Send test message
  const sendTestMessage = () => {
    if (testMessage.trim()) {
      publish(testEvent, {
        message: testMessage,
        timestamp: Date.now(),
        from: socketId,
      });
      addLog(`📤 Sent to ${testEvent}: ${testMessage}`);
      setTestMessage('');
    }
  };

  // Send with acknowledgment
  const sendWithAck = async () => {
    if (testMessage.trim()) {
      try {
        const response = await publishWithAck(
          testEvent,
          {
            message: testMessage,
            timestamp: Date.now(),
            from: socketId,
          },
          5000
        );
        addLog(`✅ Acknowledged: ${JSON.stringify(response)}`);
        setTestMessage('');
      } catch (err) {
        addLog(`❌ Acknowledgment failed: ${err}`);
      }
    }
  };

  // Manual connect
  const handleConnect = async () => {
    try {
      await ioClient.connect();
      addLog('🔄 Reconnecting...');
    } catch (err) {
      addLog(`❌ Connection failed: ${err}`);
    }
  };

  // Manual disconnect
  const handleDisconnect = () => {
    ioClient.disconnect();
    addLog('🔌 Disconnected');
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Test multiple subscriptions
  const testMultipleSubscriptions = () => {
    const events = ['event1', 'event2', 'event3'];
    events.forEach((event) => {
      ioClient.subscribe(event, (data) => {
        addLog(`📨 ${event}: ${JSON.stringify(data)}`);
      });
    });
    addLog(`✅ Subscribed to ${events.join(', ')}`);
  };

  // Clear all subscriptions
  const clearSubscriptions = () => {
    ioClient.clearAllSubscriptions();
    addLog('🗑️ Cleared all subscriptions');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Socket.IO Client Demo
        </h1>

        {/* Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Connection Status
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-lg font-bold">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Socket ID
            </h3>
            <p className="text-lg font-mono truncate">
              {socketId || 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Active Subscriptions
            </h3>
            <p className="text-lg font-bold">{subscriptions.length}</p>
            {subscriptions.length > 0 && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {subscriptions.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Controls</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={handleConnect}
              disabled={isConnected}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-green-600"
            >
              Connect
            </button>
            <button
              onClick={handleDisconnect}
              disabled={!isConnected}
              className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-red-600"
            >
              Disconnect
            </button>
            <button
              onClick={testMultipleSubscriptions}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Subscriptions
            </button>
            <button
              onClick={clearSubscriptions}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Clear Subscriptions
            </button>
          </div>

          {/* Message Sender */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={testEvent}
                onChange={(e) => setTestEvent(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="test:message"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Message
              </label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
                className="w-full border rounded px-3 py-2"
                placeholder="Type a test message..."
                disabled={!isConnected}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={sendTestMessage}
                disabled={!isConnected || !testMessage.trim()}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600"
              >
                Send Message
              </button>
              <button
                onClick={sendWithAck}
                disabled={!isConnected || !testMessage.trim() || isLoading}
                className="flex-1 bg-purple-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-purple-600"
              >
                {isLoading ? 'Sending...' : 'Send with Ack'}
              </button>
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Event Log</h2>
            <button
              onClick={clearLogs}
              className="text-sm text-blue-500 hover:underline"
            >
              Clear
            </button>
          </div>
          
          <div className="bg-gray-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No events yet...</p>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className="text-green-400 mb-1 hover:bg-gray-800 px-2 py-1"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold mb-2">📚 Instructions</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Make sure your Socket.IO server is running</li>
            <li>Set NEXT_PUBLIC_SOCKET_URL in .env.local</li>
            <li>Connection happens automatically on page load</li>
            <li>Try sending messages with different event names</li>
            <li>Watch the event log for incoming messages</li>
            <li>Test acknowledgments to see request-response pattern</li>
          </ul>
        </div>

        {/* API Info */}
        <div className="bg-gray-100 rounded-lg p-6 mt-4">
          <h3 className="text-lg font-bold mb-2">🔧 Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Subscribe to event:</h4>
              <code className="bg-gray-800 text-green-400 px-2 py-1 rounded block">
                {`ioClient.subscribe('event', callback)`}
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Publish event:</h4>
              <code className="bg-gray-800 text-green-400 px-2 py-1 rounded block">
                {`ioClient.publish('event', data)`}
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Check connection:</h4>
              <code className="bg-gray-800 text-green-400 px-2 py-1 rounded block">
                ioClient.isConnected()
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Get socket ID:</h4>
              <code className="bg-gray-800 text-green-400 px-2 py-1 rounded block">
                ioClient.getSocketId()
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
