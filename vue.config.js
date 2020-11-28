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
};
