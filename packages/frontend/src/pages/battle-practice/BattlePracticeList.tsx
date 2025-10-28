import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useBattlePractice } from "../../hooks/battle";
import { api } from "../../api/client";
import type { Question } from "@webdevinterviews/shared";

const BattlePracticeList = () => {
  const { questions, loading, error, refetch } = useBattlePractice();
  const navigate = useNavigate();
  const [currentBattlePool, setCurrentBattlePool] = useState<Question[]>([]);
  const [showOnlyPool, setShowOnlyPool] = useState(false);
  const [poolLoading, setPoolLoading] = useState(false);

  const fetchCurrentBattlePool = async () => {
    try {
      setPoolLoading(true);
      const response = (await api.getCurrentBattle()) as {
        battle: { questionPool: Question[] };
      };
      const questionPool = response.battle?.questionPool || [];
      setCurrentBattlePool(questionPool);
    } catch (err) {
      // Error handled silently - filter will just be disabled
    } finally {
      setPoolLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentBattlePool();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  const displayedQuestions = showOnlyPool
    ? questions.filter((question) =>
        currentBattlePool.some(
          (poolQuestion) => poolQuestion.id === question.id
        )
      )
    : questions;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={refetch}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Battle Practice Questions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Practice with questions that appear in coding battles. Click on any
        question to start practicing.
      </Typography>

      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant={showOnlyPool ? "contained" : "outlined"}
          onClick={() => setShowOnlyPool(!showOnlyPool)}
          disabled={poolLoading || currentBattlePool.length === 0}
          startIcon={poolLoading ? <CircularProgress size={16} /> : null}
        >
          {showOnlyPool ? "Show All Questions" : "Show Battle Pool Only"}
        </Button>
        {currentBattlePool.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {currentBattlePool.length} questions in current battle
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {displayedQuestions.map((question) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
              onClick={() => {
                navigate(`/battle-practice/${question.id}`);
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={question.difficulty}
                    color={getDifficultyColor(question.difficulty)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  {question.leetcode_number && (
                    <Chip
                      label={`#${question.leetcode_number}`}
                      variant="outlined"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>

                <Typography variant="h6" component="h2" gutterBottom>
                  {question.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {question.problem_statement.substring(0, 150)}...
                </Typography>

                {question.tags && Array.isArray(question.tags) && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {question.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    ))}
                    {question.tags.length > 3 && (
                      <Chip
                        label={`+${question.tags.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {displayedQuestions.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {showOnlyPool
              ? "No questions in current battle pool"
              : "No questions available"}
          </Typography>
          <Button variant="outlined" onClick={refetch} sx={{ mt: 2 }}>
            Refresh
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default BattlePracticeList;
