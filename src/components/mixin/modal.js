export default {
  components: {
  },
  props: [
  ],
  data () {
    return {
      isShowing: false // 模态框显示状态
    }
  },
  computed: {
  },
  methods: {
    /**
     * [toggleShow 切换显示状态]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toggleShow (_params) {
      this.isShowing = !this.isShowing
      this._params = _params
    }
  },
  created () {
  },
  mounted () {
  }
}
