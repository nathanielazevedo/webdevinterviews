import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart,
  AccountBalanceWallet,
  Timer,
  Groups,
  Person,
  EmojiEvents,
} from "@mui/icons-material";
import { useBattleContext } from "../contexts/BattleContext";
import { api } from "../api/client";
import type { AttackType } from "@webdevinterviews/shared";

interface AttackMarketProps {
  open: boolean;
  onClose: () => void;
}

export const AttackMarket: React.FC<AttackMarketProps> = ({
  open,
  onClose,
}) => {
  const {
    availableAttacks,
    userWallet,
    userInventory,
    attacksLoading,
    refreshAttackData,
  } = useBattleContext();

  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePurchase = async (attack: AttackType) => {
    setError(null);
    setSuccess(null);
    setPurchasing(attack.id);

    try {
      const response = await api.purchaseAttack({ attackTypeId: attack.id });

      if (response.success) {
        setSuccess(`Successfully purchased ${attack.name}!`);
        // Refresh attack data to update wallet and inventory
        await refreshAttackData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to purchase attack";
      setError(message);
    } finally {
      setPurchasing(null);
    }
  };

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case "all":
        return <Groups fontSize="small" />;
      case "individual":
        return <Person fontSize="small" />;
      case "self":
        return <EmojiEvents fontSize="small" />;
      default:
        return <Groups fontSize="small" />;
    }
  };

  const getTargetColor = (
    targetType: string
  ): "error" | "warning" | "success" | "default" => {
    switch (targetType) {
      case "all":
        return "error";
      case "individual":
        return "warning";
      case "self":
        return "success";
      default:
        return "default";
    }
  };

  const getUserQuantity = (attackId: number): number => {
    const inventory = userInventory.find(
      (inv) => inv.attack_type_id === attackId
    );
    return inventory?.quantity || 0;
  };

  const canAfford = (cost: number): boolean => {
    return (userWallet?.coins || 0) >= cost;
  };

  const formatDuration = (ms: number | null): string => {
    if (!ms) return "Instant";
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCart />
          <Typography variant="h5" component="span" fontWeight="bold">
            Attack Market
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(255,255,255,0.2)",
              px: 2,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            <AccountBalanceWallet fontSize="small" />
            <Typography variant="h6" fontWeight="bold">
              {userWallet?.coins || 0}
            </Typography>
            <Typography variant="body2">coins</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "inherit" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess(null)}
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        {attacksLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Purchase powerful attacks to use during battles. Each attack has
              unique effects and targeting options.
            </Typography>

            <Grid container spacing={2}>
              {availableAttacks.map((attack) => {
                const quantity = getUserQuantity(attack.id);
                const affordable = canAfford(attack.cost);
                const isPurchasing = purchasing === attack.id;

                return (
                  <Grid item xs={12} sm={6} key={attack.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.2s",
                        border: quantity > 0 ? "2px solid" : "1px solid",
                        borderColor: quantity > 0 ? "primary.main" : "divider",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            fontWeight="bold"
                          >
                            {attack.name}
                          </Typography>
                          {quantity > 0 && (
                            <Chip
                              label={`×${quantity}`}
                              size="small"
                              color="primary"
                              sx={{ fontWeight: "bold" }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, minHeight: 60 }}
                        >
                          {attack.description}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 2,
                          }}
                        >
                          <Chip
                            icon={getTargetIcon(attack.target_type)}
                            label={attack.target_type}
                            size="small"
                            color={getTargetColor(attack.target_type)}
                            variant="outlined"
                          />
                          {attack.duration_ms && (
                            <Chip
                              icon={<Timer fontSize="small" />}
                              label={formatDuration(attack.duration_ms)}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {!attack.duration_ms && (
                            <Chip
                              label="Instant"
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          )}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          disabled={!affordable || isPurchasing}
                          onClick={() => handlePurchase(attack)}
                          startIcon={
                            isPurchasing ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <ShoppingCart />
                            )
                          }
                        >
                          {isPurchasing
                            ? "Purchasing..."
                            : `Buy for ${attack.cost} coins`}
                        </Button>
                      </CardActions>

                      {!affordable && (
                        <Box sx={{ px: 2, pb: 2 }}>
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            Need {attack.cost - (userWallet?.coins || 0)} more
                            coins
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {availableAttacks.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No attacks available at the moment
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
