import { useEffect, useRef, useState } from 'react';

interface Player {
  userId: string;
  testsPassed: number;
  totalTests: number;
  joinedAt: string;
  isConnected: boolean;
}



interface PlayerResults {
  [playerId: string]: {
    passed: number;
    total: number;
    completedAt: string | null;
    isCompleted: boolean;
  };
}

interface WebSocketMessage {
  type: string;
  passed?: number;
  total?: number;
  players?: Player[];
  userId?: string;
  isCompleted?: boolean;
  completedAt?: string | null;
}

export function useWebSocket(url: string, roomId: string, userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [playerResults, setPlayerResults] = useState<PlayerResults>({});
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      
      // Join the room
      if (ws.current) {
        ws.current.send(JSON.stringify({
          type: 'join',
          roomId,
          userId
        }));

        // Request current player list
        ws.current.send(JSON.stringify({
          type: 'get-players'
        }));
      }
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      if (message.type === 'players-list') {
        setPlayersList(message.players || []);
      } else if (message.type === 'test-results-update') {
        // Handle individual player test result updates
        if (message.userId) {
          setPlayerResults(prev => ({
            ...prev,
            [message.userId!]: {
              passed: message.passed || 0,
              total: message.total || 0,
              completedAt: message.passed === message.total ? new Date().toISOString() : null,
              isCompleted: message.passed === message.total
            }
          }));
        }
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, roomId, userId]);

  const sendTestResults = (passed: number, total: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'test-results',
        passed,
        total
      }));
    }
  };

  const requestPlayersList = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'get-players'
      }));
    }
  };

  const sendPlayerResults = (passed: number, total: number, isCompleted = false) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'player-results',
        passed,
        total,
        isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null
      }));
    }
  };

  return {
    isConnected,
    playersList,
    playerResults,
    sendTestResults,
    requestPlayersList,
    sendPlayerResults
  };
}