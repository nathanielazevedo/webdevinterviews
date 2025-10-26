import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const theme = useTheme();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .send(
        "service_v9iy1dd",
        "template_tdpddgu",
        {
          from_name: form.name,
          to_name: "Nate",
          from_email: form.email,
          to_email: "nathanielpaulazevedo@gmail.com",
          message: form.message,
        },
        "DM5GqOU5YKOfGkf4I"
      )
      .then(
        () => {
          setLoading(false);
          setSnackbar({
            open: true,
            message: "Thank you! I will get back to you as soon as possible.",
            severity: "success",
          });
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.log(error);
          setSnackbar({
            open: true,
            message: "Something went wrong. Please try again.",
            severity: "error",
          });
        }
      );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: { xs: "column-reverse", lg: "row" },
          gap: 5,
          overflow: "hidden",
          pb: 5,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <motion.div variants={slideIn("left", "tween", 0.2, 1)}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="overline"
                    component="p"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: theme.palette.text.secondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                    }}
                  >
                    Get in touch
                  </Typography>
                  <Typography
                    variant="h2"
                    component="h3"
                    sx={{
                      fontWeight: 900,
                      color: theme.palette.text.primary,
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                      mt: 1,
                      mb: 4,
                    }}
                  >
                    Contact
                  </Typography>

                  <Box
                    component="form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      name="name"
                      label="Your Name"
                      placeholder="What's your name?"
                      value={form.name}
                      onChange={handleChange}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: theme.palette.background.default,
                          "& fieldset": {
                            borderColor: theme.palette.divider,
                          },
                          "&:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: theme.palette.text.secondary,
                        },
                        "& .MuiOutlinedInput-input": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      label="Your Email"
                      placeholder="What's your email?"
                      value={form.email}
                      onChange={handleChange}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: theme.palette.background.default,
                          "& fieldset": {
                            borderColor: theme.palette.divider,
                          },
                          "&:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: theme.palette.text.secondary,
                        },
                        "& .MuiOutlinedInput-input": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      name="message"
                      label="Your Message"
                      placeholder="What do you want to say?"
                      value={form.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={6}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: theme.palette.background.default,
                          "& fieldset": {
                            borderColor: theme.palette.divider,
                          },
                          "&:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: theme.palette.text.secondary,
                        },
                        "& .MuiOutlinedInput-input": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={<SendIcon />}
                      sx={{
                        width: "fit-content",
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                        "&:disabled": {
                          backgroundColor:
                            theme.palette.action.disabledBackground,
                          color: theme.palette.action.disabled,
                        },
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
