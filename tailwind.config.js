module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        newsreader: ['"Newsreader"', 'serif'],
      },
    },
  },
  plugins: [],
  // Add this 'variants' section
  variants: {
    extend: {
      display: ['print'], // Enable print variant for display utilities
    },
  },
  plugins: [
  require('@tailwindcss/line-clamp'),
],
};