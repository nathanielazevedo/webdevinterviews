import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  useTheme,
  Container,
} from "@mui/material";
import { headshot } from "../assets/index.js";
import { SectionWrapper } from "../hoc";

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          minHeight: { md: "60vh" },
          gap: { xs: 3, md: 0 },
        }}
      >
        {/* Line and Text Group */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: { xs: 0, md: 4 },
            flex: 1,
          }}
        >
          {/* Decorative line on the left */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              mt: { md: "2.2rem" }, // Align dot with middle of H
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Box
              sx={{
                width: 4,
                height: 280,
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, transparent)`,
              }}
            />
          </Box>

          {/* Text content */}
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              maxWidth: { md: "600px" },
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 900,
                color: theme.palette.text.primary,
                fontSize: {
                  xs: "2.5rem",
                  sm: "3.5rem",
                  md: "4rem",
                  lg: "4.5rem",
                },
                lineHeight: 1.2,
              }}
            >
              Hi, I'm{" "}
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                Nate
              </Box>
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                lineHeight: 1.6,
                mt: 3,
                mb: 4,
              }}
            >
              Welcome to my world.
              <br />
              Check out some of my study material:
            </Typography>

            {/* Navigation Links */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Button
                component={Link}
                to="/workouts"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                Workouts
              </Button>
              <Button
                component={Link}
                to="/games"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                Games
              </Button>
              <Button
                component={Link}
                to="/quizes"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                Quizes
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Headshot on the right */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            mt: { md: -4 },
          }}
        >
          <Avatar
            src={headshot}
            alt="Nate Azevedo headshot"
            variant="rounded"
            sx={{
              width: { xs: 200, sm: 250, md: 280, lg: 320 },
              height: { xs: 200, sm: 250, md: 280, lg: 320 },
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[8],
              transition: "all 0.3s ease",
              borderRadius: 6,
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: theme.shadows[12],
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default SectionWrapper(Hero, "");
