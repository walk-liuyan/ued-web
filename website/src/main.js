import axios from 'axios'
import AV from 'leancloud-storage/dist/av-min'
import iView from 'iview'
import Moment from 'moment'
import Vue from 'vue'
import VueSimplemde from 'vue-simplemde'
import showdown from 'showdown'
import 'vue2-animate/src/vue2-animate.less'
import './assets/less/custom-theme.less'
import './assets/sass/screen.scss'
import store from './vuex/store'
import App from './App'
import router from './router'
import Config from './assets/config/arguments.config'

const _ = require('lodash')

const converter = new showdown.Converter()

const currentEnv = Config.dev

Moment.locale('zh-CN')

_.assign(window, {
  _,
  Vue,
  store,
  Moment,
  axios,
  AV,
  currentEnv,
  converter,
})

AV.init({
  appId: currentEnv.APP_ID,
  appKey: currentEnv.APP_KEY,
})
axios.defaults.baseURL = 'https://api.github.com'
Vue.config.devtools = currentEnv.testingMode
Vue.use(iView)
Vue.use(VueSimplemde)
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})
router.afterEach(() => {
  iView.LoadingBar.finish()
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})

