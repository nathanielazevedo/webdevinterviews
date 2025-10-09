import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Send, BugReport, Person } from "@mui/icons-material";
import MonacoCodeEditor from "./MonacoCodeEditor";
import TestRunner from "./TestRunner";

interface TestResults {
  testCases: { passed: boolean }[];
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  status: "ready" | "coding" | "submitted" | "disconnected";
  testProgress?: {
    passed: number;
    total: number;
    completedAt?: number;
  };
}

interface ResizableCodingPanelsProps {
  problemTitle: string;
  problemId: string;
  onSubmit: (code: string) => void;
  onTest: (results: TestResults) => void;
  battleId?: string;
  playerId?: string;
  players?: Player[];
  currentUserId?: string;
}

const ResizableCodingPanels: React.FC<ResizableCodingPanelsProps> = ({
  problemTitle,
  problemId,
  onSubmit,
  onTest,
  battleId,
  playerId,
  players = [],
  currentUserId,
}) => {
  const theme = useTheme();
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
  const [userListWidth, setUserListWidth] = useState(20); // Percentage for left user list panel
  const [problemWidth, setProblemWidth] = useState(30); // Percentage for problem description panel
  const [rightTopHeight, setRightTopHeight] = useState(60); // Percentage for right top panel (editor)

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingVertical = useRef(false);
  const isDraggingHorizontal = useRef(false);

  const problemDescription = `
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.
  `;

  const handleSubmitSolution = () => {
    onSubmit(code);
  };

  // Handle first vertical resizer (between user list and problem panels)
  const handleFirstVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingVertical.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newUserListWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 15% and 40%
      const constrainedWidth = Math.min(40, Math.max(15, newUserListWidth));
      setUserListWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      isDraggingVertical.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  // Handle second vertical resizer (between problem and editor panels)
  const handleSecondVerticalMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingVertical.current = true;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingVertical.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newProblemWidth =
          ((e.clientX -
            containerRect.left -
            (userListWidth * containerRect.width) / 100 -
            4) /
            containerRect.width) *
          100;

        // Constrain between 20% and 50%
        const constrainedWidth = Math.min(50, Math.max(20, newProblemWidth));
        setProblemWidth(constrainedWidth);
      };

      const handleMouseUp = () => {
        isDraggingVertical.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [userListWidth]
  );

  // Handle horizontal resizer (between right top and bottom panels)
  const handleHorizontalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHorizontal.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingHorizontal.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const rightPanelTop = containerRect.top;
      const rightPanelHeight = containerRect.height;
      const newTopHeight =
        ((e.clientY - rightPanelTop) / rightPanelHeight) * 100;

      // Constrain between 30% and 80%
      const constrainedHeight = Math.min(Math.max(newTopHeight, 30), 80);
      setRightTopHeight(constrainedHeight);
    };

    const handleMouseUp = () => {
      isDraggingHorizontal.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100vh",
        display: "flex",
        border: "none",
        borderRadius: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left Panel - User List */}
      <Paper
        elevation={0}
        sx={{
          width: `${userListWidth}%`,
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Players ({players.length})
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <List sx={{ py: 0 }}>
            {players.map((player) => (
              <ListItem
                key={player.id}
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: `1px solid ${theme.palette.divider}20`,
                  backgroundColor:
                    player.id === currentUserId
                      ? `${theme.palette.primary.main}10`
                      : "transparent",
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar src={player.avatar} sx={{ width: 32, height: 32 }}>
                    <Person fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {player.name}
                      {player.id === currentUserId && " (You)"}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5, width: "100%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={
                          player.testProgress && player.testProgress.total > 0
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
                              player.testProgress &&
                              player.testProgress.passed ===
                                player.testProgress.total &&
                              player.testProgress.total > 0
                                ? theme.palette.success.main
                                : theme.palette.primary.main,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {player.testProgress?.passed || 0}/
                        {player.testProgress?.total || 0} tests
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* First Vertical Resizer */}
      <Box
        onMouseDown={handleFirstVerticalMouseDown}
        sx={{
          width: "4px",
          cursor: "col-resize",
          backgroundColor: theme.palette.divider,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
          },
          transition: "background-color 0.2s",
        }}
      />

      {/* Middle Panel - Problem Description */}
      <Paper
        elevation={0}
        sx={{
          width: `${problemWidth}%`,
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <BugReport color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {problemTitle}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: "auto",
          }}
        >
          <Typography
            variant="body1"
            component="pre"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              color: theme.palette.text.primary,
            }}
          >
            {problemDescription}
          </Typography>
        </Box>
      </Paper>

      {/* Second Vertical Resizer */}
      <Box
        onMouseDown={handleSecondVerticalMouseDown}
        sx={{
          width: "4px",
          cursor: "col-resize",
          backgroundColor: theme.palette.divider,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
          },
          transition: "background-color 0.2s",
        }}
      />

      {/* Right Panel Container */}
      <Box
        sx={{
          width: `${100 - userListWidth - problemWidth - 0.8}%`, // Subtract space for resizers
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Right Top Panel - Code Editor */}
        <Paper
          elevation={0}
          sx={{
            height: `${rightTopHeight}%`,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              JavaScript Solution
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Send />}
                onClick={handleSubmitSolution}
                color="success"
              >
                Submit
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: 2, position: "relative" }}>
            <MonacoCodeEditor
              key={`editor-${userListWidth}-${problemWidth}-${rightTopHeight}`}
              value={code}
              onChange={setCode}
              language="javascript"
              placeholder="Write your solution here..."
            />
          </Box>
        </Paper>

        {/* Horizontal Resizer */}
        <Box
          onMouseDown={handleHorizontalMouseDown}
          sx={{
            height: "4px",
            cursor: "row-resize",
            backgroundColor: theme.palette.divider,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
            transition: "background-color 0.2s",
          }}
        />

        {/* Right Bottom Panel - Test Results */}
        <Paper
          elevation={0}
          sx={{
            height: `${100 - rightTopHeight}%`,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          <TestRunner
            code={code}
            problemId={problemId}
            onTestComplete={onTest}
            battleId={battleId}
            playerId={playerId}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ResizableCodingPanels;
