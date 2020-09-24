<template>
  <el-dialog width="480px" title="少年宫老师信息" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="110px"
      :model="formData"
      :disabled='true'
      :rules="rules">
      <el-form-item label="选择学科" prop="subject"
        >
        <el-radio-group size="medium"
          v-model="formData.subject">
          <el-radio-button
            :key="v.id"
            :label="v.id"
            v-for="v of formRule[0][1]['list']"
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

      <el-form-item label="课程类别" prop="category">
        <el-col
          :span="20">
          <el-input type="text"
          v-model="formData.category"></el-input>
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
    </el-form>

    <span slot="footer">
      <template>
        <el-button type="primary"
          @click="toggleShow()">确定</el-button>
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
      let url = 'palace_teacher/details'
      let params = {
        admin_id: this.formData.admin_id,
        id: this.formData.admin_id
      }
      console.log('hhh')
      let $rt = this.$get(url, params)
      $rt.then((rt) => {
        console.log(rt)
        Object.assign(this.formData, rt.data.details)
      })
      // this.askDatas()
      // this.setFormDetails(this.formRule)
      console.log(this.formData)
      setTimeout(() => {
        this.toggleShow()
      })
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>
