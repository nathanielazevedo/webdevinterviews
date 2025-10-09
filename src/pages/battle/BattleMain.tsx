import React, { useState, useEffect } from "react";
import { Box, Grid, Container } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext.tsx";
import {
  BattleControls,
  BattleResults,
  ResizableCodingPanels,
  MultiplayerLeaderboard,
  BattleEntrySideNav,
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

  // Helper function to get player ID from URL params or user
  const getPlayerId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugPlayerId = urlParams.get("playerId");
    const debugPlayerName = urlParams.get("playerName");

    // If debug parameters are provided, use them
    if (debugPlayerId) {
      return debugPlayerId;
    }

    // If debugPlayerName is provided, create a consistent ID from it
    if (debugPlayerName) {
      return `debug_${debugPlayerName.toLowerCase().replace(/\s+/g, "_")}`;
    }

    return user?.id || "anonymous";
  };

  const getPlayerName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugPlayerName = urlParams.get("playerName");

    if (debugPlayerName) {
      return debugPlayerName;
    }

    return user?.email?.split("@")[0] || "Anonymous";
  };

  // Generate battle and player IDs for WebSocket connection
  const [battleId] = useState(`battle_1`);
  const [currentPlayerId] = useState(() => getPlayerId());
  const [currentPlayerName] = useState(() => getPlayerName());

  // Check if we're in debug mode
  const isDebugMode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("playerId") || urlParams.has("playerName");
  };

  // Generate test URLs for multiple players
  const generateTestUrls = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return [
      `${baseUrl}?playerName=Alice`,
      `${baseUrl}?playerName=Bob`,
      `${baseUrl}?playerName=Charlie`,
      `${baseUrl}?playerName=David`,
    ];
  };

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
    startBattle: startServerBattle,
  } = useWebSocket(getWebSocketUrl(), battleId, currentPlayerId);

  // Update players list from WebSocket with live test results
  useEffect(() => {
    if (playersList.length > 0) {
      const updatedPlayers = playersList.map((wsPlayer) => {
        // Check if we have live test results for this player
        const liveResults = playerResults[wsPlayer.userId];

        return {
          id: wsPlayer.userId,
          name:
            wsPlayer.userId === currentPlayerId
              ? currentPlayerName // Use debug name for current player
              : wsPlayer.userId.split("@")[0] || "Anonymous", // Extract name from userId for others
          avatar: "/api/placeholder/40/40",
          rating: 1500,
          wins: 0,
          losses: 0,
          status: wsPlayer.isConnected
            ? ("ready" as const)
            : ("disconnected" as const),
          joinedAt: new Date(wsPlayer.joinedAt).getTime(),
          testProgress: liveResults
            ? {
                // Use live results if available (more up-to-date)
                passed: liveResults.passed,
                total: liveResults.total,
                completedAt: liveResults.isCompleted ? Date.now() : undefined,
              }
            : {
                // Fall back to WebSocket player data
                passed: wsPlayer.testsPassed,
                total: wsPlayer.totalTests,
                completedAt:
                  wsPlayer.testsPassed === wsPlayer.totalTests &&
                  wsPlayer.totalTests > 0
                    ? Date.now()
                    : undefined,
              },
        };
      });
      setPlayers(updatedPlayers);
    }
  }, [playersList, playerResults, currentPlayerId, currentPlayerName]); // Include playerResults in dependencies

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

  // Update battle state based on player completion status
  useEffect(() => {
    const completedPlayers = players.filter(
      (player) =>
        player.testProgress &&
        player.testProgress.passed === player.testProgress.total &&
        player.testProgress.total > 0
    );

    if (completedPlayers.length > 0) {
      setBattleState((prev) => {
        const newWinners = completedPlayers
          .slice(0, 3) // Top 3 winners
          .map((player) => player.name);

        return {
          ...prev,
          completedPlayers: completedPlayers.length,
          winners: newWinners,
          status:
            completedPlayers.length === players.length && players.length > 0
              ? "finished"
              : prev.status,
        };
      });
    }
  }, [players]);

  // Initialize current user as the first player only if no WebSocket players
  useEffect(() => {
    if (playersList.length === 0) {
      const currentPlayer: Player = {
        id: currentPlayerId,
        name: currentPlayerName,
        avatar: user?.user_metadata?.avatar_url || "/api/placeholder/40/40",
        rating: 1500,
        wins: 0,
        losses: 0,
        status: "ready",
        joinedAt: Date.now(),
      };

      setPlayers([currentPlayer]);
      setBattleState((prev) => ({ ...prev, totalPlayers: 1 }));
    }
  }, [
    currentPlayerId,
    currentPlayerName,
    user?.user_metadata?.avatar_url,
    playersList.length,
  ]);

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
    // Send test results to WebSocket server for multiplayer sync
    if (results && results.testCases) {
      const passed = results.testCases.filter((tc) => tc.passed).length;
      const total = results.testCases.length;

      // Send to WebSocket - this will trigger updates for all players
      sendTestResults(passed, total);

      console.log("Sent test results to WebSocket:", { passed, total });
    }
    console.log("Testing code results:", results);
  };

  const handleTestCode = () => {
    // Implement code testing logic for BattleControls
    console.log("Test code button clicked");
  };

  return (
    <>
      {/* Debug Mode Info Panel - Always visible in development */}
      {/* <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          backgroundColor: "warning.light",
          border: "1px solid",
          borderColor: "warning.main",
          p: 1,
          fontSize: "0.8rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <strong>
              🧪{" "}
              {isDebugMode() ? "Debug Mode Active" : "Local Testing Available"}
            </strong>
            {" | "}
            Playing as: <strong>{currentPlayerName}</strong> (ID:{" "}
            {currentPlayerId})
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              fontSize: "0.75em",
            }}
          >
            <span>Try: ?playerName=Alice</span>
            <button
              onClick={() => {
                const urls = generateTestUrls();
                console.log("🧪 Test URLs for multiple players:");
                urls.forEach((url, i) =>
                  console.log(`Player ${i + 1}: ${url}`)
                );
                alert(
                  "Test URLs logged to console! Open Developer Tools to copy them."
                );
              }}
              style={{ padding: "2px 6px", fontSize: "11px" }}
            >
              Log Test URLs
            </button>
          </Box>
        </Box>
      </Box> */}

      <Container maxWidth="xl">
        <Box sx={{ py: 4, mt: 6 }}>
          {" "}
          {/* Add top margin to account for fixed debug panel */}
          {/* <BattleHeader /> */}
          {/* <BattleStatusPanel battleState={battleState} countdown={countdown} /> */}
          {/* Pre-battle and post-battle layout */}
          {(battleState.status === "waiting" ||
            battleState.status === "countdown") && (
            <Grid container spacing={3}>
              {/* Side Navigation */}
              <Grid item xs={12} md={3}>
                <BattleEntrySideNav
                  players={players}
                  currentUserId={currentPlayerId}
                />
              </Grid>

              {/* Main Content */}
              <Grid item xs={12} md={9}>
                <MultiplayerLeaderboard
                  players={players}
                  currentUserId={currentPlayerId}
                  battleStatus={battleState.status}
                  playerResults={playerResults}
                  countdown={countdown}
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
              </Grid>
            </Grid>
          )}
          {/* Active battle layout with editor */}
          {(battleState.status === "active" ||
            battleState.status === "finished") && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "background.default",
                overflow: "hidden",
                zIndex: 1000,
              }}
            >
              {/* Fixed-height coding panels */}
              <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <ResizableCodingPanels
                  problemTitle={battleState.currentProblem}
                  problemId="twoSum"
                  onSubmit={handleSubmitSolution}
                  onTest={handleTestResults}
                  battleId={battleId}
                  playerId={currentPlayerId}
                  players={players}
                  currentUserId={currentPlayerId}
                />
              </Box>
            </Box>
          )}
          <BattleResults
            winners={battleState.winners}
            isVisible={battleState.status === "finished"}
          />
        </Box>
      </Container>
    </>
  );
};

export default BattleMain;
