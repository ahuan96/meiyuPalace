<template>
  <el-dialog width="800px" title="社团学生列表" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <el-table ref="eltable" stripe
      :data="items">
      <el-table-column label="年级" prop="groupName" width="100"></el-table-column>

      <el-table-column label="班级" prop="class_name" width="120"></el-table-column>

      <el-table-column label="姓名" prop="name" width="100"></el-table-column>

      <el-table-column label="学号" prop="student_no" ></el-table-column>

      <el-table-column label="出勤率" prop="attendance_rate" width="120"></el-table-column>

      <el-table-column label="社团表现分" prop="point" width="120"></el-table-column>

    </el-table>
    <span slot="footer"
      v-if="cnt">
      <ys-page
        :cnt="cnt"
        :size="size"
        v-on:page="pageChange"></ys-page>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
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
      items: [], // 学生列表
      cnt: 0,
      size: 0,
      params: {page: 1, org_id: ''}
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'nianji'
    ])
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial (id) {
      this.toggleShow()
      this.params.org_id = id
      this.askDatas()
    },
    // 查看社团信息
    askDatas () {
      let $rt = this.$get('palace_org/getOrganization/', this.params)
      $rt.then((rt) => {
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize
        this.items = rt.data.studentList

        this.items.forEach(item => {
          for (let key of this.nianji) {
            if (item.grade === key.id) {
              item.groupName = key.name
            }
          }
        })
      }).catch((rt) => {
      })
    },
    pageChange (p) {
      this.params.page = p
      this.askDatas()
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
