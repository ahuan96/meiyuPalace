<template>
  <div class="report">
     <div class="r-header">
        <button>下载艺术素质测评汇总表模板</button>
        <button>下载艺术教育工作自评表模板</button>
        <button>下载艺术教育发展年度数据汇总表模板</button>
        <button>下载艺术教育发展年度报告模板</button>
        <button class="up-btn"><i class="el-icon-upload el-icon--right"></i>上传文件</button>
    </div>
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:goUpload="goUpload()"
      v-on:eduCalBak="eduChange"
      v-on:gradeCalBak="gradeChange"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long" style="top:5.9rem">
      <div class="mid">
        <el-table  height="100%"
          :data="items"
          @selection-change="selectionChange">
          <el-table-column label="编号" prop="id" width="100" fixed></el-table-column>

          <el-table-column label="文件名称" align="center" prop="yearName"  fixed>
            <template  slot-scope="scope">
              <span style="color:#5E9EEB;cursor:pointer;">{{scope.row.yearName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="上传时间" prop="yearName" width="200" fixed></el-table-column>

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
          { key: 'year', value: null, placeholder: '选择学年' }
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
      'nianfen'
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
          for (let it of this.nianfen) {
            if (item.semester === it.id) {
              item.semesterName = it.name
              break
            }
          }

          item.yearName = item.year + ' 学年'
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
      $sel[0].value = this.nianfen
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
