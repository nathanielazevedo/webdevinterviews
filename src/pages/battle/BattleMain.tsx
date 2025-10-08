import React, { useState, useEffect } from "react";
import { Box, Grid, Container } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext.tsx";
import {
  PlayerCard,
  VSIndicator,
  BattleControls,
  BattleResults,
  ResizableCodingPanels,
} from "./components";

interface Player {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  wins: number;
  losses: number;
  status: "ready" | "coding" | "submitted" | "disconnected";
}

interface BattleState {
  status: "waiting" | "countdown" | "active" | "finished";
  timeRemaining: number;
  totalTime: number;
  currentProblem: string;
  winner?: string;
}

const BattleMain: React.FC = () => {
  const { user } = useAuth();

  // Generate battle and player IDs for WebSocket connection
  const [battleId] = useState(() => `battle_${Date.now()}`);
  const [currentPlayerId] = useState(() => user?.id || "anonymous");

  const [battleState, setBattleState] = useState<BattleState>({
    status: "waiting",
    timeRemaining: 900, // 15 minutes
    totalTime: 900,
    currentProblem: "Two Sum",
  });

  // Test progress state for both players
  const [testProgress, setTestProgress] = useState<{
    [playerId: string]: { passed: number; total: number };
  }>({});

  const [players] = useState<Player[]>([
    {
      id: user?.id || "anonymous",
      name: user?.email?.split("@")[0] || "Anonymous",
      avatar: user?.user_metadata?.avatar_url || "/api/placeholder/40/40",
      rating: 1500, // Default rating for new users
      wins: 0,
      losses: 0,
      status: "ready",
    },
    {
      id: "opponent",
      name: "Waiting for opponent...",
      avatar: "/api/placeholder/40/40",
      rating: 1500,
      wins: 0,
      losses: 0,
      status: "disconnected",
    },
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
    setBattleState((prev) => ({ ...prev, status: "countdown" }));
    setCountdown(3);
  };

  const handleResetBattle = () => {
    setBattleState({
      status: "waiting",
      timeRemaining: 900,
      totalTime: 900,
      currentProblem: "Two Sum",
    });
    setCountdown(null);
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

      setTestProgress((prev) => ({
        ...prev,
        [currentPlayerId]: { passed, total },
      }));
    }
    console.log("Testing code results:", results);
  };

  const handleTestCode = () => {
    // Implement code testing logic for BattleControls
    console.log("Test code button clicked");
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* <BattleHeader /> */}

        {/* <BattleStatusPanel battleState={battleState} countdown={countdown} /> */}

        {/* Pre-battle and post-battle layout */}
        {(battleState.status === "waiting" ||
          battleState.status === "countdown") && (
          <>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <PlayerCard
                  player={players[0]}
                  position="left"
                  testProgress={testProgress[players[0].id]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PlayerCard
                  player={players[1]}
                  position="right"
                  testProgress={testProgress[players[1].id]}
                />
              </Grid>
            </Grid>
            <VSIndicator />
            <BattleControls
              battleStatus={battleState.status}
              onStartBattle={handleStartBattle}
              onResetBattle={handleResetBattle}
              onSubmitSolution={handleSubmitSolution}
              onTestCode={handleTestCode}
            />
          </>
        )}

        {/* Active battle layout with editor */}
        {(battleState.status === "active" ||
          battleState.status === "finished") && (
          <>
            <Grid container spacing={3} mb={4}>
              {/* Compact player cards during battle */}
              <Grid item xs={12} md={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <PlayerCard
                      player={players[0]}
                      position="left"
                      testProgress={testProgress[players[0].id]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <PlayerCard
                      player={players[1]}
                      position="right"
                      testProgress={testProgress[players[1].id]}
                    />
                  </Grid>
                </Grid>
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
          winner={battleState.winner}
          isVisible={battleState.status === "finished"}
        />
      </Box>
    </Container>
  );
};

export default BattleMain;
