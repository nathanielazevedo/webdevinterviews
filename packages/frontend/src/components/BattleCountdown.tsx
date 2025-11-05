import React from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useBattleContext } from "../contexts/BattleContext";
// import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * BattleCountdown component
 * Displays the countdown timer for on-demand battles
 * Shows when battle is waiting and will auto-start
 */
export const BattleCountdown: React.FC = () => {
  const { countdown, players } = useBattleContext();

  if (!countdown) {
    return null;
  }

  const { secondsUntilStart } = countdown;
  const minutes = Math.floor(secondsUntilStart / 60);
  const seconds = secondsUntilStart % 60;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {/* <AccessTimeIcon sx={{ fontSize: 40 }} /> */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Battle Starting In
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, fontFamily: "monospace" }}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {players.length} {players.length === 1 ? "player" : "players"}{" "}
            waiting
          </Typography>
        </Box>
        <CircularProgress
          variant="determinate"
          value={(secondsUntilStart / 60) * 100}
          size={60}
          thickness={4}
          sx={{ color: "white" }}
        />
      </Box>
    </Paper>
  );
};
