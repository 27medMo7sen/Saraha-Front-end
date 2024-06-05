export default defineNuxtConfig({
  alias: {
    assets: "/<rootDir>/assets",
  },
  css: ["~/assets/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@vueuse/nuxt",
    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],
});
