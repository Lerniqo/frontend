import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

/**
 * Callback function type for socket event listeners
 */
type SocketCallback<T = unknown> = (data: T) => void;

/**
 * Configuration options for the Socket.IO client
 */
interface SocketConfig {
  url?: string;
  options?: {
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    timeout?: number;
    [key: string]: any;
  };
}

/**
 * Singleton Socket.IO Client
 * Manages WebSocket connections with subscribe/publish pattern
 */
class IOClient {
  private static instance: IOClient;
  private socket: Socket | null = null;
  private subscriptions: Map<string, Set<(data: unknown) => void>> = new Map();
  /**
   * Maps topic -> (original callback -> wrapped handler)
   * We use WeakMap for per-topic mapping so original callback functions can be garbage collected.
   */
  private subscriptionWrappers: Map<string, WeakMap<(...args: unknown[]) => unknown, (data: unknown) => void>> = new Map();
  private config: SocketConfig = {
    url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    options: {
      autoConnect: false,
      reconnection: true,
      transports: ['polling', 'websocket'],
      withCredentials: true,
      path: '/dev/socket.io',
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    },
  };

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance of IOClient
   * @returns IOClient instance
   */
  public static getInstance(): IOClient {
    if (!IOClient.instance) {
      IOClient.instance = new IOClient();
    }
    return IOClient.instance;
  }

  /**
   * Initialize and connect the socket
   * @param config Optional configuration to override defaults
   * @returns Promise that resolves when connected
   */
  public connect(config?: SocketConfig): Promise<void> {
    if (this.socket?.connected) {
      console.debug('Socket already connected');
      return Promise.resolve();
    }

    // Merge custom config with defaults
    if (config) {
      this.config = {
        url: config.url || this.config.url,
        options: { ...this.config.options, ...config.options },
      };
    }

    return new Promise((resolve, reject) => {
      try {
        const url = this.config.url ?? 'http://localhost:3001';
        this.socket = io(url, this.config.options);

        // Setup connection event handlers
        this.socket.on('connect', () => {
          console.debug('Socket connected:', this.socket?.id);
          this.resubscribeAll();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.debug('Socket disconnected:', reason);
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.debug('Socket reconnected after', attemptNumber, 'attempts');
          this.resubscribeAll();
        });

        this.socket.on('reconnect_error', (error) => {
          console.error('Socket reconnection error:', error);
        });

        this.socket.on('reconnect_failed', () => {
          console.error('Socket reconnection failed');
        });

        // Connect the socket
        this.socket.connect();
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect the socket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.debug('Socket disconnected manually');
    }
  }

  /**
   * Check if socket is connected
   * @returns boolean indicating connection status
   */
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get the socket ID
   * @returns Socket ID or null if not connected
   */
  public getSocketId(): string | null {
    return this.socket?.id || null;
  }

  /**
   * Subscribe to a topic/event with a callback
   * @param topic The event name to subscribe to
   * @param callback Function to call when event is received
   * @returns Function to unsubscribe
   */
  public subscribe<T = unknown>(topic: string, callback: SocketCallback<T>): () => void {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return () => {};
    }

    const socket = this.socket;

    // Ensure we have a WeakMap to find wrappers for this topic
    let wrappersForTopic = this.subscriptionWrappers.get(topic);
    if (!wrappersForTopic) {
      wrappersForTopic = new WeakMap<(...args: unknown[]) => unknown, (data: unknown) => void>();
      this.subscriptionWrappers.set(topic, wrappersForTopic);
    }

    // Create a wrapper that performs a safe cast to the expected payload type
    const wrapped = (data: unknown) => {
      try {
        callback(data as T);
      } catch (err) {
        console.error('Error in socket callback for topic:', topic, err);
      }
    };

    // Store the wrapper in our internal subscriptions set
    let callbacks = this.subscriptions.get(topic);
    if (!callbacks) {
      callbacks = new Set<(data: unknown) => void>();
      this.subscriptions.set(topic, callbacks);
    }
    callbacks.add(wrapped);
    wrappersForTopic.set(callback as (...args: unknown[]) => unknown, wrapped);

    // Register the event listener with socket.io
    socket.on(topic, wrapped);

    console.debug(`Subscribed to topic: ${topic}`);

    // Return unsubscribe function
    return () => this.unsubscribe(topic, callback);
  }

  /**
   * Unsubscribe a specific callback from a topic
   * @param topic The event name
   * @param callback The callback function to remove
   */
  public unsubscribe<T = unknown>(topic: string, callback: SocketCallback<T>): void {
    const socket = this.socket;
    if (!socket) return;

    // Try to find the wrapper for the original callback
    const wrappersForTopic = this.subscriptionWrappers.get(topic);
    const wrapped = wrappersForTopic?.get(callback as (...args: unknown[]) => unknown);
    const callbacks = this.subscriptions.get(topic);

    if (wrapped) {
      wrappersForTopic?.delete(callback as (...args: unknown[]) => unknown);
      callbacks?.delete(wrapped);
      socket.off(topic, wrapped);
      if (callbacks && callbacks.size === 0) {
        this.subscriptions.delete(topic);
      }
      console.debug(`Unsubscribed from topic: ${topic}`);
      return;
    }

    // Fallback: maybe the provided callback was previously passed directly as the handler
    if (callbacks && callbacks.has(callback as unknown as (data: unknown) => void)) {
      const direct = callback as unknown as (data: unknown) => void;
      callbacks.delete(direct);
      socket.off(topic, direct);
      if (callbacks.size === 0) {
        this.subscriptions.delete(topic);
      }
      console.debug(`Unsubscribed from topic: ${topic}`);
    }
  }

  /**
   * Unsubscribe all callbacks from a topic
   * @param topic The event name
   */
  public unsubscribeAll(topic: string): void {
    const socket = this.socket;
    if (!socket) return;

    const callbacks = this.subscriptions.get(topic);
    if (callbacks) {
      callbacks.forEach((wrapped) => {
        socket.off(topic, wrapped);
      });
      this.subscriptions.delete(topic);
    }

    // Remove wrapper map for topic (WeakMap cannot be iterated; removing reference is sufficient)
    this.subscriptionWrappers.delete(topic);
    console.debug(`Unsubscribed all callbacks from topic: ${topic}`);
  }

  /**
   * Publish/emit data to a topic
   * @param topic The event name to emit to
   * @param data The data to send
   * @param callback Optional acknowledgment callback
   */
  public publish(topic: string, data?: unknown, callback?: (response: unknown) => void): void {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return;
    }

    if (!this.socket.connected) {
      console.warn('Socket not connected. Data may not be sent.');
    }

    if (callback) {
      this.socket.emit(topic, data, callback as (...args: unknown[]) => void);
    } else {
      this.socket.emit(topic, data);
    }

    console.debug(`Published to topic: ${topic}`, data);
  }

  /**
   * Publish data and wait for acknowledgment
   * @param topic The event name
   * @param data The data to send
   * @param timeout Optional timeout in milliseconds (default: 5000)
   * @returns Promise that resolves with the server response
   */
  public publishWithAck<T = unknown>(topic: string, data?: unknown, timeout = 5000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timer = setTimeout(() => {
        reject(new Error(`Acknowledgment timeout for topic: ${topic}`));
      }, timeout);

      this.socket.emit(topic, data, (response: unknown) => {
        clearTimeout(timer);
        resolve(response as T);
      });
    });
  }

  /**
   * Join a room (if backend supports rooms)
   * @param room The room name to join
   */
  public joinRoom(room: string): void {
    this.publish('join-room', { room });
  }

  /**
   * Leave a room (if backend supports rooms)
   * @param room The room name to leave
   */
  public leaveRoom(room: string): void {
    this.publish('leave-room', { room });
  }

  /**
   * Re-subscribe to all topics after reconnection
   * @private
   */
  private resubscribeAll(): void {
    const socket = this.socket;
    if (!socket) return;

    this.subscriptions.forEach((callbacks, topic) => {
      callbacks.forEach((wrapped) => {
        socket.on(topic, wrapped);
      });
    });

    console.debug('Resubscribed to all topics after reconnection');
  }

  /**
   * Get all active subscriptions
   * @returns Array of subscribed topic names
   */
  public getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Clear all subscriptions
   */
  public clearAllSubscriptions(): void {
    const socket = this.socket;
    if (!socket) {
      // Clear internal maps even when socket is not present
      this.subscriptions.clear();
      this.subscriptionWrappers.clear();
      console.debug('Cleared all subscriptions');
      return;
    }

    this.subscriptions.forEach((callbacks, topic) => {
      callbacks.forEach((wrapped) => {
        socket.off(topic, wrapped);
      });
    });

    this.subscriptions.clear();
    this.subscriptionWrappers.clear();
    console.debug('Cleared all subscriptions');
  }
}

// Export singleton instance
export default IOClient.getInstance();

// Also export the class for typing purposes
export { IOClient };
export type { SocketCallback, SocketConfig };
