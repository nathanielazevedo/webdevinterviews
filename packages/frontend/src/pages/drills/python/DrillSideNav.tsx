import { Box, Typography, List, ListItem, ListItemButton } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

interface DrillSideNavProps {
  topics: Topic[];
  currentTopicId: string;
  completedTopics: string[];
  onTopicSelect: (topicId: string) => void;
  brokenQuestionCounts?: Record<string, number>;
}

const DrillSideNav = ({
  topics,
  currentTopicId,
  completedTopics,
  onTopicSelect,
  brokenQuestionCounts = {},
}: DrillSideNavProps) => {
  return (
    <Box
      sx={{
        width: 280,
        height: "calc(100vh - 100px)",
        position: "sticky",
        top: 20,
        borderRight: "1px solid",
        borderColor: "divider",
        pr: 2,
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
        Topics
      </Typography>

      <List sx={{ p: 0 }}>
        {topics.map((topic) => {
          const isActive = topic.id === currentTopicId;
          const isCompleted = completedTopics.includes(topic.id);
          const brokenCount = brokenQuestionCounts[topic.id] || 0;

          return (
            <ListItem key={topic.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => onTopicSelect(topic.id)}
                sx={{
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: isActive ? topic.color : "transparent",
                  bgcolor: isActive ? `${topic.color}10` : "transparent",
                  "&:hover": {
                    bgcolor: isActive ? `${topic.color}20` : "action.hover",
                    borderColor: isActive ? topic.color : "divider",
                  },
                  transition: "all 0.2s",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "2rem",
                      mr: 1.5,
                      lineHeight: 1,
                      mt: 0.5,
                    }}
                  >
                    {topic.icon}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="600">
                        {topic.title}
                      </Typography>
                      {isCompleted && (
                        <CheckCircle
                          sx={{
                            fontSize: 16,
                            color: "success.main",
                          }}
                        />
                      )}
                      {brokenCount > 0 && (
                        <Box
                          sx={{
                            bgcolor: "error.main",
                            color: "white",
                            borderRadius: "12px",
                            px: 0.75,
                            py: 0.25,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <span>⚠️</span>
                          {brokenCount}
                        </Box>
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        lineHeight: 1.3,
                      }}
                    >
                      {topic.description}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 3, p: 2, bgcolor: "background.paper", borderRadius: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          Progress
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight="700">
            {completedTopics.length} / {topics.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            topics completed
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DrillSideNav;
