<template>
  <el-dialog width="640px" title="新增班级" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="110px"
      :model="formData"
      :rules="rules">
      <el-row>
        <el-col
          :span="11">
          <el-form-item label="教育阶段" prop="edu_stage">
            <el-select placeholder="选择阶段"
              v-model="formData.edu_stage"
              @change="eduChange">
              <el-option
                :key="it.id"
                :label="it.name"
                :value="it.id"
                v-for="it in rules.edu_stage[2]['list']"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="11">
          <el-form-item label="年级信息" prop="year">
            <el-select placeholder="选择年级"
              v-model="formData.year">
              <el-option
                :key="it.id"
                :label="it.name"
                :value="it.id"
                v-for="it in rules.year[2]['list']"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col
          :span="11">
          <el-form-item label="班级信息" prop="name">
            <el-select placeholder="选择班级"
              v-model="formData.name">
              <el-option
                :key="it.id"
                :label="it.id"
                :value="it.id"
                v-for="it in rules.name[2]['list']"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="11">
          <el-form-item label="班级备注" prop="remark">
            <el-input type="text"
              v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col
          :span="11">
          <el-form-item label="音乐老师" prop="music_teacher_id">
            <el-select placeholder="选择老师"
              v-model="formData.music_teacher_id">
              <el-option
                :key="it.id"
                :label="it.name"
                :value="it.id"
                v-for="it in rules.music_teacher_id[2]['list']"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="11">
          <el-form-item label="美术老师" prop="art_teacher_id">
            <el-select placeholder="选择老师"
              v-model="formData.art_teacher_id">
              <el-option
                :key="it.id"
                :label="it.name"
                :value="it.id"
                v-for="it in rules.art_teacher_id[2]['list']"></el-option>
            </el-select>
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
        info: 'v2z/classEdit/',
        post: 'classadmin/set_room/'
      }
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'xueduan', 'nianji'
    ])
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial () {
      this.askDatas(() => {
        this.setFormDetails(this.formRule)

        setTimeout(() => {
          this.formData.edu_stage = this.formData.edu_stage.toString()
          this.formData.edu_stage = this.formData.edu_stage.toString()

          this.eduChange(this.formData.edu_stage, true)

          this.toggleShow()
        })
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
        if (!valid) return false

        // 提交
        let $rt = this.$post(submit.post, this.formData)
        $rt.then((rt) => {
          this.$refs[form].resetFields()

          this.$emit('formCalBak')
          this.toggleShow()
        }).catch((rt) => {
        })
      })
    },

    /**
     * [eduChange 切换学段]
     * @param  {[Int]} id [学段ID]
     * @param  {[Boolean]} type [是否初始化设置]
     * @return {[]} []
     */
    eduChange (id, type) {
      this.rules.year[2]['list'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          this.rules.year[2]['list'].push(item)
        }
      }

      if (!type) {
        this.formData.year = ''
      }
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>
