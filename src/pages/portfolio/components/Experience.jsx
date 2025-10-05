import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => (
  <VerticalTimelineElement
    contentArrowStyle={{ borderRight: "7px solid #dcdcdc" }}
    date={experience.date}
    iconStyle={{ background: experience.iconBg }}
    icon={
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          src={experience.icon}
          alt={experience.company_name}
          style={{
            width: "60%",
            height: "60%",
            objectFit: "contain",
          }}
        />
      </div>
    }
    contentStyle={{
      backgroundColor: "#2a2a2a",
      color: "#f0f0f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      border: "1px solid #333",
    }}
    className="experience-timeline-element"
  >
    <div>
      <h3
        style={{
          color: "#f0f0f0",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {experience.title}
      </h3>
      <p
        style={{
          color: "#888",
          fontSize: "16px",
          fontWeight: "600",
          margin: 0,
        }}
      >
        {experience.company_name}
      </p>
    </div>
    <ul
      style={{
        marginTop: "20px",
        listStyleType: "disc",
        marginLeft: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {experience.points.map((point, index) => (
        <li
          key={`experience-point-${index}`}
          style={{
            color: "#f0f0f0",
            fontSize: "14px",
            paddingLeft: "4px",
            letterSpacing: "0.025em",
          }}
        >
          {point}
        </li>
      ))}
    </ul>
  </VerticalTimelineElement>
);

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p style={{ ...styles.sectionSubText, color: "#888" }}>
          What I have done so far
        </p>
        <p style={{ ...styles.sectionHeadText, color: "#f0f0f0" }}>
          Work Experience
        </p>
      </motion.div>
      <div
        style={{
          marginTop: "80px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
