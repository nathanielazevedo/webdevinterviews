import { Grid } from "@mui/material";
import type { Question } from "@webdevinterviews/shared";
import type { UserPerformanceData } from "../../../api/client";
import { QuestionCard } from "./QuestionCard";

interface QuestionGridProps {
  questions: Question[];
  userPerformances: Record<number, UserPerformanceData>;
  userId?: string | null;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  questions,
  userPerformances,
  userId,
}) => {
  return (
    <Grid container spacing={3}>
      {questions.map((question) => (
        <Grid item xs={12} sm={6} md={4} key={question.id}>
          <QuestionCard
            question={question}
            userPerformance={userPerformances[question.id]}
            userId={userId}
          />
        </Grid>
      ))}
    </Grid>
  );
};
