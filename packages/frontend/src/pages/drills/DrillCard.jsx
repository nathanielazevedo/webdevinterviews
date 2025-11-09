import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DrillCard = ({ drill }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // For now, just navigate to the drill ID - we can implement the actual pages later
    navigate(`/drills/${drill.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "all 0.2s ease",
        border: "2px solid transparent",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: drill.color || "primary.main",
          boxShadow: `0 8px 20px ${drill.color}40`,
        },
        textDecoration: "none",
        color: "inherit",
        "&:visited": {
          color: "inherit",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              fontSize: "3rem",
              lineHeight: 1,
            }}
          >
            {drill.icon}
          </Box>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{
              color: drill.color || "text.primary",
            }}
          >
            {drill.title}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            minHeight: 48,
            lineHeight: 1.6,
          }}
        >
          {drill.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DrillCard;
