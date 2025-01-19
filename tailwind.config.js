module.exports = {
  content: ["./index.html", "./web/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'sage-green': '#8aaf9c',
      },
      keyframes: {
        "app-logo-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "app-logo-spin": "app-logo-spin infinite 20s linear",
      },
    },
  },
  plugins: [],
};
