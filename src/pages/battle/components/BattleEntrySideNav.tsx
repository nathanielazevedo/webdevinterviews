import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
} from "@mui/material";
import { Person, FiberManualRecord } from "@mui/icons-material";
import { motion } from "framer-motion";

interface Player {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  wins: number;
  losses: number;
  status: "ready" | "coding" | "submitted" | "disconnected";
  joinedAt: number;
  testProgress?: {
    passed: number;
    total: number;
    completedAt?: number;
  };
}

interface BattleEntrySideNavProps {
  players: Player[];
  currentUserId: string;
  isCollapsed?: boolean;
}

const BattleEntrySideNav: React.FC<BattleEntrySideNavProps> = ({
  players,
  currentUserId,
  isCollapsed = false,
}) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return theme.palette.success.main;
      case "coding":
        return theme.palette.warning.main;
      case "submitted":
        return theme.palette.info.main;
      case "disconnected":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getTotalBattles = (wins: number, losses: number) => {
    return wins + losses;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: isCollapsed ? 80 : 300,
        height: "fit-content",
        maxHeight: 600,
        p: isCollapsed ? 1 : 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.background.paper})`,
        border: `1px solid ${theme.palette.divider}`,
        transition: "width 0.3s ease-in-out",
        position: "sticky",
        top: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        {!isCollapsed && (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: theme.palette.text.primary,
                textAlign: "center",
              }}
            >
              Battle Participants
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", mb: 2 }}
            >
              {players.length} Player{players.length !== 1 ? "s" : ""}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {/* Scrollable Player List */}
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <List
            sx={{
              maxHeight: isCollapsed ? 400 : 450,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: theme.palette.grey[100],
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.grey[400],
                borderRadius: "3px",
                "&:hover": {
                  background: theme.palette.grey[600],
                },
              },
            }}
          >
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    px: isCollapsed ? 0.5 : 1,
                    py: 1,
                    borderRadius: 2,
                    mb: 1,
                    background:
                      player.id === currentUserId
                        ? `${theme.palette.primary.main}15`
                        : "transparent",
                    border:
                      player.id === currentUserId
                        ? `2px solid ${theme.palette.primary.main}40`
                        : "2px solid transparent",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: `${theme.palette.action.hover}`,
                    },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: isCollapsed ? 32 : 56 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      badgeContent={
                        <FiberManualRecord
                          sx={{
                            color: getStatusColor(player.status),
                            fontSize: 12,
                          }}
                        />
                      }
                    >
                      <Avatar
                        src={player.avatar}
                        sx={{
                          width: isCollapsed ? 32 : 40,
                          height: isCollapsed ? 32 : 40,
                          border: `2px solid ${getStatusColor(
                            player.status
                          )}20`,
                        }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  {!isCollapsed && (
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {player.name}
                          {player.id === currentUserId && " (You)"}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.8rem",
                            mt: 0.5,
                          }}
                        >
                          {player.wins}W /{" "}
                          {getTotalBattles(player.wins, player.losses)} Battles
                        </Typography>
                      }
                    />
                  )}
                </ListItem>
              </motion.div>
            ))}

            {/* Empty state */}
            {players.length === 0 && !isCollapsed && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={4}
                sx={{ opacity: 0.6 }}
              >
                <Person sx={{ fontSize: 48, mb: 2 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No players in battle yet
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      </motion.div>
    </Paper>
  );
};

export default BattleEntrySideNav;
