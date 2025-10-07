import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import ThemeToggle from "./ThemeToggle";

const pages = [
  {
    title: "Workouts",
    to: "/workouts",
  },
  {
    title: "Games",
    to: "/games",
  },
  {
    title: "Quizes",
    to: "/quizes",
  },
  {
    title: "Battle",
    to: "/battle",
  },
];

const Navbar = () => {
  const location = useLocation();

  // Hide navbar on specific routes with numeric IDs (e.g., /workouts/123, /games/456) and battle route
  const shouldHideNavbar = () => {
    // Hide on battle route
    if (location.pathname === "/battle") {
      return true;
    }

    // Hide on routes with numeric IDs
    const pathSegments = location.pathname.split("/");
    if (pathSegments.length >= 3) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      // Check if the last segment is a number
      return /^\d+$/.test(lastSegment);
    }
    return false;
  };

  // Don't render navbar if it should be hidden
  if (shouldHideNavbar()) {
    return null;
  }

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        zIndex: 9999999999,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          px: { xs: 2, sm: 5 },
          py: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            sx={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "text.primary",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            Nate Azevedo
          </Typography>

          {/* Study Material Section */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {/* Handwritten-style text */}
            <Typography
              sx={{
                fontFamily:
                  '"Dancing Script", "Caveat", "Patrick Hand", cursive',
                fontSize: "1rem",
                color: "text.secondary",
                fontWeight: 500,
                userSelect: "none",
                opacity: 0.8,
                letterSpacing: "0.5px",
              }}
            >
              my study material →
            </Typography>

            {/* Navigation Links */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.title}
                  component={Link}
                  to={page.to}
                  sx={{
                    color: "text.primary",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      color: "primary.main",
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>
          </Box>

          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
