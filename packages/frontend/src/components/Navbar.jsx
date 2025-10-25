import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";
import { AccountCircle, Logout, Person } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext.tsx";

// Predefined avatar options
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

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to render avatar content
const renderAvatarContent = (avatarId, user, size = 48) => {
  const avatar = AVATAR_OPTIONS.find((a) => a.id === avatarId);

  if (!avatar || avatar.type === "initial") {
    return user?.user_metadata?.display_name
      ? user.user_metadata.display_name.charAt(0).toUpperCase()
      : user?.email?.charAt(0).toUpperCase() || "U";
  }

  if (avatar.type === "emoji") {
    return avatar.emoji;
  }

  return "U";
};

const pages = [
  {
    title: "Workouts",
    to: "/workouts",
  },
  {
    title: "Games",
    to: "/games",
  },
  {
    title: "Quizes",
    to: "/quizes",
  },
  {
    title: "Battle",
    to: "/battle",
  },
  {
    title: "Battle Practice",
    to: "/battle-practice",
  },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, supabase } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("default");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleUserMenuClose();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileOpen = () => {
    setDisplayName(user?.user_metadata?.display_name || "");
    setSelectedAvatar(user?.user_metadata?.avatar || "default");
    setSelectedCountry(user?.user_metadata?.country || "");
    setProfileDialogOpen(true);
    setProfileError("");
    setProfileSuccess("");
    handleUserMenuClose();
  };

  const handleProfileClose = () => {
    setProfileDialogOpen(false);
    setDisplayName("");
    setSelectedAvatar("default");
    setSelectedCountry("");
    setProfileError("");
    setProfileSuccess("");
  };

  const handleProfileSave = async () => {
    if (!displayName.trim()) {
      setProfileError("Display name cannot be empty");
      return;
    }

    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName.trim(),
          avatar: selectedAvatar,
          country: selectedCountry,
        },
      });

      if (error) throw error;

      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => {
        handleProfileClose();
      }, 1500);
    } catch (error) {
      setProfileError(error.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // Hide navbar on specific routes with numeric IDs (e.g., /workouts/123, /games/456) and battle route
  const shouldHideNavbar = () => {
    // Hide on battle route
    if (location.pathname === "/battle") {
      return true;
    }

    // Hide on routes with numeric IDs
    const pathSegments = location.pathname.split("/");
    if (pathSegments.length >= 3) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      // Check if the last segment is a number
      return /^\d+$/.test(lastSegment);
    }
    return false;
  };

  // Don't render navbar if it should be hidden
  if (shouldHideNavbar()) {
    return null;
  }

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        zIndex: 9999999999,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          px: { xs: 2, sm: 5 },
          py: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            sx={(theme) => ({
              fontWeight: "bold",
              textDecoration: "none",
              color:
                location.pathname === "/"
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              transition: "color 0.2s ease",
              position: "relative",
              "&:hover": {
                color: theme.palette.primary.main,
              },
              "&::after":
                location.pathname === "/"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1,
                    }
                  : {},
            })}
          >
            Nate Azevedo
          </Typography>

          {/* Study Material Section */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {/* Navigation Links */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              {pages.map((page) => {
                const isActive =
                  location.pathname === page.to ||
                  (page.to !== "/" &&
                    location.pathname.startsWith(page.to + "/"));

                return (
                  <Button
                    key={page.title}
                    component={Link}
                    to={page.to}
                    sx={(theme) => ({
                      textTransform: "none",
                      fontWeight: isActive ? 600 : 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      position: "relative",
                      transition: "all 0.2s ease",
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                      backgroundColor: isActive
                        ? `${theme.palette.primary.main}15`
                        : "transparent",
                      borderBottom: isActive
                        ? `2px solid ${theme.palette.primary.main}`
                        : "2px solid transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? `${theme.palette.primary.main}25`
                          : theme.palette.action.hover,
                        color: theme.palette.primary.main,
                      },
                    })}
                  >
                    {page.title}
                  </Button>
                );
              })}
            </Box>
          </Box>

          {/* Auth Section */}
          {!user && (
            <Button
              component={Link}
              to="/auth"
              variant="outlined"
              sx={{
                mr: 2,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
              }}
            >
              Sign In
            </Button>
          )}

          {/* User Menu - only show if user is authenticated */}
          {user && (
            <Box sx={{ mr: 2 }}>
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  p: 0,
                  border: "2px solid transparent",
                  "&:hover": {
                    border: "2px solid",
                    borderColor: "primary.main",
                  },
                }}
              >
                {(() => {
                  const avatarId = user?.user_metadata?.avatar || "default";
                  const avatar = AVATAR_OPTIONS.find((a) => a.id === avatarId);

                  if (avatar && avatar.type === "emoji") {
                    return (
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.4rem",
                          border: "2px solid transparent",
                          "&:hover": {
                            border: "2px solid",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        {avatar.emoji}
                      </Box>
                    );
                  }

                  return (
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "primary.main",
                        fontSize: "1.2rem",
                      }}
                    >
                      {renderAvatarContent(avatarId, user)}
                    </Avatar>
                  );
                })()}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    minWidth: 200,
                    "& .MuiAvatar-root": {
                      width: 24,
                      height: 24,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Signed in as
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {user.user_metadata?.display_name || user.email}
                    </Typography>
                    {user.user_metadata?.country && (
                      <Chip
                        size="small"
                        label={
                          COUNTRIES.find(
                            (c) => c.code === user.user_metadata.country
                          )?.flag || "🌍"
                        }
                        sx={{
                          fontSize: "0.8rem",
                          height: 20,
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Divider />

                <MenuItem onClick={handleProfileOpen}>
                  <Person fontSize="small" sx={{ mr: 1 }} />
                  Profile
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Profile Management Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={handleProfileClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          Manage Profile
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Update your profile information that other players will see in
              battles.
            </Typography>

            <TextField
              fullWidth
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="normal"
              variant="outlined"
              helperText="This name will be shown to other players in battles"
              disabled={profileLoading}
              sx={{ mt: 0 }}
            />

            {/* Avatar Selection */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Choose Your Avatar
              </Typography>

              <Grid container spacing={1.5}>
                {AVATAR_OPTIONS.map((avatar) => (
                  <Grid item key={avatar.id}>
                    <Paper
                      elevation={selectedAvatar === avatar.id ? 3 : 1}
                      sx={{
                        p: 1,
                        cursor: "pointer",
                        border:
                          selectedAvatar === avatar.id
                            ? "2px solid"
                            : "2px solid transparent",
                        borderColor:
                          selectedAvatar === avatar.id
                            ? "primary.main"
                            : "transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          elevation: 2,
                          borderColor:
                            selectedAvatar === avatar.id
                              ? "primary.main"
                              : "primary.light",
                        },
                      }}
                      onClick={() => setSelectedAvatar(avatar.id)}
                    >
                      {avatar.type === "emoji" ? (
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: "grey.100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.8rem",
                          }}
                        >
                          {avatar.emoji}
                        </Box>
                      ) : (
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "primary.main",
                            fontSize: "1.4rem",
                            color: "white",
                          }}
                        >
                          {renderAvatarContent(avatar.id, user, 56)}
                        </Avatar>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Country Selection */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Country (Optional)</InputLabel>
                <Select
                  value={selectedCountry}
                  label="Country (Optional)"
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={profileLoading}
                  renderValue={(selected) => {
                    if (!selected) return "";
                    const country = COUNTRIES.find((c) => c.code === selected);
                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>{country?.flag}</span>
                        <span>{country?.name}</span>
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="">
                    <em>No country selected</em>
                  </MenuItem>
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Email: {user?.email}
              </Typography>
            </Box>

            {profileError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {profileError}
              </Alert>
            )}

            {profileSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {profileSuccess}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleProfileClose} disabled={profileLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleProfileSave}
            variant="contained"
            disabled={profileLoading || !displayName.trim()}
            sx={{ ml: 1 }}
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
