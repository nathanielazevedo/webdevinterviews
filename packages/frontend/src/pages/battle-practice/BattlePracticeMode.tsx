import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import { ArrowBack, BugReport, Timer, EmojiEvents } from "@mui/icons-material";
import { Link, useParams, useSearchParams } from "react-router-dom";
import MonacoCodeEditor from "../../pages/battle/components/MonacoCodeEditor";
import TestRunner from "../../pages/battle/components/TestRunner";
import { useBattlePractice } from "../../hooks/battle";
import { DrillProgressBar } from "../../components/DrillProgressBar";
import { api, type UserPerformanceData } from "../../api/client";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface TestResults {
  testCases: { passed: boolean }[];
}

const BattlePracticeMode: React.FC = () => {
  const theme = useTheme();
  const { questionId } = useParams<{ questionId: string }>();
  const [searchParams] = useSearchParams();
  const { questions, nextBattleQuestions, loading } = useBattlePractice();

  // Check if we're in drill mode
  const isDrillMode = searchParams.get("mode") === "drill";

  // User authentication state
  const [userId, setUserId] = useState<string | null>(null);

  // Get drill progress from localStorage
  const [drillProgress, setDrillProgress] = useState<
    Record<string, "completed" | "failed" | "pending">
  >({});

  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // User performance state
  const [userPerformance, setUserPerformance] =
    useState<UserPerformanceData | null>(null);
  const [isLoadingPerformance, setIsLoadingPerformance] =
    useState<boolean>(false);

  // Find the current question
  const currentQuestion = questions.find(
    (q) => q.id === parseInt(questionId || "0")
  );

  // Get drill progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("battleDrillProgress");
    if (savedProgress) {
      setDrillProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Get user authentication state
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user performance data when user and question are available
  useEffect(() => {
    const loadPerformanceData = async () => {
      if (!userId || !currentQuestion) return;

      setIsLoadingPerformance(true);
      try {
        const response = await api.getUserQuestionPerformance(
          userId,
          currentQuestion.id
        );
        if (response.success && response.data) {
          setUserPerformance(response.data);
        } else {
          setUserPerformance(null);
        }
      } catch (error) {
        // Silently handle error
        setUserPerformance(null);
      } finally {
        setIsLoadingPerformance(false);
      }
    };

    loadPerformanceData();
  }, [userId, currentQuestion?.id]);

  // Load drill progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("battleDrillProgress");
    if (savedProgress) {
      setDrillProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Get user authentication state
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user performance data when user and question are available
  useEffect(() => {
    const loadPerformanceData = async () => {
      if (!userId || !currentQuestion) return;

      setIsLoadingPerformance(true);
      try {
        const response = await api.getUserQuestionPerformance(
          userId,
          currentQuestion.id
        );
        if (response.success && response.data) {
          setUserPerformance(response.data);
        } else {
          setUserPerformance(null);
        }
      } catch (error) {
        // Silently handle error
        setUserPerformance(null);
      } finally {
        setIsLoadingPerformance(false);
      }
    };

    loadPerformanceData();
  }, [userId, currentQuestion?.id]);

  const [code, setCode] = useState(`function solution() {
    // Write your solution here

}`);
  const [problemWidth, setProblemWidth] = useState(35); // Percentage for problem description panel
  const [editorHeight, setEditorHeight] = useState(60); // Percentage for editor panel

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingVertical = useRef(false);
  const isDraggingHorizontal = useRef(false);

  // Load saved code from localStorage or set initial code based on question
  useEffect(() => {
    if (currentQuestion) {
      const savedCodeKey = `battlePractice_code_${currentQuestion.id}`;
      const savedCode = localStorage.getItem(savedCodeKey);

      if (savedCode) {
        // Load previously saved code
        setCode(savedCode);
      } else if (currentQuestion.function_signature) {
        // Use function signature as default
        setCode(`${currentQuestion.function_signature}`);
      }
    }
  }, [currentQuestion]);

  // Timer logic
  useEffect(() => {
    if (isTimerActive && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100); // Update every 100ms for smooth display

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isTimerActive, startTime]);

  // Start timer when user first interacts with code
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);

      if (currentQuestion) {
        const savedCodeKey = `battlePractice_code_${currentQuestion.id}`;
        localStorage.setItem(savedCodeKey, newCode);

        // Start timer on first code change if not already started
        if (!isTimerActive && !startTime) {
          const now = Date.now();
          setStartTime(now);
          setIsTimerActive(true);
          setElapsedTime(0);
        }
      }
    },
    [currentQuestion, isTimerActive, startTime]
  );

  // Reset timer when switching questions
  useEffect(() => {
    setStartTime(null);
    setElapsedTime(0);
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [questionId]);

  // Format time display
  const formatTime = useCallback((timeMs: number) => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeMs % 1000) / 10);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}s`;
  }, []);

  // Handle test completion
  const handleTestComplete = useCallback(
    async (results: TestResults) => {
      if (!userId || !currentQuestion) return;

      const allTestsPassed = results.testCases.every((test) => test.passed);
      const completionTime =
        isTimerActive && startTime ? Date.now() - startTime : undefined;

      try {
        // Record the attempt in the database
        const response = await api.recordQuestionAttempt({
          questionId: currentQuestion.id,
          userId,
          completionTimeMs: allTestsPassed ? completionTime : undefined,
          isSuccessful: allTestsPassed,
        });

        if (response.success && response.data) {
          setUserPerformance(response.data);

          // Stop timer if all tests passed
          if (allTestsPassed && isTimerActive) {
            setIsTimerActive(false);
          }
        }
      } catch (error) {
        // Silently handle error - don't interrupt user experience
        // Error logging would go here in production
      }
    },
    [userId, currentQuestion, isTimerActive, startTime]
  );

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

  const handleTest = useCallback(
    (results: TestResults) => {
      // Handle test results - could add analytics or progress tracking here
      handleTestComplete(results);
    },
    [handleTestComplete]
  );

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
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ p: 1.5 }}>
          {/* Top row with leave button and drill progress */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <IconButton
              component={Link}
              to="/battle-practice"
              size="small"
              sx={{
                bgcolor: "action.hover",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <ArrowBack />
            </IconButton>

            {/* Drill Progress Bar (when in drill mode) */}
            {isDrillMode &&
              nextBattleQuestions &&
              nextBattleQuestions.length > 0 && (
                <DrillProgressBar
                  nextBattleQuestions={nextBattleQuestions}
                  drillProgress={drillProgress}
                  currentQuestionId={questionId}
                  dotsOnly={true}
                />
              )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h6" fontWeight="bold">
                {currentQuestion.title}
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: getDifficultyColor(
                    currentQuestion.difficulty
                  ),
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {currentQuestion.difficulty}
              </Box>
              {currentQuestion.leetcode_number && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.875rem" }}
                >
                  #{currentQuestion.leetcode_number}
                </Typography>
              )}
            </Box>

            {/* Timer Display */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isTimerActive && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Timer sx={{ fontSize: "1rem", color: "primary.main" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    {formatTime(elapsedTime)}
                  </Typography>
                </Box>
              )}

              {userPerformance && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {userPerformance.fastestCompletionMs && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <EmojiEvents sx={{ fontSize: "1rem", color: "gold" }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: "text.secondary",
                        }}
                      >
                        Best: {formatTime(userPerformance.fastestCompletionMs)}
                      </Typography>
                    </Box>
                  )}

                  {userPerformance.totalAttempts > 0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                      }}
                    >
                      ({userPerformance.successfulAttempts}/
                      {userPerformance.totalAttempts} solved)
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
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
              {currentQuestion.problem_statement}
              {currentQuestion.examples && (
                <>
                  {"\n\n"}
                  Examples:
                  {"\n"}
                  {Array.isArray(currentQuestion.examples)
                    ? currentQuestion.examples
                        .map(
                          (example, index) =>
                            `Example ${index + 1}:\nInput: ${
                              example.input
                            }\nOutput: ${example.output}\nExplanation: ${
                              example.explanation
                            }`
                        )
                        .join("\n\n")
                    : currentQuestion.examples}
                </>
              )}
              {currentQuestion.constraints && (
                <>
                  {"\n\n"}
                  Constraints:
                  {"\n"}
                  {currentQuestion.constraints}
                </>
              )}
            </Typography>
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
                key={`editor-${problemWidth}-${editorHeight}`}
                value={code}
                onChange={handleCodeChange}
                language="javascript"
                placeholder=""
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
              testCases={currentQuestion?.test_cases}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default BattlePracticeMode;
