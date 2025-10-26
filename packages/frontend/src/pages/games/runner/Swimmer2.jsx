/* eslint-disable react/no-unescaped-entities */
import { initializeGame } from "./gameLogic.js";
import { useState } from "react";
import { Button, CircularProgress, Typography, useTheme } from "@mui/material";
import "./runner.css";

const GameComponent = () => {
  const theme = useTheme();
  const [loading] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "100vw",
          height: "calc(100vw * 9 / 16)",
        }}
      >
        <Typography>Game Loading...</Typography>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        position: "relative",
        height: "calc(100vh - 200px)",
        minHeight: "400px",
      }}
    >
      <div
        id="intro-screen"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle, ${
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)"
            } 0%, transparent 70%)`,
            animation: "float 6s ease-in-out infinite",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            width: "400px",
            maxWidth: "90vw",
            textAlign: "center",
            zIndex: 1,
            padding: "2rem",
            background:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(255, 255, 255, 0.8)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)"
            }`,
            boxShadow: theme.shadows[8],
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              mb: 1,
              textShadow:
                theme.palette.mode === "dark"
                  ? "none"
                  : "2px 2px 4px rgba(0,0,0,0.1)",
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            JavaSwim
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
              lineHeight: 1.4,
              fontWeight: 400,
              textShadow:
                theme.palette.mode === "dark"
                  ? "none"
                  : "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Test your JavaScript knowledge
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              lineHeight: 1.6,
              textShadow:
                theme.palette.mode === "dark"
                  ? "none"
                  : "1px 1px 2px rgba(0,0,0,0.1)",
              fontSize: "1.1rem",
            }}
          >
            Swim{" "}
            <strong style={{ color: theme.palette.success.main }}>over</strong>{" "}
            the shark if the statement is{" "}
            <strong style={{ color: theme.palette.success.main }}>true</strong>,
            <br />
            Swim{" "}
            <strong style={{ color: theme.palette.error.main }}>
              under
            </strong>{" "}
            if it's{" "}
            <strong style={{ color: theme.palette.error.main }}>false</strong>.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              initializeGame();
            }}
            sx={{
              zIndex: 1000,
              minWidth: "140px",
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              border: 0,
              borderRadius: "25px",
              boxShadow: `0 3px 5px 2px ${theme.palette.primary.main}30`,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                transform: "translateY(-2px)",
                boxShadow: `0 6px 10px 2px ${theme.palette.primary.main}40`,
              },
            }}
          >
            Start Game
          </Button>
        </div>
      </div>

      <canvas id="gameCanvas"></canvas>

      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "black",
        }}
      >
        <Typography
          id="question"
          variant="h6"
          sx={{ color: "black", fontWeight: "bold" }}
        ></Typography>
      </div>

      <div
        id="startOverButton"
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2000,
          display: "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0px",
          color: "black",
        }}
      >
        <Typography variant="subtitle1" fontWeight={"bold"}>
          Game Over
        </Typography>
        <Typography id="scoreSpot" variant="subtitle1"></Typography>
        <Button variant="contained" size="small" id="playAgain">
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameComponent;
