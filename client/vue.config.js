const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: "/",
  configureWebpack: {
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
    },
  },
  // proxy 설정
  devServer: {
    proxy: {
      '/lookup/proxy': {
        target: 'http://lims.geneinsight.com',
        changeOrigin: true,
        pathRewrite: { '^/lookup/proxy': '' },
        secure: false,
        logLevel: 'debug'
      },
    }
  }
})
