import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/client';
import type { Question, QuestionSummary, Player } from '@webdevinterviews/shared';

export interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

export interface BattleStatus {
  status: 'waiting' | 'active' | 'completed' | 'no-battle';
  canJoin: boolean;
  isActive: boolean;
  isWaiting: boolean;
  isCompleted: boolean;
  connectedPlayers: number;
  participantCount?: number;
  startedAt?: string;
  change?: string;
}



export interface TestResult {
  userId: string;
  problemId: string;
  passed: number;
  total: number;
  completedAt: string;
}

interface PlayerResults {
  [playerId: string]: {
    passed: number;
    total: number;
    completedAt: string | null;
    isCompleted: boolean;
  };
}

interface BattleInfo {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  scheduledStartTime?: string;
  startedAt?: string;
  createdAt?: string;
  durationMinutes?: number;
  adminUserId?: string;
  participantCount?: number;
  connectedPlayers?: number;
  canJoin?: boolean;
  isActive?: boolean;
  isWaiting?: boolean;
  isCompleted?: boolean;
  questionPool?: QuestionSummary[];
  selectedQuestion?: Question | null;
}

export interface BattleHistoryItem {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  durationMinutes?: number;
  adminUserId?: string;
  endedBy?: string;
  participants: Array<{
    userId: string;
    testsPassed: number;
    totalTests: number;
    completionTime?: number | null;
    placement?: number | null;
    joinedAt: string;
    isConnected: boolean;
  }>;
}

/**
 * Enhanced battle hook with full functionality from useBattleOld
 * Includes WebSocket authentication, battle state management, and API integration
 */
export const useBattle = () => {
  const { session } = useAuth();
  const playerId = session?.user?.id;
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [battle, setBattle] = useState<{
    id: string | null;
    status: 'waiting' | 'active' | 'completed' | 'no-battle';
    info: BattleInfo | null;
    playerResults: PlayerResults;
    isAdmin: boolean;
    startTime: string | null;
    error: string | null;
    loading: boolean;
    currentQuestion: Question | null;
    questionPool: QuestionSummary[];
    questionLoading: boolean;
  }>({
    id: null,
    status: 'waiting',
    info: null,
    playerResults: {},
    isAdmin: false,
    startTime: null,
    error: null,
    loading: true,
    currentQuestion: null,
    questionPool: [],
    questionLoading: false,
  });

  const [battleHistory, setBattleHistory] = useState<BattleHistoryItem[]>([]);
  const [battleHistoryLoading, setBattleHistoryLoading] = useState(false);
  const [battleHistoryError, setBattleHistoryError] = useState<string | null>(null);

  // WebSocket refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const hasJoinedRef = useRef(false);
  const joinMessageCountRef = useRef(0);
  const isConnectingRef = useRef(false);
  const lastSessionTokenRef = useRef<string | null>(null);

  // WebSocket message handlers
  const handleMessage = useCallback((message: WebSocketMessage) => {

    switch (message.type) {
      case 'players-list': {
        console.log('Received players list', message.players);
        const validPlayers = ((message.players as Player[]) || []).filter(player => 
          player && typeof player.userId === 'string' && player.userId.trim() !== ''
        );
        setPlayers(validPlayers);
        break;
      }

      case 'battle-status':
        setBattle(prev => ({ ...prev, isAdmin: Boolean(message.isAdmin), status: message.status as typeof prev.status }));
        break;

      case 'battle-status-update':
        setBattle(prev => ({
          ...prev,
          status: message.status as typeof prev.status,
          info: {
            ...prev.info,
            canJoin: message.canJoin as boolean,
            isActive: message.isActive as boolean,
            isWaiting: message.isWaiting as boolean,
            isCompleted: message.isCompleted as boolean,
            connectedPlayers: (message.connectedPlayers as number) || 0,
            participantCount: message.participantCount as number,
            startedAt: message.startedAt as string,
          }
        }));
        break;

      case 'battle-started':
        setBattle(prev => ({ ...prev, status: 'active', startTime: null, currentQuestion: message.selectedQuestion as Question || null, questionLoading: false }));
        break;

      case 'battle-completed':
        console.log('Battle completed message received');
        setBattle(prev => ({ ...prev, status: 'completed' }));
        break;

      case 'test-results-update':
      case 'test-results':
        if (message.userId && typeof message.userId === 'string') {
          const passed = typeof message.passed === 'number' ? message.passed : 0;
          const total = typeof message.total === 'number' ? message.total : 0;
          setBattle(prev => ({
            ...prev,
            playerResults: {
              ...prev.playerResults,
              [message.userId as string]: {
                passed,
                total,
                completedAt: passed === total ? new Date().toISOString() : null,
                isCompleted: passed === total
              }
            }
          }));
        }
        break;

      case 'current-question':
        setBattle(prev => ({ ...prev, currentQuestion: (message.question as Question) || null, questionLoading: false }));
        break;

      case 'question-pool':
        setBattle(prev => ({ ...prev, questionPool: (message.questions as QuestionSummary[]) || [], questionLoading: false }));
        break;

      case 'battle-created':
        if (typeof message.scheduledStartTime === 'string') {
          setBattle(prev => ({ ...prev, startTime: message.scheduledStartTime }));
        }
        break;

      case 'battle-info': {
        if (message.battle && typeof message.battle === 'object') {
          const battleData = message.battle as Record<string, unknown>;
          setBattle(prev => ({
            ...prev,
            isAdmin: Boolean(battleData.isAdmin),
            status: battleData.status as typeof prev.status,
            startTime: typeof battleData.scheduledStartTime === 'string' ? battleData.scheduledStartTime : prev.startTime,
            questionPool: Array.isArray(battleData.questionPool) ? battleData.questionPool as QuestionSummary[] : prev.questionPool,
            currentQuestion: battleData.selectedQuestion ? battleData.selectedQuestion as Question : prev.currentQuestion,
          }));
        }
        break;
      }

      case 'error': {
        const errorMessage = typeof message.message === 'string' ? message.message : 'An error occurred';
        setBattle(prev => ({ ...prev, error: errorMessage, questionLoading: false }));
        break;
      }
    }
  }, []);

  const connect = useCallback(() => {
    console.log('connect function called, hasJoined:', hasJoinedRef.current, 'wsState:', wsRef.current?.readyState, 'isConnecting:', isConnectingRef.current);
    
    // If we're already connected and have joined, don't connect again
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
    const wsUrl = `${protocol}//${backendHost}?token=${session.access_token}`;

    console.log('WebSocket URL:', wsUrl.replace(session.access_token, '[TOKEN]'));

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected', reconnectAttempts.current, 'hasJoined:', hasJoinedRef.current);
      isConnectingRef.current = false; // Reset connecting flag
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Only send join message if we haven't already joined
      if (!hasJoinedRef.current) {
        console.log('Preparing to send join message...');
        // Small delay to ensure connection is fully established
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN && !hasJoinedRef.current) {
            // Send join message
            const joinMessage: WebSocketMessage = {
              type: 'join',
              userId: playerId,
            };
            console.log('Sending join message:', joinMessage);
            try {
              ws.send(JSON.stringify(joinMessage));
              hasJoinedRef.current = true;
              joinMessageCountRef.current++;
              console.log(`Join message sent successfully (count: ${joinMessageCountRef.current})`);
            } catch (error) {
              console.error('Failed to send join message:', error);
              // Reset join flag on failure so we can retry
              hasJoinedRef.current = false;
            }
          } else {
            console.log('WebSocket not ready to send message, state:', ws.readyState, 'hasJoined:', hasJoinedRef.current);
          }
        }, 200); // Increased delay for more stability
      } else {
        console.log('Skipping join message - already joined');
      }
    };

    ws.onmessage = (event) => {
      try {
        console.log('WebSocket message received', event.data);
        const message: WebSocketMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed', { code: event.code, reason: event.reason, wasClean: event.wasClean, hasJoined: hasJoinedRef.current });
      setIsConnected(false);
      wsRef.current = null;

      // Reset connection flags on close
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
      isConnectingRef.current = false; // Reset connecting flag on error
    };
  }, [session?.access_token, playerId, handleMessage]);

  const disconnect = useCallback(() => {
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
    hasJoinedRef.current = false; // Reset join flag on disconnect
    joinMessageCountRef.current = 0; // Reset join message count on disconnect
    isConnectingRef.current = false; // Reset connecting flag on disconnect
    // Don't reset lastSessionTokenRef on disconnect - only when session changes
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const sendTestResults = useCallback((passed: number, total: number) => {
    sendMessage({
      type: 'test-results',
      passed,
      total
    });
  }, [sendMessage]);

  const startBattle = useCallback(() => {
    sendMessage({ type: 'start-battle' });
  }, [sendMessage]);

  const handleStartBattle = useCallback(() => {
    startBattle();
  }, [startBattle]);

  const handleTestResults = useCallback((results: { passed: boolean; message: string; testCases: unknown[]; totalExecutionTime: number, testsPassed: number }) => {
    // Send test results to backend via WebSocket
    sendMessage({
      type: 'test-results',
      passed: results.passed ? 1 : 0,
      message: results.message,
      testCases: results.testCases,
      testsPassed: results.testsPassed,
      totalExecutionTime: results.totalExecutionTime
    });
  }, [sendMessage]);

  const handleEndBattle = useCallback(() => {
    sendMessage({ type: 'end-battle' });
  }, [sendMessage]);

  // Fetch next battle info on component mount
  useEffect(() => {
    const fetchNextBattle = async () => {
      try {
        setBattle(prev => ({ ...prev, loading: true }));

        const data = await api.getCurrentBattle() as { battle: BattleInfo };
        const { battle } = data;

        if (battle) {
          setBattle(prev => ({
            ...prev,
            id: String(battle.id),
            info: battle,
            status: (battle.status as typeof prev.status) || 'waiting',
            startTime: battle.scheduledStartTime || battle.startedAt ? String(battle.scheduledStartTime || battle.startedAt) : null,
            questionPool: Array.isArray(battle.questionPool) ? battle.questionPool as QuestionSummary[] : prev.questionPool,
            currentQuestion: battle.selectedQuestion ? battle.selectedQuestion as Question : prev.currentQuestion,
            loading: false,
          }));
        } else {
          setBattle(prev => ({ ...prev, error: 'No battle available', loading: false }));
        }
      } catch {
        setBattle(prev => ({ ...prev, error: 'Failed to fetch battle info', loading: false }));
      }
    };

    fetchNextBattle();
  }, []);

  // Connect WebSocket when session is available
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
  }, [session?.access_token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('useBattle unmounting - disconnecting');
      disconnect();
    };
  }, []);  // Memoize the battle object to prevent unnecessary re-renders
  const memoizedBattle = useMemo(() => battle, [
    battle.id,
    battle.status,
    battle.info,
    battle.playerResults,
    battle.isAdmin,
    battle.startTime,
    battle.error,
    battle.loading,
    battle.currentQuestion,
    battle.questionPool,
    battle.questionLoading,
  ]);

  const fetchBattleHistory = useCallback(async (limit?: number) => {
    try {
      setBattleHistoryLoading(true);
      setBattleHistoryError(null);
      
      const data = await api.getBattleHistory(limit) as { battles: BattleHistoryItem[]; total: number };
      setBattleHistory(data.battles);
      
      setBattleHistoryLoading(false);
    } catch (error) {
      console.error('Error fetching battle history:', error);
      setBattleHistoryError('Failed to fetch battle history');
      setBattleHistoryLoading(false);
    }
  }, []);

  return useMemo(() => ({
    battle: memoizedBattle,
    players,
    currentPlayerId: playerId,
    isConnected,
    sendTestResults,
    startBattle,
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
    sendMessage,
    connect,
    disconnect,
    fetchBattleHistory,
    battleHistory,
    battleHistoryLoading,
    battleHistoryError,
  }), [
    memoizedBattle,
    players,
    playerId,
    isConnected,
    sendTestResults,
    startBattle,
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
    sendMessage,
    connect,
    disconnect,
    fetchBattleHistory,
    battleHistory,
    battleHistoryLoading,
    battleHistoryError,
  ]);
};