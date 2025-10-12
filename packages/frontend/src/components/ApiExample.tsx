import React, { useEffect, useState } from "react";
import type { components } from "@webdevinterviews/shared";
import {
  wsClient,
  RoomsService,
  type Player,
  type BattleStatusResponse,
} from "@webdevinterviews/shared";

type PlayersListResponse = components["schemas"]["PlayersListResponse"];
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

export const ApiExample: React.FC = () => {
  const [health, setHealth] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [battleStatus, setBattleStatus] = useState<BattleStatusResponse | null>(
    null
  );
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Test REST API
    const testApi = async () => {
      try {
        // Test health check
        await RoomsService.getBattle("battle_1");
        setHealth("API is working!");

        // Test getting players
        const playersResponse = await RoomsService.getPlayers("battle_1");
        setPlayers(playersResponse.players);

        // Test battle status
        const battleResponse = await RoomsService.getBattle("battle_1");
        setBattleStatus(battleResponse);
      } catch (error) {
        console.error("API Error:", error);
        setHealth("API Error: " + (error as Error).message);
      }
    };

    testApi();
  }, []);

  useEffect(() => {
    // Test WebSocket
    wsClient.on("connected", () => {
      setWsConnected(true);
      console.log("WebSocket connected!");
    });

    wsClient.on("disconnected", () => {
      setWsConnected(false);
      console.log("WebSocket disconnected!");
    });

    wsClient.on("players-list", (data: PlayersListResponse) => {
      console.log("Received players update:", data);
      setPlayers(data.players);
    });

    wsClient.connect();

    return () => {
      wsClient.disconnect();
    };
  }, []);

  const joinRoom = () => {
    wsClient.send({
      type: "join-room",
      roomId: "battle_1",
      userId: "test-user-123",
    });
  };

  const getPlayers = () => {
    wsClient.send({
      type: "get-players",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Client Test
      </Typography>

      <Typography variant="h6">REST API Status:</Typography>
      <Typography color={health.includes("Error") ? "error" : "success"}>
        {health || "Loading..."}
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        WebSocket Status:
      </Typography>
      <Typography color={wsConnected ? "success" : "error"}>
        {wsConnected ? "Connected" : "Disconnected"}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={joinRoom} sx={{ mr: 1 }}>
          Join Room
        </Button>
        <Button variant="outlined" onClick={getPlayers}>
          Get Players
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Players ({players.length}):
      </Typography>
      <List>
        {players.map((player, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={player.userId}
              secondary={`Tests: ${player.testsPassed}/${player.totalTests} - Connected: ${player.isConnected}`}
            />
          </ListItem>
        ))}
      </List>

      {battleStatus && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Battle Status:
          </Typography>
          <Typography>Status: {battleStatus.status}</Typography>
          <Typography>
            Can Join: {battleStatus.canJoin ? "Yes" : "No"}
          </Typography>
          {battleStatus.battle && (
            <Typography>Battle ID: {battleStatus.battle.id}</Typography>
          )}
        </>
      )}
    </Box>
  );
};
