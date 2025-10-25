import { useState, useEffect, useCallback } from 'react';
import { useApi, useWebSocket } from './useApi';
import { getBattleCurrent } from '../api/generated/requests/services.gen';
import type { Player, Question, QuestionSummary } from '@webdevinterviews/shared';

interface PlayerResults {
  [playerId: string]: {
    passed: number;
    total: number;
    completedAt: string | null;
    isCompleted: boolean;
  };
}

/**
 * Simplified battle hook using centralized WebSocket system
 * Now automatically fetches next battle info instead of using hardcoded battleId
 */
export const useBattle = (playerId: string) => {
  const api = useApi();
  const { wsClient, connectWs } = useWebSocket();
  
  // Battle state
  const [battleId, setBattleId] = useState<string | null>(null);
  const [battleInfo, setBattleInfo] = useState<any>(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [playerResults, setPlayerResults] = useState<PlayerResults>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [battleStatus, setBattleStatus] = useState<'waiting' | 'active' | 'completed'>('waiting');
  const [battleStartTime, setBattleStartTime] = useState<string | null>(null);
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Question state - using shared types
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionPool, setQuestionPool] = useState<QuestionSummary[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  // WebSocket message handlers
  const handleMessage = useCallback((data: Record<string, unknown>) => {
    console.log('📨 Battle WebSocket message:', data);
    
    switch (data.type) {
      case 'players-list':
        setPlayersList((data.players as Player[]) || []);
        break;
        
      case 'battle-status':
        setIsAdmin(Boolean(data.isAdmin) || false);
        setBattleStatus(data.status as 'waiting' | 'active' | 'completed');
        break;
        
      case 'battle-started':
        setBattleStatus('active');
        setBattleStartTime(null);
        setTimeUntilStart(null);
        break;
        
      case 'battle-completed':
        setBattleStatus('completed');
        break;
        
      case 'test-results-update':
      case 'test-results':
        if (data.userId && typeof data.userId === 'string') {
          const passed = typeof data.passed === 'number' ? data.passed : 0;
          const total = typeof data.total === 'number' ? data.total : 0;
          setPlayerResults(prev => ({
            ...prev,
            [data.userId as string]: {
              passed,
              total,
              completedAt: passed === total ? new Date().toISOString() : null,
              isCompleted: passed === total
            }
          }));
        }
        break;
        
      case 'current-question':
        setCurrentQuestion((data.question as Question) || null);
        setQuestionLoading(false);
        break;
        
      case 'question-pool':
        setQuestionPool((data.questions as QuestionSummary[]) || []);
        setQuestionLoading(false);
        break;
        
      case 'battle-created':
        if (typeof data.scheduledStartTime === 'string') {
          setBattleStartTime(data.scheduledStartTime);
        }
        break;
        
      case 'battle-info': {
        if (data.battle && typeof data.battle === 'object') {
          const battle = data.battle as Record<string, unknown>;
          setIsAdmin(Boolean(battle.isAdmin));
          setBattleStatus(battle.status as 'waiting' | 'active' | 'completed');
          if (typeof battle.scheduledStartTime === 'string') {
            setBattleStartTime(battle.scheduledStartTime);
          }
          // Handle question pool from battle info
          if (Array.isArray(battle.questionPool)) {
            setQuestionPool(battle.questionPool);
            console.log('📚 Received question pool with battle info:', battle.questionPool.length, 'questions');
          }
        }
        break;
      }
        
      case 'error': {
        const errorMessage = typeof data.message === 'string' ? data.message : 'An error occurred';
        setError(errorMessage);
        setQuestionLoading(false);
        break;
      }
    }
  }, []);

  // Extended send function for messages not in type system
  const sendMessage = useCallback((data: Record<string, unknown>) => {
    // Cast to bypass type restrictions for legacy message format compatibility
    (wsClient as unknown as { send: (data: Record<string, unknown>) => void }).send(data);
  }, [wsClient]);

  // Fetch next battle info on component mount using generated API
  useEffect(() => {
    const fetchNextBattle = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching next battle info...');
        
        const data = await getBattleCurrent();
        const { battle } = data;
        
        if (battle) {
          console.log('✅ Current battle info received:', battle);
          console.log('🕐 Battle timing details:', {
            scheduledStartTime: battle.scheduledStartTime,
            startedAt: battle.startedAt,
            status: battle.status
          });
          
          setBattleId(String(battle.id) || null); 
          setBattleInfo(battle);
          setBattleStatus((battle.status as 'waiting' | 'active' | 'completed') || 'waiting');
          
          // Use scheduledStartTime for waiting battles, startedAt for active battles
          const startTime = battle.scheduledStartTime || battle.startedAt;
          console.log('🎯 Setting battle start time:', startTime);
          setBattleStartTime(startTime ? String(startTime) : null);
          
          // Set question pool if available
          if (Array.isArray(data.questions)) {
            setQuestionPool(data.questions as QuestionSummary[]);
            console.log('📚 Question pool loaded:', data.questions.length, 'questions');
          }
        } else {
          console.log('❌ No battle data received');
          setError('No battle available');
        }
      } catch (error) {
        console.error('❌ Error fetching next battle:', error);
        setError('Failed to fetch battle info');
      } finally {
        setLoading(false);
      }
    };

    fetchNextBattle();
  }, []);

  // Connect WebSocket only once and set up message handlers
  useEffect(() => {
    let isSubscribed = true;
    
    // Set up message handlers
    wsClient.on('message', handleMessage);
    wsClient.on('error', () => {
      if (isSubscribed) setError('WebSocket connection error');
    });
    
    // Connect only if not already connected
    if (!api.state.wsConnected) {
      console.log('🔌 Initiating WebSocket connection...');
      connectWs();
    }
    
    return () => {
      isSubscribed = false;
      wsClient.off('message', handleMessage as (data: unknown) => void);
      wsClient.off('error');
    };
  }, []); // Run only once on mount

  // Join battle when connected (no more rooms)
  useEffect(() => {
    if (api.state.wsConnected && battleId) {
      console.log('🔌 WebSocket connected, joining battle:', battleId);
      
      sendMessage({
        type: 'join',
        userId: playerId
      });
      
      // Request initial data
      setTimeout(() => {
        console.log('📋 Fetching initial battle data...');
        sendMessage({ type: 'get-players' });
      }, 100);
    }
  }, [api.state.wsConnected, battleId, playerId, sendMessage]);

  // Countdown timer for scheduled battles
  useEffect(() => {
    if (!battleStartTime || battleStatus !== 'waiting') {
      console.log('🔄 Countdown not running:', { battleStartTime, battleStatus });
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const nowUTC = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const startTime = new Date(battleStartTime);
      const timeLeft = Math.max(0, Math.floor((startTime.getTime() - now.getTime()) / 1000));
      
      console.log('⏰ Countdown update:', {
        nowLocal: now.toISOString(),
        nowUTC: nowUTC.toISOString(),
        battleStartTime,
        startTimeUTC: startTime.toISOString(),
        timeDiffMs: startTime.getTime() - now.getTime(),
        timeLeft,
        timeLeftMinutes: Math.floor(timeLeft / 60),
        timeLeftHours: Math.floor(timeLeft / 3600)
      });
      
      setTimeUntilStart(timeLeft);
      
      if (timeLeft === 0) {
        console.log('🚀 Battle starting! Time reached zero');
        setBattleStatus('active');
        setBattleStartTime(null);
        setTimeUntilStart(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [battleStartTime, battleStatus]);

  // Simplified battle actions for the new backend
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

  return {
    // Battle state
    playersList,
    playerResults,
    isAdmin,
    battleStatus,
    battleId,
    battleInfo,
    battleStartTime,
    timeUntilStart,
    error,
    loading,
    
    // Question state
    currentQuestion,
    questionPool,
    questionLoading,
    
    // Actions
    sendTestResults,
    startBattle,
    
    // Connection state
    isConnected: api.state.wsConnected,
  };
};