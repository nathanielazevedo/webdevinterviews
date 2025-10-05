import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
    case "junior":
      return "success";
    case "medium":
    case "mid-level":
      return "warning";
    case "hard":
    case "senior":
      return "error";
    default:
      return "primary";
  }
};

const WorkoutCard = ({ workout }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/workouts/${workout.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
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
            {workout.title}
          </Typography>
          <Chip
            label={(workout.difficulty || "Medium").toUpperCase()}
            size="small"
            color={getDifficultyColor(workout.difficulty)}
            sx={{
              ...(((workout.difficulty || "medium").toLowerCase() ===
                "medium" ||
                (workout.difficulty || "medium").toLowerCase() ===
                  "midlevel") && {
                backgroundColor: "warning.dark",
              }),
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: 40, lineHeight: 1.4 }}
        >
          {workout.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label="⚛️ React"
            variant="outlined"
            size="small"
            sx={{ fontSize: "0.7rem" }}
          />
          <Typography variant="body2" fontWeight="500">
            Workout
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
