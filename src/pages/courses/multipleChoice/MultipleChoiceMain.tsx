import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
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

  // Handle user's selection
  const handleOptionClick = (selectedOption: string): void => {
    const isCorrect =
      selectedOption === questions[currentQuestionIndex].correctAnswer;

    // Record the answer
    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestionIndex, isCorrect },
    ]);

    // Move to the next question if not the last one
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <Box
      display="flex"
      height="calc(100vh - 70px)"
      sx={{ maxWidth: "100%", maxHeight: "calc(100vh - 80px)" }}
    >
      {/* Side Navigation */}
      <Box sx={{ minWidth: "200px" }}>
        <List>
          {questions.map((q, index) => {
            const answer = answers.find((a) => a.questionIndex === index);
            const backgroundColor = answer
              ? answer.isCorrect
                ? "rgba(0, 255, 0, 0.2)"
                : "rgba(255, 0, 0, 0.2)"
              : "transparent";

            return (
              <ListItem
                key={index}
                button
                style={{ backgroundColor }}
                onClick={() => setCurrentQuestionIndex(index)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    currentQuestionIndex == index ? "grey.900" : "",
                }}
              >
                <ListItemText primary={`Question ${index + 1}`} />
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider orientation="vertical" />
      {/* Main Content */}
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box flexGrow={1} p={3}>
          <Typography variant="h5" gutterBottom>
            {questions[currentQuestionIndex].question}
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "500px" }}
          >
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleOptionClick(option)}
                style={{ margin: "10px 0" }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Quiz;
