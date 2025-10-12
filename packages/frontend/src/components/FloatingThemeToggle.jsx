import React from "react";
import { Fab, useTheme, Zoom, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ColorModeContext } from "../contexts/ThemeContext";

const FloatingThemeToggle = () => {
  const theme = useTheme();
  const { toggleColorMode } = React.useContext(ColorModeContext);

  return (
    <Zoom in={true} timeout={300}>
      <Tooltip
        title={`Switch to ${
          theme.palette.mode === "dark" ? "light" : "dark"
        } mode`}
        placement="left"
        arrow
      >
        <Fab
          onClick={toggleColorMode}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                : "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
            color: "white",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(33, 150, 243, 0.3)"
                : "0 4px 20px rgba(255, 107, 53, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 6px 25px rgba(33, 150, 243, 0.4)"
                  : "0 6px 25px rgba(255, 107, 53, 0.4)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7
              sx={{
                fontSize: "1.5rem",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
          ) : (
            <Brightness4
              sx={{
                fontSize: "1.5rem",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
          )}
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default FloatingThemeToggle;
