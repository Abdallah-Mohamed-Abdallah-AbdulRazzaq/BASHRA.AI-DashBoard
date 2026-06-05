import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // 1. Brand & Base
        brand: {
          dark: "var(--brand-dark)",
          light: "var(--brand-light)",
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          white: "var(--brand-white)",
        },

        // 2. Cyan
        cyan: {
          100: "var(--cyan-100)",
          200: "var(--cyan-200)",
          300: "var(--cyan-300)",
          400: "var(--cyan-400)",
          500: "var(--cyan-500)",
          600: "var(--cyan-600)",
          700: "var(--cyan-700)",
          800: "var(--cyan-800)",
          900: "var(--cyan-900)",
          950: "var(--cyan-950)",
        },

        // 3. Error
        error: {
          100: "var(--error-100)",
          200: "var(--error-200)",
          300: "var(--error-300)",
          400: "var(--error-400)",
          500: "var(--error-500)",
          600: "var(--error-600)",
          700: "var(--error-700)",
          800: "var(--error-800)",
          900: "var(--error-900)",
          950: "var(--error-950)",
        },

        // 4. Grey
        grey: {
          100: "var(--grey-100)",
          200: "var(--grey-200)",
          300: "var(--grey-300)",
          400: "var(--grey-400)",
          500: "var(--grey-500)",
          600: "var(--grey-600)",
          700: "var(--grey-700)",
          800: "var(--grey-800)",
          900: "var(--grey-900)",
          950: "var(--grey-950)",
        },

        // 5. Indigo
        indigo: {
          100: "var(--indigo-100)",
          200: "var(--indigo-200)",
          300: "var(--indigo-300)",
          400: "var(--indigo-400)",
          500: "var(--indigo-500)",
          600: "var(--indigo-600)",
          700: "var(--indigo-700)",
          800: "var(--indigo-800)",
          900: "var(--indigo-900)",
          950: "var(--indigo-950)",
        },

        // 6. Info
        info: {
          100: "var(--info-100)",
          200: "var(--info-200)",
          300: "var(--info-300)",
          400: "var(--info-400)",
          500: "var(--info-500)",
          600: "var(--info-600)",
          700: "var(--info-700)",
          800: "var(--info-800)",
          900: "var(--info-900)",
          950: "var(--info-950)",
        },

        // 7. Light
        light: {
          100: "var(--light-100)",
          200: "var(--light-200)",
          300: "var(--light-300)",
          400: "var(--light-400)",
          500: "var(--light-500)",
          600: "var(--light-600)",
          700: "var(--light-700)",
          800: "var(--light-800)",
          900: "var(--light-900)",
          950: "var(--light-950)",
        },

        // 8. Orange
        orange: {
          100: "var(--orange-100)",
          200: "var(--orange-200)",
          300: "var(--orange-300)",
          400: "var(--orange-400)",
          500: "var(--orange-500)",
          600: "var(--orange-600)",
          700: "var(--orange-700)",
          800: "var(--orange-800)",
          900: "var(--orange-900)",
          950: "var(--orange-950)",
        },

        // 9. Pink
        pink: {
          100: "var(--pink-100)",
          200: "var(--pink-200)",
          300: "var(--pink-300)",
          400: "var(--pink-400)",
          500: "var(--pink-500)",
          600: "var(--pink-600)",
          700: "var(--pink-700)",
          800: "var(--pink-800)",
          900: "var(--pink-900)",
          950: "var(--pink-950)",
        },

        // 10. Primary Shades (Renamed to primary_shades to avoid conflict with main primary)
        primary_shades: {
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          950: "var(--primary-950)",
        },

        // 11. Purple
        purple: {
          100: "var(--purple-100)",
          200: "var(--purple-200)",
          300: "var(--purple-300)",
          400: "var(--purple-400)",
          500: "var(--purple-500)",
          600: "var(--purple-600)",
          700: "var(--purple-700)",
          800: "var(--purple-800)",
          900: "var(--purple-900)",
          950: "var(--purple-950)",
        },

        // 12. Secondary Shades (Renamed to avoid conflict)
        secondary_shades: {
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
          950: "var(--secondary-950)",
        },

        // 13. Success
        success: {
          100: "var(--success-100)",
          200: "var(--success-200)",
          300: "var(--success-300)",
          400: "var(--success-400)",
          500: "var(--success-500)",
          600: "var(--success-600)",
          700: "var(--success-700)",
          800: "var(--success-800)",
          900: "var(--success-900)",
          950: "var(--success-950)",
        },

        // 14. System Colors
        sys: {
          cyan: "var(--sys-cyan)",
          error: "var(--sys-error)",
          indigo: "var(--sys-indigo)",
          info: "var(--sys-info)",
          orange: "var(--sys-orange)",
          pink: "var(--sys-pink)",
          purple: "var(--sys-purple)",
          success: "var(--sys-success)",
          teal: "var(--sys-teal)",
          warning: "var(--sys-warning)",
        },

        // 15. Teal
        teal: {
          100: "var(--teal-100)",
          200: "var(--teal-200)",
          300: "var(--teal-300)",
          400: "var(--teal-400)",
          500: "var(--teal-500)",
          600: "var(--teal-600)",
          700: "var(--teal-700)",
          800: "var(--teal-800)",
          900: "var(--teal-900)",
          950: "var(--teal-950)",
        },

        // 16. Transparent
        trans: {
          cyan: "var(--trans-cyan)",
          error: "var(--trans-error)",
          grey: "var(--trans-grey)",
          indigo: "var(--trans-indigo)",
          info: "var(--trans-info)",
          light: "var(--trans-light)",
          orange: "var(--trans-orange)",
          pink: "var(--trans-pink)",
          primary: "var(--trans-primary)",
          purple: "var(--trans-purple)",
          secondary: "var(--trans-secondary)",
          success: "var(--trans-success)",
          teal: "var(--trans-teal)",
          warning: "var(--trans-warning)",
        },

        // 17. Warning
        warning: {
          100: "var(--warning-100)",
          200: "var(--warning-200)",
          300: "var(--warning-300)",
          400: "var(--warning-400)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
          700: "var(--warning-700)",
          800: "var(--warning-800)",
          900: "var(--warning-900)",
          950: "var(--warning-950)",
        },
        
        // Standard Mappings
        primary: {
          DEFAULT: "var(--brand-primary)",
          foreground: "var(--brand-white)",
        },
        secondary: {
          DEFAULT: "var(--brand-secondary)",
          foreground: "var(--brand-dark)",
        },
        destructive: {
          DEFAULT: "var(--error-500)",
          foreground: "var(--brand-white)",
        },
        muted: {
          DEFAULT: "var(--grey-100)",
          foreground: "var(--grey-500)",
        },
        accent: {
          DEFAULT: "var(--grey-100)",
          foreground: "var(--brand-dark)",
        },
        popover: {
          DEFAULT: "var(--brand-white)",
          foreground: "var(--brand-dark)",
        },
        card: {
          DEFAULT: "var(--brand-white)",
          foreground: "var(--brand-dark)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;