import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        copper: {
          DEFAULT: "#c87d41",
          dark: "#b87333",
          light: "#f5e6d8",
          muted: "#fdf8f4",
        },
        surface: {
          DEFAULT: "#ffffff",
          warm: "#f9f9f9",
        },
        border: {
          DEFAULT: "rgba(0, 0, 0, 0.06)",
          soft: "rgba(0, 0, 0, 0.04)",
        },
        text: {
          primary: "#1a1a1a",
          secondary: "#5c5c5c",
          muted: "#8a8a8a",
        },
      },
      fontFamily: {
        pretendard: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 20px 50px -15px rgba(0, 0, 0, 0.1)",
      },
    },
  },
};

export default config;
