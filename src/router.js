import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ './pages/Home.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ './pages/About.vue')
      },
      {
        path: '*',
        name: 'Error404',
        component: () => import(/* webpackChunkName: "about" */ './pages/404.vue')
      }
    ]
  })
}
