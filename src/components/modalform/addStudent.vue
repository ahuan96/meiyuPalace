<template>
  <el-dialog width="800px" title="新增学生" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-form ref="elform" label-width="110px"
      :model="formData"
      :rules="rules">
      <el-form-item label="填写要求">
        <p>1、每行依次输入内容为学生学籍号（必填），学生姓名（必填），家长手机号<span>（选填）</span>；以空格隔开。</p>
        <p>2、姓名仅支持中英文（不可含空格），每一名学生独占一行。</p>
        <p>3、一次最多填写200名学生。更多数量的学生数据导入请使用批量导入功能。</p>
      </el-form-item>

      <el-row>
        <el-col :span="7">
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

        <el-col :span="7">
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

        <el-col :span="7">
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

      <el-form-item label="填写示例">
        <el-col
          :span="21">
          <el-input type="text" value="340111200212246866 李伟大 18956060730"
            :disabled="true"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="填写内容" prop="students">
        <el-col
          :span="21">
          <el-input type="textarea" placeholder="学生学籍号（必填），学生姓名（必填），家长手机号（选填）"
            :autosize="{ minRows: 5 }"
            v-model="formData.students"></el-input>
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
        post: 'admin/add_batch_student/'
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
      this.setFormDetails(this.formRule)
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
     * @return {[]} []
     */
    eduChange (id) {
      this.rules.year[2]['list'] = []
      this.rules.room_id[2]['list'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          this.rules.year[2]['list'].push(item)
        }
      }

      this.formData.year = ''
      this.formData.room_id = ''
    },

    /**
     * [yearChange 切换年级]
     * @param  {[Int]} id [年级ID]
     * @return {[]} []
     */
    yearChange (id) {
      this.rules.room_id[2]['list'] = []

      for (let item of this.rules.room_id[2]['data']) {
        if (id === item.grade) {
          this.rules.room_id[2]['list'].push(item)
        }
      }

      this.formData.room_id = ''
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
