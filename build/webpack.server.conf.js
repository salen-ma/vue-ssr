const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.conf')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  entry: './src/entry-server.js',

  // 允许 webpack 以 node 适用方式处理模块加载
  // 会在编译 Vue 组件时，告知 vue-loader 输送面向服务器代码(server-oriented code)
  target: 'node',

  output: {
    filename: 'server-bundle.js',
    // 告知 server bundle 使用 node 风格导出模块
    libraryTarget: 'commonjs2'
  },

  // 不打包 node_modules 第三方包，保留 require 方式直接加载
  externals: [
    nodeExternals({
      // 配置白名单，白名单内的资源正常打包
      allowlist: [/\.css$/]
    })
  ],

  plugins: [
    // 将服务器整个的输出构建为单个 JSON 文件
    // 默认文件名为 vue-ssr-server-bundle.json
    new VueSSRServerPlugin()
  ]
})
