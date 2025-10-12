import { useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBattleState } from './useBattleState';
import { useBattlePlayers } from './useBattlePlayers';
import { useBattleQuestions } from './useBattleQuestions';
import { useBattleTimer } from './useBattleTimer';
import { useBattle as useOriginalBattle } from '../useBattle';

interface UseBattleEnhancedProps {
  battleId?: string;
  playerId?: string;
}

export const useBattleEnhanced = ({ 
  battleId = 'battle_1',
  playerId 
}: UseBattleEnhancedProps = {}) => {
  const { user } = useAuth();

  // Get player ID and name
  const getPlayerId = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugPlayerId = urlParams.get("playerId");
    const debugPlayerName = urlParams.get("playerName");

    if (debugPlayerId) return debugPlayerId;
    if (debugPlayerName) {
      return `debug_${debugPlayerName.toLowerCase().replace(/\\s+/g, "_")}`;
    }
    return playerId || user?.id || "anonymous";
  }, [playerId, user?.id]);

  const getPlayerName = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugPlayerName = urlParams.get("playerName");
    
    if (debugPlayerName) return debugPlayerName;
    return user?.email?.split("@")[0] || "Anonymous";
  }, [user?.email]);

  const currentPlayerId = getPlayerId();
  const currentPlayerName = getPlayerName();

  // Initialize all the individual hooks
  const battleState = useBattleState({ initialBattleId: battleId });
  const battlePlayers = useBattlePlayers({
    currentPlayerId,
    currentPlayerName,
    userAvatarUrl: user?.user_metadata?.avatar_url
  });
  const battleQuestions = useBattleQuestions();
  const battleTimer = useBattleTimer();

  // Use the original battle hook for WebSocket connection
  const originalBattle = useOriginalBattle(currentPlayerId);

  // Sync with original battle hook data
  useEffect(() => {
    if (originalBattle.playersList) {
      battlePlayers.setPlayersList(originalBattle.playersList);
    }
  }, [originalBattle.playersList, battlePlayers]);

  useEffect(() => {
    if (originalBattle.playerResults) {
      battlePlayers.setPlayerResults(originalBattle.playerResults);
    }
  }, [originalBattle.playerResults, battlePlayers]);

  useEffect(() => {
    if (originalBattle.battleStatus) {
      battleState.syncWithServerStatus(originalBattle.battleStatus, battleTimer.timeUntilStart);
    }
  }, [originalBattle.battleStatus, battleTimer.timeUntilStart, battleState]);

  useEffect(() => {
    if (originalBattle.isAdmin !== undefined) {
      battleState.setIsAdmin(originalBattle.isAdmin);
    }
  }, [originalBattle.isAdmin, battleState]);

  useEffect(() => {
    if (originalBattle.battleStartTime) {
      battleTimer.setBattleStartTime(originalBattle.battleStartTime);
    }
  }, [originalBattle.battleStartTime, battleTimer]);

  useEffect(() => {
    if (originalBattle.currentQuestion) {
      battleQuestions.updateCurrentQuestion(originalBattle.currentQuestion);
      battleState.setCurrentProblem(originalBattle.currentQuestion.title);
    }
  }, [originalBattle.currentQuestion, battleQuestions, battleState]);

  useEffect(() => {
    if (originalBattle.questionPool) {
      battleQuestions.updateQuestionPool(originalBattle.questionPool);
    }
  }, [originalBattle.questionPool, battleQuestions]);

  // Update battle completion based on players
  useEffect(() => {
    const completedPlayers = battlePlayers.completedPlayers;
    const winners = battlePlayers.winners;
    
    if (completedPlayers.length > 0) {
      battleState.updateBattleCompletion(
        completedPlayers.length,
        battlePlayers.totalPlayers,
        winners
      );
    }
  }, [battlePlayers.completedPlayers, battlePlayers.winners, battlePlayers.totalPlayers, battleState]);

  // Battle actions
  const handleStartBattle = useCallback(() => {
    if (battleState.isAdmin) {
      originalBattle.startBattle();
    } else {
      // Fallback for testing
      battleState.syncWithServerStatus('active');
      battleTimer.startCountdown(3);
    }
  }, [battleState.isAdmin, originalBattle, battleState, battleTimer]);

  const handleResetBattle = useCallback(() => {
    battleState.resetBattle();
    battlePlayers.resetPlayerProgress();
    battleTimer.resetTimers();
  }, [battleState, battlePlayers, battleTimer]);

  const handleSubmitSolution = useCallback((_code?: string) => {
    // Implementation for solution submission
    battleState.finishBattle(battlePlayers.winners);
  }, [battleState, battlePlayers.winners]);

  const handleTestResults = useCallback((results: { testCases: { passed: boolean }[] }) => {
    if (results && results.testCases) {
      const passed = results.testCases.filter((tc) => tc.passed).length;
      const total = results.testCases.length;
      
      // Send to WebSocket
      originalBattle.sendTestResults(passed, total);
      // Update local state
      battlePlayers.updatePlayerResults(currentPlayerId, passed, total);
    }
  }, [originalBattle, battlePlayers, currentPlayerId]);

  const handleCreateScheduledBattle = useCallback(() => {
    const scheduledTime = new Date(Date.now() + 30 * 1000).toISOString();
    const durationMinutes = 15;
    
    if (originalBattle.createBattle) {
      originalBattle.createBattle(scheduledTime, durationMinutes);
    }
    
    battleState.syncWithServerStatus('waiting');
  }, [originalBattle, battleState]);

  return {
    // IDs
    battleId: battleState.battleId,
    currentPlayerId,
    currentPlayerName,

    // Battle State
    battleState: battleState.battleState,
    serverBattleStatus: battleState.serverBattleStatus,
    isAdmin: battleState.isAdmin,
    error: battleState.error,
    loading: battleState.loading,

    // Players
    players: battlePlayers.players,
    playerResults: battlePlayers.playerResults,
    completedPlayers: battlePlayers.completedPlayers,
    winners: battlePlayers.winners,

    // Questions
    currentQuestion: battleQuestions.currentQuestion,
    questionPool: battleQuestions.questionPool,
    questionLoading: battleQuestions.questionLoading,
    questionError: battleQuestions.questionError,

    // Timer
    timeUntilStart: battleTimer.timeUntilStart,
    battleStartTime: battleTimer.battleStartTime,
    effectiveCountdown: battleTimer.effectiveCountdown,
    battleTimeRemaining: battleTimer.battleTimeRemaining,
    formatTime: battleTimer.formatTime,

    // Actions
    handleStartBattle,
    handleResetBattle,
    handleSubmitSolution,
    handleTestResults,
    handleCreateScheduledBattle,

    // Original battle actions (for direct access)
    getCurrentQuestion: originalBattle.getCurrentQuestion,
    getQuestionPool: originalBattle.getQuestionPool,
    getBattleInfo: originalBattle.getBattleInfo,
    createBattle: originalBattle.createBattle,

    // Connection state
    isConnected: originalBattle.isConnected,
  };
};