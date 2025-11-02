import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/client';
import { useWebSocket, type WebSocketMessage } from './useWebSocket';
import type { Player, Battle } from '@webdevinterviews/shared';

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

interface BattleState {
  battle: Battle | null;
  isAdmin: boolean;
  error: string | null;
  loading: boolean;
}

/**
 * Simplified battle hook using the new useWebSocket hook
 * Focused on battle state management and API integration
 */
export const useBattle = () => {
  const { session } = useAuth();
  const playerId = session?.user?.id;
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [battleState, setBattleState] = useState<BattleState>({
    battle: null,
    isAdmin: false,
    error: null,
    loading: true,
  });

  const [battleHistory, setBattleHistory] = useState<Battle[]>([]);
  const [battleHistoryLoading, setBattleHistoryLoading] = useState(false);
  const [battleHistoryError, setBattleHistoryError] = useState<string | null>(null);

  // WebSocket message handler - synchronized with backend WebSocketMessageHandler
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {

    switch (message.type) {
      case 'players-list': {
        const validPlayers = ((message.players as Player[]) || []).filter(player => 
          player && typeof player.userId === 'string' && player.userId.trim() !== ''
        );
        setPlayers(validPlayers);
        break;
      }

      case 'battle-status':
        // Backend sends raw battle data - question info is included in battle object
        const { battle } = message as any;
        if (battle) {
          setBattleState(prev => ({
            ...prev,
            battle: battle,
            isAdmin: battle.admin_user_id === session?.user?.id || battle.admin_user_id === (session?.user as any)?.sub,
            error: null,
            loading: false
          }));
        }
        break;

      case 'battle-started':
        // Backend sends simple battle-started message
        setBattleState(prev => ({ 
          ...prev, 
          battle: prev.battle ? { ...prev.battle, status: 'active' } : null
        }));
        break;

      case 'battle-ended':
        // Backend sends battle-ended with results
        setBattleState(prev => ({ 
          ...prev, 
          battle: prev.battle ? { ...prev.battle, status: 'completed' } : null
          // Could store results in battle state if needed
        }));
        break;

      case 'join-response':
        // Handle join response from backend with raw battle data
        if (!message.success) {
          setBattleState(prev => ({ 
            ...prev, 
            error: (message.error as string) || 'Failed to join battle' 
          }));
        } else {
          // Use raw battle data from backend - question info is included in the battle object
          const { battle } = message as any;
          setBattleState(prev => ({
            ...prev,
            battle: battle,
            isAdmin: battle?.admin_user_id === session?.user?.id || battle?.admin_user_id === (session?.user as any)?.sub,
            error: null,
            loading: false
          }));
        }
        break;

      case 'start-battle-response':
        // Handle start battle response
        if (!message.success) {
          setBattleState(prev => ({ 
            ...prev, 
            error: (message.error as string) || 'Failed to start battle' 
          }));
        }
        break;

      case 'error': {
        const errorMessage = typeof message.message === 'string' ? message.message : 'An error occurred';
        setBattleState(prev => ({ ...prev, error: errorMessage }));
        break;
      }

      default:
        console.log('Unhandled message type:', message.type);
    }
  }, []);

  // Use the new WebSocket hook
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: handleWebSocketMessage,
    maxReconnectAttempts: 5
  });

  // Battle actions
  const handleStartBattle = useCallback(() => {
    sendMessage({ type: 'start-battle' });
  }, [sendMessage]);

  const handleTestResults = useCallback((results: { 
    passed: boolean; 
    message: string; 
    testCases: unknown[]; 
    totalExecutionTime: number;
    testsPassed: number;
  }) => {
    // Backend only expects testsPassed field based on WebSocketMessageHandler
    sendMessage({
      type: 'test-results',
      testsPassed: results.testsPassed,
      userId: playerId // Include userId for backend processing
    });
  }, [sendMessage, playerId]);

  const handleEndBattle = useCallback(() => {
    sendMessage({ type: 'end-battle' });
  }, [sendMessage]);

  // Legacy methods for compatibility
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

  // Battle history management
  const fetchBattleHistory = useCallback(async (limit?: number) => {
    try {
      setBattleHistoryLoading(true);
      setBattleHistoryError(null);
      
      const data = await api.getBattleHistory(limit);
      setBattleHistory(data.battles);
      setBattleHistoryLoading(false);
    } catch (error) {
      console.error('Error fetching battle history:', error);
      setBattleHistoryError('Failed to fetch battle history');
      setBattleHistoryLoading(false);
    }
  }, []);

  // Load initial battle info on mount - simplified without getCurrentBattle for now
  useEffect(() => {
    setBattleState(prev => ({ ...prev, loading: false }));
  }, []);

  // Memoized battle object
  const memoizedBattle = useMemo(() => battleState, [
    battleState.battle?.id,
    battleState.battle?.status,
    battleState.battle,
    battleState.isAdmin,
    battleState.error,
    battleState.loading,
  ]);

  return useMemo(() => ({
    // Battle data - now directly from battleState
    battle: memoizedBattle.battle,
    isAdmin: memoizedBattle.isAdmin,
    error: memoizedBattle.error,
    loading: memoizedBattle.loading,
    // WebSocket data
    players,
    currentPlayerId: playerId,
    isConnected,
    // Actions
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
    // Legacy interface for backward compatibility
    sendTestResults,
    startBattle,
    sendMessage,
    // Battle history
    fetchBattleHistory,
    battleHistory,
    battleHistoryLoading,
    battleHistoryError,
  }), [
    memoizedBattle,
    players,
    playerId,
    isConnected,
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
    sendTestResults,
    startBattle,
    sendMessage,
    fetchBattleHistory,
    battleHistory,
    battleHistoryLoading,
    battleHistoryError,
  ]);
};