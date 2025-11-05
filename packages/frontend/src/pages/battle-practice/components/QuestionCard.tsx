import { Card, CardContent, Chip, Typography, Box } from "@mui/material";
import { Timer } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Question } from "@webdevinterviews/shared";
import type { UserPerformanceData } from "../../../api/client";

interface QuestionCardProps {
  question: Question;
  userPerformance?: UserPerformanceData | null;
  userId?: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userPerformance,
  userId,
}) => {
  const navigate = useNavigate();

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

  const formatTime = (timeMs: number) => {
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
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      onClick={() => {
        navigate(`/battle-practice/${question.id}`);
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={question.difficulty}
            color={getDifficultyColor(question.difficulty)}
            size="small"
            sx={{ mb: 1 }}
          />
          {question.leetcode_number && (
            <Chip
              label={`#${question.leetcode_number}`}
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Typography variant="h6" component="h2" gutterBottom>
          {question.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {question.problem_statement.substring(0, 150)}...
        </Typography>

        {/* User Performance Stats */}
        {userId && userPerformance && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                Your Stats
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {userPerformance.fastestCompletionMs && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Timer sx={{ fontSize: "0.9rem", color: "primary.main" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: "0.8rem",
                    }}
                  >
                    {formatTime(userPerformance.fastestCompletionMs)}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                {userPerformance.successfulAttempts}/
                {userPerformance.totalAttempts} solved
              </Typography>
            </Box>
          </Box>
        )}

        {question.tags && Array.isArray(question.tags) && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {question.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
            {question.tags.length > 3 && (
              <Chip
                label={`+${question.tags.length - 3} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
