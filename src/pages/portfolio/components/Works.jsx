import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_link,
}) => {
  return (
    <motion.div
      whileInView="show"
      initial="hidden"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      onClick={() => window.open(live_link, "_blank")}
      style={{ width: "100%", maxWidth: "360px" }}
    >
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid #333",
          padding: "20px",
          borderRadius: "16px",
          cursor: "pointer",
          height: "100%",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "230px" }}>
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "flex-end",
              margin: "12px",
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                window.open(source_code_link, "_blank");
              }}
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #ffffff",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={github}
                alt="github"
                style={{
                  width: "50%",
                  height: "50%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3
            style={{
              color: "#f0f0f0",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {name}
          </h3>
          <p
            style={{
              marginTop: "8px",
              color: "#888",
              fontSize: "14px",
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {tags.map((tag) => (
            <p
              key={tag.name}
              style={{
                fontSize: "14px",
                color: "#f0f0f0",
              }}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{ textAlign: "left" }}
      >
        <p style={{ ...styles.sectionSubText, color: "#888" }}>My projects</p>
        <p style={{ ...styles.sectionHeadText, color: "#f0f0f0" }}>Projects</p>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{
          marginTop: "16px",
          color: "#f0f0f0",
          fontSize: "17px",
          maxWidth: "768px",
          lineHeight: "30px",
          textAlign: "left",
        }}
      >
        The following projects showcase my skills and experience through
        real-world examples of my work. Each project is briefly described with
        links to code repositories and live demos. They reflect my ability to
        solve complex problems, work with different technologies, and manage
        projects effectively.
      </motion.p>

      <div
        style={{
          marginTop: "80px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "28px",
          width: "100%",
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
