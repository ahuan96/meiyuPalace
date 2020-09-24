<template>
  <div class="app" id="app"
    v-if="loading">
    <div class="container">
      <ys-navigator
        v-if="flag"
        v-on:_hrefTo="hrefTo"
        v-on:_pathTo="pathTo"></ys-navigator>

      <div class="contain">
        <iframe id="oldpages" name="oldpages" scrolling="auto" frameborder="no"
          :src="iframe"
          v-if="iframe"></iframe>
        <div class="transition"
          v-else>
          <transition name="fade" mode="out-in">
            <router-view
              v-on:_hrefTo="hrefTo"
              v-on:_pathTo="pathTo" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  props: [
  ],
  data () {
    return {
      loading: true, // 用户信息加载状态
      iframe: false, // 兼容旧代码模块
      flag: false
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    /**
     * [initApp 初始化APP]
     * @return {[]} []
     */
    initApp () {
      window.Global.urlsets = this.hrefTo
      let user = sessionStorage.getItem('user')
      window.Global.user = JSON.parse(user)
      console.log('Global', window.Global)
      // this.askDatas()
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas () {
      let $rt = this.$get('v2/ajaxworkbench', {})
      $rt.then((rt) => {
        // 用户信息
        const info = rt.data.user_info

        let arr = []
        if (info.teacher_style === '1') {
          arr = [{ id: '1', name: '音乐' }]
        } else if (info.teacher_style === '2') {
          arr = [{ id: '2', name: '美术' }]
        } else {
          arr = [{ id: '1', name: '音乐' }, { id: '2', name: '美术' }]
        }

        const datas = window.Global.database
        datas.userAccount = info.login_account
        datas.userPower = info.is_admin
        datas.userName = info.teacher_name
        datas.userType = arr
        datas.userScore = info.integral
        datas.school_id = info['school_id']
        datas.schoolName = info.school_name
        datas.cityCode = info.city_code
        datas.cityName = this.$cityname(info.city_code)
        datas.roomSum = info.total_room.toString()
        datas.studentSum = info.total_student.toString()
        datas.loginTime = info.time

        this.loading = true // 加载完成
      }).catch((rt) => {
      })
    },
    /**
     * [hrefTo 连接跳转]
     * @param  {[String]} href [路由]
     * @return {[]} []
     */
    hrefTo (href) {
      this.iframe = this.url + href
    },

    /**
     * [hrefTo 视图跳转]
     * @param  {[String]} path [视图名]
     * @return {[]} []
     */
    pathTo (path) {
      console.log(1, path)
      this.iframe = false
      console.log(2, this.iframe)

      this.$router.push({
        name: path
      }).catch(data => {})
      console.log(3)
    },

    beforeunloadHandler (e) {
      console.log(111, e)
    }
  },
  created () {
    console.log(11)
    let $rt = this.$get('palace_teacher/details', {})
    // 用户信息
    $rt.then(rt => {
      console.log(12)
      const info = rt.data.details
      window.Global.userinfo = info
      console.log('info', info, window.Global.userinfo)
      this.flag = true
    })
  },
  mounted () {
  }
}
</script>
