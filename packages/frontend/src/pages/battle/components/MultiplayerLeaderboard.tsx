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
  CheckCircle,
  PlayArrow,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { QuestionSummary, Player } from "@webdevinterviews/shared";

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
  battleStatus: "waiting" | "active" | "completed" | "no-battle";
  playerResults?: PlayerResults;
  countdown?: number | null;
  battleStartTime?: string | null;
  questionPool?: QuestionSummary[];
}

const MultiplayerLeaderboard: React.FC<MultiplayerLeaderboardProps> = ({
  players,
  currentUserId,
  battleStatus,
  playerResults: _playerResults = {},
  countdown = null,
  battleStartTime = null,
  questionPool = [],
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
    // Get completion status from playerResults
    const aResult = _playerResults?.[a.userId];
    const bResult = _playerResults?.[b.userId];

    // Completed players first
    if (aResult?.isCompleted && !bResult?.isCompleted) return -1;
    if (!aResult?.isCompleted && bResult?.isCompleted) return 1;

    // Among completed players, sort by completion time
    if (
      aResult?.isCompleted &&
      bResult?.isCompleted &&
      aResult.completedAt &&
      bResult.completedAt
    ) {
      return (
        new Date(aResult.completedAt).getTime() -
        new Date(bResult.completedAt).getTime()
      );
    }

    // Among non-completed players, sort by progress
    const aProgress = a.totalTests > 0 ? a.testsPassed / a.totalTests : 0;
    const bProgress = b.totalTests > 0 ? b.testsPassed / b.totalTests : 0;

    if (aProgress !== bProgress) return bProgress - aProgress;

    // Finally sort by join time
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });

  const getStatusColor = (player: Player) => {
    return player.isConnected
      ? theme.palette.success.main
      : theme.palette.error.main;
  };

  const getStatusIcon = (player: Player) => {
    return player.isConnected ? (
      <CheckCircle color="success" />
    ) : (
      <Person color="disabled" />
    );
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <EmojiEvents sx={{ color: "#FFD700" }} />; // Gold
    if (index === 1) return <EmojiEvents sx={{ color: "#C0C0C0" }} />; // Silver
    if (index === 2) return <EmojiEvents sx={{ color: "#CD7F32" }} />; // Bronze
    return null;
  };

  // Show countdown entry screen for waiting and countdown states
  if (battleStatus === "waiting") {
    return (
      <Paper elevation={2} sx={{ p: 4, mb: 3, textAlign: "center" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight={300}
        >
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
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Scheduled for: {formatBattleStartTime(battleStartTime)}
              </Typography>
            )}
            {(!battleStartTime || (countdown !== null && countdown <= 0)) && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Battle will start when ready
              </Typography>
            )}
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Get ready to code! The battle will begin automatically.
            </Typography>

            {/* Question Pool Display */}
            {questionPool.length > 0 && (
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Battle Questions ({questionPool.length})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {questionPool.map((question, index) => (
                    <Chip
                      key={question.id}
                      label={`${index + 1}. ${question.title}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        backgroundColor:
                          question.difficulty === "Easy"
                            ? "#e8f5e8"
                            : question.difficulty === "Medium"
                            ? "#fff3e0"
                            : "#ffebee",
                        borderColor:
                          question.difficulty === "Easy"
                            ? "#4caf50"
                            : question.difficulty === "Medium"
                            ? "#ff9800"
                            : "#f44336",
                        color:
                          question.difficulty === "Easy"
                            ? "#2e7d32"
                            : question.difficulty === "Medium"
                            ? "#e65100"
                            : "#c62828",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

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
          <Grid item xs={12} sm={6} md={4} lg={3} key={player.userId}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                elevation={player.userId === currentUserId ? 4 : 1}
                sx={{
                  height: "100%",
                  border:
                    player.userId === currentUserId
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Rank Badge */}
                {battleStatus === "completed" && index < 3 && (
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
                        {player.username}
                        {player.userId === currentUserId && " (You)"}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getStatusIcon(player)}
                        <Typography variant="caption" color="text.secondary">
                          {player.isConnected ? "Connected" : "Disconnected"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Test Progress */}
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
                        {player.testsPassed}/{player.totalTests}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        player.totalTests > 0
                          ? (player.testsPassed / player.totalTests) * 100
                          : 0
                      }
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: theme.palette.grey[200],
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          backgroundColor:
                            player.testsPassed === player.totalTests &&
                            player.totalTests > 0
                              ? theme.palette.success.main
                              : theme.palette.primary.main,
                        },
                      }}
                    />
                  </Box>

                  {/* Player Stats - Placeholder for now */}
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Chip
                      label="Rating: TBD"
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Completion Time */}
                  {_playerResults?.[player.userId]?.isCompleted && (
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
