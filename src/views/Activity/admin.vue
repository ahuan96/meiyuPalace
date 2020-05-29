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
          <el-table-column label="编号" prop="id" width="80" fixed></el-table-column>

          <el-table-column label="活动类型" prop="typeName" width="100" fixed></el-table-column>

          <el-table-column label="活动名称" prop="name" min-width="120" fixed></el-table-column>

          <el-table-column label="活动范围" prop="className" min-width="300"></el-table-column>

          <el-table-column label="截至时间" prop="end_time" width="200"></el-table-column>

          <el-table-column label="状态" prop="stateName" width="100"></el-table-column>

          <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toLook(scope.row.id)">查看活动</el-link>
              <em></em>
              <el-link type="primary"
                :underline="false"
                @click="toCheck(scope.row.id)">待审核名单</el-link>
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

      params: { page: 1, type: '', state: '', searchKey: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'type', value: null, placeholder: '选择类型' },
          { key: 'state', value: null, placeholder: '选择状态' }
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
  },
  methods: {
    /**
     * [initPages 初始化]
     * @return {[]} []
     */
    initPages () {
      this.askDatas()

      this.setSearchData()
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas () {
      let $rt = this.$get('meiyu/ActivictyList/', this.params)
      $rt.then((rt) => {
        // 老师数据
        this.items = rt.data.data
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize

        for (let item of this.items) {
          item.className = []
          for (let it of item.class) {
            item.className.push(it.grade + it.class_name)
          }

          item.className = item.className.join('、')
          item.typeName = item.type === '1' ? '校内活动' : '校外实践'
          item.stateName = item.state === '1' ? '进行中' : '已结束'
        }
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
        { id: '-2', name: '全部' },
        { id: '1', name: '进行中' },
        { id: '2', name: '已结束' }
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
     * [toLook 查看活动]
     * @param  {[Int]} id [活动ID]
     * @return {[]} []
     */
    toLook (id) {
      this.tableData.a_id = id
      this.$refs.ystable.initial()
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
