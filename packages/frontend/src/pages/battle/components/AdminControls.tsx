import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  AdminPanelSettings,
  ExpandMore,
  ExpandLess,
  Stop,
  PlayArrow,
  Refresh,
  BugReport,
} from "@mui/icons-material";

interface AdminControlsProps {
  isAdmin: boolean;
  battleStatus: "waiting" | "active" | "completed";
  battleId: string | null;
  onEndBattle: () => void;
  onStartBattle?: () => void;
  onResetBattle?: () => void;
}

export const AdminControls: React.FC<AdminControlsProps> = ({
  isAdmin,
  battleStatus,
  battleId,
  onEndBattle,
  onStartBattle,
  onResetBattle,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [endBattleDialogOpen, setEndBattleDialogOpen] = useState(false);

  if (!isAdmin) return null;

  const handleEndBattleClick = () => {
    setEndBattleDialogOpen(true);
  };

  const handleConfirmEndBattle = () => {
    onEndBattle();
    setEndBattleDialogOpen(false);
  };

  const handleCancelEndBattle = () => {
    setEndBattleDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 2000,
          width: expanded ? 320 : 60,
          transition: "width 0.3s ease",
        }}
      >
        <Card
          elevation={8}
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <AdminPanelSettings sx={{ color: "white" }} />
                {expanded && (
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    Admin Controls
                  </Typography>
                )}
              </Box>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ color: "white" }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                {/* Battle Status */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={`Status: ${battleStatus}`}
                    color={battleStatus === "active" ? "success" : "default"}
                    size="small"
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                  />
                  {battleId && (
                    <Chip
                      label={`ID: ${battleId.slice(0, 8)}...`}
                      size="small"
                      sx={{
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.2)",
                      }}
                    />
                  )}
                </Stack>

                {/* Action Buttons */}
                <Stack spacing={1}>
                  {battleStatus === "waiting" && onStartBattle && (
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={onStartBattle}
                      fullWidth
                      sx={{
                        backgroundColor: "rgba(76, 175, 80, 0.8)",
                        "&:hover": { backgroundColor: "rgba(76, 175, 80, 1)" },
                      }}
                    >
                      Force Start Battle
                    </Button>
                  )}

                  {battleStatus === "active" && (
                    <Button
                      variant="contained"
                      startIcon={<Stop />}
                      onClick={handleEndBattleClick}
                      fullWidth
                      sx={{
                        backgroundColor: "rgba(244, 67, 54, 0.8)",
                        "&:hover": { backgroundColor: "rgba(244, 67, 54, 1)" },
                      }}
                    >
                      End Battle
                    </Button>
                  )}

                  {battleStatus === "completed" && onResetBattle && (
                    <Button
                      variant="contained"
                      startIcon={<Refresh />}
                      onClick={onResetBattle}
                      fullWidth
                      sx={{
                        backgroundColor: "rgba(255, 152, 0, 0.8)",
                        "&:hover": { backgroundColor: "rgba(255, 152, 0, 1)" },
                      }}
                    >
                      Reset Battle
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<BugReport />}
                    onClick={() => {
                      // Debug information - could open a debug modal or log to console
                      alert(
                        `Battle Debug: Status=${battleStatus}, ID=${battleId}`
                      );
                    }}
                    fullWidth
                    size="small"
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.5)",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Debug Info
                  </Button>
                </Stack>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </Box>

      {/* End Battle Confirmation Dialog */}
      <Dialog
        open={endBattleDialogOpen}
        onClose={handleCancelEndBattle}
        aria-labelledby="end-battle-dialog-title"
        aria-describedby="end-battle-dialog-description"
      >
        <DialogTitle id="end-battle-dialog-title">End Battle?</DialogTitle>
        <DialogContent>
          <DialogContentText id="end-battle-dialog-description">
            Are you sure you want to end this battle? This action cannot be
            undone. All players will see the battle results immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEndBattle} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEndBattle}
            color="error"
            variant="contained"
          >
            End Battle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
