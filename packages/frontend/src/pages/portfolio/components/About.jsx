import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  useTheme,
} from "@mui/material";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc/index";

const ServiceCard = ({ index, title, icon }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Tilt style={{ width: "100%", height: "100%" }}>
        <motion.div
          variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
          style={{ width: "100%", height: "100%" }}
        >
          <Card
            sx={{
              height: "100%",
              minHeight: 100,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                p: 4,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                {title}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Tilt>
    </Grid>
  );
};

const About = () => {
  const theme = useTheme();

  return (
    <Box>
      <motion.div variants={textVariant()}>
        <Typography
          variant="overline"
          component="p"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: theme.palette.text.secondary,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 500,
          }}
        >
          Introduction
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 900,
            color: theme.palette.text.primary,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            mt: 1,
          }}
        >
          Overview
        </Typography>
      </motion.div>

      <motion.div variants={fadeIn("", "", 0.1, 1)}>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: theme.palette.text.primary,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            maxWidth: "768px",
            lineHeight: 1.8,
          }}
        >
          I'm a software developer with experience using JavaScript, Python,
          HTML, and CSS. I'm most competent using these frameworks — React, Vue,
          Django, Flask. I'm a quick learner and collaborate closely with
          clients to create efficient, scalable, and user-friendly solutions
          that solve real-world problems. Let's work together to bring your
          ideas to life!
        </Typography>
      </motion.div>

      <Box sx={{ mt: 10 }}>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SectionWrapper(About, "about");
