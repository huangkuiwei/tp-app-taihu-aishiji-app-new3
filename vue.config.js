module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],

  devServer: {
    proxy: {
      '/api': {
        target: 'https://fandaapi.cshuz.cn',
        changeOrigin: true,
      },
    },
    port: 8090,
  },
};
