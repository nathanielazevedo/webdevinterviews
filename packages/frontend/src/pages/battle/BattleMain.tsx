import React, { useState, useEffect } from "react";
import { Box, Grid, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BattleResults,
  ResizableCodingPanels,
  MultiplayerLeaderboard,
  BattleEntrySideNav,
  AdminControls,
} from "./components";
import { useBattleContext } from "../../contexts/BattleContext";

const BattleMain: React.FC = () => {
  const navigate = useNavigate();
  const {
    battle,
    players,
    currentPlayerId,
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
  } = useBattleContext();

  // Local countdown timer state
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);

  // Calculate winners from player results
  const winners: string[] = [];

  // Local countdown timer for scheduled battles
  useEffect(() => {
    if (!battle.startTime || battle.status !== "waiting") {
      setTimeUntilStart(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const startTime = new Date(battle.startTime!);
      const timeLeft = Math.max(
        0,
        Math.floor((startTime.getTime() - now.getTime()) / 1000)
      );

      setTimeUntilStart(timeLeft);

      if (timeLeft === 0) {
        setTimeUntilStart(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [battle.startTime, battle.status]);

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ py: 4, pt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/")}
            sx={{ mb: 2 }}
          >
            ← Back to Home
          </Button>

          {/* Pre-battle and post-battle layout */}
          {battle.status === "waiting" && (
            <Grid container spacing={3}>
              {/* Side Navigation */}
              <Grid item xs={12} md={3}>
                <BattleEntrySideNav
                  players={players}
                  currentUserId={currentPlayerId || ""}
                />
              </Grid>

              {/* Main Content */}
              <Grid item xs={12} md={9}>
                <MultiplayerLeaderboard
                  players={players}
                  currentUserId={currentPlayerId || ""}
                  battleStatus={battle.status}
                  playerResults={battle.playerResults}
                  countdown={timeUntilStart || 0}
                  battleStartTime={battle.startTime}
                  questionPool={battle.questionPool}
                />
              </Grid>
            </Grid>
          )}

          {/* Active battle layout with editor */}
          {(battle.status === "active") && (
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
                  problemTitle={battle.currentQuestion?.title || "Loading..."}
                  problemId={battle.currentQuestion?.slug || "twoSum"}
                  question={battle.currentQuestion || undefined}
                  onTest={handleTestResults}
                  battleId={battle.id || undefined}
                  playerId={currentPlayerId}
                  players={players}
                  currentUserId={currentPlayerId || ""}
                />
              </Box>
            </Box>
          )}

          <BattleResults
            winners={winners}
            isVisible={battle.status === "completed"}
          />
        </Box>
      </Container>

      {/* Admin Controls - Only show for admins when there's an active battle */}
      {battle.isAdmin && battle.status !== "no-battle" && (
        <AdminControls
          isAdmin={battle.isAdmin}
          battleStatus={battle.status as "waiting" | "active" | "completed"}
          battleId={battle.id}
          onEndBattle={handleEndBattle}
          onStartBattle={handleStartBattle}
        />
      )}
    </>
  );
};

export default BattleMain;
