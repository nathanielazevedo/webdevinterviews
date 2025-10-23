import React from "react";
import { Box, Grid, Container } from "@mui/material";
import {
  BattleControls,
  BattleResults,
  ResizableCodingPanels,
  MultiplayerLeaderboard,
  BattleEntrySideNav,
  AdminControls,
} from "./components";
import { useBattleEnhanced } from "../../hooks/battle";

const BattleMain: React.FC = () => {
  // Use the enhanced battle hook
  const {
    // IDs
    battleId,
    currentPlayerId,

    // Battle State - use actual properties from useBattle
    battleStatus,
    isAdmin,

    // Players
    players,
    playerResults,

    // Questions
    currentQuestion,

    // Timer
    battleStartTime,
    timeUntilStart,

    // Actions
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
  } = useBattleEnhanced();

  // Calculate derived values that were in the old battleState

  // Calculate winners from player results
  const winners = Object.entries(playerResults)
    .filter(([, result]) => result.isCompleted)
    .sort((a, b) => {
      // Sort by completion time, then by score
      const aTime = new Date(a[1].completedAt || "").getTime();
      const bTime = new Date(b[1].completedAt || "").getTime();
      if (aTime !== bTime) return aTime - bTime;
      return b[1].passed - a[1].passed;
    })
    .slice(0, 3) // Top 3
    .map(([playerId]) => playerId);

  // Simple test code handler for BattleControls
  const handleTestCode = () => {
    // Implementation for test code functionality
  };

  const handleResetBattle = () => {
    // Reset functionality would go here
  };

  const handleSubmitSolution = () => {
    // Submit solution functionality would go here
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Pre-battle and post-battle layout */}
          {battleStatus === "waiting" && (
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
                  battleStatus={battleStatus}
                  playerResults={playerResults}
                  countdown={timeUntilStart || 0}
                  battleStartTime={battleStartTime}
                />

                {!isAdmin && (
                  <BattleControls
                    battleStatus={battleStatus}
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
          {(battleStatus === "active" || battleStatus === "completed") && (
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
                  problemTitle={currentQuestion?.title || "Loading..."}
                  problemId={currentQuestion?.slug || "twoSum"}
                  onSubmit={handleSubmitSolution}
                  onTest={handleTestResults}
                  battleId={battleId || undefined}
                  playerId={currentPlayerId}
                  players={players}
                  currentUserId={currentPlayerId}
                />
              </Box>
            </Box>
          )}

          <BattleResults
            winners={winners}
            isVisible={battleStatus === "completed"}
          />
        </Box>
      </Container>

      {/* Admin Controls - Always visible to admins */}
      <AdminControls
        isAdmin={true}
        battleStatus={battleStatus}
        battleId={battleId}
        onEndBattle={handleEndBattle}
        onStartBattle={handleStartBattle}
        onResetBattle={handleResetBattle}
      />
    </>
  );
};

export default BattleMain;
