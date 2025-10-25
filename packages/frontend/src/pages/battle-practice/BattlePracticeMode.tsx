import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { ArrowBack, BugReport, Home } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import MonacoCodeEditor from "../../pages/battle/components/MonacoCodeEditor";
import TestRunner from "../../pages/battle/components/TestRunner";
import { useBattlePractice } from "../../hooks/battle";

interface TestResults {
  testCases: { passed: boolean }[];
}

const BattlePracticeMode: React.FC = () => {
  const theme = useTheme();
  const { questionId } = useParams<{ questionId: string }>();
  const { questions, loading } = useBattlePractice();

  const [code, setCode] = useState(`function solution() {
    // Write your solution here

}`);
  const [problemWidth, setProblemWidth] = useState(35); // Percentage for problem description panel
  const [editorHeight, setEditorHeight] = useState(60); // Percentage for editor panel

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingVertical = useRef(false);
  const isDraggingHorizontal = useRef(false);

  // Find the current question
  const currentQuestion = questions.find(
    (q) => q.id === parseInt(questionId || "0")
  );

  // Set initial code based on question
  useEffect(() => {
    if (currentQuestion?.function_signature) {
      setCode(`${currentQuestion.function_signature} {
    // Write your solution here

}`);
    }
  }, [currentQuestion]);

  // Handle vertical resizer (between problem and editor panels)
  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingVertical.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newProblemWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 25% and 50%
      const constrainedWidth = Math.min(50, Math.max(25, newProblemWidth));
      setProblemWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      isDraggingVertical.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  // Handle horizontal resizer (between editor and test panels)
  const handleHorizontalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHorizontal.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingHorizontal.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const editorPanelTop = containerRect.top;
      const editorPanelHeight = containerRect.height;
      const newEditorHeight =
        ((e.clientY - editorPanelTop) / editorPanelHeight) * 100;

      // Constrain between 40% and 80%
      const constrainedHeight = Math.min(Math.max(newEditorHeight, 40), 80);
      setEditorHeight(constrainedHeight);
    };

    const handleMouseUp = () => {
      isDraggingHorizontal.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleTest = useCallback((_results: TestResults) => {
    // Handle test results - could add analytics or progress tracking here
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Loading question...</Typography>
      </Box>
    );
  }

  if (!currentQuestion) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Typography variant="h6">Question not found</Typography>
        <Button component={Link} to="/battle-practice" variant="outlined">
          Back to Practice
        </Button>
      </Box>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return theme.palette.success.main;
      case "medium":
        return theme.palette.warning.main;
      case "hard":
        return theme.palette.error.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <IconButton component={Link} to="/battle-practice" sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>

          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink
              component={Link}
              to="/"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Home fontSize="small" />
              Home
            </MuiLink>
            <MuiLink component={Link} to="/battle-practice">
              Battle Practice
            </MuiLink>
            <Typography color="text.primary">
              {currentQuestion.title}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {currentQuestion.title}
          </Typography>
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: getDifficultyColor(currentQuestion.difficulty),
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {currentQuestion.difficulty}
          </Box>
          {currentQuestion.leetcode_number && (
            <Typography variant="body2" color="text.secondary">
              LeetCode #{currentQuestion.leetcode_number}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel - Problem Description */}
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
                Problem Description
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
              component="div"
              sx={{
                fontFamily: "inherit",
                fontSize: "1rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                color: theme.palette.text.primary,
                "& pre": {
                  backgroundColor: theme.palette.grey[100],
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: "0.875rem",
                  overflow: "auto",
                },
              }}
              dangerouslySetInnerHTML={{
                __html: currentQuestion.problem_statement
                  .replace(/\n/g, "<br/>")
                  .replace(/```(\w+)?\n?([\s\S]*?)```/g, "<pre>$2</pre>"),
              }}
            />

            {currentQuestion.examples && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Examples
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    backgroundColor: theme.palette.grey[100],
                    p: 2,
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {Array.isArray(currentQuestion.examples)
                    ? currentQuestion.examples.join("\n\n")
                    : currentQuestion.examples}
                </Typography>
              </Box>
            )}

            {currentQuestion.constraints && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Constraints
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    backgroundColor: theme.palette.grey[100],
                    p: 2,
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {currentQuestion.constraints}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Vertical Resizer */}
        <Box
          onMouseDown={handleVerticalMouseDown}
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
            width: `${100 - problemWidth - 0.4}%`, // Subtract space for resizer
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Panel - Code Editor */}
          <Paper
            elevation={0}
            sx={{
              height: `${editorHeight}%`,
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
            </Box>

            <Box sx={{ flex: 1, position: "relative" }}>
              <MonacoCodeEditor
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

          {/* Bottom Panel - Test Results */}
          <Paper
            elevation={0}
            sx={{
              height: `${100 - editorHeight}%`,
              display: "flex",
              flexDirection: "column",
              borderRadius: 0,
              overflow: "hidden",
            }}
          >
            <TestRunner
              code={code}
              problemId={questionId || "0"}
              onTestComplete={handleTest}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default BattlePracticeMode;
