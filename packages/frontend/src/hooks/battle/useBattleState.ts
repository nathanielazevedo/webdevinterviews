import { useState, useCallback } from 'react';

export type BattleStatus = 'waiting' | 'countdown' | 'active' | 'finished';

export interface BattleState {
  status: BattleStatus;
  timeRemaining: number;
  totalTime: number;
  currentProblem: string;
  winners: string[];
  totalPlayers: number;
  completedPlayers: number;
}

export interface BattleInfo {
  id: string;
  roomId: string;
  status: 'waiting' | 'active' | 'completed';
  startedAt?: string;
  createdAt: string;
  scheduledStartTime?: string;
  durationMinutes?: number;
  adminUserId: string;
  participantCount: number;
  connectedPlayers: number;
  canJoin: boolean;
  isActive: boolean;
  isWaiting: boolean;
  isCompleted: boolean;
}

interface UseBattleStateProps {
  initialBattleId?: string;
  initialStatus?: BattleStatus;
}

export const useBattleState = ({ 
  initialBattleId = 'battle_1', 
  initialStatus = 'waiting' 
}: UseBattleStateProps = {}) => {
  // Core battle state
  const [battleId] = useState(initialBattleId);
  const [battleInfo, setBattleInfo] = useState<BattleInfo | null>(null);
  const [battleState, setBattleState] = useState<BattleState>({
    status: initialStatus,
    timeRemaining: 900, // 15 minutes
    totalTime: 900,
    currentProblem: "Two Sum",
    winners: [],
    totalPlayers: 0,
    completedPlayers: 0,
  });

  // Server sync state
  const [serverBattleStatus, setServerBattleStatus] = useState<'waiting' | 'active' | 'completed'>('waiting');
  const [isAdmin, setIsAdmin] = useState(false);
  const [battleStartTime, setBattleStartTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Update local battle state based on server status
  const syncWithServerStatus = useCallback((
    serverStatus: 'waiting' | 'active' | 'completed',
    timeUntilStart?: number | null
  ) => {
    setServerBattleStatus(serverStatus);
    
    setBattleState((prev) => ({
      ...prev,
      status:
        serverStatus === "waiting"
          ? (timeUntilStart !== null && timeUntilStart !== undefined && timeUntilStart > 0)
            ? "countdown"
            : "waiting"
          : serverStatus === "active"
          ? "active"
          : "finished",
    }));
  }, []);

  // Update battle completion status
  const updateBattleCompletion = useCallback((completedCount: number, totalCount: number, winners: string[]) => {
    setBattleState((prev) => ({
      ...prev,
      completedPlayers: completedCount,
      totalPlayers: totalCount,
      winners: winners.slice(0, 3), // Top 3 winners
      status: completedCount === totalCount && totalCount > 0 ? "finished" : prev.status,
    }));
  }, []);

  // Battle actions
  const startBattle = useCallback(() => {
    setBattleState((prev) => ({ ...prev, status: "active" }));
  }, []);

  const resetBattle = useCallback(() => {
    setBattleState({
      status: "waiting",
      timeRemaining: 900,
      totalTime: 900,
      currentProblem: "Two Sum",
      winners: [],
      totalPlayers: 0,
      completedPlayers: 0,
    });
    setError(null);
  }, []);

  const finishBattle = useCallback((winners: string[]) => {
    setBattleState((prev) => ({
      ...prev,
      status: "finished",
      winners: winners.slice(0, 3),
    }));
  }, []);

  // Update current problem
  const setCurrentProblem = useCallback((problemTitle: string) => {
    setBattleState((prev) => ({
      ...prev,
      currentProblem: problemTitle,
    }));
  }, []);

  return {
    // State
    battleId,
    battleInfo,
    battleState,
    serverBattleStatus,
    isAdmin,
    battleStartTime,
    error,
    loading,

    // Setters
    setBattleInfo,
    setIsAdmin,
    setBattleStartTime,
    setError,
    setLoading,

    // Actions
    syncWithServerStatus,
    updateBattleCompletion,
    startBattle,
    resetBattle,
    finishBattle,
    setCurrentProblem,
  };
};