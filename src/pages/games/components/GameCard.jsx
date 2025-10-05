import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${game.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        textDecoration: "none",
        color: "inherit",
        "&:visited": {
          color: "inherit",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600" sx={{ fontSize: "1.1rem" }}>
            {game.title}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: 40, lineHeight: 1.4 }}
        >
          {game.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label="JavaScript"
            variant="outlined"
            size="small"
            sx={{ fontSize: "0.7rem" }}
          />
          <Typography variant="body2" fontWeight="500">
            Interactive Game
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GameCard;
