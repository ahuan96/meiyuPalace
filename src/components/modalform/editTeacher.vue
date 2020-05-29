<template>
  <el-dialog width="480px" title="新增老师" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="110px"
      :model="formData"
      :rules="rules">
      <el-form-item label="选择学科" prop="type"
        v-if="rules.type">
        <el-radio-group size="medium"
          v-model="formData.type">
          <el-radio-button
            :key="v.id"
            :label="v.id"
            v-for="v of rules.type[2]['list']"
            v-if="v.id !== '-2'">{{v.name}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="老师姓名" prop="name">
        <el-col
          :span="20">
          <el-input type="text"
          v-model="formData.name"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="联系电话" prop="mobile">
        <el-col
          :span="20">
          <el-input type="text"
          v-model="formData.mobile"></el-input>
        </el-col>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <template>
        <el-button type="primary"
          @click="submitForm('elform', formSubmit)">确定</el-button>
        <el-button type="info"
          @click="toggleShow()">取消</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import mixmodal from '../mixin/modal'
import mixform from '../mixin/form'

export default {
  mixins: [mixmodal, mixform],
  components: {
  },
  props: [
    'formData', 'formRule'
  ],
  data () {
    return {
      // 表单内容提交
      formSubmit: {
        info: 'admin/get_teacher_info/',
        post: 'admin/reset_teacher_name/',
        column: 'admin_'
      }
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
      console.log(1)
      this.askDatas()
      this.setFormDetails(this.formRule)

      setTimeout(() => {
        this.toggleShow()
      })
    },

    /**
     * [submitForm 提交表单]
     * @param  {[String]} form [表单]
     * @param  {[Object]} submit [提交方向]
     * @return {[]} []
     */
    submitForm (form, submit) {
      this.$refs[form].validate((valid) => {
        if (!valid) {
          return false
        }

        // 提交
        let $rt = this.$post(submit.post, this.formData)
        $rt.then((rt) => {
          this.$refs[form].resetFields()

          this.$emit('formCalBak')
          this.toggleShow()
        }).catch((rt) => {
        })
      })
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>
