import React, { useState } from "react";
import { Box, Container, Button } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import {
  BattleResults,
  ResizableCodingPanels,
  AdminControls,
  PreBattleScreen,
  BattleLobby,
  BattleTimer,
} from "./components";
import { useBattleContext } from "../../contexts/BattleContext";
import { AttackMarket } from "../../components/AttackMarket";

const BattleMain: React.FC = () => {
  const [marketOpen, setMarketOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const {
    battle,
    isAdmin,
    players,
    currentPlayerId,
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
    userWallet,
    countdown,
  } = useBattleContext();

  const handleJoinBattle = async () => {
    setIsJoining(true);
    // Add a small delay for better UX
    setTimeout(() => {
      setHasJoined(true);
      setIsJoining(false);
    }, 500);
  };

  // Calculate winners from player results
  const winners: string[] = [];

  return (
    <>
      <AttackMarket open={marketOpen} onClose={() => setMarketOpen(false)} />

      {/* Show lobby if user hasn't joined yet */}
      {!hasJoined && (
        <BattleLobby onJoinBattle={handleJoinBattle} isLoading={isJoining} />
      )}

      {/* Show battle content after joining */}
      {hasJoined && (
        <Container maxWidth="xl">
          <Box sx={{ py: 4, pt: 1 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setHasJoined(false)}
              >
                ← Leave Battle
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                startIcon={<ShoppingCart />}
                onClick={() => setMarketOpen(true)}
              >
                Market ({userWallet?.coins || 0} coins)
              </Button>
            </Box>

            {/* Pre-battle and post-battle layout */}
            {battle?.status === "waiting" && (
              <PreBattleScreen
                players={players}
                currentUserId={currentPlayerId || ""}
                countdown={countdown}
                questionTitle={battle?.selectedQuestion?.title}
                questionDifficulty={battle?.selectedQuestion?.difficulty}
              />
            )}

            {/* Active battle layout with editor */}
            {battle?.status === "active" && (
              <>
                {/* Battle Timer */}
                {/* eslint-disable-next-line no-console */}
                {console.log("BattleMain - Rendering BattleTimer with:", {
                  started_at: battle?.started_at,
                  duration_minutes: battle?.duration_minutes,
                  auto_end_time: battle?.auto_end_time,
                  status: battle?.status,
                })}
                <BattleTimer
                  startedAt={battle?.started_at}
                  durationMinutes={battle?.duration_minutes}
                  autoEndTime={battle?.auto_end_time}
                  status={battle.status}
                />

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
                      players={players}
                      currentUserId={currentPlayerId || ""}
                      problemTitle={
                        battle?.selectedQuestion?.title || "Loading..."
                      }
                      problemId={battle?.selectedQuestion?.slug || "twoSum"}
                      question={battle?.selectedQuestion || undefined}
                      onTestResults={handleTestResults}
                      battleId={battle?.id || undefined}
                    />
                  </Box>
                </Box>
              </>
            )}

            <BattleResults
              winners={winners}
              isVisible={battle?.status === "completed"}
            />
          </Box>
        </Container>
      )}

      {/* Admin Controls - Only show for admins when there's an active battle */}
      {hasJoined && isAdmin && battle && (
        <AdminControls
          isAdmin={isAdmin}
          battleStatus={battle.status}
          battleId={battle.id}
          onEndBattle={handleEndBattle}
          onStartBattle={handleStartBattle}
        />
      )}
    </>
  );
};

export default BattleMain;
