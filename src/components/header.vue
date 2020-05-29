<template>
  <div class="header" oncontextmenu="return false" onselectstart="return false">
    <a class="logo" href="/index/newtmpl/"></a>
    <h1
      v-html="doc"></h1>
    <div class="more">
      <span
        v-html="'欢迎您：' + datas.userName"></span>
      <span
        v-html="'今天是：' + dates"></span>
      <a
        @click="loginOut">退出</a>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: [
  ],
  data () {
    return {
      datas: window.Global.database, // 老师信息
      dates: this.$timeformat((new Date().getTime() / 1000), 1), // 当前日期

      doc: '【' // 标题文档
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial () {
      this.setHeader()
    },

    /**
     * [setHeader 设置网页标题]
     * @return {[]} []
     */
    setHeader () {
      // 处理地区名
      const area = ['北京', '天津', '上海', '重庆', '雄安']
      const city = window.Global.database.cityName
      const cityArr = city.split(' ')

      if (area.indexOf(cityArr[0]) > -1) {
        this.doc += cityArr[0] + '市 '
      } else {
        this.doc += cityArr[1] + '市 '
      }

      // 处理学校名
      this.doc += window.Global.database.schoolName + '】' + document.title

      document.title = this.doc
    },

    /**
     * [loginOut 退出登录]
     * @return {[]} []
     */
    loginOut () {
      const loginUrl = this.url.replace('laoshi', 'login')
      location.href = loginUrl
    }
  },
  created () {
    this.initial()
  },
  mounted () {
  }
}
</script>
