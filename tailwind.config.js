/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  darkMode: ["class"],
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-soehne)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
      colors: {
        background: 'var(--bg-color)',
        foreground: 'var(--text-color)',
        border: 'var(--border-color)',
        input: 'var(--input-bg-color)',
        ring: 'var(--caret-color)',
        
        primary: {
          DEFAULT: 'var(--main-color)',
          foreground: 'var(--main-color-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--sub-alt-color)',
          foreground: 'var(--sub-color)',
        },
        destructive: {
          DEFAULT: 'var(--error-color)',
          foreground: 'var(--error-color-foreground)',
        },
        muted: {
          DEFAULT: 'var(--sub-alt-color)',
          foreground: 'var(--sub-color)',
        },
        accent: {
          DEFAULT: 'var(--main-color)',
          foreground: 'var(--main-color-foreground)',
        },
        popover: {
          DEFAULT: 'var(--sub-alt-color)',
          foreground: 'var(--text-color)',
        },
        card: {
          DEFAULT: 'var(--sub-alt-color)',  
          foreground: 'var(--text-color)',  
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-bg-color)',
          foreground: 'var(--sidebar-text-color)',
          border: 'var(--sidebar-border-color)',
        }
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "card-appear": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "card-appear": "card-appear 0.5s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-up": "slide-in-up 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "slide-in-down": "slide-in-down 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "slide-in-up": "slide-in-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
