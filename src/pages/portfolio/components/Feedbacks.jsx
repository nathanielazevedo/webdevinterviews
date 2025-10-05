import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    style={{
      backgroundColor: "#2a2a2a",
      padding: "40px",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "320px",
      border: "1px solid #333",
    }}
  >
    <p
      style={{
        color: "#f0f0f0",
        fontWeight: "900",
        fontSize: "48px",
        margin: 0,
      }}
    >
      "
    </p>
    <div style={{ marginTop: "4px" }}>
      <p
        style={{
          color: "#f0f0f0",
          letterSpacing: "0.025em",
          fontSize: "18px",
        }}
      >
        {testimonial}
      </p>
      <div
        style={{
          marginTop: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              color: "#f0f0f0",
              fontWeight: "500",
              fontSize: "16px",
            }}
          >
            <span style={{ color: "#3b82f6" }}>@</span>
            {name}
          </p>
          <p
            style={{
              marginTop: "4px",
              color: "#888",
              fontSize: "12px",
            }}
          >
            {designation} of {company}
          </p>
        </div>
        <img
          src={image}
          alt={`feedback-by-${name}`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <div
      style={{
        marginTop: "48px",
        backgroundColor: "#2a2a2a",
        borderRadius: "20px",
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          ...styles.padding,
          backgroundColor: "#1a1a1a",
          borderRadius: "16px",
          minHeight: "300px",
          border: "1px solid #333",
        }}
      >
        <motion.div variants={textVariant()}>
          <p style={{ ...styles.sectionSubText, color: "#888" }}>
            What others say
          </p>
          <p style={{ ...styles.sectionHeadText, color: "#f0f0f0" }}>
            Testimonials
          </p>
        </motion.div>
      </div>
      <div
        style={{
          ...styles.padding,
          marginTop: "-80px",
          paddingBottom: "56px",
          display: "flex",
          flexWrap: "wrap",
          gap: "28px",
        }}
      >
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");
