<template>
  <div>
    <h1>Post List</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PostList',
  metaInfo: {
    title: 'Posts'
  },

  // ssr 生命周期函数
  serverPrefetch () {
    return this.fetchPosts()
  },

  computed: {
    ...mapState(['posts'])
  },

  methods: {
    ...mapActions(['fetchPosts'])
  }
}
</script>

<style>

</style>
