import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Container, Box, Typography } from "@mui/material";

import TextLink from "../../../components/TextLink";
import Footer from "../../../components/Footer";
import Game from "../components/Game";

import random from "./data/random.json";

const Games = () => {
  // Pick a random deck from the available decks
  const randomDeck = random[Math.floor(Math.random() * random.length)];

  return (
    <>
      <Box sx={{ minHeight: "calc(100vh - 200px)" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Game
            deck={randomDeck}
            pastFreeDecks={false}
            goNextDeck={() => {
              // Reload with a new random deck
              window.location.reload();
            }}
            isLastDeck={false}
            gameName="mutate"
            playSound={true}
          />
        </Container>
      </Box>
    </>
  );
};

export default Games;
