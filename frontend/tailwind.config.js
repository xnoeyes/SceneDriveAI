/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066ff",
        secondary: "#0099ff",
        accent: "#00cc99",
        city: "#f8fafc",
        road: "#94a3b8",
        highlight: "#3b82f6",
      },
      animation: {
        "car-move": "carMove 10s linear infinite",
        "city-pulse": "cityPulse 4s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "ai-pulse": "aiPulse 2s ease-in-out infinite",
      },
      keyframes: {
        carMove: {
          "0%":   { transform: "translateX(-10vw) translateY(0)" },
          "50%":  { transform: "translateX(40vw) translateY(-5px)" },
          "100%": { transform: "translateX(110vw) translateY(0)" },
        },
        cityPulse: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 28px rgba(0, 102, 255, 0.4)" },
          "50%":      { boxShadow: "0 0 45px rgba(0, 102, 255, 0.8)" },
        },
        aiPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
