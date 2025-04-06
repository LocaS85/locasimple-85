
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
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
      fontFamily: {
        sans: ['Work Sans', 'Inter', 'SF Pro Text', 'Manrope', 'sans-serif'],
        heading: ['Inter', 'SF Pro Display', 'Manrope', 'sans-serif'],
        worksans: ['Work Sans', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Updated color palette from Figma
        slateblue: {
          DEFAULT: "#273647",  // Bleu ardoise profond
          light: "#3A4D61",
          dark: "#1A2430"
        },
        sagegreen: {
          DEFAULT: "#A9B7AC",  // Vert sauge doux
          light: "#C5D0C8",
          dark: "#8A9690"
        },
        copper: {
          DEFAULT: "#C7956D",  // Cuivré doux
          light: "#D8B292",
          dark: "#A77A55"
        },
        electricblue: {
          DEFAULT: "#5B9CF6",  // Bleu électrique léger
          light: "#83B5F8",
          dark: "#3D7FD8"
        },
        offwhite: {
          DEFAULT: "#F9F9F9",  // Blanc cassé
          light: "#FFFFFF",
          dark: "#F0F0F0"
        },
        velvetgray: {
          DEFAULT: "#EAEAEA",  // Gris velours
          light: "#F5F5F5",
          dark: "#D0D0D0"
        },
        
        primary: {
          DEFAULT: "#273647",  // slateblue
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#C7956D",  // copper
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        accent: {
          DEFAULT: "#A9B7AC",  // sagegreen
          foreground: "hsl(var(--accent-foreground))",
        },
        highlight: {
          DEFAULT: "#5B9CF6",  // electricblue 
          foreground: "hsl(var(--highlight-foreground))",
        },
        muted: {
          DEFAULT: "#EAEAEA",  // velvetgray
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        app: {
          dark: "#1a1a2e",
          primary: "#273647",    // Slate blue
          secondary: "#C7956D",  // Copper
          accent: "#A9B7AC",     // Sage green  
          highlight: "#5B9CF6",  // Electric blue
          light: "#F9F9F9",      // Off-white
          gray: "#EAEAEA",       // Velvet gray
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite"
      },
      boxShadow: {
        "neu-light": "5px 5px 10px rgba(0, 0, 0, 0.03), -5px -5px 10px rgba(255, 255, 255, 0.8)",
        "neu-dark": "3px 3px 8px rgba(0, 0, 0, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.05)",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
