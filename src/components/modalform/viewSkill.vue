<template>
  <el-dialog width="480px" title="查看评分" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="90px">
      <el-form-item label="录入分数">{{formData.score}}</el-form-item>

      <el-form-item label="评语">{{formData.comment}}</el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import mixmodal from '../mixin/modal'

export default {
  mixins: [mixmodal],
  components: {
  },
  props: [
    'formData'
  ],
  data () {
    return {
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
      this.toggleShow()
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
