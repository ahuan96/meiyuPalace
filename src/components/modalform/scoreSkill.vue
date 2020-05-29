<template>
  <el-dialog width="480px" title="评分" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="90px">
      <el-form-item label="录入分数">
        <el-col
          :span="24">
          <el-input
            v-model="params.score"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="评语">
        <el-col
          :span="24">
          <el-input type="textarea"
            v-model="params.comment"></el-input>
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
      params: { score: '', comment: '' } // 参数
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
      let re = /^[0-9|10]$/
      if (!re.test(this.params.score)) {
        this.$err('请输入0-10的整数')
        return
      }
      let $rt = this.$post('student_certificate/set_score/', this.params)
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
