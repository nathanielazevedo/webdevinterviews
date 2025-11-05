import { Box, Tabs, Tab, Badge, Divider } from "@mui/material";
import { Quiz, EmojiEvents } from "@mui/icons-material";

interface QuestionTabsProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  nextBattleQuestionsCount: number;
}

export const QuestionTabs: React.FC<QuestionTabsProps> = ({
  activeTab,
  onTabChange,
  nextBattleQuestionsCount,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        aria-label="practice mode tabs"
      >
        <Tab
          label="All Questions"
          icon={<Quiz />}
          iconPosition="start"
          sx={{ textTransform: "none", fontSize: "1rem" }}
        />
        <Tab
          label={
            <Badge
              badgeContent={nextBattleQuestionsCount || 0}
              color="primary"
              sx={{ "& .MuiBadge-badge": { right: -8, top: -4 } }}
            >
              Next Battle Pool
            </Badge>
          }
          icon={<EmojiEvents />}
          iconPosition="start"
          sx={{ textTransform: "none", fontSize: "1rem" }}
        />
      </Tabs>
      <Divider />
    </Box>
  );
};
