<template>
  <el-dialog width="480px" title="驳回" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="90px">
      <el-form-item label="驳回原因">
        <el-col
          :span="24">
          <el-input type="textarea"
            v-model="params.content"></el-input>
        </el-col>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <template>
        <el-button type="primary"
          @click="submitForm('elform')">发 送</el-button>
        <el-button type="info"
          @click="toggleShow()">取 消</el-button>
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
      params: { content: '' } // 参数
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
      Object.assign(this.params, this.formData)
      this.toggleShow()
    },

    /**
     * [submitForm 提交表单]
     * @return {[]} []
     */
    submitForm () {
      let $rt = this.$post('student_certificate/reject/', this.params)
      $rt.then((rt) => {
        this.$emit('formCalBak')
        this.toggleShow()
      }).catch((rt) => {
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
