import { BrowserRouter } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  ThemeToggle,
} from "./components";
// import "./index.css";

const Portfolio = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Hero />
      <About />
      <Experience />
      <Tech />
      <Works />
      <Feedbacks />
      <Box sx={{ position: "relative", zIndex: 0 }}>
        <Contact />
        <StarsCanvas />
      </Box>
    </Box>
  );
};

export default Portfolio;
