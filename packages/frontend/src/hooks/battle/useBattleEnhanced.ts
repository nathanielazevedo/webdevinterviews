import { useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBattle } from '../useBattle';
import { useApi } from '../useApi';
import type { Player as SharedPlayer } from '@webdevinterviews/shared';

interface UseBattleEnhancedProps {
  battleId?: string;
  playerId?: string;
}

// Component-expected Player interface (for compatibility with existing components)
interface ComponentPlayer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  wins: number;
  losses: number;
  status: "ready" | "coding" | "submitted" | "disconnected";
  joinedAt: number;
  testProgress?: {
    passed: number;
    total: number;
    completedAt?: number;
  };
}

/**
 * Enhanced battle hook that adds convenience functions for getting player ID/name
 * from auth or URL params, plus adapters to map shared types to component-expected types.
 */
export const useBattleEnhanced = ({ 
  playerId 
}: UseBattleEnhancedProps = {}) => {
  const { user } = useAuth();
  const api = useApi();

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

  // Use the main battle hook
  const battle = useBattle(currentPlayerId);

  // Map shared Player type to component-expected Player type
  const adaptedPlayers = useMemo((): ComponentPlayer[] => {
    return battle.playersList.map((sharedPlayer: SharedPlayer): ComponentPlayer => {
      // Generate a display name from userId or use a default
      const displayName = sharedPlayer.userId.includes('debug_') 
        ? sharedPlayer.userId.replace('debug_', '').replace(/_/g, ' ')
        : sharedPlayer.userId.split('@')[0] || sharedPlayer.userId;

      return {
        id: sharedPlayer.userId,
        name: displayName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sharedPlayer.userId}`,
        rating: 1200, // Default rating
        wins: 0, // Default wins
        losses: 0, // Default losses
        status: sharedPlayer.isConnected ? "ready" : "disconnected",
        joinedAt: new Date(sharedPlayer.joinedAt).getTime(),
        testProgress: {
          passed: sharedPlayer.testsPassed,
          total: sharedPlayer.totalTests,
          completedAt: sharedPlayer.testsPassed === sharedPlayer.totalTests && sharedPlayer.totalTests > 0 
            ? new Date().getTime() 
            : undefined,
        },
      };
    });
  }, [battle.playersList]);

  // Helper functions for test results
  const handleTestResults = useCallback((results: { testCases: { passed: boolean }[] }) => {
    if (results && results.testCases) {
      const passed = results.testCases.filter((tc) => tc.passed).length;
      const total = results.testCases.length;
      
      battle.sendTestResults(passed, total);
    }
  }, [battle]);

  // Admin function to end battle
  const handleEndBattle = useCallback(() => {
    if (api.state.wsConnected) {
      // Send end-battle message via WebSocket
      api.wsClient.send({
        type: 'end-battle',
        userId: currentPlayerId
      });
    }
  }, [api, currentPlayerId]);

  return {
    // Player info
    currentPlayerId,
    currentPlayerName,

    // Pass through most properties from the main battle hook
    battleId: battle.battleId,
    battleStatus: battle.battleStatus,
    isAdmin: battle.isAdmin,
    playerResults: battle.playerResults,
    currentQuestion: battle.currentQuestion,
    questionPool: battle.questionPool,
    battleStartTime: battle.battleStartTime,
    timeUntilStart: battle.timeUntilStart,
    error: battle.error,
    loading: battle.loading,
    isConnected: battle.isConnected,

    // Use adapted players for component compatibility
    players: adaptedPlayers,

    // Actions
    handleStartBattle: battle.startBattle,
    handleTestResults,
    handleEndBattle,
  };
};