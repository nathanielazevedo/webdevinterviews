import React from "react";
import { ApiProvider } from "../contexts/ApiContext";
import { useApi, useWebSocket } from "../hooks/useApi";
import { Box, Typography, Chip, Alert, Button, Paper } from "@mui/material";

// Example component showing how to use the API context
const ApiStatusDisplay: React.FC = () => {
  const { config, state, clearErrors } = useApi();
  const { connected, connectWs, disconnectWs } = useWebSocket();

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        API Status Dashboard
      </Typography>

      {/* Configuration Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Configuration:
        </Typography>
        <Typography variant="body2">
          Environment: <Chip label={config.environment} size="small" />
        </Typography>
        <Typography variant="body2">Base URL: {config.baseUrl}</Typography>
        <Typography variant="body2">WebSocket URL: {config.wsUrl}</Typography>
      </Box>

      {/* Connection Status */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Connection Status:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Chip
            label={`Online: ${state.isOnline ? "Yes" : "No"}`}
            color={state.isOnline ? "success" : "error"}
            size="small"
          />
          <Chip
            label={`WebSocket: ${connected ? "Connected" : "Disconnected"}`}
            color={connected ? "success" : "error"}
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={connectWs}
            disabled={connected}
          >
            Connect WS
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={disconnectWs}
            disabled={!connected}
          >
            Disconnect WS
          </Button>
        </Box>
      </Box>

      {/* Last Sync */}
      {state.lastSync && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Last API Sync: {state.lastSync.toLocaleTimeString()}
        </Typography>
      )}

      {/* Errors */}
      {state.errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            API Errors:
          </Typography>
          {state.errors.map((error, index) => (
            <Alert
              key={index}
              severity="error"
              onClose={clearErrors}
              sx={{ mb: 1 }}
            >
              {error}
            </Alert>
          ))}
        </Box>
      )}

      {/* Loading States */}
      {Object.keys(state.loading).length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Loading States:
          </Typography>
          {Object.entries(state.loading).map(([key, loading]) => (
            <Chip
              key={key}
              label={`${key}: ${loading ? "Loading..." : "Complete"}`}
              color={loading ? "warning" : "success"}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

// Example battle component using the API context
const BattleApiExample: React.FC = () => {
  const { getRoomBattle, getRoomPlayers, isLoading } = useApi();
  const { joinRoom, sendTestResults } = useWebSocket();

  const handleGetBattle = async () => {
    try {
      const battle = await getRoomBattle("battle_1");
      console.log("Battle data:", battle);
    } catch (error) {
      console.error("Failed to get battle:", error);
    }
  };

  const handleGetPlayers = async () => {
    try {
      const players = await getRoomPlayers("battle_1");
      console.log("Players data:", players);
    } catch (error) {
      console.error("Failed to get players:", error);
    }
  };

  const handleJoinRoom = () => {
    joinRoom("battle_1", "user-123");
  };

  const handleSendResults = () => {
    sendTestResults(3, 5); // 3 out of 5 tests passed
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Battle API Operations
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={handleGetBattle}
          disabled={isLoading("room-battle-battle_1")}
        >
          {isLoading("room-battle-battle_1") ? "Loading..." : "Get Battle"}
        </Button>

        <Button
          variant="contained"
          onClick={handleGetPlayers}
          disabled={isLoading("room-players-battle_1")}
        >
          {isLoading("room-players-battle_1") ? "Loading..." : "Get Players"}
        </Button>

        <Button variant="outlined" onClick={handleJoinRoom}>
          Join Room
        </Button>

        <Button variant="outlined" onClick={handleSendResults}>
          Send Test Results
        </Button>
      </Box>
    </Paper>
  );
};

// Main wrapper component
export const ApiContextExample: React.FC = () => {
  return (
    <ApiProvider
      initialConfig={{
        // Override defaults if needed
        timeout: 60000,
        retryAttempts: 5,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ p: 2 }}>
          Centralized API Context Example
        </Typography>

        <ApiStatusDisplay />
        <BattleApiExample />

        <Paper sx={{ p: 3, m: 2 }}>
          <Typography variant="h6" gutterBottom>
            Usage in Your Components:
          </Typography>
          <Typography
            variant="body2"
            component="pre"
            sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
          >
            {`// In any component:
import { useApi, useWebSocket } from '../hooks/useApi';

const MyComponent = () => {
  const { getRoomBattle, state } = useApi();
  const { joinRoom, connected } = useWebSocket();
  
  // Use API methods with automatic loading states
  // and error handling
};`}
          </Typography>
        </Paper>
      </Box>
    </ApiProvider>
  );
};
