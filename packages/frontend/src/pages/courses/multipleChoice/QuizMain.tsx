import Quiz from "./MultipleChoiceMain";
import hardwareQuiz from "./hardware";
import dataSizeQuiz from "./data";
import { leetCode75Quiz } from "./dsa";
import { linuxQuiz } from "./linux";
import { networkingQuiz } from "./networking";
import { sqlQuiz } from "./sql";
import { programmingParadigmsQuiz } from "./programminParadigms";
import { timeComplexityQuiz } from "./timeComplexity";
import { dsaPatternsQuiz } from "./dsaPatterns";
import { djangoQuiz } from "./django";
import { restApiQuiz } from "./rest";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Container,
  LinearProgress,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuizIcon from "@mui/icons-material/Quiz";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QuizCard from "./components/QuizCard";

// Quiz options with descriptions
const quizOptions = [
  {
    name: "Hardware Basics",
    quiz: hardwareQuiz,
    description: "Computer components and architecture fundamentals",
    questions: hardwareQuiz.length,
    difficulty: "Beginner",
    category: "Computer Science",
  },
  {
    name: "Data Sizes",
    quiz: dataSizeQuiz,
    description: "Bytes, bits, and storage measurements",
    questions: dataSizeQuiz.length,
    difficulty: "Beginner",
    category: "Computer Science",
  },
  {
    name: "Leetcode75",
    quiz: leetCode75Quiz,
    description: "Essential coding interview problems",
    questions: leetCode75Quiz.length,
    difficulty: "Advanced",
    category: "Algorithms",
  },
  {
    name: "Linux",
    quiz: linuxQuiz,
    description: "Command line and system administration",
    questions: linuxQuiz.length,
    difficulty: "Intermediate",
    category: "System Administration",
  },
  {
    name: "Networking",
    quiz: networkingQuiz,
    description: "Protocols, TCP/IP, and network concepts",
    questions: networkingQuiz.length,
    difficulty: "Intermediate",
    category: "Networking",
  },
  {
    name: "Programming Paradigms",
    quiz: programmingParadigmsQuiz,
    description: "OOP, functional, and other programming styles",
    questions: programmingParadigmsQuiz.length,
    difficulty: "Intermediate",
    category: "Programming",
  },
  {
    name: "SQL",
    quiz: sqlQuiz,
    description: "Database queries and relational concepts",
    questions: sqlQuiz.length,
    difficulty: "Intermediate",
    category: "Database",
  },
  {
    name: "Time Complexity",
    quiz: timeComplexityQuiz,
    description: "Big O notation and algorithm analysis",
    questions: timeComplexityQuiz.length,
    difficulty: "Advanced",
    category: "Algorithms",
  },
  {
    name: "DSA Patterns",
    quiz: dsaPatternsQuiz,
    description: "Common algorithmic problem-solving patterns",
    questions: dsaPatternsQuiz.length,
    difficulty: "Advanced",
    category: "Algorithms",
  },
  {
    name: "Django",
    quiz: djangoQuiz,
    description: "Python web framework fundamentals",
    questions: djangoQuiz.length,
    difficulty: "Intermediate",
    category: "Web Development",
  },
  {
    name: "REST",
    quiz: restApiQuiz,
    description: "API design and HTTP methods",
    questions: restApiQuiz.length,
    difficulty: "Intermediate",
    category: "Web Development",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "success";
    case "Intermediate":
      return "warning";
    case "Advanced":
      return "error";
    default:
      return "primary";
  }
};

const QuizMain = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<
    typeof quizOptions[0] | null
  >(null);

  const handleQuizSelect = (option: typeof quizOptions[0]) => {
    setSelectedQuiz(option);
  };

  const handleBackToSelection = () => {
    setSelectedQuiz(null);
  };

  const QuizSelectionScreen = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {quizOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <QuizCard option={option} onSelect={handleQuizSelect} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ minHeight: "calc(100vh - 90px)" }}>
      {!selectedQuiz ? (
        <QuizSelectionScreen />
      ) : (
        <Box sx={{ minHeight: "calc(100vh - 90px)" }}>
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={handleBackToSelection} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight="medium">
                {selectedQuiz.name}
              </Typography>
            </Box>
          </Box>

          <Container maxWidth="md" sx={{ py: 3 }}>
            <Quiz
              key={selectedQuiz.name}
              questions={selectedQuiz.quiz}
              onComplete={() => {
                // Handle quiz completion - could show results screen
              }}
            />
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default QuizMain;
