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
  try {
    const { execSync } = require('child_process')
    const secretHost = execSync('/home/sgkwon/scripts/get-gcp-secret.mjs DTC_GENE_SFTP_HOST', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (secretHost) {
      const host = secretHost.split(':')[0]
      return `http://${host}`
    }
  } catch (e) {
    // Secret Manager 미연동 환경 폴백
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
