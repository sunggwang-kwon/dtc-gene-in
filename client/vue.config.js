const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')

function getProxyTarget() {
  if (process.env.DEV_PROXY_TARGET) {
    return process.env.DEV_PROXY_TARGET
  }
  if (fs.existsSync('./.deploy.env')) {
    const envContent = fs.readFileSync('./.deploy.env', 'utf-8')
    const match = envContent.match(/REMOTE_HOST=["']?([^"'\r\n]+)["']?/)
    if (match && match[1]) {
      return `http://${match[1]}`
    }
  }
  return 'http://localhost'
}

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production' ? '/lookup/' : '/',
  configureWebpack: {
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
    },
  },
  // proxy 설정
  devServer: {
    proxy: {
      '/lookup/proxy': {
        target: getProxyTarget(),
        changeOrigin: true,
        pathRewrite: { '^/lookup/proxy': '/lookup' },
        secure: false,
        logLevel: 'debug'
      },
    }
  }
})
