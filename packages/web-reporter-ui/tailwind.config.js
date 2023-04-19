// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${__dirname}/src/**/*.{html,js,ts,jsx,tsx}`,
    `${__dirname}/*.{html,js,ts,jsx,tsx}`,
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        "midnight-blue": "#06182C",
        "navy-blue": "#0F395E",
        "dark-navy-blue": "#0A2540",
        "light-sky-blue": "#1199EE",
        "dark-charcoal": "#131313",
        "light-charcoal": "#1B1B1D",
        "theme-color": { DEFAULT: "var(--theme-color)", 100: "var(--theme-color-100)" },
      },
      boxShadow: {
        glow: "0 0 10px 0 var(--theme-color)",
      },
      backgroundImage: {
        "gradient-radial": `radial-gradient(57.7% 57.7% at 50% 0%, theme(colors.theme-color.100) 0%, rgba(29, 29, 31, 0) 100%)`,
      },
    },
  },
  plugins: []
};
