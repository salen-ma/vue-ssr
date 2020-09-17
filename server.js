const fs = require('fs')
const express = require('express')
const setupDevServer = require('./build/setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')

const server = express()
server.use('/dist', express.static('./dist'))

const isProd = process.env.NODE_ENV === 'production'
let renderer
let onReady
if (isProd) {
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')

  renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })
} else {
  // 开发模式需要监听变化自动构建 -> 重新生成 Renderer 渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false, // 推荐
      template, // （可选）页面模板
      clientManifest // （可选）客户端构建 manifest
    })
  })
}

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      url: req.url
    })

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(html)
  } catch (err) {
    res.status(500).end('Internal Server Error')
  }
}

// 在服务器处理函数中……
server.get('*', isProd
  ? render
  : async (req, res) => {
    // 等待 Renderer 渲染器生成完毕，调用 render 进行渲染
    await onReady
    render(req, res)
  }
)

server.listen(3000, () => {
  console.log('server running at port 3000')
})
