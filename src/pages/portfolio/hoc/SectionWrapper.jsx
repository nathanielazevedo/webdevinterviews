import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        style={{
          ...styles.padding,
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
          zIndex: 0,
        }}
      >
        <span
          style={{
            display: "block",
            paddingTop: "100px",
            marginTop: "-100px",
          }}
          id={idName}
        >
          &nbsp;
        </span>
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
