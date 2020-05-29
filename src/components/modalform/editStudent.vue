<template>
  <el-dialog width="720px" title="编辑学生" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="110px"
      :model="formData"
      :rules="rules">
      <el-row>
        <el-col
          :span="11">
          <el-form-item label="教育阶段" prop="select_edu_stage">
            <el-select placeholder="选择阶段"
              v-model="formData.select_edu_stage"
              @change="eduChange">
              <el-option
                :key="it.id"
                :label="it.name"
                :value="it.id"
                v-for="it in rules.select_edu_stage[2]['list']"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="11">
          <el-form-item label="年级信息" prop="year">
            <el-select placeholder="选择年级"
              v-model="formData.year"
              @change="yearChange">
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
          <el-form-item label="班级信息" prop="room_id"
            v-if="rules.room_id">
            <el-select placeholder="选择班级"
              v-model="formData.room_id">
              <el-option
                :key="it.id"
                :label="it.name"
                :value="it.id"
                v-for="it in rules.room_id[2]['list']"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col
          :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input type="text"
            v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="11">
          <el-form-item label="性别" prop="sex">
            <el-radio-group
              v-model="formData.sex">
              <el-radio
                :key="v.id"
                :label="v.id"
                v-for="v of xingbie"
                v-if="v.id !== '-2' && v.id !== '0'">{{v.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col
          :span="11">
          <el-form-item label="学号" prop="student_no">
            <el-input type="text"
            v-model="formData.student_no"></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="11">
          <el-form-item label="家长电话" prop="home_mobile">
            <el-input type="text"
            v-model="formData.home_mobile"></el-input>
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
        info: 'v2z/studentEdit/',
        post: 'admin/update_student/'
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
        this.setFormDetails(this.formRule)

        setTimeout(() => {
          this.formData.select_edu_stage = this.formData.select_edu_stage.toString()
          this.formData.year = this.formData.year.toString()
          this.formData.sex = this.formData.sex !== '0' ? this.formData.sex : '1'

          this.eduChange(this.formData.select_edu_stage, true)
          this.yearChange(this.formData.year, true)

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
      this.rules.room_id[2]['list'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          this.rules.year[2]['list'].push(item)
        }
      }

      if (!type) {
        this.formData.year = ''
        this.formData.room_id = ''
      }
    },

    /**
     * [yearChange 切换年级]
     * @param  {[Int]} id [年级ID]
     * @param  {[Boolean]} type [是否初始化设置]
     * @return {[]} []
     */
    yearChange (id, type) {
      this.rules.room_id[2]['list'] = []

      for (let item of this.rules.room_id[2]['data']) {
        if (id === item.grade) {
          this.rules.room_id[2]['list'].push(item)
        }
      }

      if (!type) {
        this.formData.room_id = ''
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
