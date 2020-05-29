import { mapGetters } from 'vuex'

export default {
  components: {
  },
  props: [
  ],
  data () {
    return {
      rules: {} // 表单验证规则
    }
  },
  computed: {
    ...mapGetters([
      'biaodan'
    ])
  },
  methods: {
    /**
     * [askDatas 请求数据]
     * @param  {[Function]} cbk [回调函数]
     * @return {[]} []
     */
    askDatas (cbk) {
      let col = this.formSubmit.column

      if (!col) col = ''

      if (!this.formData[col + 'id']) {
        if (cbk) cbk()
        return
      }

      const params = {}
      params[col + 'id'] = this.formData[col + 'id']

      let $rt = this.$get(this.formSubmit.info, params)
      $rt.then((rt) => {
        const keys = Object.keys(this.formData)
        for (let k of keys) {
          if (rt.data[k]) this.formData[k] = rt.data[k]
        }

        if (cbk) cbk()
      }).catch((rt) => {
      })
    },

    /**
     * [setFormDetails 设置表单内容细节]
     * @param  {[Object]} datas [表单验证]
     * @return {[]} []
     */
    setFormDetails (datas) {
      const keys = Object.keys(this.formData)
      keys.splice(0, 1)

      for (let k of keys) {
        let i = keys.indexOf(k)
        let d = datas[i]
        this.rules[k] = []

        Object.assign(this.rules[k], this.biaodan[d[0]])
        this.rules[k].push(d[1])
      }
    },

    /**
     * [cancelForm 取消表单]
     * @return {[]} []
     */
    cancelForm () {
      this.$router.back(-1)
    },

    /**
     * [setCityCode 城市编码]
     * @param  {[Array]} codes [编码列表]
     * @return {[]} []
     */
    setCityCode (codes) {
      this.formData.citycode = codes[0].toString()
    }
  },
  created () {
  },
  mounted () {
  }
}
