// theme.ts
import { createTheme } from "@mui/material/styles";

const common = {
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
    fontSize: 14,
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
};

export const lightTheme = createTheme({
  ...common,
  palette: {
    mode: "light",
    primary: {
      main: "#10A37F", // teal accent
    },
    secondary: {
      main: "#00A67E",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F7F7F8", // subtle contrast for cards
    },
    text: {
      primary: "#202123", // dark gray text
      secondary: "#4D4D4D",
    },
    divider: "rgba(0,0,0,0.08)",
  },
});

export const darkTheme = createTheme({
  ...common,
  palette: {
    mode: "dark",
    primary: {
      main: "#10A37F", // same ChatGPT green
    },
    secondary: {
      main: "#00A67E",
    },
    background: {
      default: "#1E1E1E", // main background
      paper: "#2D2D2D", // slightly lighter cards
    },
    text: {
      primary: "#ECECEC", // near-white text
      secondary: "#B0B0B0",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#2D2D2D",
          "&:hover": {
            borderColor: "#10A37F",
            backgroundColor: "#323232",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 6,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(16, 163, 127, 0.3)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: "0.75rem",
        },
      },
    },
  },
});

// ThemeContext.jsx
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { responsiveFontSizes } from "@mui/material/styles";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: "dark",
});

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = React.useState("dark");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme", newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setMode(savedTheme);
    }
  }, []);

  let theme = React.useMemo(
    () => responsiveFontSizes(mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export { ThemeProvider, ColorModeContext };
