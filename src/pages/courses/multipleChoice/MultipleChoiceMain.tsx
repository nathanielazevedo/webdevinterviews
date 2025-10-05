import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";

// Define types for the question and quiz data
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: Question[];
}

interface Answer {
  questionIndex: number;
  isCorrect: boolean;
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // Handle user's selection
  const handleOptionClick = (selectedOption: string): void => {
    if (showFeedback) return; // Prevent multiple selections

    setSelectedOption(selectedOption);
    setShowFeedback(true);

    const isCorrect =
      selectedOption === questions[currentQuestionIndex].correctAnswer;

    if (isCorrect) {
      // Record the correct answer
      setAnswers((prev) => [
        ...prev,
        { questionIndex: currentQuestionIndex, isCorrect: true },
      ]);

      // Move to next question after a delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedOption(null);
          setShowFeedback(false);
        } else {
          setShowResults(true);
        }
      }, 1500);
    } else {
      // Show incorrect feedback, then reset after delay
      setTimeout(() => {
        setSelectedOption(null);
        setShowFeedback(false);
      }, 1500);
    }
  };

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const progress = (currentQuestionIndex / questions.length) * 100;

  if (showResults) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Quiz Complete!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              You scored {correctAnswers} out of {questions.length}
            </Typography>
            <Typography variant="h3" color="primary.main" sx={{ mb: 2 }}>
              {Math.round((correctAnswers / questions.length) * 100)}%
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      {/* Question Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {questions[currentQuestionIndex].question}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 3,
            }}
          >
            {questions[currentQuestionIndex].options.map((option, index) => {
              let buttonColor = "outlined";
              let buttonSx = {
                p: 2,
                textAlign: "left",
                justifyContent: "flex-start",
                "&:hover": showFeedback
                  ? {}
                  : {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
              };

              if (showFeedback) {
                if (option === questions[currentQuestionIndex].correctAnswer) {
                  buttonColor = "contained";
                  buttonSx = {
                    ...buttonSx,
                    backgroundColor: "success.main",
                    color: "success.contrastText",
                    "&:hover": {
                      backgroundColor: "success.main",
                    },
                  };
                } else if (option === selectedOption) {
                  buttonSx = {
                    ...buttonSx,
                    backgroundColor: "error.main",
                    color: "error.contrastText",
                    "&:hover": {
                      backgroundColor: "error.main",
                    },
                  };
                }
              }

              return (
                <Button
                  key={index}
                  variant={buttonColor as any}
                  onClick={() => handleOptionClick(option)}
                  disabled={showFeedback}
                  sx={buttonSx}
                >
                  {option}
                </Button>
              );
            })}
          </Box>

          {/* Feedback */}
          {showFeedback && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              {selectedOption ===
              questions[currentQuestionIndex].correctAnswer ? (
                <Typography variant="h6" color="success.main">
                  ✓ Correct! Moving to next question...
                </Typography>
              ) : (
                <Typography variant="h6" color="error.main">
                  ✗ Incorrect. Try again in a moment...
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Quiz;
