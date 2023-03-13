/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(gray|sky|red|orange|yellow|lime|green|indigo|fuchsia)-(300|400|500)\/30/,
    },
    {
      pattern: /border-(gray|sky|red|orange|yellow|lime|green|indigo|fuchsia)-(300|400|500)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
