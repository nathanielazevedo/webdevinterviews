import React from "react";
import { motion } from "framer-motion";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Grid,
  Container,
  useTheme,
} from "@mui/material";
import { FormatQuote as QuoteIcon } from "@mui/icons-material";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <motion.div
        variants={fadeIn("", "spring", index * 0.5, 0.75)}
        style={{ height: "100%" }}
      >
        <Card
          sx={{
            height: "100%",
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            p: 3,
            position: "relative",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: theme.shadows[8],
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <QuoteIcon
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              fontSize: "3rem",
              color: theme.palette.primary.main,
              opacity: 0.3,
            }}
          />

          <CardContent sx={{ pt: 6, pb: 2 }}>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                letterSpacing: "0.025em",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.6,
                mb: 3,
                fontStyle: "italic",
              }}
            >
              "{testimonial}"
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: "1rem",
                  }}
                >
                  <Box
                    component="span"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    @
                  </Box>
                  {name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  {designation} of {company}
                </Typography>
              </Box>

              <Avatar
                src={image}
                alt={`feedback-by-${name}`}
                sx={{
                  width: 48,
                  height: 48,
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[2],
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );
};

const Feedbacks = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 6,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        position: "relative",
        boxShadow: theme.shadows[4],
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          borderRadius: 2,
          minHeight: 200,
          border: `1px solid ${theme.palette.divider}`,
          p: { xs: 3, sm: 4, md: 5 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xl">
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
              What others say
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
              Testimonials
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Grid */}
      <Box
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          mt: { xs: -6, sm: -8, md: -10 },
          pb: { xs: 4, sm: 6, md: 7 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <FeedbackCard
                key={testimonial.name}
                index={index}
                {...testimonial}
              />
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default SectionWrapper(Feedbacks, "");
