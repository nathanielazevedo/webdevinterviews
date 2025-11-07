import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, LinearProgress } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";

interface BattleTimerProps {
  startedAt?: string | null;
  durationMinutes?: number | null;
  autoEndTime?: string | null;
  status: "waiting" | "active" | "completed";
}

export const BattleTimer: React.FC<BattleTimerProps> = ({
  startedAt,
  durationMinutes,
  autoEndTime,
  status,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [percentRemaining, setPercentRemaining] = useState<number>(100);

  useEffect(() => {
    // Only show timer when battle is active
    if (status !== "active") {
      return;
    }

    // Log for debugging
    // eslint-disable-next-line no-console
    console.log("BattleTimer - Battle data:", {
      status,
      startedAt,
      durationMinutes,
      autoEndTime,
    });

    if (!startedAt || !durationMinutes) {
      // eslint-disable-next-line no-console
      console.warn("BattleTimer - Missing required data:", {
        startedAt,
        durationMinutes,
      });
      return;
    }

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      let endTime: number;

      // Use auto_end_time if available, otherwise calculate from started_at + duration
      if (autoEndTime) {
        endTime = new Date(autoEndTime).getTime();
      } else {
        const start = new Date(startedAt).getTime();
        endTime = start + durationMinutes * 60 * 1000;
      }

      const remaining = Math.max(0, endTime - now);
      const totalDuration = durationMinutes * 60 * 1000;
      const percent = Math.max(0, (remaining / totalDuration) * 100);

      setTimeRemaining(remaining);
      setPercentRemaining(percent);
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [startedAt, durationMinutes, autoEndTime, status]);

  // Don't show timer if battle is not active
  if (status !== "active") {
    return null;
  }

  // Format time as MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Determine color based on time remaining
  const getColor = () => {
    if (percentRemaining > 50) return "success";
    if (percentRemaining > 25) return "warning";
    return "error";
  };

  const isLowTime = percentRemaining <= 25;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1200, // Increased from 1100 to be above the editor (which is 1000)
        p: 2,
        minWidth: 200,
        backgroundColor: "background.paper",
        animation: isLowTime ? "pulse 1s infinite" : "none",
        "@keyframes pulse": {
          "0%, 100%": { boxShadow: (theme) => theme.shadows[3] },
          "50%": { boxShadow: (theme) => theme.shadows[10] },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <TimerIcon color={getColor()} />
        <Typography variant="h6" fontWeight="bold">
          Time Remaining
        </Typography>
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 1,
          fontFamily: "monospace",
          color: getColor() === "error" ? "error.main" : "text.primary",
        }}
      >
        {formatTime(timeRemaining)}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={percentRemaining}
        color={getColor()}
        sx={{
          height: 8,
          borderRadius: 1,
        }}
      />

      {isLowTime && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
            fontWeight: "bold",
          }}
        >
          Hurry! Time is running out!
        </Typography>
      )}
    </Paper>
  );
};
