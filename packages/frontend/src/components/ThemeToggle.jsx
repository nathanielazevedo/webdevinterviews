import { useContext, useEffect } from "react";
import { Button } from "@mui/material";
import { ColorModeContext } from "../contexts/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggle = () => {
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      root.classList.add("dark");
    }
  }, []);

  const handleToggle = () => {
    console.log("Toggling theme");
    toggleColorMode();
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outlined"
      startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      sx={{
        minWidth: "auto",
        px: 2,
        py: 1,
      }}
    >
      {mode === "dark" ? "Light" : "Dark"}
    </Button>
  );
};

export default ThemeToggle;
