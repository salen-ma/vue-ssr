const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
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
  const serverDevMiddleware = devMiddleware(serverCompiler, {
    logLevel: 'silent' // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
  })

  // 每次构建结束触发
  serverCompiler.hooks.done.tap('server', () => {
    serverBundle = JSON.parse(
      serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    )
    updated()
  })

  // 监视构建 clientManifest
  const clientConfig = require('./webpack.client.conf')
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新的客户端脚本
    clientConfig.entry.app
  ]
  clientConfig.output.filename = '[name].js' // 热更新模式下需要确保 hash 一致

  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath, // 构建输出中的请求前缀路径
    logLevel: 'silent' // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
  })
  clientCompiler.hooks.done.tap('server', () => {
    clientManifest = JSON.parse(
      clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
    )
    updated()
  })

  // 使用 clientDevMiddleware 作为 express 服务中间件，提供其对内存中数据的访问能力
  server.use(clientDevMiddleware)
  server.use(hotMiddleware(clientCompiler, {
    log: false,
  }));

  return onReady
}
