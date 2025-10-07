import React from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";

const BattleHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography
        variant="h3"
        component="h1"
        textAlign="center"
        fontWeight="bold"
        mb={1}
      >
        ⚔️ Coding Battle Arena
      </Typography>
      <Typography variant="h6" textAlign="center" color="text.secondary" mb={4}>
        Real-time 1v1 Coding Competition
      </Typography>
    </motion.div>
  );
};

export default BattleHeader;
