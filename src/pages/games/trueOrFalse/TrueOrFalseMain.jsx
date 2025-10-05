import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Container, Box, Typography } from "@mui/material";

import TextLink from "../../../components/TextLink";
import Footer from "../../../components/Footer";
import Game from "../components/Game";

import structured from "./data/structured.json";
import random from "./data/random.json";

const TrueOrFalseMain = () => {
  // Start with the first structured deck for better learning progression
  const length = random.length;
  const randomIndex = Math.floor(Math.random() * length);
  const selectedDeck = random[randomIndex];

  return (
    <>
      <Box sx={{ minHeight: "calc(100vh - 200px)" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <TextLink
              to="/games"
              text="Back to games"
              icon={<ArrowBackIosIcon fontSize="small" />}
            />
          </Box>

          <Game
            deck={selectedDeck}
            pastFreeDecks={false}
            goNextDeck={() => {
              // Reload with a new deck or cycle through structured decks
              window.location.reload();
            }}
            isLastDeck={false}
            gameName="true-or-false"
            playSound={true}
          />
        </Container>
      </Box>
    </>
  );
};

export default TrueOrFalseMain;
