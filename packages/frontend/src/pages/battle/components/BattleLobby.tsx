import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  alpha,
} from "@mui/material";
import {
  EmojiEvents,
  Code,
  Timer,
  People,
  TrendingUp,
  Psychology,
  Bolt,
  PlayArrow,
} from "@mui/icons-material";

interface BattleLobbyProps {
  onJoinBattle: () => void;
  isLoading?: boolean;
}

export const BattleLobby: React.FC<BattleLobbyProps> = ({
  onJoinBattle,
  isLoading,
}) => {
  const features = [
    {
      icon: <Timer sx={{ fontSize: 40 }} />,
      title: "Real-Time Competition",
      description: "Compete against other developers in live coding challenges",
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: "Multiplayer Arena",
      description:
        "Battle up to 4 players simultaneously and climb the leaderboard",
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: "Real Problems",
      description:
        "Solve actual coding interview questions used by top tech companies",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: "Track Progress",
      description:
        "Earn coins, level up, and track your coding performance over time",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Join the Battle",
      description:
        "Click join and wait for other players (or AI opponents) to join",
    },
    {
      step: 2,
      title: "Get Ready",
      description: "60-second countdown begins when players are ready",
    },
    {
      step: 3,
      title: "Code Fast",
      description:
        "Solve the coding challenge as quickly and accurately as possible",
    },
    {
      step: 4,
      title: "Win Rewards",
      description: "Top performers earn coins and climb the leaderboard",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <EmojiEvents
            sx={{
              fontSize: 120,
              color: "primary.main",
              mb: 3,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
              },
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "4rem" },
            }}
          >
            Code Battle Arena
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Test your coding skills in real-time multiplayer battles. Compete,
            learn, and become a coding champion!
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            size="large"
            onClick={onJoinBattle}
            disabled={isLoading}
            startIcon={<PlayArrow />}
            sx={{
              fontSize: "1.25rem",
              py: 2,
              px: 6,
              borderRadius: 3,
              "&:hover": {
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isLoading ? "Joining..." : "Join Battle Now"}
          </Button>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Chip
              icon={<Bolt />}
              label="Instant Matchmaking"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Psychology />}
              label="AI Opponents Available"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Box>

        {/* Features Section */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* How It Works Section */}
        <Card
          sx={{
            mb: 6,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 4, textAlign: "center" }}
            >
              How It Works
            </Typography>
            <Grid container spacing={3}>
              {howItWorks.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.step}>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        margin: "0 auto 16px",
                      }}
                    >
                      {item.step}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: "Active Players", value: "1,000+" },
            { label: "Battles Today", value: "250+" },
            { label: "Problems Available", value: "500+" },
            { label: "Avg. Battle Time", value: "15 min" },
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Final CTA */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to prove your skills?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onJoinBattle}
            disabled={isLoading}
            startIcon={<PlayArrow />}
            sx={{
              fontSize: "1.25rem",
              py: 2,
              px: 6,
              borderRadius: 3,
              fontWeight: 700,
              "&:hover": {
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isLoading ? "Joining Battle..." : "Enter the Arena"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
