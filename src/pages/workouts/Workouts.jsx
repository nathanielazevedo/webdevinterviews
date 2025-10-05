import { Alert, Container, Typography, Grid, Box } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import InfoIcon from "@mui/icons-material/Info";
import WorkoutCard from "./components/WorkoutCard";
import workouts from "./workouts.json";

const Workouts = () => {
  const sortedWorkouts = workouts.sort((a, b) =>
    a.difficulty.localeCompare(b.difficulty)
  );

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Workouts Grid */}
        <Grid container spacing={3}>
          {sortedWorkouts.map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout.id}>
              <WorkoutCard workout={workout} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Workouts;
