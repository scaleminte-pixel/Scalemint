import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        agency: {
          dark: "#08080D",
          surface: "#0F0F1A",
          card: "#141424",
          cardHover: "#1A1A30",
          border: "#23233D",
          borderGlow: "#4338CA",
          purple: {
            DEFAULT: "#7C3AED",
            dark: "#5B21B6",
            light: "#A78BFA",
            glow: "rgba(124, 58, 237, 0.25)"
          },
          blue: {
            DEFAULT: "#2563EB",
            light: "#38BDF8",
            cyan: "#06B6D4",
            glow: "rgba(37, 99, 235, 0.25)"
          },
          gold: {
            DEFAULT: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706"
          }
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "glow-purple": "0 0 30px -5px rgba(124, 58, 237, 0.3)",
        "glow-blue": "0 0 30px -5px rgba(37, 99, 235, 0.3)",
        "glow-gold": "0 0 30px -5px rgba(245, 158, 11, 0.3)",
        "card-subtle": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 20px 50px -15px rgba(124, 58, 237, 0.2), 0 0 20px rgba(37, 99, 235, 0.1)"
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "border-glow": "borderGlow 6s ease-in-out infinite",
        "fadeIn": "fadeInUp 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-8px) rotate(1deg)" },
          "75%": { transform: "translateY(5px) rotate(-1deg)" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(124, 58, 237, 0.3)" },
          "33%": { borderColor: "rgba(37, 99, 235, 0.3)" },
          "66%": { borderColor: "rgba(245, 158, 11, 0.2)" }
        }
      },
      transitionDuration: {
        "400": "400ms",
      }
    },
  },
  plugins: [],
};

export default config;
