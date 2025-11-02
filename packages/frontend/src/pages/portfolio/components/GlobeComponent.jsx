import { useState, useEffect } from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";
import { Globe } from "react-globe-frequency";
import { api } from "../../../api/client";
import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";

const GlobeComponent = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const initializeGlobe = async () => {
      try {
        // Send current client location to backend for geocoding and storage
        // Backend automatically detects client IP from request headers
        try {
          await api.geocodeLocation();
        } catch {
          // Silently handle geocoding errors
        }

        // Fetch all stored location points
        const pointsResponse = await api.getLocationPoints();
        console.log(pointsResponse);
        setPoints(pointsResponse.data.points || []);
      } catch {
        // Fallback to empty points array
        setPoints([]);
      } finally {
        setLoading(false);
      }
    };

    initializeGlobe();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "text.primary",
          borderRadius: 2,
          margin: "20px auto",
          maxWidth: "800px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading globe...
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Check out where my visitors are from
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Text Section */}
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
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
          Visitor Analytics
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
          Global Reach
        </Typography>
      </motion.div>

      <motion.div
        variants={textVariant(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
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
          This interactive globe showcases{" "}
          <Link
            href="https://www.npmjs.com/package/react-globe-frequency"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            sx={{ textDecoration: "none" }}
          >
            react-globe-frequency
          </Link>
          , an npm package I built that tracks and visualizes the geographic
          locations of visitors to my portfolio. Each point represents someone
          who has viewed my work, giving you a real-time glimpse of my global
          reach. It&apos;s a fun way to see how far my content travels across
          the world!
        </Typography>
      </motion.div>

      {/* Globe Container */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "550px",
        }}
      >
        <Globe
          points={points}
          style={{
            width: "100%",
            height: "100%",
            padding: 0,
            margin: 0,
            // backgroundColor: "black",
            borderRadius: "10px",
          }}
        />
      </Box>
    </Box>
  );
};

export default SectionWrapper(GlobeComponent, "globe");
