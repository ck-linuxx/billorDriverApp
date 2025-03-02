const { Colors } = require('./src/themes/Colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: Colors
    },
  },
  plugins: [],
  darkMode: "class",
}

