import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Paper,
  useTheme,
  Badge,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  EmojiEvents,
  Timer,
  Code,
  CheckCircle,
  Schedule,
  PlayArrow,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface Player {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  wins: number;
  losses: number;
  status: "ready" | "coding" | "submitted" | "disconnected";
  joinedAt: number;
  testProgress?: {
    passed: number;
    total: number;
    completedAt?: number;
  };
}

interface PlayerResults {
  [playerId: string]: {
    passed: number;
    total: number;
    completedAt: string | null;
    isCompleted: boolean;
  };
}

interface MultiplayerLeaderboardProps {
  players: Player[];
  currentUserId: string;
  battleStatus: "waiting" | "countdown" | "active" | "finished";
  playerResults?: PlayerResults;
  countdown?: number | null;
  battleStartTime?: string | null;
}

const MultiplayerLeaderboard: React.FC<MultiplayerLeaderboardProps> = ({
  players,
  currentUserId,
  battleStatus,
  playerResults: _playerResults = {},
  countdown = null,
  battleStartTime = null,
}) => {
  const theme = useTheme();

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  // Format the battle start time properly
  const formatBattleStartTime = (startTime: string | null) => {
    if (!startTime) return "Not scheduled";

    try {
      const date = new Date(startTime);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid time";

      // Check if it's a Saturday 5pm battle (weekly scheduled battle)
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      if (dayOfWeek === 6 && hour === 17) {
        // Saturday at 5pm
        return (
          date.toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) + " (Weekly Battle)"
        );
      }

      return date.toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid time";
    }
  }; // Sort players by completion status and time
  const sortedPlayers = [...players].sort((a, b) => {
    // Completed players first
    if (a.testProgress?.completedAt && !b.testProgress?.completedAt) return -1;
    if (!a.testProgress?.completedAt && b.testProgress?.completedAt) return 1;

    // Among completed players, sort by completion time
    if (a.testProgress?.completedAt && b.testProgress?.completedAt) {
      return a.testProgress.completedAt - b.testProgress.completedAt;
    }

    // Among non-completed players, sort by progress
    const aProgress = a.testProgress
      ? a.testProgress.passed / a.testProgress.total
      : 0;
    const bProgress = b.testProgress
      ? b.testProgress.passed / b.testProgress.total
      : 0;

    if (aProgress !== bProgress) return bProgress - aProgress;

    // Finally sort by join time
    return a.joinedAt - b.joinedAt;
  });

  const getStatusColor = (player: Player) => {
    switch (player.status) {
      case "submitted":
        return theme.palette.success.main;
      case "coding":
        return theme.palette.warning.main;
      case "ready":
        return theme.palette.info.main;
      case "disconnected":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (player: Player) => {
    switch (player.status) {
      case "submitted":
        return <CheckCircle color="success" />;
      case "coding":
        return <Code color="warning" />;
      case "ready":
        return <Schedule color="info" />;
      case "disconnected":
        return <Person color="disabled" />;
      default:
        return <Person />;
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <EmojiEvents sx={{ color: "#FFD700" }} />; // Gold
    if (index === 1) return <EmojiEvents sx={{ color: "#C0C0C0" }} />; // Silver
    if (index === 2) return <EmojiEvents sx={{ color: "#CD7F32" }} />; // Bronze
    return null;
  };

  // Show countdown entry screen for waiting and countdown states
  if (battleStatus === "waiting" || battleStatus === "countdown") {
    return (
      <Paper elevation={2} sx={{ p: 4, mb: 3, textAlign: "center" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight={300}
        >
          {battleStatus === "countdown" && countdown !== null ? (
            // Battle starting countdown
            <>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.primary.main,
                }}
              >
                {countdown}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Battle Starting...
              </Typography>
              <CircularProgress size={60} thickness={4} />
            </>
          ) : (
            // Waiting for next battle
            <>
              <PlayArrow
                sx={{
                  fontSize: 80,
                  mb: 3,
                  color: theme.palette.primary.main,
                  opacity: 0.7,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {countdown !== null && countdown > 0
                  ? "Battle Starts In"
                  : "Waiting for Players"}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: theme.palette.primary.main,
                  fontFamily: "monospace",
                }}
              >
                {countdown !== null && countdown > 0
                  ? formatCountdown(countdown)
                  : "--:--"}
              </Typography>
              {battleStartTime && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Scheduled for: {formatBattleStartTime(battleStartTime)}
                </Typography>
              )}
              {(!battleStartTime || (countdown !== null && countdown <= 0)) && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Battle will start when ready
                </Typography>
              )}
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Get ready to code! The battle will begin automatically.
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={`${players.length} Player${
                    players.length !== 1 ? "s" : ""
                  } Ready`}
                  color="success"
                  variant="outlined"
                  size="medium"
                />
                <Timer color="primary" />
              </Box>
            </>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Battle Leaderboard
        </Typography>
        <Chip
          label={`${players.length} Players`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Grid container spacing={2}>
        {sortedPlayers.map((player, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={player.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                elevation={player.id === currentUserId ? 4 : 1}
                sx={{
                  height: "100%",
                  border:
                    player.id === currentUserId
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Rank Badge */}
                {battleStatus === "finished" && index < 3 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      zIndex: 1,
                    }}
                  >
                    <Badge
                      badgeContent={getRankIcon(index)}
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "transparent",
                          boxShadow: "none",
                        },
                      }}
                    >
                      <Box />
                    </Badge>
                  </Box>
                )}

                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={player.avatar}
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 1.5,
                        border: `2px solid ${getStatusColor(player)}`,
                      }}
                    >
                      <Person />
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {player.name}
                        {player.id === currentUserId && " (You)"}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getStatusIcon(player)}
                        <Typography variant="caption" color="text.secondary">
                          {player.status}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Test Progress */}
                  {player.testProgress && (
                    <Box mb={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Tests Passed
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {player.testProgress.passed}/
                          {player.testProgress.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={
                          player.testProgress.total > 0
                            ? (player.testProgress.passed /
                                player.testProgress.total) *
                              100
                            : 0
                        }
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.palette.grey[200],
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor:
                              player.testProgress.passed ===
                              player.testProgress.total
                                ? theme.palette.success.main
                                : theme.palette.primary.main,
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* Player Stats */}
                  <Box display="flex" justifyContent="space-between" gap={1}>
                    <Chip
                      label={`${player.rating} ELO`}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${player.wins}W/${player.losses}L`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  {/* Completion Time */}
                  {player.testProgress?.completedAt && (
                    <Box mt={2} display="flex" alignItems="center" gap={0.5}>
                      <Timer fontSize="small" color="success" />
                      <Typography variant="caption" color="success.main">
                        Completed #{index + 1}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Empty state for waiting for players */}
        {players.length === 1 && (
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={4}
              sx={{ opacity: 0.6 }}
            >
              <Person sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Waiting for more players...
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Share this battle room to invite others to join the competition!
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default MultiplayerLeaderboard;
