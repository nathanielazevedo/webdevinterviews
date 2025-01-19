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
import { Box, Typography, List, ListItem, Divider } from "@mui/material";

// Quiz options
const quizOptions = [
  { name: "Hardware Basics", quiz: hardwareQuiz },
  { name: "Data Sizes", quiz: dataSizeQuiz },
  { name: "Leetcode75", quiz: leetCode75Quiz },
  { name: "Linux", quiz: linuxQuiz },
  { name: "Networking", quiz: networkingQuiz },
  { name: "Programming Paradigms", quiz: programmingParadigmsQuiz },
  { name: "SQL", quiz: sqlQuiz },
  { name: "Time Complexity", quiz: timeComplexityQuiz },
  { name: "DSA Patterns", quiz: dsaPatternsQuiz },
  { name: "Django", quiz: djangoQuiz },
  { name: "REST", quiz: restApiQuiz },
];

const QuizMain = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<typeof quizOptions | null>(
    null
  );

  return (
    <Box display="flex" height="calc(100vh - 90px)">
      {/* Sidebar for Quiz Selection */}
      <Box sx={{ minWidth: "250px" }} p={2}>
        <Typography variant="h6" gutterBottom>
          Select a Quiz
        </Typography>
        <List>
          {quizOptions.map((option, index) => (
            <ListItem
              key={index}
              sx={{
                cursor: "pointer",
                backgroundColor:
                  selectedQuiz?.name == option.name ? "grey.900" : "inherit",
              }}
              onClick={() => setSelectedQuiz(option)}
            >
              <Typography>{option.name}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider orientation="vertical" />
      <Box flexGrow={1} p={3} py={0}>
        {selectedQuiz ? (
          <Quiz key={selectedQuiz.name} questions={selectedQuiz.quiz} />
        ) : (
          <Typography variant="h5">Please select a quiz to start.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default QuizMain;
