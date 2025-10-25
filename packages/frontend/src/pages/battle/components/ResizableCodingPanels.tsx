import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { BugReport } from "@mui/icons-material";
import type { Question, Player } from "@webdevinterviews/shared";
import MonacoCodeEditor from "./MonacoCodeEditor";
import TestRunner from "./TestRunner";

// Predefined avatar options (same as in BattleEntrySideNav)
const AVATAR_OPTIONS = [
  { id: "default", type: "initial", label: "Default (Initials)" },
  { id: "dev1", type: "emoji", emoji: "👨‍💻", label: "Developer" },
  { id: "dev2", type: "emoji", emoji: "👩‍💻", label: "Developer" },
  { id: "ninja", type: "emoji", emoji: "🥷", label: "Ninja" },
  { id: "robot", type: "emoji", emoji: "🤖", label: "Robot" },
  { id: "alien", type: "emoji", emoji: "👽", label: "Alien" },
  { id: "wizard", type: "emoji", emoji: "🧙‍♂️", label: "Wizard" },
  { id: "cat", type: "emoji", emoji: "🐱", label: "Cat" },
  { id: "dog", type: "emoji", emoji: "🐶", label: "Dog" },
  { id: "panda", type: "emoji", emoji: "🐼", label: "Panda" },
  { id: "lion", type: "emoji", emoji: "🦁", label: "Lion" },
  { id: "tiger", type: "emoji", emoji: "🐯", label: "Tiger" },
  { id: "fire", type: "emoji", emoji: "🔥", label: "Fire" },
  { id: "lightning", type: "emoji", emoji: "⚡", label: "Lightning" },
  { id: "star", type: "emoji", emoji: "⭐", label: "Star" },
  { id: "rocket", type: "emoji", emoji: "🚀", label: "Rocket" },
];

// Helper function to render avatar content
const renderAvatarContent = (player: Player) => {
  if (!player.username) return "?";

  const initials = player.username
    .split(" ")
    .map((name: string) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return initials || player.username.charAt(0).toUpperCase();
};

interface TestResult {
  passed: boolean;
  message: string;
  testCases: unknown[];
  totalExecutionTime: number;
}

interface ResizableCodingPanelsProps {
  problemTitle: string;
  problemId: string;
  question?: Question;
  onTest: (results: TestResult) => void;
  battleId?: string;
  playerId?: string;
  players?: Player[];
  currentUserId?: string;
}

const ResizableCodingPanels: React.FC<ResizableCodingPanelsProps> = ({
  problemTitle,
  problemId,
  question,
  onTest,
  battleId,
  playerId,
  players = [],
  currentUserId,
}) => {
  const theme = useTheme();
  const [code, setCode] = useState(
    question?.starter_code ||
      `function solution() {
    // Write your solution here
    
}`
  );

  const [userListWidth, setUserListWidth] = useState(20); // Percentage for left user list panel
  const [problemWidth, setProblemWidth] = useState(30); // Percentage for problem description panel
  const [rightTopHeight, setRightTopHeight] = useState(60); // Percentage for right top panel (editor)

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingVertical = useRef(false);
  const isDraggingHorizontal = useRef(false);

  // Generate problem description from question data
  const problemDescription = question
    ? `
${question.problem_statement || "No problem statement available."}

${
  question.examples && question.examples.length > 0
    ? question.examples
        .map(
          (example, index) =>
            `Example ${index + 1}:
${example.input ? `Input: ${example.input}` : ""}
${example.output ? `Output: ${example.output}` : ""}
${example.explanation ? `Explanation: ${example.explanation}` : ""}`
        )
        .join("\n\n")
    : ""
}

${
  question.constraints
    ? `Constraints:
${question.constraints}`
    : ""
}
  `.trim()
    : "Loading problem description...";

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
            {players.map((player: Player) => (
              <ListItem
                key={player.userId}
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: `1px solid ${theme.palette.divider}20`,
                  backgroundColor:
                    player.userId === currentUserId
                      ? `${theme.palette.primary.main}10`
                      : "transparent",
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  {(() => {
                    const avatarId = player.avatar || "default";
                    const avatar = AVATAR_OPTIONS.find(
                      (a) => a.id === avatarId
                    );

                    if (avatar && avatar.type === "emoji") {
                      return (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "grey.100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                          }}
                        >
                          {avatar.emoji}
                        </Box>
                      );
                    }

                    return (
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {renderAvatarContent(player)}
                      </Avatar>
                    );
                  })()}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {player.username}
                      {player.userId === currentUserId && " (You)"}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5, width: "100%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={
                          question?.test_cases?.length > 0
                            ? (player.testsPassed /
                                question?.test_cases?.length) *
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
                              player.testsPassed === player.totalTests &&
                              player.totalTests > 0
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
                        {player.testsPassed}/{question?.test_cases.length} tests
                        passed
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
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          onCopy={(e: React.ClipboardEvent) => e.preventDefault()}
          onCut={(e: React.ClipboardEvent) => e.preventDefault()}
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
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              WebkitTouchCallout: "none",
              WebkitTapHighlightColor: "transparent",
              pointerEvents: "none",
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
            <Box display="flex" gap={1}></Box>
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
            testCases={question?.test_cases}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ResizableCodingPanels;
