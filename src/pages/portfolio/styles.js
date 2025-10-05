const styles = {
  paddingX: { paddingLeft: "24px", paddingRight: "24px" }, // Default mobile, would need media queries for larger screens
  paddingY: { paddingTop: "24px", paddingBottom: "24px" },
  padding: {
    paddingLeft: "24px",
    paddingRight: "24px",
    paddingTop: "40px",
    paddingBottom: "40px",
  },

  heroHeadText: {
    fontWeight: "900",
    color: "#f0f0f0",
    fontSize: "40px", // Base mobile size
    lineHeight: "1.2",
    marginTop: "8px",
  },

  heroSubText: {
    color: "#f0f0f0",
    fontWeight: "500",
    fontSize: "16px", // Base mobile size
    lineHeight: "1.5",
  },

  sectionHeadText: {
    fontWeight: "900",
    color: "#f0f0f0",
    fontSize: "30px", // Base mobile size
  },

  sectionSubText: {
    fontSize: "14px", // Base mobile size
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
};

export { styles };

