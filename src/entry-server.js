import { createApp } from './app'

export default async context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  const { app, router, store } = createApp()
  // 设置服务器端 router 的位置
  router.push(context.url)
  context.meta = app.$meta()

  // 等到 router 将可能的异步组件和钩子函数解析完
  await new Promise(router.onReady.bind(router))
  // 解析完成
  context.rendered = () => {
    // context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
    context.state = store.state
  }
  return app
}
