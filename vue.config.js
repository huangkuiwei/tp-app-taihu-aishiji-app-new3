module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],

  devServer: {
    proxy: {
      '/api': {
        target: 'https://mhy.colmiao.com',
        changeOrigin: true,
      },
    },
    port: 8090,
  },
};
