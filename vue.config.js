module.exports = {
  devServer: {
    proxy: {
      "/graphql": {
        target: process.env.VUE_APP_GRAPHQL_LOCAL_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/graphql": "",
        },
      },
    },
  },
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true,
    },
  },
  pwa: {
    name: "My Chat App",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "dev/sw.js",
      // ...other Workbox options...
    },
  },
};
