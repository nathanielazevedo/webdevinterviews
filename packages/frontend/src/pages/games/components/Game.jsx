import { useState } from "react";
import { Card, CardContent, Box, Container, Typography } from "@mui/material";

import Screen from "./Screen";
import Explanation from "./Explanation";
import GameHead from "./GameHead";
import BackButton from "./BackButton";
import GameOverButtons from "./GameOverButtons";
import GameButtons from "./GameButtons";

import correctSound from "../sounds/correctSound.wav";
import incorrectSound from "../sounds/incorrectSound.mp3";

const Game = ({
  deck,
  pastFreeDecks,
  goNextDeck,
  isLastDeck,
  gameName,
  playSound,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [output, setOutput] = useState(null);
  const [scores, setScores] = useState([]);
  const [errorType, setErrorType] = useState();

  const deckLength = deck.questions.length;
  const gameOver = currentQuestionIndex >= deckLength;
  const currentScore = scores.reduce((cum, curr) => (curr ? cum + 1 : cum), 0);
  const currentQuestionInfo = deck.questions[currentQuestionIndex];
  const currentQuestion = currentQuestionInfo?.question;
  const currentDeckExplanation = currentQuestionInfo?.explanation;
  const allowNots =
    gameName != "ccc" ? undefined : currentQuestionInfo?.allowNots;
  const answer = currentQuestionInfo?.answer;
  const options = currentQuestionInfo?.options;
  const newGame = () => {
    setCurrentQuestionIndex(0);
    setScores([]);
    setOutput(null);
  };

  const goBack = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
    if (output) setOutput(null);
    setScores((prev) => {
      prev.pop();
      return [...prev];
    });
  };

  const handleCorrectInput = () => {
    if (playSound) {
      const audio = new Audio(correctSound);
      audio.play();
    }
    setOutput(true);
    setScores((prev) => [...prev, true]);
  };

  const handleIncorrectInput = () => {
    if (playSound) {
      const audio = new Audio(incorrectSound);
      audio.play();
    }
    setOutput(false);
    setScores((prev) => [...prev, false]);
  };

  const onSubmit = (evt) => {
    const input = evt.target.value;
    const cleanedQuestion = currentQuestion
      .replaceAll("<br>", "")
      .replaceAll("&nbsp;", "");

    if (gameName == "true-or-false") {
      try {
        if (input == eval(cleanedQuestion)) handleCorrectInput();
        else handleIncorrectInput();
      } catch (e) {
        console.log(`Error, ${(deck.id, currentQuestion)}`);
      }
    } else if (gameName == "will-it-throw") {
      try {
        eval(cleanedQuestion);
        if (input === "no") handleCorrectInput();
        else handleIncorrectInput();
      } catch (e) {
        setErrorType(e.toString());
        if (input === "yes") handleCorrectInput();
        else handleIncorrectInput();
      }
    } else if (gameName == "ccc") {
      const questionWithInput = cleanedQuestion.replaceAll("???", input);
      try {
        const result = eval(questionWithInput);
        if (result) handleCorrectInput();
        else handleIncorrectInput();
      } catch (e) {
        console.log(`Error, ${(deck.id, currentQuestion)}`);
      }
    } else if (gameName == "mutate") {
      try {
        if (answer == input) handleCorrectInput();
        else handleIncorrectInput();
      } catch (e) {
        console.log(`Error, ${(deck.id, currentQuestion)}`);
      }
    } else if (gameName == "returns") {
      try {
        if (answer == input) handleCorrectInput();
        else handleIncorrectInput();
      } catch (e) {
        console.log(`Error, ${(deck.id, currentQuestion)}`);
      }
    }

    setTimeout(() => {
      setOutput(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 500);

    setTimeout(() => {
      setErrorType("");
    }, 4000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Card
        sx={{
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          boxShadow: 3,
          border: 2,
          borderColor: "divider",
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <BackButton goBack={goBack} disabled={currentQuestionIndex == 0} />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {deck.title}
            </Typography>
          </Box>

          <GameHead scores={scores} length={deckLength} />

          <Box sx={{ flexGrow: 1, my: 3 }}>
            <Screen
              output={output}
              gameOver={gameOver}
              code={currentQuestion}
              deckLength={deckLength}
              currentScore={currentScore}
            />
          </Box>

          <Box sx={{ mt: "auto" }}>
            {gameOver ? (
              <GameOverButtons
                newGame={newGame}
                isLastDeck={isLastDeck}
                goNextDeck={goNextDeck}
                pastFreeDecks={pastFreeDecks}
              />
            ) : (
              <GameButtons
                gameName={gameName}
                onSubmit={onSubmit}
                allowNots={allowNots}
                options={options}
                disabled={output != null}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {!gameOver && (
        <Box sx={{ mt: 3 }}>
          <Explanation text={currentDeckExplanation} />
        </Box>
      )}

      {errorType && (
        <Box sx={{ mt: 2 }}>
          <Typography
            color="error"
            variant="body2"
            sx={{
              p: 2,
              bgcolor: "error.dark",
              borderRadius: 1,
              color: "error.contrastText",
            }}
          >
            {errorType}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Game;
