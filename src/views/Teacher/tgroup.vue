<template>
  <div class="group" >
    <div class="edit" style="background:#F0F0F0;">
      <div class="back" style="color:#79BBF9;padding:1rem 0;font-size: 1rem;cursor:pointer;display:inline-block;"
       @click="$router.back(-1)"
      >
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <div class="mid">
          <el-table
          :data="items">
            <el-table-column label="编号" prop="id" width="80" fixed></el-table-column>

          <el-table-column label="社团名称" prop="name"></el-table-column>

          <el-table-column label="活动时间" prop="time" ></el-table-column>

          <el-table-column label="状态" prop="stateName" ></el-table-column>

          <el-table-column label="人数" width="120">
            <template slot-scope="scope">
                <el-link type="primary"
                :underline="false"
                @click="toViewGroup(scope.row.id)">{{scope.row.pass_num}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="活动次数" prop="attdence_count" ></el-table-column>

          <el-table-column label="活动详情" >
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toLook(scope.row)">查看</el-link>
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
   <ys-view-group ref="ysviewgroup"
      :formData="id"></ys-view-group>
 </div>
</template>
<script>
import ysViewGroup from '@/components/modalform/viewGroup'
export default {
  components: {
    ysViewGroup
  },
  data () {
    return {
      id: '', // 老师id
      items: [] // 社团数组
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.askDatas()
  },
  methods: {
    pageChange (p) {
      this.params.page = p
      this.askDatas()
    },
    askDatas () {
      let $rt = this.$get('palace_org/organizationList', {teacher_id: this.id})
      $rt.then((rt) => {
        console.log(rt)
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize
        this.items = rt.data.data
        for (let item of this.items) {
          if (item.state === '1') {
            item.stateName = '招募中'
          } else if (item.state === '2') {
            item.stateName = '进行中'
          } else {
            item.stateName = '已结束'
          }

          item.time = (item.create_time.split(' '))[0] + ' 至 ' + (item.end_time.split(' '))[0]
        }
      })
    },
    /**
     * [toLook 查看活动详情]
     * @param  {[Object]} row [行信息]
     * @return {[]} []
     */
    toLook (row) {
      this.$router.push({name: 'TeacherTactive', params: { id: row.id, name: row.name }})
    },
    /**
     * [toReset 查看社团]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toViewGroup (id) {
      this.$refs.ysviewgroup.initial(id)
    }
  }
}
</script>
