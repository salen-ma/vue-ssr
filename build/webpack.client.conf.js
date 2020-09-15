const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js'
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bowser_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },

  // 将 webpack 运行时分离到一个引导 chunk 中
  // 以便于之后正确注入异步 chunk
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity
    }
  },

  plugins: [
    new VueSSRClientPlugin()
  ]
})
