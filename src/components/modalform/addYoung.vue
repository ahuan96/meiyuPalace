<template>
  <el-dialog width="480px" title="新增少年宫老师" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="110px"
      :model="formData"
      :rules="rules">
      <el-form-item label="选择学科" prop="subject"
        v-if="rules.subject">
        <el-radio-group size="medium"
          v-model="formData.subject">
          <el-radio-button
            :key="v.id"
            :label="v.id"
            v-for="v of rules.subject[2]['list']"
            v-if="v.id !== '-2'">{{v.name}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="课程类别" prop="category">
        <el-col
          :span="20">
          <el-input type="text"
          v-model="formData.category" placeholder="例如：古筝、舞蹈、书法等"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="老师姓名" prop="name">
        <el-col
          :span="20">
          <el-input type="text"
          v-model="formData.name"></el-input>
        </el-col>
      </el-form-item>
        <el-form-item label="联系电话" prop="tel">
        <el-col
          :span="20">
          <el-input type="text"
          v-model="formData.tel"></el-input>
        </el-col>
      </el-form-item>
       <el-form-item label="身份证号" prop="idcard">
        <el-col
          :span="20">
          <el-input type="text"
          v-model="formData.idcard"></el-input>
        </el-col>
      </el-form-item>
       <el-form-item label="个人简介"  prop="synopsis">
        <el-col
          :span="20">
          <el-input type="textarea"
          v-model="formData.synopsis"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-col
          :span="20">
          <el-input type="password"
          v-model="formData.password"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="确认密码" prop="pwd2">
        <el-col
          :span="20">
          <el-input type="password"
          v-model="formData.pwd2"></el-input>
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
        post: 'admin/add_teacher/',
        post2: 'palace_teacher/do_save/'
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
      console.log(this.formRule)
      this.setFormDetails(this.formRule)
      console.log(this.rules)
      this.toggleShow()
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
        if (this.formData.password !== this.formData.pwd2) {
          this.$err('密码输入不一致')
          return
        }

        // 提交
        let $rt = null
        console.log(this.formData)
        $rt = this.$post(submit.post2, this.formData)
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
