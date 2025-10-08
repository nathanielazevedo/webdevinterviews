import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { motion } from "framer-motion";

interface Player {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  wins: number;
  losses: number;
  status: "ready" | "coding" | "submitted" | "disconnected";
}

interface PlayerCardProps {
  player: Player;
  position: "left" | "right";
  testProgress?: {
    passed: number;
    total: number;
  };
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  position,
  testProgress,
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: position === "left" ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={4}
        sx={{
          height: "100%",
          border:
            player.status === "coding"
              ? `2px solid ${theme.palette.primary.main}`
              : "none",
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center">
            <Avatar
              src={player.avatar}
              sx={{
                width: 60,
                height: 60,
                mr: 2,
                border: `3px solid ${theme.palette.primary.main}`,
              }}
            >
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {player.name}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip
                  label={`${player.rating} ELO`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`${player.wins}W/${player.losses}L`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          {/* Test Progress Section */}
          {testProgress && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 1 }} />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.secondary">
                  Test Progress
                </Typography>
                <Chip
                  label={`${testProgress.passed}/${testProgress.total} passed`}
                  color={
                    testProgress.passed === testProgress.total
                      ? "success"
                      : "warning"
                  }
                  size="small"
                  variant="outlined"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  testProgress.total > 0
                    ? (testProgress.passed / testProgress.total) * 100
                    : 0
                }
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: theme.palette.grey[200],
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    backgroundColor:
                      testProgress.passed === testProgress.total
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlayerCard;
