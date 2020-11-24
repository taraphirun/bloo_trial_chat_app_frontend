module.exports = {
  devServer: {
    proxy: {
      // proxy all requests starting with /api to jsonplaceholder
      "/graphql": {
        target: "http://localhost:4000/graphql",
        changeOrigin: true,
        pathRewrite: {
          "^/graphql": "",
        },
      },
      // ws: {
      //   target: "ws://localhost:4000/graphql",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^ws": "",
      //   },
      // },
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
