import React from "react";
import { Box, Grid, Container } from "@mui/material";
import {
  BattleControls,
  BattleResults,
  ResizableCodingPanels,
  MultiplayerLeaderboard,
  BattleEntrySideNav,
} from "./components";
import { useBattleEnhanced } from "../../hooks/battle";

const BattleMain: React.FC = () => {
  // Use the new enhanced battle hook - all logic is now contained here
  const {
    // IDs
    battleId,
    currentPlayerId,

    // Battle State
    battleState,
    isAdmin,

    // Players
    players,
    playerResults,

    // Questions
    currentQuestion,

    // Timer
    battleStartTime,
    effectiveCountdown,

    // Actions
    handleStartBattle,
    handleResetBattle,
    handleSubmitSolution,
    handleTestResults,
  } = useBattleEnhanced();

  // Simple test code handler for BattleControls
  const handleTestCode = () => {
    // Implementation for test code functionality
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
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
                  countdown={effectiveCountdown}
                  battleStartTime={battleStartTime}
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
                  problemTitle={
                    currentQuestion?.title || battleState.currentProblem
                  }
                  problemId={currentQuestion?.slug || "twoSum"}
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
