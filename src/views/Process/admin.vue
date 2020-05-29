<template>
  <div class="student">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:goUpload="goUpload()"
      v-on:eduCalBak="eduChange"
      v-on:gradeCalBak="gradeChange"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table stripe height="100%"
          :data="items"
          @selection-change="selectionChange">
          <el-table-column prop="id" type="selection" width="35" fixed></el-table-column>

          <el-table-column label="学年" prop="yearName" width="150" fixed></el-table-column>

          <el-table-column label="学期" prop="semesterName" width="100" fixed></el-table-column>

          <el-table-column label="年级" prop="gradeName"></el-table-column>

          <el-table-column label="班级" prop="class_room"></el-table-column>

          <el-table-column label="评分周期" prop="time" width="220"></el-table-column>

          <el-table-column label="状态" prop="submittedName" width="150"></el-table-column>

          <el-table-column label="操作" width="330" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="viewScore(scope.row.class_id,scope.row.conf_id)">查看评分信息</el-link>
              <em></em>
              <el-link type="primary"
                :underline="false"
                @click="toExplore(scope.row)">导出班级评价报表</el-link>
              <template
                v-if="scope.row.submitted === '0'">
                <em></em>
                <el-link type="primary"
                  :underline="false"
                  @click="goUpload(scope.row)">上报</el-link>
              </template>
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
      v-on:confirmCalBak="toUpload"></ys-modal-confirm>

    <!-- 表格模态框 -->
    <!-- <ys-drawer-table ref="ystable"
      :tableData="tableData"></ys-drawer-table> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
  },
  props: [
  ],
  data () {
    return {
      items: [], // 过程性评价数据
      itemsEdu: [], // 学段数据
      itemsRoom: [], // 班级数据
      cnt: 0, // 总数
      size: 20, // 单页数目
      selection: [], // 已勾选列表

      params: { page: 1, year: '', semester: '', select_edu_stage: '', grade: '', class_id: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'year', value: null, placeholder: '选择学年' },
          { key: 'semester', value: null, placeholder: '选择学期' },
          { key: 'select_edu_stage', value: null, placeholder: '选择阶段', cbk: 'eduCalBak' },
          { key: 'grade', value: null, placeholder: '选择年级', reset: true, needed: 'select_edu_stage', cbk: 'gradeCalBak' },
          { key: 'class_id', value: null, placeholder: '选择班级', reset: true, needed: 'grade' }
        ],
        buttons: [
          { key: 'goUpload', value: '批量上报' }
        ]
      },

      // 确认内容数据
      confirmData: { k: 'process', v: 0 },

      // 表格数据
      tableData: {}
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'xueduan', 'nianji', 'xueqi',
      'nianfen2'
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
      let $rt = this.$get('report/school_pj/', this.params)
      $rt.then((rt) => {
        // 过程性评价数据
        this.items = rt.data.data
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize

        for (let item of this.items) {
          for (let it of this.xueqi) {
            if (item.semester === it.id) {
              item.semesterName = it.name
              break
            }
          }

          for (let it of this.nianji) {
            if (item.grade === it.id) {
              item.gradeName = it.name
              break
            }
          }

          item.yearName = item.year + ' 学年'
          item.submittedName = item.submitted === '1' ? '已上报' : '未上报'
          item.time = this.$timeformat(item.begin_time, 3) + ' 至 ' + this.$timeformat(item.end_time, 3)
        }

        // 学段数据
        this.itemsEdu = []

        for (let item of rt.data.other.edu_stage_list) {
          let index = rt.data.other.edu_stage_list.indexOf(item).toString()
          if (index === '0') {
            continue
          }

          let edu = { id: index, name: item.name }
          this.itemsEdu.push(edu)
        }

        // 班级数据
        this.itemsRoom = []

        for (let item of rt.data.other.room_list) {
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
      // 学年数据
      $sel[0].value = this.nianfen2

      // 学期数据
      $sel[1].value = this.xueqi

      // 阶段数据
      $sel[2].value = JSON.parse(JSON.stringify(this.itemsEdu))
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
      $sel[3]['value'] = []
      $sel[4]['value'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          $sel[3]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(3)
    },

    /**
     * [gradeChange 切换年级]
     * @param  {[Int]} id [年级ID]
     * @return {[]} []
     */
    gradeChange (id) {
      const $sel = this.searchData.selector
      $sel[4]['value'] = []

      for (let item of this.itemsRoom) {
        if (id === item.grade) {
          $sel[4]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(4)
    },

    /**
     * [selectionChange 切换勾选项]
     * @param  {[Array]} arr [勾选列表]
     * @return {[]} []
     */
    selectionChange (arr) {
      this.selection = arr
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
     * [viewScore 查看评分信息]
     * @param  {[Int]} id [班级ID]
     * @return {[]} []
     */
    // eslint-disable-next-line camelcase
    viewScore (id, confid) {
      // eslint-disable-next-line camelcase
      const push = { name: 'processView', query: {} }
      push.query.room_id = id
      push.query.config_id = confid
      this.$router.push(push)
    },

    /**
     * [goUpload 准备上报]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    goUpload (item) {
      const params = { rooms: [] }
      if (!item) {
        for (let item of this.selection) {
          let obj = { config_id: item.conf_id, class_id: item.class_id }
          params.rooms.push(obj)
        }
      } else {
        const obj = { config_id: item.conf_id, class_id: item.class_id }
        params.rooms.push(obj)
      }
      params.rooms = JSON.stringify(params.rooms)
      this.$refs.ysconfirm.toggleShow(params)
    },

    /**
     * [toUpload 上报]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toUpload (_params) {
      let $rt = this.$post('report/submitted_pj/', _params)
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },

    /**
     * [toExplore 导出班级评价报表]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toExplore (item) {
      window.open(this.url + 'evaluation/export_class_student?conf_id=' + item.conf_id + '&class_id=' + item.class_id)
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
