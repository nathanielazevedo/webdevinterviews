import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeButton = ({ text, to, outside, oneLine }) => {
  const navigate = useNavigate();
  if (outside) {
    return (
      <Button
        variant="contained"
        href={to}
        target="_blank"
        size="large"
        fullWidth={!oneLine}
        className={oneLine ? "marketing-button" : ""}
        sx={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {text}
      </Button>
    );
  }
  return (
    <Button
      variant="contained"
      onClick={() => navigate(to)}
      size="large"
      fullWidth={!oneLine}
      className={oneLine ? "marketing-button" : ""}
      sx={{
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      {text}
    </Button>
  );
};

export default HomeButton;
