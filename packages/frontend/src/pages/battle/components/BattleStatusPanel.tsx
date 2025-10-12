import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { Timer } from "@mui/icons-material";
import { motion } from "framer-motion";

interface BattleStatus {
  status: "waiting" | "countdown" | "active" | "finished";
  timeRemaining: number;
  totalTime: number;
  currentProblem: string;
}

interface BattleStatusPanelProps {
  battleState: BattleStatus;
  countdown: number | null;
}

const BattleStatusPanel: React.FC<BattleStatusPanelProps> = ({
  battleState,
  countdown,
}) => {
  const theme = useTheme();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressColor = () => {
    const percentage =
      (battleState.timeRemaining / battleState.totalTime) * 100;
    if (percentage > 50) return "success";
    if (percentage > 25) return "warning";
    return "error";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          textAlign: "center",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
              : "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
        }}
      >
        {countdown !== null && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
          >
            <Typography variant="h1" color="primary" fontWeight="bold">
              {countdown}
            </Typography>
            <Typography variant="h6">Get Ready!</Typography>
          </motion.div>
        )}

        {countdown === null && (
          <>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <Timer sx={{ mr: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatTime(battleState.timeRemaining)}
              </Typography>
            </Box>

          </>
        )}
      </Paper>
    </motion.div>
  );
};

export default BattleStatusPanel;
