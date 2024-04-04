/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#36acac",
        "secondary-blue": "#2a7599",
        "primary-purple": "#ecabf2",
        "secondary-purple": "#9643cc",
      },
    },
  },
  plugins: [],
};
