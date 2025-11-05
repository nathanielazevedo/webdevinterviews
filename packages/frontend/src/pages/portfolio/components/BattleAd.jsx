import { Box, Typography, Button, Card, Chip, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmojiEvents, Schedule, Groups, Code } from "@mui/icons-material";

const BattleAd = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeUntilNext, setTimeUntilNext] = useState("");

  // Calculate time until next Saturday 5pm EST
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextSaturday = new Date();

      // Find next Saturday
      const daysUntilSaturday = (6 - now.getDay()) % 7 || 7;
      nextSaturday.setDate(now.getDate() + daysUntilSaturday);
      nextSaturday.setHours(17, 0, 0, 0); // 5pm

      // If it's already past 5pm on Saturday, get next Saturday
      if (now.getDay() === 6 && now.getHours() >= 17) {
        nextSaturday.setDate(nextSaturday.getDate() + 7);
      }

      const timeDiff = nextSaturday - now;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntilNext(`${days}d ${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Code />, text: "Live Coding Challenges" },
    { icon: <Groups />, text: "Real-time Competition" },
    { icon: <EmojiEvents />, text: "Win & Build Portfolio" },
    { icon: <Schedule />, text: "Every Saturday 5PM EST" },
  ];

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4, md: 6 },
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card
            sx={{
              p: { xs: 3, md: 6 },
              background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.palette.primary.main}30`,
              borderRadius: 4,
              boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{ display: "inline-block", marginBottom: 16 }}
              >
                <EmojiEvents
                  sx={{ fontSize: 60, color: theme.palette.primary.main }}
                />
              </motion.div>

              <Typography
                variant="h3"
                component={motion.h2}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 2,
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                CODING BATTLE ARENA
              </Typography>

              <Typography
                variant="h6"
                component={motion.p}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                Join the ultimate coding competition every Saturday!
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 4,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={`Next Battle: ${timeUntilNext}`}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    px: 1,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.05)" },
                    },
                  }}
                />
                <Chip
                  label="FREE TO JOIN"
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.success.main,
                    color: theme.palette.success.main,
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
                mb: 4,
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      p: 3,
                      borderRadius: 2,
                      background: `${theme.palette.primary.main}08`,
                      border: `1px solid ${theme.palette.primary.main}20`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: `${theme.palette.primary.main}15`,
                        borderColor: `${theme.palette.primary.main}40`,
                      },
                    }}
                  >
                    <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {feature.text}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/battle")}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "white",
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      boxShadow: `0 12px 35px ${theme.palette.primary.main}50`,
                    },
                  }}
                >
                  JOIN THE BATTLE
                </Button>
              </motion.div>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                }}
              >
                Compete with developers worldwide • Build your coding reputation
                • Win prizes
              </Typography>
            </Box>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default BattleAd;
