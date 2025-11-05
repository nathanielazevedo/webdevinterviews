import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBattlePractice } from "../../hooks/battle";
import { QuestionTabs, DrillProgressSection, QuestionGrid } from "./components";
import { useUserPerformance } from "./hooks/useUserPerformance";
import { useDrillProgress } from "./hooks/useDrillProgress";

const BattlePracticeList = () => {
  const { questions, nextBattleQuestions, loading, error, refetch } =
    useBattlePractice();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Custom hooks for drill progress and user performance
  const { drillProgress, setDrillProgress } = useDrillProgress();

  // Memoize displayedQuestions to prevent useEffect dependency issues
  const displayedQuestions = useMemo(() => {
    return activeTab === 0 ? questions : nextBattleQuestions || [];
  }, [activeTab, questions, nextBattleQuestions]);

  // Get user performance data for displayed questions
  const { userId, userPerformances } = useUserPerformance(displayedQuestions);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const startBattleDrill = () => {
    if (nextBattleQuestions && nextBattleQuestions.length > 0) {
      // Reset progress for this drill session
      const resetProgress: Record<string, "completed" | "failed" | "pending"> =
        {};
      nextBattleQuestions.forEach((q) => {
        resetProgress[q.id.toString()] = "pending";
      });
      setDrillProgress(resetProgress);

      // Navigate to first question in drill mode
      navigate(
        `/battle-practice/${
          nextBattleQuestions[0].id
        }?mode=drill&pool=${nextBattleQuestions.map((q) => q.id).join(",")}`
      );
    }
  };

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

      {/* Tabs for All Questions vs Battle Pool */}
      <QuestionTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        nextBattleQuestionsCount={nextBattleQuestions?.length || 0}
      />

      {/* Battle Drill Progress and Mode */}
      {activeTab === 1 && (
        <DrillProgressSection
          nextBattleQuestions={nextBattleQuestions || []}
          drillProgress={drillProgress}
          onStartDrill={startBattleDrill}
        />
      )}

      {/* Questions Grid */}
      <QuestionGrid
        questions={displayedQuestions}
        userPerformances={userPerformances}
        userId={userId}
      />

      {displayedQuestions.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No questions available
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
