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
  status?: string;
  isAdmin?: boolean;
  battleId?: string;
  startedAt?: string;
  message?: string;
  roomIds?: string[];
  rooms?: Record<string, {
    status: string;
    canJoin: boolean;
    connectedPlayers: number;
    isActive?: boolean;
    isWaiting?: boolean;
    isCompleted?: boolean;
    participantCount?: number;
    startedAt?: string;
  }>;
  roomId?: string;
  canJoin?: boolean;
  connectedPlayers?: number;
  change?: string;
  results?: Array<{
    userId: string;
    testsPassed: number;
    totalTests: number;
    placement: number;
  }>;
}

export function useWebSocket(url: string, roomId: string, userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [playerResults, setPlayerResults] = useState<PlayerResults>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [battleStatus, setBattleStatus] = useState<'waiting' | 'active' | 'completed'>('waiting');
  const [battleId, setBattleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchedRooms, setWatchedRooms] = useState<Record<string, {
    status: string;
    canJoin: boolean;
    connectedPlayers: number;
  }>>({});
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log('🔗 Connecting to WebSocket:', url);
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
      setError(null);
      
      // Join the room
      if (ws.current) {
        console.log('🚪 Joining room:', roomId, 'as user:', userId);
        ws.current.send(JSON.stringify({
          type: 'join',
          roomId,
          userId
        }));

        // Request current player list
        setTimeout(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log('📋 Requesting players list');
            ws.current.send(JSON.stringify({
              type: 'get-players'
            }));
          }
        }, 100); // Small delay to ensure server processes join first
      }
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('📨 WebSocket message received:', message);

      if (message.type === 'players-list') {
        console.log('👥 Players list updated:', message.players);
        setPlayersList(message.players || []);
      } else if (message.type === 'battle-status') {
        setIsAdmin(message.isAdmin || false);
        setBattleStatus(message.status as 'waiting' | 'active' | 'completed');
        setBattleId(message.battleId || null);
      } else if (message.type === 'battle-started') {
        setBattleStatus('active');
        setBattleId(message.battleId || null);
        setError(null);
      } else if (message.type === 'battle-completed') {
        setBattleStatus('completed');
        // Results are available in message.results
      } else if (message.type === 'test-results-update') {
        // Handle individual player test result updates
        console.log('🧪 Test results update received:', message);
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
      } else if (message.type === 'test-results') {
        // Handle test results message (alternative message type)
        console.log('🧪 Test results received:', message);
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
      } else if (message.type === 'room-statuses') {
        // Handle initial room statuses when watching multiple rooms
        setWatchedRooms(message.rooms || {});
      } else if (message.type === 'room-status-update') {
        // Handle real-time room status updates
        if (message.roomId) {
          setWatchedRooms(prev => ({
            ...prev,
            [message.roomId!]: {
              status: message.status || 'unknown',
              canJoin: message.canJoin || false,
              connectedPlayers: message.connectedPlayers || 0,
            }
          }));
        }
      } else if (message.type === 'unwatched') {
        // Clear watched rooms when unwatching
        setWatchedRooms({});
      } else if (message.type === 'error') {
        console.error('❌ Server error:', message.message);
        setError(message.message || 'An error occurred');
      } else {
        console.warn('❓ Unknown message type:', message.type, message);
      }
    };

    ws.current.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('🚨 WebSocket error:', error);
      setError('WebSocket connection error');
    };

    return () => {
      if (ws.current) {
        console.log('🔌 Closing WebSocket connection');
        ws.current.close();
      }
    };
  }, [url, roomId, userId]);

  // Periodic player list refresh
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log('🔄 Refreshing players list');
        ws.current.send(JSON.stringify({
          type: 'get-players'
        }));
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  const sendTestResults = (passed: number, total: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('🔄 Sending test results:', { passed, total, userId });
      ws.current.send(JSON.stringify({
        type: 'test-results',
        passed,
        total,
        userId // Include userId to help server identify the player
      }));
    }
  };

  const requestPlayersList = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('📋 Manually requesting players list');
      ws.current.send(JSON.stringify({
        type: 'get-players',
        roomId // Include roomId to be explicit
      }));
    } else {
      console.warn('⚠️ Cannot request players list - WebSocket not connected');
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

  const startBattle = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'start-battle'
      }));
    }
  };

  const completeBattle = (completionTime?: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'complete-battle',
        completionTime
      }));
    }
  };

  const watchRooms = (roomIds: string[]) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'watch-rooms',
        roomIds
      }));
    }
  };

  const unwatchRooms = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'unwatch-rooms'
      }));
    }
  };

  return {
    isConnected,
    playersList,
    playerResults,
    isAdmin,
    battleStatus,
    battleId,
    error,
    watchedRooms,
    sendTestResults,
    requestPlayersList,
    sendPlayerResults,
    startBattle,
    completeBattle,
    watchRooms,
    unwatchRooms
  };
}