import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      posts: []
    },
    actions: {
      async fetchPosts ({ commit }) {
        // 在服务端渲染期间需要返回 Promise
        const { data } = await axios.get('https://cnodejs.org/api/v1/topics')
        commit('setPosts', data.data)
      }
    },
    mutations: {
      setPosts (state, posts) {
        state.posts = posts
      }
    }
  })
}
