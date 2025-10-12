import { useState, useCallback, useEffect } from 'react';

export interface Player {
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

export interface WSPlayer {
  userId: string;
  testsPassed: number;
  totalTests: number;
  joinedAt: string;
  isConnected: boolean;
}

export interface PlayerResults {
  [playerId: string]: {
    passed: number;
    total: number;
    completedAt: string | null;
    isCompleted: boolean;
  };
}

interface UseBattlePlayersProps {
  currentPlayerId: string;
  currentPlayerName: string;
  userAvatarUrl?: string;
}

export const useBattlePlayers = ({ 
  currentPlayerId, 
  currentPlayerName, 
  userAvatarUrl 
}: UseBattlePlayersProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersList, setPlayersList] = useState<WSPlayer[]>([]);
  const [playerResults, setPlayerResults] = useState<PlayerResults>({});

  // Convert WebSocket players to UI players
  const convertWSPlayersToUIPlayers = useCallback((
    wsPlayers: WSPlayer[], 
    liveResults: PlayerResults
  ): Player[] => {
    return wsPlayers.map((wsPlayer) => {
      const liveResult = liveResults[wsPlayer.userId];

      return {
        id: wsPlayer.userId,
        name: wsPlayer.userId === currentPlayerId
          ? currentPlayerName
          : wsPlayer.userId.split("@")[0] || "Anonymous",
        avatar: wsPlayer.userId === currentPlayerId 
          ? (userAvatarUrl || "/api/placeholder/40/40")
          : "/api/placeholder/40/40",
        rating: 1500,
        wins: 0,
        losses: 0,
        status: wsPlayer.isConnected ? "ready" : "disconnected",
        joinedAt: new Date(wsPlayer.joinedAt).getTime(),
        testProgress: liveResult
          ? {
              passed: liveResult.passed,
              total: liveResult.total,
              completedAt: liveResult.isCompleted ? Date.now() : undefined,
            }
          : {
              passed: wsPlayer.testsPassed,
              total: wsPlayer.totalTests,
              completedAt: (wsPlayer.testsPassed === wsPlayer.totalTests && wsPlayer.totalTests > 0)
                ? Date.now()
                : undefined,
            },
      };
    });
  }, [currentPlayerId, currentPlayerName, userAvatarUrl]);

  // Update players when WebSocket data changes
  useEffect(() => {
    if (playersList.length > 0) {
      const updatedPlayers = convertWSPlayersToUIPlayers(playersList, playerResults);
      setPlayers(updatedPlayers);
    }
  }, [playersList, playerResults, convertWSPlayersToUIPlayers]);

  // Initialize current user as first player if no WebSocket players
  useEffect(() => {
    if (playersList.length === 0) {
      const currentPlayer: Player = {
        id: currentPlayerId,
        name: currentPlayerName,
        avatar: userAvatarUrl || "/api/placeholder/40/40",
        rating: 1500,
        wins: 0,
        losses: 0,
        status: "ready",
        joinedAt: Date.now(),
      };

      setPlayers([currentPlayer]);
    }
  }, [currentPlayerId, currentPlayerName, userAvatarUrl, playersList.length]);

  // Update player test results
  const updatePlayerResults = useCallback((userId: string, passed: number, total: number) => {
    setPlayerResults(prev => ({
      ...prev,
      [userId]: {
        passed,
        total,
        completedAt: passed === total ? new Date().toISOString() : null,
        isCompleted: passed === total
      }
    }));
  }, []);

  // Reset all players' test progress
  const resetPlayerProgress = useCallback(() => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        testProgress: undefined,
        status: "ready" as const,
      }))
    );
    setPlayerResults({});
  }, []);

  // Get completed players
  const getCompletedPlayers = useCallback(() => {
    return players.filter(
      (player) =>
        player.testProgress &&
        player.testProgress.passed === player.testProgress.total &&
        player.testProgress.total > 0
    );
  }, [players]);

  // Get winners (top 3 completed players)
  const getWinners = useCallback(() => {
    const completedPlayers = getCompletedPlayers();
    return completedPlayers
      .slice(0, 3)
      .map((player) => player.name);
  }, [getCompletedPlayers]);

  return {
    // State
    players,
    playersList,
    playerResults,

    // Setters (for WebSocket updates)
    setPlayersList,
    setPlayerResults,

    // Actions
    updatePlayerResults,
    resetPlayerProgress,

    // Computed values
    completedPlayers: getCompletedPlayers(),
    winners: getWinners(),
    totalPlayers: players.length,
    completedCount: getCompletedPlayers().length,
  };
};