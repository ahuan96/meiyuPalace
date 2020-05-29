export default {
  components: {
  },
  props: [
    'tableData', 'tableDetail'
  ],
  data () {
    return {
      items: [], // 数据
      cnt: 0, // 总数
      size: 20 // 单页数目
    }
  },
  computed: {
  },
  methods: {
    /**
     * [askDatas 请求数据]
     * @param  {[Function]} cbk [回调函数]
     * @return {[]} []
     */
    askDatas (cbk) {
      let col = this.tableDetail.column
      if (!col) col = ''

      const params = {}
      Object.assign(params, this.params)
      if (this.tableData[col + 'id']) {
        params[col + 'id'] = this.tableData[col + 'id']
      }

      let $rt = this.$get(this.tableDetail.info, params)
      $rt.then((rt) => {
        this.items = rt.data.list
        this.cnt = rt.data.cnt
        this.size = rt.data.size

        if (cbk) cbk()
      }).catch((rt) => {
      })
    },

    /**
     * [pageChange 切换页码]
     * @param  {[Int]} p [页码]
     * @return {[]} []
     */
    pageChange (p) {
      this.params.page = p
      this.askDatas()
    },

    /**
     * [submitTable 提交表格]
     * @return {[]} []
     */
    submitTable () {
      this.$emit('tableCalBak')
      this.toggleShow()
    }
  },
  created () {
  },
  mounted () {
  }
}
