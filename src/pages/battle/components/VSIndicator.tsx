import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const VSIndicator: React.FC = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        <Paper
          elevation={6}
          sx={{
            p: 2,
            borderRadius: "50%",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            VS
          </Typography>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default VSIndicator;
