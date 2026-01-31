import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/onborda/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode base colors (dark mode uses dark: prefix)
        background: {
          DEFAULT: '#f6f7f8',
          dark: '#090909',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0c0c0c',
        },
        border: {
          DEFAULT: 'rgba(8, 11, 16, 0.1)',
          dark: 'rgba(255, 255, 255, 0.12)',
        },
        // "dark" color is the main text color (confusing name but matches existing usage)
        dark: {
          DEFAULT: 'rgba(8, 11, 16, 0.92)',
          light: '#ededed', // Used in dark mode
        },
        'text-muted': {
          DEFAULT: 'rgba(8, 11, 16, 0.6)',
          dark: 'rgba(237, 237, 237, 0.65)',
        },
        // Brand colors (same in both modes)
        base: '#2DA355',
        accent: '#57BF7A',
        'base-hover': 'rgba(54, 180, 96, 0.6)',
        // Status colors
        success: {
          DEFAULT: '#16a34a',
          dark: '#22c55e',
        },
        error: {
          DEFAULT: '#dc2626',
          dark: '#ef4444',
        },
        warning: {
          DEFAULT: '#d97706',
          dark: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
