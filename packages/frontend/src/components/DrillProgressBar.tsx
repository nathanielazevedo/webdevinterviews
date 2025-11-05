import { Box, Typography, LinearProgress, Tooltip } from "@mui/material";
import {
  CheckCircle,
  Cancel,
  RadioButtonUnchecked,
  EmojiEvents,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Question } from "@webdevinterviews/shared";

interface DrillProgressBarProps {
  nextBattleQuestions: Question[];
  drillProgress: Record<string, "completed" | "failed" | "pending">;
  currentQuestionId?: string;
  compact?: boolean;
  dotsOnly?: boolean;
}

export const DrillProgressBar: React.FC<DrillProgressBarProps> = ({
  nextBattleQuestions,
  drillProgress,
  currentQuestionId,
  compact = false,
  dotsOnly = false,
}) => {
  const navigate = useNavigate();

  const getDrillProgressStats = () => {
    const stats = {
      completed: 0,
      failed: 0,
      pending: 0,
      total: nextBattleQuestions.length,
    };
    nextBattleQuestions.forEach((q) => {
      const status = drillProgress[q.id.toString()];
      if (status) {
        stats[status]++;
      } else {
        stats.pending++;
      }
    });
    return stats;
  };

  const stats = getDrillProgressStats();
  const progressPercentage =
    ((stats.completed + stats.failed) / stats.total) * 100;

  // If dotsOnly mode, return just the dots without any container or progress bar
  if (dotsOnly) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            mr: 1,
            color: "text.secondary",
            fontSize: "0.8rem",
          }}
        >
          Drill Progress:
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {nextBattleQuestions.map((question, index) => {
            const status = drillProgress[question.id.toString()];
            const isCurrentQuestion =
              currentQuestionId === question.id.toString();

            const getIcon = () => {
              switch (status) {
                case "completed":
                  return (
                    <CheckCircle
                      sx={{ color: "success.main", fontSize: "0.9rem" }}
                    />
                  );
                case "failed":
                  return (
                    <Cancel sx={{ color: "error.main", fontSize: "0.9rem" }} />
                  );
                default:
                  return (
                    <RadioButtonUnchecked
                      sx={{ color: "text.disabled", fontSize: "0.9rem" }}
                    />
                  );
              }
            };

            return (
              <Tooltip
                key={question.id}
                title={`${index + 1}. ${question.title} - ${
                  status || "pending"
                }${isCurrentQuestion ? " (current)" : ""}`}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor:
                      status === "completed"
                        ? "success.light"
                        : status === "failed"
                        ? "error.light"
                        : "grey.100",
                    border: isCurrentQuestion ? "2px solid" : "none",
                    borderColor: isCurrentQuestion
                      ? "primary.main"
                      : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.15)",
                    },
                  }}
                  onClick={() =>
                    navigate(
                      `/battle-practice/${
                        question.id
                      }?mode=drill&pool=${nextBattleQuestions
                        .map((q) => q.id)
                        .join(",")}`
                    )
                  }
                >
                  {getIcon()}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
        <Typography
          variant="body2"
          sx={{
            ml: 1,
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          ({stats.completed}/{stats.total})
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: compact ? 2 : 3,
        bgcolor: "background.paper",
        borderRadius: compact ? 1 : 2,
        border: "1px solid",
        borderColor: "divider",
        mb: compact ? 0 : 3,
      }}
    >
      <Typography
        variant={compact ? "subtitle1" : "h6"}
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <EmojiEvents
          sx={{
            color: "primary.main",
            fontSize: compact ? "1.25rem" : "1.5rem",
          }}
        />
        Battle Drill Progress
      </Typography>

      <Box sx={{ mb: compact ? 1.5 : 2 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: compact ? 6 : 8,
            borderRadius: 4,
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
            },
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {stats.completed + stats.failed} of {stats.total} questions attempted
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mb: compact ? 1.5 : 2,
          justifyContent: "center",
        }}
      >
        {nextBattleQuestions.map((question, index) => {
          const status = drillProgress[question.id.toString()];
          const isCurrentQuestion =
            currentQuestionId === question.id.toString();

          const getIcon = () => {
            switch (status) {
              case "completed":
                return (
                  <CheckCircle
                    sx={{
                      color: "success.main",
                      fontSize: compact ? "1rem" : "1.25rem",
                    }}
                  />
                );
              case "failed":
                return (
                  <Cancel
                    sx={{
                      color: "error.main",
                      fontSize: compact ? "1rem" : "1.25rem",
                    }}
                  />
                );
              default:
                return (
                  <RadioButtonUnchecked
                    sx={{
                      color: "text.disabled",
                      fontSize: compact ? "1rem" : "1.25rem",
                    }}
                  />
                );
            }
          };

          return (
            <Tooltip
              key={question.id}
              title={`${index + 1}. ${question.title} - ${status || "pending"}${
                isCurrentQuestion ? " (current)" : ""
              }`}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: compact ? 28 : 32,
                  height: compact ? 28 : 32,
                  borderRadius: "50%",
                  bgcolor:
                    status === "completed"
                      ? "success.light"
                      : status === "failed"
                      ? "error.light"
                      : "grey.100",
                  border: isCurrentQuestion ? "2px solid" : "none",
                  borderColor: isCurrentQuestion
                    ? "primary.main"
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: isCurrentQuestion
                      ? "0 0 0 3px rgba(25, 118, 210, 0.2)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() =>
                  navigate(
                    `/battle-practice/${
                      question.id
                    }?mode=drill&pool=${nextBattleQuestions
                      .map((q) => q.id)
                      .join(",")}`
                  )
                }
              >
                {getIcon()}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {!compact && (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            fontSize: "0.875rem",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircle sx={{ color: "success.main", fontSize: "1rem" }} />
            <Typography variant="body2">
              Completed: {stats.completed}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Cancel sx={{ color: "error.main", fontSize: "1rem" }} />
            <Typography variant="body2">Failed: {stats.failed}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <RadioButtonUnchecked
              sx={{ color: "text.disabled", fontSize: "1rem" }}
            />
            <Typography variant="body2">Pending: {stats.pending}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
