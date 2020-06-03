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
  // Vue.prototype.cookie = '2680dVQAvQ2p6S8VgSlF8JZtbbjJz6eU0XJAyJKkVoQSvjo'
  // var user = {
  //   id: '3',
  //   level: '2',
  //   name: '赵老师',
  //   subject: '1',
  //   tel: '15879168001',
  //   school_id: '15',
  //   username: 'p5521498'
  // }
  Vue.prototype.cookie = '9e5dIGEjTrBpvWcC1gxFhcBBHEilpjMAYutllecgJahIDYYS'
  var user = {
    id: '15',
    level: '1',
    name: '少年宫老师',
    subject: '3',
    tel: '18812345678',
    school_id: '15',
    username: 'p4297940'
  }
  sessionStorage.setItem('user', JSON.stringify(user))
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
    const loginUrl = 'http://test.laoshi.xinzhimeiyu.com/login/palace'
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
