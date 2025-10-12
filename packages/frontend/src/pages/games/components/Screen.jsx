import { Typography, Zoom } from "@mui/material";
import FireWorks from "../../../components/fireworks/Fireworks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import CloseIcon from "@mui/icons-material/Close";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { ColorModeContext } from "../../../contexts/ThemeContext";
import { useContext } from "react";

const Screen = ({ output, code, gameOver, currentScore, deckLength }) => {
  const perfectScore = currentScore == deckLength;
  const colorMode = useContext(ColorModeContext);
  const syntaxTheme = colorMode.mode == "dark" ? vscDarkPlus : vs;

  const getGameOverText = () => {
    const score = (currentScore / deckLength) * 100;
    if (score > 80) {
      return "You're a master at this!";
    } else if (score > 65) {
      return "You did alright.";
    } else {
      return "Go back to the gym!";
    }
  };

  const getScreen = () => {
    if (gameOver) {
      return (
        <Zoom in={true}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" color="text.primary">
              {getGameOverText()}
            </Typography>
            <Typography color={"text.secondary"} sx={{ fontSize: "45px" }}>
              {currentScore} / {deckLength}
            </Typography>
          </div>
        </Zoom>
      );
    } else if (output !== null) {
      return (
        <div className="output-container">
          <Typography variant="h4">
            {output ? (
              <Zoom in={true}>
                <CheckOutlinedIcon
                  color="success"
                  sx={{ fontSize: "70px" }}
                  className="thing"
                />
              </Zoom>
            ) : (
              <Zoom in={true}>
                <CloseIcon
                  color="error"
                  sx={{ fontSize: "70px" }}
                  className="thing"
                />
              </Zoom>
            )}
          </Typography>
        </div>
      );
    } else {
      return (
        <Zoom in={true}>
          <div>
            <SyntaxHighlighter
              language="javascript"
              style={syntaxTheme}
              customStyle={{
                fontSize: "20px",
                lineHeight: "30px",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: colorMode.mode == "dark" ? "#2D2D2D" : "white",
              }}
              wrapLines={true}
              wrapLongLines={true}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Zoom>
      );
    }
  };

  return (
    <div className="code-container">
      {getScreen()}
      {perfectScore && <FireWorks />}
    </div>
  );
};

export default Screen;
