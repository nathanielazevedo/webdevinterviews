import React, { useState } from "react";
import { Box, Grid, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import {
  BattleResults,
  ResizableCodingPanels,
  MultiplayerLeaderboard,
  BattleEntrySideNav,
  AdminControls,
} from "./components";
import { useBattleContext } from "../../contexts/BattleContext";
import { AttackMarket } from "../../components/AttackMarket";
import { BattleCountdown } from "../../components/BattleCountdown";

const BattleMain: React.FC = () => {
  const navigate = useNavigate();
  const [marketOpen, setMarketOpen] = useState(false);
  const {
    battle,
    isAdmin,
    players,
    currentPlayerId,
    handleStartBattle,
    handleTestResults,
    handleEndBattle,
    userWallet,
  } = useBattleContext();

  // Calculate winners from player results
  const winners: string[] = [];

  return (
    <>
      <AttackMarket open={marketOpen} onClose={() => setMarketOpen(false)} />

      <Container maxWidth="xl">
        <Box sx={{ py: 4, pt: 1 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/")}
            >
              ← Back to Home
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
            <>
              {/* Countdown Timer */}
              <BattleCountdown />

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
                  <MultiplayerLeaderboard />
                </Grid>
              </Grid>
            </>
          )}

          {/* Active battle layout with editor */}
          {battle?.status === "active" && (
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
                  problemTitle={battle?.selectedQuestion?.title || "Loading..."}
                  problemId={battle?.selectedQuestion?.slug || "twoSum"}
                  question={battle?.selectedQuestion || undefined}
                  onTestResults={handleTestResults}
                  battleId={battle?.id || undefined}
                />
              </Box>
            </Box>
          )}

          <BattleResults
            winners={winners}
            isVisible={battle?.status === "completed"}
          />
        </Box>
      </Container>

      {/* Admin Controls - Only show for admins when there's an active battle */}
      {isAdmin && battle && (
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
