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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `radial-gradient(circle, rgba(16,163,127,0.15) 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          backgroundAttachment: 'fixed',
        },
      },
    },
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `radial-gradient(circle, rgba(16,163,127,0.12) 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
});
