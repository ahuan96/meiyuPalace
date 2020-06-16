<template>
  <ul class="navigater" oncontextmenu="return false" onselectstart="return false">
    <li
      :key="item.id"
      v-for="item of items">
      <el-tooltip class="item" effect="light" placement="right"
        v-if="item.child">
        <div class="navigater-lnk" slot="content">
          <a
            :key="it.id"
            :class="it.style"
            @click.stop="lnkChange(item, it)"
            v-html="it.name"
            v-for="it of item.child"
            v-if="it.name !== '老师管理' || (it.name === '老师管理' && isadmin === '管理员')"></a>
        </div>
        <el-button
          :class="item.id + ' ' + item.style"
          @click="navChange(item)">{{item.name}}</el-button>
      </el-tooltip>
      <el-button
        :class="item.id + ' ' + item.style"
        @click="navChange(item)"
        v-else>{{item.name}}</el-button>
    </li>
  </ul>
</template>

<script>
export default {
  components: {
  },
  props: [
  ],
  data () {
    return {
      // 控制器数据列表
      items: [
        {
          id: 'nav4',
          name: '老师管理',
          type: '_pathTo',
          path: 'TeacherAdmin',
          style: 'active'
        },
        {
          id: 'nav5',
          name: '社团小组',
          type: '_pathTo',
          path: 'GroupAdmin',
          style: ''
        }
      ],

      isadmin: window.Global.database.userPower // 是否管理角色
    }
  },
  watch: {
    $route (to) {
      console.log(1, to)
    }
  },
  computed: {
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial () {
      // console.log(0, this.$route)
    },

    /**
     * [navChange 导航切换]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    navChange (item) {
      this.clearStyle()
      this.$emit(item.type, item.path)

      item.style = 'active'
      if (item.child) {
        for (let it of item.child) {
          if (it.default) {
            it.style = 'active'
          }
        }
      }
    },

    /**
     * [lnkChange 连接切换]
     * @param  {[Object]} item [元素数据]
     * @param  {[Object]} it [子元素数据]
     * @return {[]} []
     */
    lnkChange (item, it) {
      this.clearStyle()
      this.$emit(it.type, it.path)

      item.style = 'active'
      it.style = 'active'
    },

    /**
     * [clearStyle 清除样式]
     * @return {[]} []
     */
    clearStyle () {
      for (let item of this.items) {
        item.style = ''
        if (item.child) {
          for (let it of item.child) {
            it.style = ''
          }
        }
      }
    }
  },
  created () {
    console.log('nav')
    this.initial()
  },
  mounted () {
    let userInfo = JSON.parse(localStorage.getItem('user'))
    if (userInfo.level === '1') {
      let item = this.items[0]
      item.path = 'MasterAdmin'
      this.$set(this.items, 0, item)
    }
  }
}
</script>
