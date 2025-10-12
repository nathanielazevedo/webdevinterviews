import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  AdminPanelSettings,
  People,
  Timer,
} from "@mui/icons-material";

interface AdminPanelProps {
  isAdmin: boolean;
  battleStatus: "waiting" | "active" | "finished";
  playerCount: number;
  error?: string | null;
  onStartBattle: () => void;
  onCompleteBattle: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isAdmin,
  battleStatus,
  playerCount,
  error,
  onStartBattle,
  onCompleteBattle,
}) => {
  if (!isAdmin) {
    return (
      <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <People color="action" />
            <Typography variant="body2" color="text.secondary">
              Waiting for admin to start the battle...
            </Typography>
            <Chip
              label={`${playerCount} player${
                playerCount !== 1 ? "s" : ""
              } joined`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        mb: 3,
        bgcolor: "primary.50",
        border: "2px solid",
        borderColor: "primary.main",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <AdminPanelSettings color="primary" />
          <Typography variant="h6" fontWeight="bold" color="primary">
            Admin Panel
          </Typography>
          <Chip
            label={battleStatus.toUpperCase()}
            color={
              battleStatus === "waiting"
                ? "warning"
                : battleStatus === "active"
                ? "success"
                : "default"
            }
            variant="filled"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            <People sx={{ verticalAlign: "middle", mr: 1 }} />
            {playerCount} player{playerCount !== 1 ? "s" : ""} joined
          </Typography>

          {battleStatus === "waiting" && (
            <Button
              variant="contained"
              color="success"
              startIcon={<PlayArrow />}
              onClick={onStartBattle}
              disabled={playerCount === 0}
              sx={{ ml: "auto" }}
            >
              Start Battle
            </Button>
          )}

          {battleStatus === "active" && (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={onCompleteBattle}
              sx={{ ml: "auto" }}
            >
              Complete Battle
            </Button>
          )}

          {battleStatus === "finished" && (
            <Box sx={{ ml: "auto" }}>
              <Chip
                label="Battle Completed"
                color="default"
                variant="outlined"
                icon={<Timer />}
              />
            </Box>
          )}
        </Stack>

        {battleStatus === "waiting" && playerCount === 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Waiting for players to join before starting the battle...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
