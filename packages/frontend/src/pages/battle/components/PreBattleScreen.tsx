import React from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Grid,
  Paper,
  alpha,
} from "@mui/material";
import {
  EmojiEvents,
  Code,
  Timer,
  PersonAdd,
  SmartToy,
} from "@mui/icons-material";
import type { Player } from "@webdevinterviews/shared";
import type { BattleCountdown } from "../../../hooks/battle/useBattle";

interface PreBattleScreenProps {
  players: Player[];
  currentUserId: string;
  countdown: BattleCountdown | null;
  questionTitle?: string;
  questionDifficulty?: "Easy" | "Medium" | "Hard";
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case "Easy":
      return "success";
    case "Medium":
      return "warning";
    case "Hard":
      return "error";
    default:
      return "default";
  }
};

export const PreBattleScreen: React.FC<PreBattleScreenProps> = ({
  players,
  currentUserId,
  countdown,
  questionTitle,
  questionDifficulty,
}) => {
  const currentPlayer = players.find((p) => p.userId === currentUserId);
  const otherPlayers = players.filter((p) => p.userId !== currentUserId);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = countdown
    ? ((60 - countdown.secondsUntilStart) / 60) * 100
    : 0;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        {/* Title Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <EmojiEvents
            sx={{
              fontSize: 80,
              color: "primary.main",
              mb: 2,
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Battle Arena
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Prepare for combat! Battle starts soon...
          </Typography>
        </Box>

        {/* Countdown Card */}
        {countdown && (
          <Card
            sx={{
              mb: 4,
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.1
                )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Timer sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {formatTime(countdown.secondsUntilStart)}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Battle starts in...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.1),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background:
                      "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  },
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Challenge Info */}
        {questionTitle && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Code sx={{ color: "primary.main" }} />
                <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
                  Today&apos;s Challenge
                </Typography>
                {questionDifficulty && (
                  <Chip
                    label={questionDifficulty}
                    color={getDifficultyColor(questionDifficulty)}
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="h6" color="text.secondary">
                {questionTitle}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Players Section */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonAdd />
            Warriors in the Arena ({players.length}/4)
          </Typography>

          <Grid container spacing={3}>
            {/* Current Player - Featured */}
            {currentPlayer && (
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: (theme) =>
                      `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )} 0%, ${alpha(
                        theme.palette.secondary.main,
                        0.15
                      )} 100%)`,
                    border: "2px solid",
                    borderColor: "primary.main",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Chip
                    label="YOU"
                    color="primary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontWeight: 700,
                    }}
                  />
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                      src={currentPlayer.avatar}
                      sx={{
                        width: 80,
                        height: 80,
                        border: "4px solid",
                        borderColor: "primary.main",
                        boxShadow: 3,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {currentPlayer.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ready to battle
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Other Players */}
            {otherPlayers.map((player) => (
              <Grid item xs={12} sm={6} md={4} key={player.userId}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2} alignItems="center">
                      <Box sx={{ position: "relative" }}>
                        <Avatar
                          src={player.avatar}
                          sx={{
                            width: 64,
                            height: 64,
                            border: "3px solid",
                            borderColor: player.isBot
                              ? "secondary.main"
                              : "divider",
                          }}
                        />
                        {player.isBot && (
                          <SmartToy
                            sx={{
                              position: "absolute",
                              bottom: -4,
                              right: -4,
                              backgroundColor: "background.paper",
                              borderRadius: "50%",
                              padding: 0.5,
                              color: "secondary.main",
                              fontSize: 20,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {player.username}
                        </Typography>
                        {player.isBot && (
                          <Chip
                            label="AI"
                            color="secondary"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Empty Slots */}
            {players.length < 4 &&
              Array.from({ length: 4 - players.length }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`empty-${index}`}>
                  <Card
                    sx={{
                      height: "100%",
                      border: "2px dashed",
                      borderColor: "divider",
                      backgroundColor: "transparent",
                    }}
                  >
                    <CardContent>
                      <Stack
                        spacing={2}
                        alignItems="center"
                        sx={{ opacity: 0.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            backgroundColor: "action.hover",
                          }}
                        >
                          <PersonAdd />
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          Waiting for player...
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>

        {/* Battle Tips */}
        <Paper
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
            border: "1px solid",
            borderColor: "info.main",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            💡 Battle Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <strong>Write clean code:</strong> Focus on solving the problem
                efficiently
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <strong>Test often:</strong> Run tests to verify your solution
                as you code
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                <strong>Stay focused:</strong> You have limited time to complete
                the challenge
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};
