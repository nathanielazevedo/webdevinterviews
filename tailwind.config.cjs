/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#f1f1f1",
        tertiary: "#dcdcdc",
        text: "#1a1a1a",
        
        "dark-primary": "#050816",
        "dark-secondary": "#aaa6c3",
        "dark-tertiary": "#151030",
        "dark-black-100": "#100d25",
        "dark-black-200": "#090325",
        "dark-white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};
