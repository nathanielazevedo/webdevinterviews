import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  useTheme,
  GlobalStyles,
} from "@mui/material";

import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => {
  const theme = useTheme();

  return (
    <VerticalTimelineElement
      contentArrowStyle={{
        borderRight: `7px solid ${theme.palette.divider}`,
      }}
      date={experience.date}
      iconStyle={{
        background: theme.palette.background.paper,
        border: `3px solid ${theme.palette.primary.main}`,
      }}
      icon={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Avatar
            src={experience.icon}
            alt={experience.company_name}
            sx={{
              width: "60%",
              height: "60%",
              objectFit: "contain",
            }}
          />
        </Box>
      }
      contentStyle={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[4],
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      }}
      className="experience-timeline-element"
    >
      <Box>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {experience.title}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            mb: 2,
          }}
        >
          {experience.company_name}
        </Typography>
      </Box>

      <List
        sx={{
          mt: 2,
          pl: 2,
        }}
      >
        {experience.points.map((point, index) => (
          <ListItem
            key={`experience-point-${index}`}
            sx={{
              display: "list-item",
              listStyleType: "disc",
              py: 0.5,
              px: 0,
            }}
          >
            <ListItemText
              primary={point}
              primaryTypographyProps={{
                color: theme.palette.text.primary,
                fontSize: "0.875rem",
                letterSpacing: "0.025em",
                lineHeight: 1.5,
              }}
            />
          </ListItem>
        ))}
      </List>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const theme = useTheme();

  const timelineStyles = {
    ".vertical-timeline::before": {
      backgroundColor: `${theme.palette.text.primary} !important`,
    },
    ".vertical-timeline-element-date": {
      color: `${theme.palette.text.secondary} !important`,
    },
  };

  return (
    <Box>
      <GlobalStyles styles={timelineStyles} />
      <motion.div variants={textVariant()}>
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
          What I have done so far
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 900,
            color: theme.palette.text.primary,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            mt: 1,
          }}
        >
          Work Experience
        </Typography>
      </motion.div>

      <Box
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </Box>
    </Box>
  );
};

export default SectionWrapper(Experience, "work");
