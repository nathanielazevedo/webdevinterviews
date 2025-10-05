import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "20px 40px",
        position: "fixed",
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? "#1a1a1a" : "transparent",
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#f0f0f0",
            fontSize: "18px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
          onClick={() => window.scrollTo(0, 0)}
        >
          Nate Azevedo
        </Link>

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
