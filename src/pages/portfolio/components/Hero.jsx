import React from "react";
import { styles } from "../styles";
import { headshot } from "../assets/index.js";

const Hero = () => {
  return (
    <section
      style={{
        width: "100%",
        paddingTop: "80px",
        paddingBottom: "80px",
        backgroundColor: "#1a1a1a",
        color: "#f0f0f0",
      }}
    >
      <div
        style={{
          ...styles.paddingX,
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          paddingTop: "112px",
        }}
      >
        {/* Side bar gradient */}
        <div
          style={{
            display: "none", // Hidden on mobile
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "32px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#915eff",
            }}
          />
          <div
            style={{
              width: "4px",
              height: "240px",
              background: "linear-gradient(to bottom, #915eff, transparent)",
            }}
          />
        </div>

        {/* Hero text + image */}
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: "32px",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Text */}
          <div>
            <h1 style={styles.heroHeadText}>
              Hi, I'm <span style={{ color: "#995eff" }}>Nate</span>
            </h1>
            <p style={{ ...styles.heroSubText, marginTop: "16px" }}>
              I develop performant
              <br />
              and attractive web applications.
            </p>
          </div>

          {/* Headshot */}
          <img
            src={headshot}
            alt="Nate Azevedo headshot"
            style={{
              width: "192px",
              height: "192px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ffffff",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
