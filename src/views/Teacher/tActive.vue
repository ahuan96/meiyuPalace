<template>
  <div class="group" >
    <div class="edit" style="background:#F0F0F0;padding:0 1rem;">
      <div class="back" style="color:#79BBF9;padding:1rem 0;font-size: 1rem;cursor:pointer;"
       @click="$router.back(-1)"
      >
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <div class="mid">
          <h3 style="font-weight:bold;font-size:20px;margin:10px">{{name}}</h3>
          <el-table
          :data="items">
        <el-table-column
             label="序号"
              type="index"
              width="100">
          </el-table-column>
          <el-table-column label="活动日期" prop="create_time" ></el-table-column>

          <el-table-column label="出勤人数" prop="attendance"></el-table-column>

          <el-table-column label="出勤率" prop="rate"></el-table-column>

          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toView(scope.row.teacher_record)">查看教师记录</el-link>
            </template>
          </el-table-column>
          </el-table>
           <div class="bot"
        v-if="cnt">
        <ys-page ref="yspage"
          :cnt="cnt"
          :size="size"
          v-on:page="pageChange"></ys-page>
      </div>
      </div>
   </div>

   <!-- 查看教师记录 -->
    <el-dialog
      title="教师活动记录"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose">
      <span>{{teacherCont}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

   <ys-view-group ref="ysviewgroup"
      :formData="id"></ys-view-group>
 </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ysViewGroup from '@/components/modalform/viewGroup'
export default {
  components: {
    ysViewGroup
  },
  data () {
    return {
      id: '', // 老师id
      name: '', // 社团名称
      items: [], // 社团数组
      cnt: 0,
      size: 20,
      params: {page: 1, org_id: ''},
      dialogVisible: false,
      teacherCont: '' // 教师记录
    }
  },
  mounted () {
    console.log(this.$route.params)
    this.params.org_id = this.$route.params.id
    this.name = this.$route.params.name
    this.askDatas()
  },
  computed: {
    ...mapGetters([
      'xueduan', 'nianji'
    ])
  },
  methods: {
    pageChange (p) {
      this.params.page = p
      this.askDatas()
    },
    askDatas () {
      let $rt = this.$get('palace_org/getAttendanceRecord', this.params)
      $rt.then((rt) => {
        console.log(rt)
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize
        this.items = rt.data.data
      })
    },
    /**
     * [toReset 查看教师记录]
     * @param  {[String]} cont [内容]
     * @return {[]} []
     */
    toView (cont) {
      this.teacherCont = cont || '这个人很懒，什么都没说！'
      this.dialogVisible = true
    }
  }
}
</script>
