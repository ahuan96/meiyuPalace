<template>
  <div class="group">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:addNew="toEdit"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table stripe height="100%"
          :data="items">
          <el-table-column label="编号" prop="id" width="100" fixed></el-table-column>

          <el-table-column label="年级" prop="gradeName" width="100" fixed></el-table-column>

          <el-table-column label="班级" prop="room_name" min-width="120" fixed></el-table-column>

          <el-table-column label="姓名" prop="student_name" min-width="300"></el-table-column>

          <el-table-column label="上传记录" prop="cnt" width="150"></el-table-column>

          <el-table-column label="学号" prop="student_no" width="200"></el-table-column>

          <el-table-column label="状态" prop="student_no" width="200">
            <template  slot-scope="scope">
              <span class="redTd" v-if="scope.row.reviewed == 0">未评分</span>
              <span class="grayTd" v-if="scope.row.reviewed == 1">已评分</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toLook(scope.row.student_id)">
                  <i style="font-size:1rem" class="el-icon-edit"></i>
                </el-link>
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

    <!-- 确认模态框 -->
    <ys-modal-confirm ref="ysconfirm"
      :confirmData="confirmData"
      v-on:confirmCalBak="toDel"></ys-modal-confirm>

    <!-- 表格模态框 -->
    <ys-drawer-table ref="ystable"
      :tableData="tableData"></ys-drawer-table>

    <ys-modal-table-check ref="ystable3"
      :tableData="tableDataCheck"
      :tableDetail="tableDetailCheck"></ys-modal-table-check>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ysDrawerTable from '@/components/drawertable/viewActivity'
import ysDrawerTableView from '@/components/drawertable/viewActivityDetail'
import ysModalTableCheck from '@/components/modaltable/ActivityStudent'
export default {
  components: {
    ysDrawerTable,
    ysDrawerTableView,
    ysModalTableCheck
  },
  props: [
  ],
  data () {
    return {
      items: [], // 老师数据
      cnt: 0, // 总数
      size: 20, // 单页数目

      params: { page: 1, room_id: '', reviewed: '', searchKey: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'room_id', value: null, placeholder: '选择班级' },
          { key: 'reviewed', value: null, placeholder: '选择状态' }
        ],
        keywords: true,
        buttons: [
          { key: 'addNew', value: '发布活动' }
        ]
      },
      // 表格数据
      tableData: {},

      tableDataCheck: {},

      // 表格细节
      tableDetailCheck: { info: 'meiyu/getActivityApply/', column: 'a_' },

      // 确认内容数据
      confirmData: { k: 'teacher', v: 0 }
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
      this.askDatas()
      this.askClass()
      this.setSearchData()
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas () {
      let $rt = this.$get('meiyu/practiceOutsideList/', this.params)
      $rt.then((rt) => {
        // 老师数据
        this.items = rt.data.list
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize

        for (let item of this.items) {
          item.className = []
          for (let it of this.nianji) {
            if (it.id === item.grade) {
              console.log(it.name)
              item.gradeName = it.name
            }
          }

          item.cnt += '条'
        }
      }).catch((rt) => {
      })
    },
    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askClass () {
      const $sel = this.searchData.selector
      let $rt = this.$get('v2z/classadmin/')
      $rt.then((rt) => {
        // 班级数据

        $sel[0].value = rt.data.list
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
        { id: '1', name: '校内活动' },
        { id: '2', name: '校外实践' }
      ]
      $sel[1].value = [
        { id: '', name: '全部' },
        { id: '0', name: '进行中' },
        { id: '1', name: '已结束' }
      ]
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
    yinshe (str, id) {
      var n = ''
      switch (str) {
        case '一年级' : n = 1
          break
        case '二年级' : n = 2
          break
        case '三年级' : n = 3
          break
        case '四年级' : n = 4
          break
        case '五年级' : n = 5
          break
        case '六年级' : n = 6
          break
        case '七年级' : n = 7
          break
        case '八年级' : n = 8
          break
        case '九年级' : n = 9
          break
        case '高一' : n = 10
          break
        case '高二' : n = 11
          break
        case '高三' : n = 12
          break
      }
      if (n === id) {
        return true
      }
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
     * [toEdit 编辑项目]
     * @param  {[Int]} id [项目ID]
     * @return {[]} []
     */
    toEdit (id) {
      const push = { name: 'ActivityAdd', query: {} }
      if (id) {
        push.query.id = id
      }

      this.$router.push(push)
    },

    /**
     * [toLook 查看学生实践]
     * @param  {[Int]} id [学生ID]
     * @return {[]} []
     */
    toLook (id) {
      const push = { name: 'ActivityEditPractice', query: {} }
      push.query.student_id = id
      this.$router.push(push)
    },

    /**
     * [toCheck 查看待审核名单]
     * @param  {[Int]} id [活动ID]
     * @return {[]} []
     */
    toCheck (id) {
      this.tableDataCheck.a_id = id
      this.$refs.ystable3.initial()
    },

    /**
     * [goDel 准备删除老师]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    goDel (id) {
      const params = { id: id }
      this.$refs.ysconfirm.toggleShow(params)
    },

    /**
     * [toDel 删除老师]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toDel (_params) {
      let $rt = this.$post('admin/delete_account/', _params)
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
