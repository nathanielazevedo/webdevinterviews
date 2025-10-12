import React from "react";
import { Typography, Paper, useTheme } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { motion } from "framer-motion";

interface BattleResultsProps {
  winners?: string[];
  isVisible: boolean;
}

const BattleResults: React.FC<BattleResultsProps> = ({
  winners,
  isVisible,
}) => {
  const theme = useTheme();

  if (!isVisible) return null;

  const renderWinners = () => {
    if (!winners || winners.length === 0) {
      return <Typography variant="h6">No winners</Typography>;
    }

    if (winners.length === 1) {
      return (
        <Typography variant="h6">
          Winner: <strong>{winners[0]}</strong>
        </Typography>
      );
    }

    return (
      <>
        <Typography variant="h6" mb={1}>
          Winners:
        </Typography>
        {winners.map((winner, index) => (
          <Typography key={winner} variant="h6" component="div">
            <strong>
              #{index + 1} {winner}
            </strong>
          </Typography>
        ))}
      </>
    );
  };

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
        {renderWinners()}
      </Paper>
    </motion.div>
  );
};

export default BattleResults;
