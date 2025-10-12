import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

interface QuizOption {
  name: string;
  description: string;
  questions: number;
  difficulty: string;
  category: string;
}

interface QuizCardProps {
  option: QuizOption;
  onSelect: (option: QuizOption) => void;
}

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

const QuizCard = ({ option, onSelect }: QuizCardProps) => {
  return (
    <Card
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
      onClick={() => onSelect(option)}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600" sx={{ fontSize: "1.1rem" }}>
            {option.name}
          </Typography>
          <Chip
            label={option.difficulty}
            size="small"
            color={getDifficultyColor(option.difficulty)}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: 40, lineHeight: 1.4 }}
        >
          {option.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={option.category}
            variant="outlined"
            size="small"
            sx={{ fontSize: "0.7rem" }}
          />
          <Typography variant="body2" fontWeight="500">
            {option.questions} Questions
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
