// VUE
import Vue from 'vue'

// 依赖库
import Vuex from 'vuex'
import Element from 'element-ui'
import FastClick from 'fastclick'
import Echarts from 'echarts'
import VueClipboard from 'vue-clipboard2'

// 方法库
import { post, get, err } from '@/lib/axios'
import { setcookie, getcookie } from '@/lib/cookie'
import { timeformat, numformat } from '@/lib/app'
import { cityname, citylevel } from '@/lib/city'

// 封装库
import App from '@/App'
import store from '@/store/index'
import router from '@/router'

// 组件库
import ysHeader from '@/components/header'
import ysNavigator from '@/components/navigator'
import ysSearch from '@/components/search'
import ysPage from '@/components/page'
import ysStickyBox from '@/components/stickyBox'
import ysCityChoose from '@/components/cityChoose'

import ysModalFile from '@/components/modalFile'
import ysModalConfirm from '@/components/modalConfirm'

// 样式库
import 'element-ui/lib/theme-chalk/index.css'
import '@/sass/core.sass'
import 'echarts/theme/macarons.js'

// 依赖库设置
Vue.use(Vuex)
Vue.use(Element)
FastClick.attach(document.body)
Vue.prototype.$echarts = Echarts
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

// 方法库设置
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$err = err
Vue.prototype.$setcookie = setcookie
Vue.prototype.$getcookie = getcookie
Vue.prototype.$timeformat = timeformat
Vue.prototype.$numformat = numformat
Vue.prototype.$cityname = cityname
Vue.prototype.$citylevel = citylevel

// 组件库设置
Vue.component('ysHeader', ysHeader)
Vue.component('ysNavigator', ysNavigator)
Vue.component('ysSearch', ysSearch)
Vue.component('ysPage', ysPage)
Vue.component('ysStickyBox', ysStickyBox)
Vue.component('ysCityChoose', ysCityChoose)

Vue.component('ysModalFile', ysModalFile)
Vue.component('ysModalConfirm', ysModalConfirm)

// 全局变量设置
const href = window.location.href
if (href.indexOf('localhost') > -1) {
  Vue.prototype.url = 'http://test.laoshi.xinzhimeiyu.com/'
  Vue.prototype.cookie = '9e5dIGEjTrBpvWcC1gxFhcBBHEilpjMAYutllecgJahIDYYS'
  // Vue.prototype.cookie = '1f29O6nxYO7hjMqTZvanxQJmzSvEuTf%2Bl7p%2BOu9SzmbFKxU'

  // Vue.prototype.cookie = '10aeWXuDdQ2wQfAskg6DghUh8b9WLKzZnS7pKipl6QgtoYI'

  // Vue.prototype.cookie = '3a11v5EWc6hKMEpJbasuOTYT63oGD7hwKuj7UglrKx%2Bv3FYs'
  // Vue.prototype.cookie = '48e4um1KPge4zkGx5fReVat5dycEMco8Q%2FJNnHUzK57cHK9N'
  // Vue.prototype.cookie = '053do4MV%2FUrhPhlbSZabvPgNxxS9Tbcns7x5aOo%2F5hBf0Wk'
  // Vue.prototype.cookie = 'c89bCT889wTVo%2FxbKMBV2xYDev%2F3bCODd%2Flxq5VZCDCvwrM'
} else if (href.indexOf('test') > -1) {
  Vue.prototype.url = 'http://test.laoshi.xinzhimeiyu.com/'
  Vue.prototype.cookie = getcookie('test_p_token')
} else {
  Vue.prototype.url = 'http://laoshi.xinzhimeiyu.com/'
  Vue.prototype.cookie = getcookie('release_p_token')
}

// 路由检测
router.beforeEach((to, from, next) => {
  if (!Vue.prototype.cookie) {
    let loginUrl = Vue.prototype.url + 'login/palace'
    window.location.href = loginUrl
    return
  }

  next()
})

/* eslint-disable no-new
 */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
