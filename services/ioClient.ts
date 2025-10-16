import { io, Socket } from 'socket.io-client';

/**
 * Callback function type for socket event listeners
 */
type SocketCallback = (data: any) => void;

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
  private subscriptions: Map<string, Set<SocketCallback>> = new Map();
  private config: SocketConfig = {
    url: (process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001').concat('realtime-service'),
    options: {
      autoConnect: false,
      reconnection: true,
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
  public async connect(config?: SocketConfig): Promise<void> {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
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
        this.socket = io(this.config.url!, this.config.options);

        // Setup connection event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket?.id);
          this.resubscribeAll();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('Socket reconnected after', attemptNumber, 'attempts');
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
      console.log('Socket disconnected manually');
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
  public subscribe(topic: string, callback: SocketCallback): () => void {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return () => {};
    }

    // Add callback to subscriptions map
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)!.add(callback);

    // Register the event listener with socket.io
    this.socket.on(topic, callback);

    console.log(`Subscribed to topic: ${topic}`);

    // Return unsubscribe function
    return () => this.unsubscribe(topic, callback);
  }

  /**
   * Unsubscribe a specific callback from a topic
   * @param topic The event name
   * @param callback The callback function to remove
   */
  public unsubscribe(topic: string, callback: SocketCallback): void {
    if (!this.socket) return;

    // Remove from subscriptions map
    const callbacks = this.subscriptions.get(topic);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscriptions.delete(topic);
      }
    }

    // Remove event listener from socket
    this.socket.off(topic, callback);

    console.log(`Unsubscribed from topic: ${topic}`);
  }

  /**
   * Unsubscribe all callbacks from a topic
   * @param topic The event name
   */
  public unsubscribeAll(topic: string): void {
    if (!this.socket) return;

    const callbacks = this.subscriptions.get(topic);
    if (callbacks) {
      callbacks.forEach((callback) => {
        this.socket?.off(topic, callback);
      });
      this.subscriptions.delete(topic);
      console.log(`Unsubscribed all callbacks from topic: ${topic}`);
    }
  }

  /**
   * Publish/emit data to a topic
   * @param topic The event name to emit to
   * @param data The data to send
   * @param callback Optional acknowledgment callback
   */
  public publish(topic: string, data?: any, callback?: (response: any) => void): void {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return;
    }

    if (!this.socket.connected) {
      console.warn('Socket not connected. Data may not be sent.');
    }

    if (callback) {
      this.socket.emit(topic, data, callback);
    } else {
      this.socket.emit(topic, data);
    }

    console.log(`Published to topic: ${topic}`, data);
  }

  /**
   * Publish data and wait for acknowledgment
   * @param topic The event name
   * @param data The data to send
   * @param timeout Optional timeout in milliseconds (default: 5000)
   * @returns Promise that resolves with the server response
   */
  public async publishWithAck(topic: string, data?: any, timeout: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timer = setTimeout(() => {
        reject(new Error(`Acknowledgment timeout for topic: ${topic}`));
      }, timeout);

      this.socket.emit(topic, data, (response: any) => {
        clearTimeout(timer);
        resolve(response);
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
    if (!this.socket) return;

    this.subscriptions.forEach((callbacks, topic) => {
      callbacks.forEach((callback) => {
        this.socket?.on(topic, callback);
      });
    });

    console.log('Resubscribed to all topics after reconnection');
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
    this.subscriptions.forEach((callbacks, topic) => {
      this.unsubscribeAll(topic);
    });
    console.log('Cleared all subscriptions');
  }
}

// Export singleton instance
export default IOClient.getInstance();

// Also export the class for typing purposes
export { IOClient };
export type { SocketCallback, SocketConfig };
