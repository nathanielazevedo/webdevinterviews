import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Grid,
  useTheme,
} from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_link,
}) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <motion.div
        whileInView="show"
        initial="hidden"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn("up", "spring", index * 0.5, 0.75)}
        style={{ height: "100%" }}
      >
        <Tilt
          options={{ max: 45, scale: 1, speed: 450 }}
          style={{ height: "100%" }}
        >
          <Card
            onClick={() => window.open(live_link, "_blank")}
            sx={{
              height: "100%",
              cursor: "pointer",
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="230"
                image={image}
                alt={name}
                sx={{
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(source_code_link, "_blank");
                  }}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[2],
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <GitHubIcon
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: "1.2rem",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                {name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {tags.map((tag) => (
                  <Chip
                    key={tag.name}
                    label={`#${tag.name}`}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontSize: "0.75rem",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Tilt>
      </motion.div>
    </Grid>
  );
};

const Works = () => {
  const theme = useTheme();

  return (
    <Box>
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
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
          My projects
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
          Projects
        </Typography>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
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
          The following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos. They reflect my ability to
          solve complex problems, work with different technologies, and manage
          projects effectively.
        </Typography>
      </motion.div>

      <Box sx={{ mt: 10 }}>
        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} index={index} {...project} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SectionWrapper(Works, "projects");
