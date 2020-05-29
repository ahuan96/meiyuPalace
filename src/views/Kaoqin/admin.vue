<template>
  <div class="kaoqin">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:addNew="toAdd"
      v-on:eduCalBak="eduChange"
      v-on:yearCalBak="yearChange"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table stripe height="100%"
          :data="items">
          <el-table-column label="科目" prop="stypeName" width="80" fixed></el-table-column>

          <el-table-column label="年级" prop="year" width="100" fixed></el-table-column>

          <el-table-column label="班级" prop="name" width="100" fixed></el-table-column>

          <el-table-column label="时间" prop="class_time" width="200"></el-table-column>

          <el-table-column label="课程" prop="course"></el-table-column>

          <el-table-column label="出勤人数" prop="attendance">
            <template slot-scope="scope">
              {{scope.row.attendance}} / {{scope.row.sum}}
            </template>
          </el-table-column>

          <el-table-column label="出勤率" prop="percent"></el-table-column>

          <el-table-column label="考勤老师" prop="teacher_name"></el-table-column>

          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toView(scope.row.id)">查看详情</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="bot"
        v-if="cnt">
        <ys-page ref="yspage"
          :cnt="cnt"
          :size="size"
          v-on:page="pageChange"></ys-page>
      </div>
    </div>

    <!-- 表格模态框 -->
    <ys-drawer-table ref="ystable"
      :itemsEdu="itemsEdu"
      v-on:formCalBak="askDatas"
      :itemsRoom="itemsRoom"></ys-drawer-table>

    <ys-drawer-table-view ref="ystable2"
      :tableData="tableData"></ys-drawer-table-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ysDrawerTable from '@/components/drawertable/addKaoqin'
import ysDrawerTableView from '@/components/drawertable/viewKaoqin'

export default {
  components: {
    ysDrawerTable, ysDrawerTableView
  },
  props: [
  ],
  data () {
    return {
      items: [], // 老师数据
      itemsEdu: [], // 学段数据
      itemsRoom: [], // 班级数据
      cnt: 0, // 总数
      size: 20, // 单页数目

      params: { page: 1, stype: '', select_edu_stage: '', year: '', room_id: '', date_time: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'stype', value: null, placeholder: '选择学科' },
          { key: 'select_edu_stage', value: null, placeholder: '选择阶段', cbk: 'eduCalBak' },
          { key: 'year', value: null, placeholder: '选择年级', reset: true, needed: 'select_edu_stage', cbk: 'yearCalBak' },
          { key: 'room_id', value: null, placeholder: '选择班级', reset: true, needed: 'year' }
        ],
        buttons: [
          { key: 'addNew', value: '新增考勤' }
        ],
        daterange2: true
      },

      // 表格数据
      tableData: {}
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
     * [initPages 初始化]
     * @return {[]} []
     */
    initPages () {
      this.askDatas(() => {
        this.setSearchData()
      })
    },

    /**
     * [askDatas 请求数据]
     * @param  {[Function]} cbk [回调]
     * @return {[]} []
     */
    askDatas (cbk) {
      console.log('params', this.params)
      let datetime = this.params.date_time
      this.params.start_time = datetime[0] + ' 00:00:00'
      this.params.end_time = datetime[1] + ' 23:59:59'
      let $rt = this.$get('admin/attendance/', this.params)
      $rt.then((rt) => {
        // 考勤数据
        this.items = rt.data.list
        this.cnt = parseInt(rt.data.cnt)
        this.size = rt.data.pagesize

        for (let item of this.items) {
          if (item.stype === '1') {
            item.stypeName = '音乐'
          } else if (item.stype === '2') {
            item.stypeName = '美术'
          }

          item.class_time = this.$timeformat(item.class_time, 3)
          item.course = '第' + item.course + '节课'
          item.sum = parseInt(item.attendance) + parseInt(item.absenteeism)
          item.percent = this.$numformat(parseInt(item.attendance) / item.sum * 100) + '%'
        }

        // 学段数据
        this.itemsEdu = []

        for (let item of rt.data.edu_stage_list) {
          let index = rt.data.edu_stage_list.indexOf(item).toString()
          if (index === '0') {
            continue
          }

          let edu = { id: index, name: item.name }
          this.itemsEdu.push(edu)
        }

        // 班级数据
        this.itemsRoom = []

        for (let item of rt.data.room_list) {
          let room = { id: item.id, name: item.name, grade: item.grade }
          this.itemsRoom.push(room)
        }

        cbk()
      }).catch((rt) => {
      })
    },

    /**
     * [setSearchData 设置查询内容数据]
     * @return {[]} []
     */
    setSearchData () {
      const $sel = this.searchData.selector
      $sel[0].value = [
        { id: '-2', name: '全部' },
        { id: '1', name: '音乐' },
        { id: '2', name: '美术' }
      ]
      $sel[1].value = JSON.parse(JSON.stringify(this.itemsEdu))
    },

    /**
     * [pageChange 切换页码]
     * @param  {[Int]} p [页码]
     * @return {[]} []
     */
    pageChange (p) {
      this.params.page = p
      this.askDatas()
    },

    /**
     * [paramsChange 切换查询条件]
     * @param  {[Object]} $params [查询参数]
     * @return {[]} []
     */
    paramsChange ($params) {
      $params.page = 1
      const keys = Object.keys(this.params)
      for (let k of keys) {
        if ($params[k]) this.params[k] = $params[k]
        else this.params[k] = ''
      }

      this.askDatas()
    },

    /**
     * [eduChange 切换学段]
     * @param  {[Int]} id [学段ID]
     * @return {[]} []
     */
    eduChange (id) {
      const $sel = this.searchData.selector
      $sel[2]['value'] = []
      $sel[3]['value'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          $sel[2]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(2)
    },

    /**
     * [yearChange 切换年级]
     * @param  {[Int]} id [年级ID]
     * @return {[]} []
     */
    yearChange (id) {
      const $sel = this.searchData.selector
      $sel[3]['value'] = []

      for (let item of this.itemsRoom) {
        if (id === item.grade) {
          $sel[3]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(3)
    },

    /**
     * [toAdd 新增考勤]
     * @return {[]} []
     */
    toAdd () {
      this.$refs.ystable.initial()
    },

    /**
     * [toView 查看考勤]
     * @param  {[Int]} id [考勤ID]
     * @return {[]} []
     */
    toView (id) {
      this.tableData.aid = id
      this.$refs.ystable2.initial()
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
