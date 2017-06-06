import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component(resolve) {
        require(['@/components/index'], resolve)
      },
    },
    {
      path: '/login',
      name: 'Login',
      component(resolve) {
        require(['@/components/login'], resolve)
      },
    },
    {
      path: '/signup',
      name: 'signUp',
      component(resolve) {
        require(['@/components/signup'], resolve)
      },
    },
    {
      path: '/about',
      name: 'About',
      component(resolve) {
        require(['@/components/about'], resolve)
      },
    },
    {
      path: '/result',
      name: 'Result',
      component(resolve) {
        require(['@/components/result'], resolve)
      },
    },
    {
      path: '/articles',
      component(resolve) {
        require(['@/components/article/index'], resolve)
      },
      name: 'ArticleIndex',
      children: [
        {
          path: 'list/:categoryId',
          component(resolve) {
            require(['@/components/article/list'], resolve)
          },
          name: 'ArticleList',
        },
        {
          path: 'content/:contentId',
          component(resolve) {
            require(['@/components/article/content'], resolve)
          },
          name: 'ArticleContent',
        },
      ],
    },
    {
      path: '/admin',
      component(resolve) {
        require(['@/components/admin/index'], resolve)
      },
      name: 'AdminIndex',
      children: [
        {
          path: 'articles',
          component(resolve) {
            require(['@/components/admin/articles'], resolve)
          },
          name: 'AdminArticles',
        },
        {
          path: 'category',
          component(resolve) {
            require(['@/components/admin/category'], resolve)
          },
          name: 'AdminCategory',
        },
        {
          path: 'carousel',
          component(resolve) {
            require(['@/components/admin/carousel'], resolve)
          },
          name: 'AdminCarousel',
        },
        {
          path: 'about',
          component(resolve) {
            require(['@/components/admin/about'], resolve)
          },
          name: 'AdminAbout',
        },
      ],
    },
    {
      path: '/hello',
      name: 'Hello',
      component(resolve) {
        require(['@/components/hello'], resolve)
      },
    },
  ],
})
