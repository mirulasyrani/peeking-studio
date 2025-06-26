/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        newsreader: ['"Newsreader"', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  variants: {
    extend: {
      display: ['print'], // Enable print variant for display utilities
    },
  },
};
