const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const webpack = require('webpack')
const resolve = file => path.resolve(__dirname, file)

module.exports = (server, callback) => {
  let ready
  const onReady = new Promise(r => ready = r)

  // 监视构建，更新 Renderer

  let serverBundle
  let template
  let clientManifest

  const updated = () => {
    if (serverBundle && template && clientManifest) {
      ready()
      console.log('ready')
      callback(serverBundle, template, clientManifest)
    }
  }

  // 监视构建 template
  const templatePath = resolve('../index.template.html')
  template = fs.readFileSync(templatePath, 'utf-8')
  updated()
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    updated()
  })

  // 监视构建 serverBundle
  const serverConfig = require('./webpack.server.conf')
  const serverCompiler = webpack(serverConfig)
  serverCompiler.watch({}, (err, stats) => {
    // webpack 打包有错误
    if (err) throw err
    // 打包结果有错误
    if (stats.hasErrors()) return
    serverBundle = JSON.parse(
      fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    )
    updated()
  })

  // 监视构建 clientManifest
  const clientConfig = require('./webpack.client.conf')
  const clientCompiler = webpack(clientConfig)
  clientCompiler.watch({}, (err, stats) => {
    // webpack 打包有错误
    if (err) throw err
    // 打包结果有错误
    if (stats.hasErrors()) return
    clientManifest = JSON.parse(
      fs.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
    )
    updated()
  })

  return onReady
}
