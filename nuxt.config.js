module.exports = {
  mode: "spa",
  /*
  ** Environment variables
  */
  env: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
  },
  /*
  ** Headers of the page
  */
  head: {
    title: "Speed snitch",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Speed snitch administration"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  css: [
    "normalize.css" // version controlled in package.json
  ],
  /* TODO: how is this used, does it need to stay? (https://nuxtjs.org/api/configuration-loading)
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** plugins
  */
  plugins: [
    "~/plugins/directives.js",
    "~/plugins/admin-api-service.js",
    "~/plugins/filters.js"
  ],
  /*
  ** modules
  */
  modules: ["@nuxtjs/dotenv"],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        });
      }
    },

    /*
    ** Keep page bundles smaller by only including these once, see https://nuxtjs.org/guide/plugins
    */
    vendor: ["axios"]
  }
};
