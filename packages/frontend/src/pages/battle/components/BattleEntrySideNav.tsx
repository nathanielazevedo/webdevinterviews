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
import { Player } from "@webdevinterviews/shared";

// Predefined avatar options (same as in Navbar)
const AVATAR_OPTIONS = [
  { id: "default", type: "initial", label: "Default (Initials)" },
  { id: "dev1", type: "emoji", emoji: "👨‍💻", label: "Developer" },
  { id: "dev2", type: "emoji", emoji: "👩‍💻", label: "Developer" },
  { id: "ninja", type: "emoji", emoji: "🥷", label: "Ninja" },
  { id: "robot", type: "emoji", emoji: "🤖", label: "Robot" },
  { id: "alien", type: "emoji", emoji: "👽", label: "Alien" },
  { id: "wizard", type: "emoji", emoji: "🧙‍♂️", label: "Wizard" },
  { id: "cat", type: "emoji", emoji: "🐱", label: "Cat" },
  { id: "dog", type: "emoji", emoji: "🐶", label: "Dog" },
  { id: "panda", type: "emoji", emoji: "🐼", label: "Panda" },
  { id: "lion", type: "emoji", emoji: "🦁", label: "Lion" },
  { id: "tiger", type: "emoji", emoji: "🐯", label: "Tiger" },
  { id: "fire", type: "emoji", emoji: "🔥", label: "Fire" },
  { id: "lightning", type: "emoji", emoji: "⚡", label: "Lightning" },
  { id: "star", type: "emoji", emoji: "⭐", label: "Star" },
  { id: "rocket", type: "emoji", emoji: "🚀", label: "Rocket" },
];

// Helper function to render avatar content (same as in Navbar)
const renderAvatarContent = (player: Player) => {
  if (!player.username) return "?";

  const initials = player.username
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return initials || player.username.charAt(0).toUpperCase();
};

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

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? theme.palette.success.main : theme.palette.error.main;
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
                key={player.userId}
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
                      player.userId === currentUserId
                        ? `${theme.palette.primary.main}15`
                        : "transparent",
                    border:
                      player.userId === currentUserId
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
                            color: getStatusColor(player.isConnected),
                            fontSize: 12,
                          }}
                        />
                      }
                    >
                      {(() => {
                        const avatarId = player.avatar || "default";
                        const avatar = AVATAR_OPTIONS.find(
                          (a) => a.id === avatarId
                        );

                        if (avatar && avatar.type === "emoji") {
                          return (
                            <Box
                              sx={{
                                width: isCollapsed ? 32 : 40,
                                height: isCollapsed ? 32 : 40,
                                borderRadius: "50%",
                                bgcolor: "grey.100",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isCollapsed ? "1.2rem" : "1.4rem",
                                border: `2px solid ${getStatusColor(
                                  player.isConnected
                                )}20`,
                              }}
                            >
                              {avatar.emoji}
                            </Box>
                          );
                        }

                        return (
                          <Avatar
                            sx={{
                              width: isCollapsed ? 32 : 40,
                              height: isCollapsed ? 32 : 40,
                              bgcolor: "primary.main",
                              fontSize: isCollapsed ? "0.9rem" : "1.1rem",
                              border: `2px solid ${getStatusColor(
                                player.isConnected
                              )}20`,
                            }}
                          >
                            {renderAvatarContent(player)}
                          </Avatar>
                        );
                      })()}
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
                          {player.username}
                          {player.userId === currentUserId && " (You)"}
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
