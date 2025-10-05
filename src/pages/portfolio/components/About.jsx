import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc/index";

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt style={{ width: "100%", maxWidth: "250px" }}>
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        style={{
          width: "100%",
          border: "1px solid #333",
          padding: "1px",
          borderRadius: "20px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          style={{
            backgroundColor: "#2a2a2a",
            borderRadius: "20px",
            padding: "48px",
            minHeight: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              color: "#f0f0f0",
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p style={{ ...styles.sectionSubText, color: "#888" }}>Introduction</p>
        <p style={{ ...styles.sectionHeadText, color: "#f0f0f0" }}>Overview</p>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        style={{
          marginTop: "16px",
          color: "#f0f0f0",
          fontSize: "17px",
          maxWidth: "768px",
          lineHeight: "30px",
        }}
      >
        I'm a software developer with experience using JavaScript, Python, HTML,
        and CSS. I'm most competent using these frameworks — React, Vue, Django,
        Flask. I'm a quick learner and collaborate closely with clients to
        create efficient, scalable, and user-friendly solutions that solve
        real-world problems. Let's work together to bring your ideas to life!
      </motion.p>

      <div
        style={{
          marginTop: "80px",
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
