/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      fontSize: {
        15: "15px",
        17: "17px",
      },
      screens: {
        "3xl": "1736px",
        "4xl": "1936px",
        "5xl": "2036px",
        "6xl": "2136px",
        "7xl": "2336px",
        "8xl": "113rem",
      },
      colors: {
        dark: "#1e1d20",
        light: "#f6f6f6",
        theme: "#FF4654",
        theme_dark: "#e91122",
        theme_darker: "#b8000e",
      },
      spacing: {
        md: "27rem",
        lg: "30rem",
        xl: "36rem",
        "2xl": "42rem",
      },
      maxWidth: {
        "8xl": "1550px",
      },
      boxShadow: {
        bold_r: "10px 10px",
        bold_r_xs: "3px 3px",
        bold_r_sm: "5px 5px",
        bold_r_md: "7px 7px",
        bold_l: "-10px 10px",
        zero: "0px 0px",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
