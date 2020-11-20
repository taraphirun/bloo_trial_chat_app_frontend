module.exports = {
  devServer: {
    proxy: {
      // proxy all requests starting with /api to jsonplaceholder
      "/api": {
        target: "http://localhost:4000/graphql",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
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
