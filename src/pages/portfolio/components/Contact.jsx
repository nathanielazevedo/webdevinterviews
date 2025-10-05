import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .send(
        "service_tsj9foh",
        "template_tdpddgu",
        {
          from_name: form.name,
          to_name: "Nate",
          from_email: form.email,
          to_email: "nathanielpaulazevedo@gmail.com",
          message: form.message,
        },
        "DM5GqOU5YKOfGkf4I"
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.log(error);
          alert("Something went wrong.");
        }
      );
  };

  return (
    <div
      style={{
        marginTop: "48px",
        display: "flex",
        flexDirection: "column-reverse",
        gap: "40px",
        overflow: "hidden",
      }}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        style={{
          flex: "0.75",
          backgroundColor: "#2a2a2a",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid #333",
        }}
      >
        <p style={{ ...styles.sectionSubText, color: "#888" }}>Get in touch</p>
        <h3 style={{ ...styles.sectionHeadText, color: "#f0f0f0" }}>Contact</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{
            marginTop: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#f0f0f0",
                fontWeight: "500",
                marginBottom: "16px",
              }}
            >
              Your Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              style={{
                backgroundColor: "#1a1a1a",
                padding: "16px 24px",
                color: "#f0f0f0",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                fontWeight: "500",
                fontSize: "14px",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#f0f0f0",
                fontWeight: "500",
                marginBottom: "16px",
              }}
            >
              Your Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              style={{
                backgroundColor: "#1a1a1a",
                padding: "16px 24px",
                color: "#f0f0f0",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                fontWeight: "500",
                fontSize: "14px",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#f0f0f0",
                fontWeight: "500",
                marginBottom: "16px",
              }}
            >
              Your Message
            </span>
            <textarea
              rows="7"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              style={{
                backgroundColor: "#1a1a1a",
                padding: "16px 24px",
                color: "#f0f0f0",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                fontWeight: "500",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: "#1a1a1a",
              padding: "12px 32px",
              outline: "none",
              width: "fit-content",
              color: "#f0f0f0",
              fontWeight: "bold",
              borderRadius: "12px",
              border: "1px solid #333",
              cursor: "pointer",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      {/* Optional EarthCanvas here */}
      {/* <motion.div variants={slideIn("right", "tween", 0.2, 1)} style={{ flex: 1, height: '350px' }}>
        <EarthCanvas />
      </motion.div> */}
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
