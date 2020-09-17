<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <h2>客户端动态交互</h2>
    <div>
      <input v-model="message">
    </div>
    <div>
      <button @click="onClick">点击测试</button>
    </div>
    <nav>
      <router-link to="/">home</router-link> |
      <router-link to="/about">about</router-link> |
      <router-link to="/posts">posts</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      message: 'Vue ssr'
    }
  },
  methods: {
    onClick () {
      console.log('Hello World')
    }
  },
}
</script>

<style>

</style>
