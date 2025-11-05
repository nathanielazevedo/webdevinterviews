import {
  Box,
  Typography,
  LinearProgress,
  Tooltip,
  Button,
} from "@mui/material";
import {
  EmojiEvents,
  CheckCircle,
  Cancel,
  RadioButtonUnchecked,
  PlayArrow,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Question } from "@webdevinterviews/shared";

interface DrillProgressSectionProps {
  nextBattleQuestions: Question[];
  drillProgress: Record<string, "completed" | "failed" | "pending">;
  onStartDrill: () => void;
}

interface DrillStats {
  completed: number;
  failed: number;
  pending: number;
  total: number;
}

export const DrillProgressSection: React.FC<DrillProgressSectionProps> = ({
  nextBattleQuestions,
  drillProgress,
  onStartDrill,
}) => {
  const navigate = useNavigate();

  const getDrillProgressStats = (): DrillStats => {
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

  if (!nextBattleQuestions || nextBattleQuestions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <EmojiEvents sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Battle Questions Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The next battle hasn&apos;t been scheduled yet or questions
          haven&apos;t been selected.
        </Typography>
      </Box>
    );
  }

  const stats = getDrillProgressStats();
  const progressPercentage =
    ((stats.completed + stats.failed) / stats.total) * 100;

  return (
    <>
      {/* Progress Bar */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <EmojiEvents sx={{ color: "primary.main" }} />
          Battle Drill Progress
        </Typography>

        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {stats.completed + stats.failed} of {stats.total} questions
            attempted
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {nextBattleQuestions.map((question, index) => {
            const status = drillProgress[question.id.toString()];
            const getIcon = () => {
              switch (status) {
                case "completed":
                  return <CheckCircle sx={{ color: "success.main" }} />;
                case "failed":
                  return <Cancel sx={{ color: "error.main" }} />;
                default:
                  return (
                    <RadioButtonUnchecked sx={{ color: "text.disabled" }} />
                  );
              }
            };

            return (
              <Tooltip
                key={question.id}
                title={`${index + 1}. ${question.title} - ${
                  status || "pending"
                }`}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor:
                      status === "completed"
                        ? "success.light"
                        : status === "failed"
                        ? "error.light"
                        : "grey.100",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
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
      </Box>

      {/* Start Drill Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          onClick={onStartDrill}
          sx={{
            background: "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
            color: "white",
            fontWeight: "bold",
            py: 1.5,
            px: 3,
            "&:hover": {
              background: "linear-gradient(45deg, #E55A2B 30%, #E8841B 90%)",
              transform: "translateY(-2px)",
            },
          }}
        >
          {stats.completed + stats.failed === 0
            ? `Start Battle Drill Mode (${nextBattleQuestions.length} Questions)`
            : "Continue Drill Mode"}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Practice all questions from the next Saturday battle in sequence
        </Typography>
      </Box>
    </>
  );
};
