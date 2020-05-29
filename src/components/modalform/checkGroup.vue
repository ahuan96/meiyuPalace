<template>
  <el-dialog width="720px" title="社团小组申请列表" oncontextmenu="return false" onselectstart="return false"
             :close-on-click-modal="false"
             :visible.sync="isShowing"
             v-if="isShowing">
    <el-table stripe height="100%"
              :data="items"
              @selection-change="selectionChange">
      <el-table-column prop="id" type="selection" width="35" fixed></el-table-column>

      <el-table-column label="姓名" prop="name" min-width="100"></el-table-column>

      <el-table-column label="学号" prop="student_no" min-width="180"></el-table-column>

      <el-table-column label="年级" prop="yearname" width="120"></el-table-column>

      <el-table-column label="申请理由" prop="roomname" width="120"></el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-link type="primary"
                   :underline="false"
                   @click="toAccpet(scope.row.id)">通过</el-link>
          <em></em>
          <el-link type="primary"
                   :underline="false"
                   @click="toRefuse(scope.row.id)">拒绝</el-link>
          <em></em>
        </template>
      </el-table-column>
    </el-table>
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
        setTimeout(() => {
          this.toggleShow()
        })
      })
    },
    askDatas (cbk) {
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
