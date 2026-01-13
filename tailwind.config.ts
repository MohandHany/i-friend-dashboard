module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#0066FF",
        "dark-blue": "#030712",
        "light-blue": "#0E1521",
        "natural": "#666C76",
      },
      fontFamily: {
        sans: ["var(--font-lexend)", "sans-serif"],
      },
    },
  },
  plugins: [],
};