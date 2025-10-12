import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { PlayArrow, Code, Refresh, Send } from "@mui/icons-material";
import { motion } from "framer-motion";

interface BattleControlsProps {
  battleStatus: "waiting" | "countdown" | "active" | "finished";
  onStartBattle: () => void;
  onResetBattle: () => void;
  onSubmitSolution?: () => void;
  onTestCode?: () => void;
}

const BattleControls: React.FC<BattleControlsProps> = ({
  battleStatus,
  onStartBattle,
  onResetBattle,
  onSubmitSolution,
  onTestCode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2} textAlign="center">
          Battle Controls
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          {battleStatus === "waiting" && (
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={onStartBattle}
              color="success"
            >
              Start Battle
            </Button>
          )}

          {battleStatus === "active" && (
            <>
              <Button
                variant="contained"
                startIcon={<Send />}
                color="primary"
                onClick={onSubmitSolution}
              >
                Submit Solution
              </Button>
              <Button
                variant="outlined"
                startIcon={<Code />}
                onClick={onTestCode}
              >
                Test Code
              </Button>
            </>
          )}

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onResetBattle}
          >
            Reset Battle
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default BattleControls;
