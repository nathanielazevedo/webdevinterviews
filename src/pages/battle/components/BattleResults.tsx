import React from "react";
import { Typography, Paper, useTheme } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { motion } from "framer-motion";

interface BattleResultsProps {
  winner?: string;
  isVisible: boolean;
}

const BattleResults: React.FC<BattleResultsProps> = ({ winner, isVisible }) => {
  const theme = useTheme();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mt: 4,
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.success.main}20, ${theme.palette.primary.main}20)`,
        }}
      >
        <EmojiEvents sx={{ fontSize: 60, color: "gold", mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" mb={2}>
          🎉 Battle Complete! 🎉
        </Typography>
        <Typography variant="h6">
          Winner: <strong>{winner}</strong>
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default BattleResults;
