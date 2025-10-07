import React, { useState, useEffect } from "react";
import { Box, Grid, Container } from "@mui/material";
import {
  PlayerCard,
  BattleStatusPanel,
  VSIndicator,
  BattleControls,
  BattleResults,
  BattleHeader,
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
  const [battleState, setBattleState] = useState<BattleState>({
    status: "waiting",
    timeRemaining: 900, // 15 minutes
    totalTime: 900,
    currentProblem: "Two Sum",
  });

  const [players] = useState<Player[]>([
    {
      id: "1",
      name: "Alex Chen",
      avatar: "/api/placeholder/40/40",
      rating: 1850,
      wins: 23,
      losses: 7,
      status: "ready",
    },
    {
      id: "2",
      name: "Jordan Smith",
      avatar: "/api/placeholder/40/40",
      rating: 1920,
      wins: 31,
      losses: 12,
      status: "ready",
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

  const handleTestCode = (code?: string) => {
    // Implement code testing logic
    console.log("Testing code:", code);
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
                <PlayerCard player={players[0]} position="left" />
              </Grid>
              <Grid item xs={12} md={6}>
                <PlayerCard player={players[1]} position="right" />
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
                    <PlayerCard player={players[0]} position="left" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <PlayerCard player={players[1]} position="right" />
                  </Grid>
                </Grid>
              </Grid>

              {/* Resizable Coding Panels */}
              <Grid item xs={12}>
                <ResizableCodingPanels
                  problemTitle={battleState.currentProblem}
                  onSubmit={handleSubmitSolution}
                  onTest={handleTestCode}
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
