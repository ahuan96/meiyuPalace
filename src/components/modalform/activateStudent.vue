<template>
  <el-dialog width="720px" title="开通学生端" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="110px"
      :model="formData"
      :rules="rules">
      <el-row>
        <el-col
          :span="11">
          <el-form-item label="系统学号" prop="student_no">
            <el-input type="text"
            v-model="formData.system_no"></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="11">
          <el-form-item label="手机号" prop="home_mobile">
            <el-input type="text"
            v-model="formData.mobile"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

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
import { mapGetters } from 'vuex'
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
        info: '',
        post: 'meiyu/compatibleBindSystemNo/'
      }
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'xueduan', 'nianji', 'xingbie'
    ])
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial () {
      this.askDatas(() => {
        setTimeout(() => {
          this.toggleShow()
        })
      })
    },
    askDatas (cbk) {
      // console.log()
      // let $rt = this.$get('meiyu/getOrganization/', this.params)
      // $rt.then((rt) => {
      //   // 学生数据
      //   this.items = rt.data.studentList
      //   this.cnt = rt.data.cnt
      //   this.size = rt.data.pagesize
      //   this.org_id = rt.data.data.id
      //   for (let item of this.items) {
      //     let i = this.items.indexOf(item)
      //     this.items[i].grade = this.items[i].grade + '年级'
      //   }
      //   cbk()
      // }).catch((rt) => {
      // })
      cbk()
    },
    /**
     * [submitForm 提交表单]
     * @param  {[String]} form [表单]
     * @param  {[Object]} submit [提交方向]
     * @return {[]} []
     */
    submitForm (form, submit) {
      this.$refs[form].validate((valid) => {
        if (!valid) return false

        // 提交
        let $rt = this.$get(submit.post, this.formData)
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
