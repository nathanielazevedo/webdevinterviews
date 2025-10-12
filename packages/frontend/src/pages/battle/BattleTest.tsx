import React from "react";
import { Box, Typography, Paper, List, ListItem, Chip } from "@mui/material";
import { useBattle } from "../../hooks/useBattle";

/**
 * Simple test component to demonstrate the battle info fetching with question pool
 */
const BattleTest: React.FC = () => {
  const playerId = "test-player-456";

  // Use our consolidated useBattle hook (now automatically fetches next battle)
  const {
    playersList,
    battleId,
    battleInfo,
    battleStartTime,
    timeUntilStart,
    questionPool,
    isConnected,
    battleStatus,
    loading,
    error,
    getBattleInfo,
  } = useBattle(playerId);

  // Manual refresh for testing
  const handleRefresh = () => {
    console.log("🔄 Manually refreshing battle info...");
    getBattleInfo();
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Loading Battle Info...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fetching next battle information from server...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="error">
          Error Loading Battle
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "8px 16px", marginTop: 16 }}
        >
          Retry
        </button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Battle Info Test Page (Auto-Fetched)
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Status
        </Typography>
        <Chip
          label={isConnected ? "Connected" : "Disconnected"}
          color={isConnected ? "success" : "error"}
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Battle ID: {battleId || "Loading..."}
        </Typography>
        <Typography variant="body2">Player ID: {playerId}</Typography>
        <Typography variant="body2">
          Battle Status: {battleStatus || "Unknown"}
        </Typography>
        {battleInfo && (
          <Typography variant="body2" color="primary">
            ✅ Battle info automatically loaded from server
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Battle Timing
        </Typography>
        {battleStartTime ? (
          <Box>
            <Typography variant="body1">
              Scheduled Start: {new Date(battleStartTime).toLocaleString()}
            </Typography>
            {timeUntilStart !== null && timeUntilStart > 0 && (
              <Typography variant="body1" color="primary">
                Time Until Start: {Math.floor(timeUntilStart / 60)}:
                {(timeUntilStart % 60).toString().padStart(2, "0")}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No scheduled start time
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Question Pool ({questionPool.length} questions)
        </Typography>
        {questionPool.length > 0 ? (
          <List>
            {questionPool.map((question, index) => (
              <ListItem key={question.id} sx={{ py: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {index + 1}.
                  </Typography>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {question.title}
                  </Typography>
                  <Chip
                    label={question.difficulty}
                    color={
                      question.difficulty === "Easy"
                        ? "success"
                        : question.difficulty === "Medium"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                  {question.leetcode_number && (
                    <Typography variant="body2" color="text.secondary">
                      #{question.leetcode_number}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No questions loaded yet. Questions will be fetched automatically
            when connected.
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Players ({playersList.length})
        </Typography>
        {playersList.length > 0 ? (
          <List>
            {playersList.map((player) => (
              <ListItem key={player.userId} sx={{ py: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {player.userId}
                  </Typography>
                  <Chip
                    label={player.isConnected ? "Connected" : "Disconnected"}
                    color={player.isConnected ? "success" : "default"}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Tests: {player.testsPassed}/{player.totalTests}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No players connected
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: "flex", gap: 2 }}>
        <button onClick={handleRefresh} style={{ padding: "8px 16px" }}>
          Refresh Battle Info
        </button>
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          This page demonstrates the automatic battle info fetching with
          question pool. When you load this page, the useBattle hook
          automatically:
          <br />• Connects to WebSocket
          <br />• Joins the battle room
          <br />• Fetches battle info including 10 questions
          <br />• Displays real-time battle timing and player status
        </Typography>
      </Box>
    </Box>
  );
};

export default BattleTest;
