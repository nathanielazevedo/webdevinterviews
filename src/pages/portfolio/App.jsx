import { BrowserRouter } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  ThemeToggle,
} from "./components";
import "./index.css";

const Portfolio = () => {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 0,
        backgroundColor: "#1a1a1a",
        color: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <div>
        {/* <Navbar /> */}
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Works />
      <Feedbacks />
      <div style={{ position: "relative", zIndex: 0 }}>
        <Contact />
        <StarsCanvas />
      </div>
    </div>
  );
};

export default Portfolio;
