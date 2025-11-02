import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

interface UseWebSocketOptions {
  onMessage: (message: WebSocketMessage) => void;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Custom hook for managing WebSocket connections with authentication and auto-reconnection
 */
export const useWebSocket = ({ 
  onMessage, 
  maxReconnectAttempts = 5 
}: UseWebSocketOptions): UseWebSocketReturn => {
  const { session } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket refs for connection management
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const hasJoinedRef = useRef(false);
  const joinMessageCountRef = useRef(0);
  const isConnectingRef = useRef(false);
  const lastSessionTokenRef = useRef<string | null>(null);

  const getWebSocketUrl = useCallback((token: string): string => {
    // Use same backend URL logic as API client
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === ''
    );
    const backendHost = isLocalhost
      ? 'localhost:3001'
      : 'webdevinterviewsbackend-production.up.railway.app';
    const protocol = isLocalhost ? 'ws:' : 'wss:';
    return `${protocol}//${backendHost}?token=${token}`;
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message:', message);
    }
  }, []);

  const connect = useCallback(() => {
    console.log('connect function called, hasJoined:', hasJoinedRef.current, 'wsState:', wsRef.current?.readyState, 'isConnecting:', isConnectingRef.current);
    
    // Early return conditions
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && hasJoinedRef.current) {
      console.log('Already connected and joined, skipping connect');
      return;
    }
    
    // If we're already attempting to connect, don't start another connection
    if (isConnectingRef.current) {
      console.log('Already connecting, skipping connect');
      return;
    }
    
    if (!session?.access_token) {
      console.log('No session or access token available', { session: !!session, token: !!session?.access_token });
      return;
    }

    isConnectingRef.current = true;
    console.log('Attempting WebSocket connection with token:', session.access_token.substring(0, 20) + '...');

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = getWebSocketUrl(session.access_token);
    console.log('WebSocket URL:', wsUrl.replace(session.access_token, '[TOKEN]'));

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected', reconnectAttempts.current, 'hasJoined:', hasJoinedRef.current);
      isConnectingRef.current = false;
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Only send join message if we haven't already joined
      if (!hasJoinedRef.current) {
        console.log('Preparing to send join message...');
        // Longer delay to ensure connection is fully established on both sides
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN && !hasJoinedRef.current) {
            const joinMessage: WebSocketMessage = {
              type: 'join'
            };
            console.log('Sending join message after delay:', joinMessage);
            try {
              ws.send(JSON.stringify(joinMessage));
              hasJoinedRef.current = true;
              joinMessageCountRef.current++;
              console.log(`Join message sent successfully (count: ${joinMessageCountRef.current})`);
            } catch (error) {
              console.error('Failed to send join message:', error);
              hasJoinedRef.current = false;
            }
          } else {
            console.log('WebSocket not ready to send message after delay, state:', ws.readyState, 'hasJoined:', hasJoinedRef.current);
          }
        }, 500);
      } else {
        console.log('Skipping join message - already joined');
      }
    };

    ws.onmessage = (event) => {
      try {
        console.log('WebSocket message received', event.data);
        const message: WebSocketMessage = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed', { code: event.code, reason: event.reason, wasClean: event.wasClean, hasJoined: hasJoinedRef.current });
      setIsConnected(false);
      wsRef.current = null;
      isConnectingRef.current = false;

      // Reset join state on any closure to allow reconnection
      hasJoinedRef.current = false;
      joinMessageCountRef.current = 0;

      // Attempt to reconnect if not a normal closure and we have a session token
      if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts && session?.access_token) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        console.log(`Scheduling reconnect attempt ${reconnectAttempts.current + 1} in ${delay}ms`);

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current++;
          console.log(`Executing reconnect attempt ${reconnectAttempts.current}`);
          connect();
        }, delay);
      } else if (event.code === 1000) {
        console.log('Normal closure, not attempting reconnect');
      } else if (!session?.access_token) {
        console.log('No session token available, not attempting reconnect');
      } else {
        console.log(`Max reconnect attempts (${maxReconnectAttempts}) reached, giving up`);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error, 'readyState:', ws.readyState);
      isConnectingRef.current = false;
    };
  }, [session?.access_token, session?.user?.id, onMessage, maxReconnectAttempts, getWebSocketUrl]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting WebSocket');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnecting');
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttempts.current = 0;
    hasJoinedRef.current = false;
    joinMessageCountRef.current = 0;
    isConnectingRef.current = false;
  }, []);

  // Connect WebSocket when session changes
  useEffect(() => {
    const currentToken = session?.access_token || null;
    const tokenChanged = lastSessionTokenRef.current !== currentToken;

    if (tokenChanged) {
      console.log('Session token changed from', lastSessionTokenRef.current?.substring(0, 10), 'to', currentToken?.substring(0, 10));
      
      // Disconnect existing connection
      disconnect();

      // Reset state for new session
      hasJoinedRef.current = false;
      joinMessageCountRef.current = 0;
      lastSessionTokenRef.current = currentToken;

      // Connect with new token
      if (currentToken) {
        console.log('Connecting with new token');
        connect();
      }
    }
  }, [session?.access_token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('useWebSocket unmounting - disconnecting');
      disconnect();
    };
  }, [disconnect]);

  return useMemo(() => ({
    isConnected,
    sendMessage,
    connect,
    disconnect,
  }), [isConnected, sendMessage, connect, disconnect]);
};