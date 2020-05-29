<template>
  <el-dialog width="480px" title="评分" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="90px" :disabled='true'>
      <el-form-item label="录入分数">
        <el-col
          :span="24">
          <el-input
            v-model="formData.teacher_point"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="评语">
        <el-col
          :span="24">
          <el-input type="textarea"
            v-model="formData.teacher_remark"></el-input>
        </el-col>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <template>
        <el-button type="primary"
          @click="close">关 闭</el-button>
        <!-- <el-button type="info"
          @click="toggleShow()">取 消</el-button> -->
      </template>
    </span>
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
      params: { } // 参数
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
    },

    /**
     * [submitForm 关闭弹框]
     * @return {[]} []
     */
    close () {
      this.toggleShow()
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
