import React, { useState, useEffect } from "react";
import { Box, Grid, Container } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext.tsx";
import {
  BattleControls,
  BattleResults,
  ResizableCodingPanels,
  MultiplayerLeaderboard,
  AdminPanel,
} from "./components";
import { useWebSocket } from "./components/Websocket";
import { getWebSocketUrl } from "../../config/api";

interface Player {
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

interface BattleState {
  status: "waiting" | "countdown" | "active" | "finished";
  timeRemaining: number;
  totalTime: number;
  currentProblem: string;
  winners: string[]; // Array of winners for multiplayer
  totalPlayers: number;
  completedPlayers: number;
}

const BattleMain: React.FC = () => {
  const { user } = useAuth();

  // Generate battle and player IDs for WebSocket connection
  const [battleId] = useState(`battle_1`);
  const [currentPlayerId] = useState(() => user?.id || "anonymous");

  const [battleState, setBattleState] = useState<BattleState>({
    status: "waiting",
    timeRemaining: 900, // 15 minutes
    totalTime: 900,
    currentProblem: "Two Sum",
    winners: [],
    totalPlayers: 0,
    completedPlayers: 0,
  });

  // Dynamic player list - updated via WebSocket
  const [players, setPlayers] = useState<Player[]>([]);

  // WebSocket integration for multiplayer functionality
  const {
    playersList,
    playerResults,
    sendTestResults,
    isAdmin,
    battleStatus: serverBattleStatus,
    battleId: serverBattleId,
    error: serverError,
    startBattle: startServerBattle,
    completeBattle: completeServerBattle,
  } = useWebSocket(getWebSocketUrl(), battleId, currentPlayerId);

  // Update players list from WebSocket
  useEffect(() => {
    if (playersList.length > 0) {
      const updatedPlayers = playersList.map((wsPlayer) => ({
        id: wsPlayer.userId,
        name: wsPlayer.userId.split("@")[0] || "Anonymous", // Extract name from userId
        avatar: "/api/placeholder/40/40",
        rating: 1500,
        wins: 0,
        losses: 0,
        status: wsPlayer.isConnected
          ? ("ready" as const)
          : ("disconnected" as const),
        joinedAt: new Date(wsPlayer.joinedAt).getTime(),
        testProgress: {
          passed: wsPlayer.testsPassed,
          total: wsPlayer.totalTests,
          completedAt:
            wsPlayer.testsPassed === wsPlayer.totalTests &&
            wsPlayer.totalTests > 0
              ? Date.now()
              : undefined,
        },
      }));
      setPlayers(updatedPlayers);
    }
  }, [playersList]);

  // Sync server battle status with local state
  useEffect(() => {
    if (serverBattleStatus) {
      setBattleState((prev) => ({
        ...prev,
        status:
          serverBattleStatus === "waiting"
            ? "waiting"
            : serverBattleStatus === "active"
            ? "active"
            : "finished",
      }));
    }
  }, [serverBattleStatus]);

  // Initialize current user as the first player
  useEffect(() => {
    if (user) {
      const currentPlayer: Player = {
        id: user.id,
        name: user.email?.split("@")[0] || "Anonymous",
        avatar: user.user_metadata?.avatar_url || "/api/placeholder/40/40",
        rating: 1500,
        wins: 0,
        losses: 0,
        status: "ready",
        joinedAt: Date.now(),
      };

      setPlayers([currentPlayer]);
      setBattleState((prev) => ({ ...prev, totalPlayers: 1 }));
    }
  }, [user]);

  const [countdown, setCountdown] = useState<number | null>(null);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (battleState.status === "active" && battleState.timeRemaining > 0) {
      interval = setInterval(() => {
        setBattleState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [battleState.status, battleState.timeRemaining]);

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (countdown === 0) {
      setBattleState((prev) => ({ ...prev, status: "active" }));
      setCountdown(null);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const handleStartBattle = () => {
    if (isAdmin) {
      // Admin starts battle via server
      startServerBattle();
      setBattleState((prev) => ({ ...prev, status: "countdown" }));
      setCountdown(3);
    } else {
      // Regular user can only request battle start (fallback for testing)
      setBattleState((prev) => ({ ...prev, status: "countdown" }));
      setCountdown(3);
    }
  };

  const handleResetBattle = () => {
    setBattleState({
      status: "waiting",
      timeRemaining: 900,
      totalTime: 900,
      currentProblem: "Two Sum",
      winners: [],
      totalPlayers: players.length,
      completedPlayers: 0,
    });
    setCountdown(null);

    // Reset all players' test progress
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        testProgress: undefined,
        status: "ready",
      }))
    );
  };

  const handleSubmitSolution = (code?: string) => {
    // Implement solution submission logic
    console.log("Submitting solution:", code);
    setBattleState((prev) => ({
      ...prev,
      status: "finished",
      winner: players[Math.floor(Math.random() * 2)].name,
    }));
  };

  const handleTestResults = (results: { testCases: { passed: boolean }[] }) => {
    // Update test progress for current player
    if (results && results.testCases) {
      const passed = results.testCases.filter((tc) => tc.passed).length;
      const total = results.testCases.length;
      const isCompleted = passed === total;

      // Send test results to WebSocket server for multiplayer sync
      sendTestResults(passed, total);

      // Update the player's test progress
      setPlayers((prev) =>
        prev.map((player) =>
          player.id === currentPlayerId
            ? {
                ...player,
                testProgress: {
                  passed,
                  total,
                  completedAt: isCompleted ? Date.now() : undefined,
                },
                status: isCompleted ? "submitted" : "coding",
              }
            : player
        )
      );

      // Update battle state if player completed all tests
      if (isCompleted) {
        setBattleState((prev) => {
          const newCompletedPlayers = prev.completedPlayers + 1;
          const newWinners = [...prev.winners];

          // Add to winners list (first 3 get podium positions)
          if (newWinners.length < 3) {
            newWinners.push(user?.email?.split("@")[0] || "Anonymous");
          }

          return {
            ...prev,
            completedPlayers: newCompletedPlayers,
            winners: newWinners,
            status:
              newCompletedPlayers === prev.totalPlayers
                ? "finished"
                : prev.status,
          };
        });
      }
    }
    console.log("Testing code results:", results);
  };

  const handleTestCode = () => {
    // Implement code testing logic for BattleControls
    console.log("Test code button clicked");
  };

  const handleCompleteBattle = () => {
    if (isAdmin) {
      // Admin completes battle via server
      completeServerBattle();
      setBattleState((prev) => ({ ...prev, status: "finished" }));
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* <BattleHeader /> */}

        {/* <BattleStatusPanel battleState={battleState} countdown={countdown} /> */}

        {/* Admin Panel */}
        <AdminPanel
          isAdmin={isAdmin}
          battleStatus={
            serverBattleStatus === "completed"
              ? "finished"
              : serverBattleStatus || "waiting"
          }
          playerCount={players.length}
          error={serverError}
          onStartBattle={handleStartBattle}
          onCompleteBattle={handleCompleteBattle}
        />

        {/* Pre-battle and post-battle layout */}
        {(battleState.status === "waiting" ||
          battleState.status === "countdown") && (
          <>
            <MultiplayerLeaderboard
              players={players}
              currentUserId={currentPlayerId}
              battleStatus={battleState.status}
              playerResults={playerResults}
            />
            {!isAdmin && (
              <BattleControls
                battleStatus={battleState.status}
                onStartBattle={handleStartBattle}
                onResetBattle={handleResetBattle}
                onSubmitSolution={handleSubmitSolution}
                onTestCode={handleTestCode}
              />
            )}
          </>
        )}

        {/* Active battle layout with editor */}
        {(battleState.status === "active" ||
          battleState.status === "finished") && (
          <>
            {/* Admin panel also visible during active battle */}
            {battleState.status === "active" && (
              <AdminPanel
                isAdmin={isAdmin}
                battleStatus={
                  serverBattleStatus === "completed"
                    ? "finished"
                    : serverBattleStatus || "waiting"
                }
                playerCount={players.length}
                error={serverError}
                onStartBattle={handleStartBattle}
                onCompleteBattle={handleCompleteBattle}
              />
            )}

            <Grid container spacing={3} mb={4}>
              {/* Multiplayer leaderboard during battle */}
              <Grid item xs={12} md={12}>
                <MultiplayerLeaderboard
                  players={players}
                  currentUserId={currentPlayerId}
                  battleStatus={battleState.status}
                  playerResults={playerResults}
                />
              </Grid>

              {/* Resizable Coding Panels */}
              <Grid item xs={12}>
                <ResizableCodingPanels
                  problemTitle={battleState.currentProblem}
                  problemId="twoSum"
                  onSubmit={handleSubmitSolution}
                  onTest={handleTestResults}
                  battleId={battleId}
                  playerId={currentPlayerId}
                />
              </Grid>
            </Grid>

            {/* <BattleControls
              battleStatus={battleState.status}
              onStartBattle={handleStartBattle}
              onResetBattle={handleResetBattle}
              onSubmitSolution={handleSubmitSolution}
              onTestCode={handleTestCode}
            /> */}
          </>
        )}

        <BattleResults
          winners={battleState.winners}
          isVisible={battleState.status === "finished"}
        />
      </Box>
    </Container>
  );
};

export default BattleMain;
