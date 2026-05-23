import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      orbitron: ["var(--font-orbitron)"],
      "space-grotesk": ["var(--font-space-grotesk)"],
      sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        // Cyberpunk Theme
        "cyber-bg": "#050505",
        "cyber-red": "#ff003c",
        "cyber-red-dark": "#8b0000",
        "cyber-red-glow": "#ff4d6d",
        "cyber-text": "#ffffff",
        "cyber-text-secondary": "#a1a1aa",
        "cyber-border": "rgba(255, 0, 60, 0.2)",
        "cyber-border-strong": "rgba(255, 0, 60, 0.5)",
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 0, 60, 0.5)",
        "glow-lg": "0 0 40px rgba(255, 0, 60, 0.6)",
        "glow-xl": "0 0 60px rgba(255, 0, 60, 0.7)",
        "neon": "0 0 10px rgba(255, 77, 109, 0.6), inset 0 0 10px rgba(255, 77, 109, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 0, 60, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 0, 60, 0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "slide-in-up": {
          from: { transform: "translateY(40px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.5s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
      backgroundImage: {
        "gradient-glow": "linear-gradient(135deg, rgba(255, 0, 60, 0.1) 0%, rgba(255, 77, 109, 0.1) 100%)",
        "gradient-cyber": "linear-gradient(135deg, #050505 0%, #1a0505 50%, #050505 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

