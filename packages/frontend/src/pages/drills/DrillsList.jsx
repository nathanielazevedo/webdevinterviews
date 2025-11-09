import drills from "./drills.json";
import { Container, Grid, Box, Typography } from "@mui/material";
import DrillCard from "./DrillCard";

const DrillsList = () => {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="700" gutterBottom sx={{ mb: 1 }}>
            Drills
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Practice and master different programming languages and frameworks
          </Typography>
        </Box>

        {/* Drills Grid */}
        <Grid container spacing={3}>
          {drills.map((drill) => (
            <Grid item xs={12} sm={6} md={4} key={drill.id}>
              <DrillCard drill={drill} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DrillsList;
