import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#F43F5E",
        accentDark: "#1db854",
        accentLight: "#a4e2ba",
      },
    },
  },
  plugins: [],
};

export default config;
