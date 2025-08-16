export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    screens: {
      xs: "360px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      container: { center: true, padding: { DEFAULT: "12px", md: "16px" } },
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Inter', 'Manrope', 'Helvetica', 'Arial', 'sans-serif'],
      },
    }
  },
  plugins: [],
};
