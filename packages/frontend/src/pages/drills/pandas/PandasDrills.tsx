import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import CodeEditor from "../../../components/CodeEditor";
import pandasQuestions from "./questions.json";

interface Question {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  setupCode: string;
  starterCode: string;
  expectedOutput: string;
  testCode: string;
  hints: string[];
  broken?: boolean;
}

const BROKEN_QUESTIONS_KEY = "pandas-drills-broken-questions";
const PROGRESS_KEY = "pandas-drills-progress";

const PandasDrills: React.FC = () => {
  // Load saved question index from localStorage
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const progress = JSON.parse(saved);
        return progress.questionIndex || 0;
      }
    } catch {
      // ignore
    }
    return 0;
  });
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brokenQuestions, setBrokenQuestions] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(BROKEN_QUESTIONS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Merge broken questions from localStorage with JSON data
  const allQuestions = (pandasQuestions as Question[]).map((q) => ({
    ...q,
    broken: q.broken || brokenQuestions.has(q.id),
  }));
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  useEffect(() => {
    setUserCode(currentQuestion.starterCode);
    setFeedback({ type: null, message: "" });
    setShowHint(false);
    setCurrentHintIndex(0);
  }, [currentQuestionIndex, currentQuestion.starterCode]);

  // Save progress to localStorage whenever question changes
  useEffect(() => {
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ questionIndex: currentQuestionIndex })
      );
    } catch {
      // ignore localStorage errors
    }
  }, [currentQuestionIndex]);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback({ type: null, message: "" });

    try {
      const codeToExecute = currentQuestion.testCode.replace(
        "{user_code}",
        userCode
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/drills/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: "python",
            code: codeToExecute,
            expectedOutput: currentQuestion.expectedOutput,
          }),
        }
      );

      const result = await response.json();

      if (result.isCorrect) {
        setFeedback({ type: "success", message: "✅ Correct!" });
        setTimeout(() => {
          if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            setFeedback({
              type: "success",
              message: "🎉 You completed all Pandas drills!",
            });
          }
        }, 1500);
      } else {
        setFeedback({
          type: "error",
          message: result.error || "Incorrect. Try again!",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Error executing code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true);
      setCurrentHintIndex(0);
    } else if (currentHintIndex < currentQuestion.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          🐼 Pandas Drills
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Master Pandas data analysis with hands-on practice
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Progress: {currentQuestionIndex + 1} / {allQuestions.length}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">{currentQuestion.title}</Typography>
          {currentQuestion.broken && (
            <Chip
              label="⚠️ Broken"
              color="error"
              size="small"
              variant="outlined"
            />
          )}
          <Chip
            label={currentQuestion.difficulty}
            color={getDifficultyColor(currentQuestion.difficulty)}
            size="small"
          />
        </Stack>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {currentQuestion.description}
        </Typography>

        {currentQuestion.broken && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            This question is currently marked as broken. The expected output or
            test may not work correctly.
          </Alert>
        )}

        {currentQuestion.setupCode && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
            <Typography variant="subtitle2" gutterBottom>
              Given:
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {currentQuestion.setupCode}
            </Typography>
          </Paper>
        )}

        <Typography variant="subtitle2" gutterBottom>
          Your Code:
        </Typography>
        <CodeEditor
          value={userCode}
          onChange={setUserCode}
          onSubmit={handleSubmit}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Running..." : "Submit (Enter)"}
          </Button>
          <Button
            variant={currentQuestion.broken ? "contained" : "outlined"}
            color={currentQuestion.broken ? "error" : "warning"}
            onClick={toggleBrokenStatus}
          >
            {currentQuestion.broken ? "✓ Broken" : "Mark Broken"}
          </Button>
          <Button variant="outlined" onClick={handleShowHint}>
            {showHint
              ? currentHintIndex < currentQuestion.hints.length - 1
                ? "Next Hint"
                : "All Hints Shown"
              : "Show Hint"}
          </Button>
          {currentQuestionIndex > 0 && (
            <Button
              variant="text"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              Previous Question
            </Button>
          )}
        </Stack>

        {showHint && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 Hint {currentHintIndex + 1}:{" "}
              {currentQuestion.hints[currentHintIndex]}
            </Typography>
          </Alert>
        )}

        {feedback.type && (
          <Alert severity={feedback.type} sx={{ mt: 2 }}>
            {feedback.message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default PandasDrills;
