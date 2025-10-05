import React from "react";
import { Box, Typography, Avatar, useTheme, Container } from "@mui/material";
import { headshot } from "../assets/index.js";

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
          gap: { xs: 3, sm: 4, md: 6 },
          flexDirection: { xs: "column", md: "row" },
          minHeight: { md: "60vh" },
        }}
      >
        {/* Decorative line on the left */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            minHeight: 300,
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

        {/* Text content in the middle */}
        <Box
          sx={{
            flex: 1,
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
            }}
          >
            I develop performant and attractive web applications.
          </Typography>
        </Box>

        {/* Headshot on the right */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={headshot}
            alt="Nate Azevedo headshot"
            sx={{
              width: { xs: 200, sm: 250, md: 280, lg: 320 },
              height: { xs: 200, sm: 250, md: 280, lg: 320 },
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[8],
              transition: "all 0.3s ease",
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

export default Hero;
