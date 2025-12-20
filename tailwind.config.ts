import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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

    extend: {
      /* ===============================
       * Colors / Design Tokens
       * =============================== */
      colors: {
        /* Base tokens (shadcn / radix) */
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

        /* Vivalegria Design System */
        viva: {
          sun: "hsl(var(--viva-yellow))",
          gold: "hsl(var(--viva-yellow))",
          yellow: "hsl(var(--viva-yellow))",
          orange: "hsl(var(--viva-orange))",
          warm: "hsl(var(--viva-orange-hover))",
          blue: "hsl(var(--viva-blue))",
          dark: "hsl(var(--viva-text))",
          offwhite: "hsl(var(--viva-offwhite))",
        },
      },

      /* ===============================
       * Typography
       * =============================== */
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },

      /* ===============================
       * Effects
       * =============================== */
      boxShadow: {
        soft: "var(--shadow-soft)",
        hover: "var(--shadow-hover)",
        card: "var(--shadow-card)",
        premium: "var(--shadow-premium)",
        elegant: "var(--shadow-elegant)",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ===============================
       * Animations (Radix / shadcn)
       * =============================== */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  /* 🔒 Proteção contra purge em produção */
  safelist: [
    "bg-amber-400",
    "bg-amber-500",
    "bg-yellow-400",
    "bg-orange-500",

    "text-amber-600",
    "text-orange-500",

    "border-amber-400",
    "border-orange-500",
  ],

  plugins: [require("tailwindcss-animate")],
};

export default config;