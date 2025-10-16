/**
 * Custom React Hooks for Socket.IO Client
 * 
 * These hooks provide easy integration of the IOClient singleton
 * into React components with proper cleanup and state management.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import ioClient, { SocketCallback } from '@/services/ioClient';

/**
 * Hook to manage socket connection
 * Connects on mount and provides connection status
 * 
 * @param config Optional socket configuration
 * @returns Connection state and utilities
 */
export function useSocket(config?: Parameters<typeof ioClient.connect>[0]) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      try {
        if (!ioClient.isConnected()) {
          await ioClient.connect(config);
        }
        setIsConnected(true);
        setSocketId(ioClient.getSocketId());
      } catch (err) {
        setError(err as Error);
        console.error('Socket connection failed:', err);
      }
    };

    initSocket();

    // Optional: Disconnect on unmount (careful - other components might be using it)
    // return () => {
    //   ioClient.disconnect();
    // };
  }, [config]);

  const reconnect = useCallback(async () => {
    try {
      setError(null);
      await ioClient.connect(config);
      setIsConnected(true);
      setSocketId(ioClient.getSocketId());
    } catch (err) {
      setError(err as Error);
    }
  }, [config]);

  return {
    isConnected,
    socketId,
    error,
    reconnect,
  };
}

/**
 * Hook to subscribe to a socket event
 * Automatically subscribes on mount and unsubscribes on unmount
 * 
 * @param event Event name to subscribe to
 * @param callback Function to call when event is received
 * @param enabled Whether the subscription is active (default: true)
 * @returns Connection status
 */
export function useSocketEvent<T = any>(
  event: string,
  callback: (data: T) => void,
  enabled: boolean = true
) {
  const [isConnected, setIsConnected] = useState(false);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const ensureConnection = async () => {
      if (!ioClient.isConnected()) {
        try {
          await ioClient.connect();
        } catch (error) {
          console.error('Failed to connect:', error);
          return;
        }
      }
      setIsConnected(true);
    };

    ensureConnection();

    // Use a wrapper to call the latest callback
    const wrapper = (data: T) => {
      callbackRef.current(data);
    };

    const unsubscribe = ioClient.subscribe(event, wrapper);

    return () => {
      unsubscribe();
    };
  }, [event, enabled]);

  return { isConnected };
}

/**
 * Hook to manage multiple socket subscriptions
 * 
 * @param subscriptions Array of event-callback pairs
 * @returns Connection status and utilities
 */
export function useSocketEvents(
  subscriptions: Array<{ event: string; callback: SocketCallback }>
) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ensureConnection = async () => {
      if (!ioClient.isConnected()) {
        try {
          await ioClient.connect();
        } catch (error) {
          console.error('Failed to connect:', error);
          return;
        }
      }
      setIsConnected(true);
    };

    ensureConnection();

    const unsubscribers = subscriptions.map(({ event, callback }) =>
      ioClient.subscribe(event, callback)
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [subscriptions]);

  return { isConnected };
}

/**
 * Hook to publish socket events with acknowledgment
 * Returns a function to publish events
 * 
 * @returns Publish functions and loading state
 */
export function useSocketPublish() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const publish = useCallback(
    (event: string, data?: any, callback?: (response: any) => void) => {
      try {
        setError(null);
        ioClient.publish(event, data, callback);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to publish:', err);
      }
    },
    []
  );

  const publishWithAck = useCallback(
    async <T = any,>(event: string, data?: any, timeout?: number): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ioClient.publishWithAck(event, data, timeout);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    publish,
    publishWithAck,
    isLoading,
    error,
  };
}

/**
 * Hook to manage socket room subscriptions
 * Automatically joins on mount and leaves on unmount
 * 
 * @param room Room name to join
 * @param enabled Whether to join the room (default: true)
 * @returns Room status and utilities
 */
export function useSocketRoom(room: string, enabled: boolean = true) {
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const ensureConnection = async () => {
      if (!ioClient.isConnected()) {
        try {
          await ioClient.connect();
        } catch (error) {
          console.error('Failed to connect:', error);
          return;
        }
      }

      ioClient.joinRoom(room);
      setIsJoined(true);
    };

    ensureConnection();

    return () => {
      ioClient.leaveRoom(room);
      setIsJoined(false);
    };
  }, [room, enabled]);

  return { isJoined };
}

/**
 * Hook to get socket connection status
 * Re-checks status periodically
 * 
 * @param interval Check interval in ms (default: 1000)
 * @returns Connection status and socket ID
 */
export function useSocketStatus(interval: number = 1000) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      setIsConnected(ioClient.isConnected());
      setSocketId(ioClient.getSocketId());
    };

    checkStatus();
    const timer = setInterval(checkStatus, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return {
    isConnected,
    socketId,
  };
}

/**
 * Hook to listen for a single event occurrence
 * Automatically unsubscribes after the first event
 * 
 * @param event Event name to listen for
 * @param callback Function to call when event is received
 * @param enabled Whether the listener is active (default: true)
 */
export function useSocketEventOnce<T = any>(
  event: string,
  callback: (data: T) => void,
  enabled: boolean = true
) {
  const [isConnected, setIsConnected] = useState(false);
  const callbackRef = useRef(callback);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const ensureConnection = async () => {
      if (!ioClient.isConnected()) {
        try {
          await ioClient.connect();
        } catch (error) {
          console.error('Failed to connect:', error);
          return;
        }
      }
      setIsConnected(true);

      const wrapper = (data: T) => {
        callbackRef.current(data);
        // Unsubscribe after first call
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };

      unsubscribeRef.current = ioClient.subscribe(event, wrapper);
    };

    ensureConnection();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [event, enabled]);

  return { isConnected };
}

/**
 * Hook to manage request-response pattern
 * Sends a request and waits for a corresponding response event
 * 
 * @param requestEvent Event to send request to
 * @param responseEvent Event to listen for response
 * @returns Request function and state
 */
export function useSocketRequest<TRequest = any, TResponse = any>(
  requestEvent: string,
  responseEvent: string
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const request = useCallback(
    async (requestData: TRequest, timeout: number = 5000): Promise<TResponse> => {
      setIsLoading(true);
      setError(null);

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          unsubscribe();
          const err = new Error('Request timeout');
          setError(err);
          setIsLoading(false);
          reject(err);
        }, timeout);

        const unsubscribe = ioClient.subscribe(responseEvent, (response: TResponse) => {
          clearTimeout(timer);
          unsubscribe();
          setData(response);
          setIsLoading(false);
          resolve(response);
        });

        ioClient.publish(requestEvent, requestData);
      });
    },
    [requestEvent, responseEvent]
  );

  return {
    request,
    isLoading,
    error,
    data,
  };
}
