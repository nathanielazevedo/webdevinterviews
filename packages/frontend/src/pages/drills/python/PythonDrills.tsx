import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  LinearProgress,
  Chip,
  Collapse,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  PlayArrow,
  NavigateNext,
  NavigateBefore,
  Lightbulb,
} from "@mui/icons-material";
import CodeEditor from "../../../components/CodeEditor";
import { api } from "../../../api/client";
import DrillSideNav from "./DrillSideNav";
import topicsData from "./topics.json";
import listsQuestions from "./questions/lists.json";
import tuplesQuestions from "./questions/tuples.json";
import stringsQuestions from "./questions/strings.json";
import dictionariesQuestions from "./questions/dictionaries.json";
import setsQuestions from "./questions/sets.json";
import conditionalsQuestions from "./questions/conditionals.json";
import loopsQuestions from "./questions/loops.json";
import comprehensionsQuestions from "./questions/comprehensions.json";
import functionsQuestions from "./questions/functions.json";
import classesQuestions from "./questions/classes.json";
import exceptionsQuestions from "./questions/exceptions.json";
import filesQuestions from "./questions/files.json";
import modulesQuestions from "./questions/modules.json";
import contextsQuestions from "./questions/contexts.json";
import conversionsQuestions from "./questions/conversions.json";
import mathQuestions from "./questions/math.json";
import datesQuestions from "./questions/dates.json";
import regexQuestions from "./questions/regex.json";
import osQuestions from "./questions/os.json";
import pathlibQuestions from "./questions/pathlib.json";
import ioQuestions from "./questions/io.json";
import zipQuestions from "./questions/zip.json";
import asyncQuestions from "./questions/async.json";
import futuresQuestions from "./questions/futures.json";

interface Question {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  setupCode: string;
  starterCode: string;
  expectedOutput: string;
  testCode: string;
  hints: string[];
  broken?: boolean;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

// Map topic IDs to their questions
const topicQuestions: Record<string, Question[]> = {
  lists: listsQuestions,
  tuples: tuplesQuestions,
  strings: stringsQuestions,
  dictionaries: dictionariesQuestions,
  sets: setsQuestions,
  conditionals: conditionalsQuestions,
  loops: loopsQuestions,
  comprehensions: comprehensionsQuestions,
  functions: functionsQuestions,
  classes: classesQuestions,
  exceptions: exceptionsQuestions,
  files: filesQuestions,
  modules: modulesQuestions,
  contexts: contextsQuestions,
  conversions: conversionsQuestions,
  math: mathQuestions,
  dates: datesQuestions,
  regex: regexQuestions,
  os: osQuestions,
  pathlib: pathlibQuestions,
  io: ioQuestions,
  zip: zipQuestions,
  async: asyncQuestions,
  futures: futuresQuestions,
};

const BROKEN_QUESTIONS_KEY = "python-drills-broken-questions";
const PROGRESS_KEY = "python-drills-progress";

const PythonDrills = () => {
  const topics: Topic[] = topicsData;

  // Load saved progress from localStorage
  const [currentTopicId, setCurrentTopicId] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const progress = JSON.parse(saved);
        return progress.topicId || topics[0].id;
      }
    } catch {
      // ignore
    }
    return topics[0].id;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const progress = JSON.parse(saved);
        // Return saved index for current topic, or 0
        return progress.questionIndexes?.[currentTopicId] || 0;
      }
    } catch {
      // ignore
    }
    return 0;
  });
  const [userCode, setUserCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    output?: string;
    error?: string;
    isCorrect?: boolean;
    expectedOutput?: string;
  } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [completedQuestionsInTopic, setCompletedQuestionsInTopic] = useState<
    Set<number>
  >(new Set());
  const [brokenQuestions, setBrokenQuestions] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(BROKEN_QUESTIONS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Merge broken questions from localStorage with JSON data
  const currentQuestions = (topicQuestions[currentTopicId] || []).map((q) => ({
    ...q,
    broken: q.broken || brokenQuestions.has(q.id),
  }));
  const currentQuestion: Question = currentQuestions[currentQuestionIndex];
  const currentTopic = topics.find((t) => t.id === currentTopicId)!;

  // Calculate broken question counts per topic
  const brokenQuestionCounts: Record<string, number> = {};
  Object.entries(topicQuestions).forEach(([topicId, questions]) => {
    const count = questions.filter(
      (q) => q.broken || brokenQuestions.has(q.id)
    ).length;
    if (count > 0) {
      brokenQuestionCounts[topicId] = count;
    }
  });

  // Reset code when question changes
  useEffect(() => {
    setUserCode(currentQuestion.starterCode);
    setResult(null);
    setShowHints(false);
  }, [currentQuestionIndex, currentQuestion.starterCode]);

  // Save progress to localStorage whenever topic or question changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      const progress = saved ? JSON.parse(saved) : { questionIndexes: {} };

      progress.topicId = currentTopicId;
      progress.questionIndexes = progress.questionIndexes || {};
      progress.questionIndexes[currentTopicId] = currentQuestionIndex;

      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore localStorage errors
    }
  }, [currentTopicId, currentQuestionIndex]);

  // Handler for changing topics
  const handleTopicChange = (topicId: string) => {
    setCurrentTopicId(topicId);

    // Load saved question index for this topic
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const progress = JSON.parse(saved);
        const savedIndex = progress.questionIndexes?.[topicId] || 0;
        setCurrentQuestionIndex(savedIndex);
      } else {
        setCurrentQuestionIndex(0);
      }
    } catch {
      setCurrentQuestionIndex(0);
    }

    setCompletedQuestionsInTopic(new Set());
  };

  // Auto-advance to next question or topic after correct answer
  useEffect(() => {
    if (result?.success && result?.isCorrect) {
      // Mark current question as completed
      setCompletedQuestionsInTopic((prev) =>
        new Set(prev).add(currentQuestionIndex)
      );

      const timer = setTimeout(() => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
          // Move to next question in current topic
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          // Current topic is complete, mark it and move to next topic
          setCompletedTopics((prev) => {
            const newCompleted = [...prev, currentTopicId];
            return newCompleted;
          });

          // Find next topic
          const currentTopicIndex = topics.findIndex(
            (t) => t.id === currentTopicId
          );
          if (currentTopicIndex < topics.length - 1) {
            const nextTopic = topics[currentTopicIndex + 1];
            setCurrentTopicId(nextTopic.id);
            setCurrentQuestionIndex(0);
            setCompletedQuestionsInTopic(new Set());
          }
        }
      }, 1500); // Wait 1.5 seconds before advancing

      return () => clearTimeout(timer);
    }
  }, [
    result,
    currentQuestionIndex,
    currentQuestions.length,
    currentTopicId,
    topics,
  ]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      // Replace {user_code} placeholder with actual user code
      const fullCode = currentQuestion.testCode.replace(
        "{user_code}",
        userCode
      );

      const response = await api.executeCode(
        "python",
        fullCode,
        currentQuestion.expectedOutput
      );

      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to run code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const toggleBrokenStatus = () => {
    const newBrokenQuestions = new Set(brokenQuestions);
    if (brokenQuestions.has(currentQuestion.id)) {
      newBrokenQuestions.delete(currentQuestion.id);
    } else {
      newBrokenQuestions.add(currentQuestion.id);
    }
    setBrokenQuestions(newBrokenQuestions);
    localStorage.setItem(
      BROKEN_QUESTIONS_KEY,
      JSON.stringify(Array.from(newBrokenQuestions))
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ py: 1, bgcolor: "background.default" }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            borderBottom: 1,
            borderColor: "divider",
            pb: 1,
          }}
        >
          <Typography variant="h6">Python Drills</Typography>
        </Box>

        {/* Main Layout with Side Nav */}
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Side Navigation */}
          <DrillSideNav
            topics={topics}
            currentTopicId={currentTopicId}
            completedTopics={completedTopics}
            onTopicSelect={handleTopicChange}
            brokenQuestionCounts={brokenQuestionCounts}
          />

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Progress */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Question {currentQuestionIndex + 1} of{" "}
                  {currentQuestions.length}
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {Math.round(
                    ((currentQuestionIndex + 1) / currentQuestions.length) * 100
                  )}
                  % Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  ((currentQuestionIndex + 1) / currentQuestions.length) * 100
                }
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Paper>

            {/* Question Card */}
            <Paper sx={{ p: 4, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="h5" fontWeight="600">
                      {currentQuestion.title}
                    </Typography>
                    {currentQuestion.broken && (
                      <Chip
                        label="⚠️ Broken"
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {currentQuestion.description}
                  </Typography>
                  {currentQuestion.broken && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      This question is currently marked as broken. The expected
                      output or test may not work correctly.
                    </Alert>
                  )}
                </Box>
                <Chip
                  label={currentQuestion.difficulty}
                  color={getDifficultyColor(currentQuestion.difficulty)}
                  size="small"
                />
              </Box>

              {/* Setup Code Display - Only show if setupCode exists */}
              {currentQuestion.setupCode && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: "#1e1e1e",
                    borderLeft: "4px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mb: 1, color: "#888" }}
                  >
                    Given:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily:
                        "'Fira Code', 'Monaco', 'Courier New', monospace",
                      whiteSpace: "pre",
                      color: "#d4d4d4",
                    }}
                  >
                    {currentQuestion.setupCode}
                  </Typography>
                </Paper>
              )}

              {/* Code Editor */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="600"
                  sx={{ mb: 1.5 }}
                >
                  Your Solution:
                </Typography>
                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  onSubmit={() => {
                    if (!isRunning && userCode.trim()) {
                      handleRunCode();
                    }
                  }}
                  language="python"
                  minHeight="150px"
                />
              </Box>

              {/* Hints Section */}
              <Box sx={{ mb: 3 }}>
                <Button
                  startIcon={<Lightbulb />}
                  onClick={() => setShowHints(!showHints)}
                  size="small"
                  sx={{ mb: 1 }}
                >
                  {showHints ? "Hide" : "Show"} Hints
                </Button>
                <Collapse in={showHints}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "info.lighter",
                      border: "1px solid",
                      borderColor: "info.light",
                    }}
                  >
                    {currentQuestion.hints.map((hint, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: index < currentQuestion.hints.length - 1 ? 1 : 0,
                        }}
                      >
                        💡 {hint}
                      </Typography>
                    ))}
                  </Paper>
                </Collapse>
              </Box>

              {/* Run Button */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={handleRunCode}
                    disabled={isRunning || !userCode.trim()}
                    sx={{ flex: 1 }}
                  >
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                  <Button
                    variant={currentQuestion.broken ? "contained" : "outlined"}
                    size="large"
                    color={currentQuestion.broken ? "error" : "warning"}
                    onClick={toggleBrokenStatus}
                  >
                    {currentQuestion.broken ? "✓ Broken" : "Mark Broken"}
                  </Button>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center", mt: 0.5 }}
                >
                  Press Enter to run • Shift + Enter for new line
                </Typography>
              </Box>

              {/* Result Display */}
              {result && (
                <Box sx={{ mt: 2 }}>
                  {result.success && result.isCorrect && (
                    <Alert
                      severity="success"
                      icon={<CheckCircle />}
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="subtitle2" fontWeight="600">
                        Correct! 🎉
                      </Typography>
                      <Typography variant="body2">
                        Output: {result.output}
                      </Typography>
                    </Alert>
                  )}

                  {result.success && !result.isCorrect && (
                    <Alert severity="warning" icon={<Cancel />} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        Not quite right
                      </Typography>
                      <Typography variant="body2">
                        Expected: {result.expectedOutput}
                      </Typography>
                      <Typography variant="body2">
                        Got: {result.output}
                      </Typography>
                    </Alert>
                  )}

                  {!result.success && (
                    <Alert severity="error" icon={<Cancel />} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        Error
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily:
                            "'Fira Code', 'Monaco', 'Courier New', monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {result.error}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>

            {/* Navigation */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                startIcon={<NavigateBefore />}
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outlined"
              >
                Previous
              </Button>

              <Typography variant="body2" color="text.secondary">
                {currentQuestionIndex + 1} / {currentQuestions.length}
              </Typography>

              <Button
                endIcon={<NavigateNext />}
                onClick={handleNext}
                disabled={currentQuestionIndex === currentQuestions.length - 1}
                variant="outlined"
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PythonDrills;
