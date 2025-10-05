import games from "./games.json";
import { Container, Grid, Box } from "@mui/material";
import GameCard from "./components/GameCard";

const GamesList = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Games Grid */}
        <Grid container spacing={3}>
          {games.map((game, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <GameCard game={game} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default GamesList;
