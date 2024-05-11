export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],

  theme: {
    extend: {},
    fontFamily: {
      bitter: ["Bitter", "serif"],
      ubuntu: ["Ubuntu", "sans-serif"],
      sacramento: ["Sacramento", "sans-serif"],
    },
  },
  plugins: [],
};
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        bitter: ["Bitter", "serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
        sacramento: ["Sacramento", "sans-serif"],
      },
    },
  },
};
