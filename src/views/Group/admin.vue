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

          <el-table-column label="社团名称" prop="name" min-width="120" fixed></el-table-column>

          <el-table-column label="招募范围" prop="className" min-width="300">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                :title="scope.row.name"
                width="300"
                trigger="hover"
                :content="scope.row.classAllName">
                <span slot="reference">{{scope.row.className}}</span>
            </el-popover>
            </template>
          </el-table-column>

          <el-table-column label="活动时间" prop="time" width="200"></el-table-column>

          <el-table-column label="人数" width="100">
            <template slot-scope="scope">
              {{scope.row.pass_num}} / {{scope.row.num}}
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="state" width="100">
             <template slot-scope="scope">
              <div v-if="scope.row.state==='-1'">已结束</div>
              <div class="blueTd" v-if="scope.row.state==='1'">招募中</div>
              <div class="blueTd" v-if="scope.row.state==='2'">进行中</div>
              <div class="" v-if="scope.row.state==='3'">待发布</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="340" fixed="right">
            <template slot-scope="scope">
              <template
               v-if="scope.row.state === '1'&&scope.row.isMe">
                <el-link type="primary"
                  :underline="false"
                @click="toCheck(scope.row.id)">待审核名单
                <span style="color:#F56C6C;">({{scope.row.audit_num}}人)</span>
                </el-link>
                <em></em>
                <el-link type="danger"
                  :underline="false"
                  @click="toBack(scope.row.id)">撤回</el-link>
                <em></em>
                <el-link type="danger"
                  :underline="false"
                  @click="goClose(scope.row.id)">关闭申请</el-link>
              </template>
              <template
               v-if="scope.row.state === '-1'||scope.row.state === '2'">
               <el-link type="primary"
                :underline="false"
                @click="toLook(scope.row.id,scope.row.isMe)">查看社团</el-link>
              </template>
              <template
               v-if="scope.row.state === '2'&&scope.row.isMe">
                <em></em>
                <el-link type="primary"
                :underline="false"
                @click="toAdd(scope.row.id)">创建考勤</el-link>
               </template>
               <template
               v-if="scope.row.state === '3'&&scope.row.isMe">
                <el-link type="primary"
                :underline="false" @click="toEdit(scope.row.id,1)">继续编辑</el-link>
                <em></em>
                <el-link type="primary"
                :underline="false" @click="toPublish(scope.row.id)">发布</el-link>
                <em></em>
                <el-link type="danger"
                :underline="false" @click="goDel(scope.row.id)">删除</el-link>
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
      v-on:confirmCalBak="toClose"></ys-modal-confirm>
      <!-- 确认模态框 -->
    <ys-modal-confirm ref="ysconfirm2"
      :confirmData="confirmData2"
      v-on:confirmCalBak="toDel"></ys-modal-confirm>

    <!-- 表格模态框 -->
    <ys-drawer-table ref="ystable"
      :tableData="tableData"></ys-drawer-table>

    <ys-drawer-table-kaoqin ref="ystable2"
      :tableData="tableDataKaoqin"></ys-drawer-table-kaoqin>

    <ys-modal-table-check ref="ystable3"
      :tableData="tableDataCheck"
      :tableDetail="tableDetailCheck"></ys-modal-table-check>
  </div>
</template>

<script>
import ysDrawerTable from '@/components/drawertable/viewGroup'
import ysDrawerTableKaoqin from '@/components/drawertable/addGroupKaoqin'
import ysModalTableCheck from '@/components/modaltable/groupStudent'

export default {
  components: {
    ysDrawerTable,
    ysDrawerTableKaoqin,
    ysModalTableCheck
  },
  props: [
  ],
  data () {
    return {
      items: [], // 老师数据
      cnt: 0, // 总数
      size: 20, // 单页数目

      params: { page: 1, state: '', searchKey: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'state', value: null, placeholder: '选择状态' }
        ],
        keywords: true,
        buttons: [{ key: 'addNew', value: '创建社团' }]
      },

      // 表格数据
      tableData: {},

      tableDataKaoqin: {},

      tableDataCheck: {},

      // 表格细节
      tableDetailCheck: { info: 'palace_org/getOrganizationApply/', column: 'org_' },

      // 确认内容数据
      confirmData: { k: 'group', v: 0 },
      confirmData2: { k: 'group', v: 1 },
      userinfo: window.Global.userinfo
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
      console.log('userinfo', this.userinfo)
      this.askDatas()
      this.setSearchData()
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas () {
      let $rt = this.$get('palace_org/organizationList/', this.params)
      $rt.then((rt) => {
        // 社团数据
        this.items = rt.data.data
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize
        for (let item of this.items) {
          // 招募范围名称 列表显示
          item.className = this.resetClassName(item.class)
          // 招募范围名称 弹出显示
          item.classAllName = []
          for (let it of item.class) {
            item.classAllName.push(it.grade + it.class_name)
          }
          item.classAllName = item.classAllName.join('、')

          let teacherArr = item.teacher_ids.split(',')
          if (teacherArr.indexOf(this.userinfo.id) > -1) {
            item.isMe = true
          }
          item.time = (item.create_time.split(' '))[0] + ' 至 ' + (item.end_time.split(' '))[0]
        }
      }).catch((rt) => {
      })
    },
    /**
     *[resetClassName 重置招募范围名称显示]
     *@param  {[Array]} classList [班级数组]
     *@return {[String]} [重置名称]
     */
    resetClassName (classList) {
      if (classList.length === 0) {
        return ''
      }
      let groupArr = []
      let roomArr = []
      let reStr = ''
      for (let item of classList) {
        roomArr.push(item.class_name)
        if (groupArr.indexOf(item.grade) === -1) {
          groupArr.push(item.grade)
        }
      }
      if (groupArr.length === 1) {
        reStr = roomArr.join('、')
        if (roomArr.length === 1) {
          return groupArr[0] + reStr
        } else {
          return groupArr[0] + reStr + '等共' + roomArr.length + '个班级'
        }
      } else {
        reStr = groupArr.join('、')
        return reStr + '等共' + roomArr.length + '个班级'
      }
    },

    /**
     * [setSearchData 设置查询内容数据]
     * @return {[]} []
     */
    setSearchData () {
      const $sel = this.searchData.selector
      $sel[0].value = [
        { id: '', name: '全部' },
        { id: '1', name: '招募中' },
        { id: '2', name: '进行中' },
        { id: '-1', name: '已结束' }
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
     * [toEdit 编辑社团]
     * @param  {[Int]} id [社团ID]
     * @return {[]} []
     */
    toEdit (id, state) {
      const push = { name: 'GroupAdd', query: {} }
      if (id) {
        push.query.id = id
        push.query.state = state // 如果是继续编辑传1
      }
      this.$router.push(push)
    },
    /**
     * [toLook 查看社团]
     * @param  {[Int]} id [社团ID]
     * @return {[]} []
     */
    toLook (id, isMe) {
      this.tableData.org_id = id
      this.$refs.ystable.initial(isMe)
    },

    /**
     * [toCheck 查看待审核名单]
     * @param  {[Int]} id [社团ID]
     * @return {[]} []
     */
    toCheck (id) {
      this.tableDataCheck.org_id = id
      this.$refs.ystable3.initial()
    },

    /**
     * [toAdd 创建考勤]
     * @param  {[Int]} id [社团ID]
     * @return {[]} []
     */
    toAdd (id) {
      this.tableDataKaoqin.org_id = id
      this.$refs.ystable2.initial()
    },

    /**
     * [goClose 准备关闭社团]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    goClose (id) {
      const params = { org_id: id }
      this.$refs.ysconfirm.toggleShow(params)
    },

    /**
     * [toClose 关闭社团]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toClose (_params) {
      let $rt = this.$get('palace_org/closeOrganization/', _params)
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },
    /**
     * [toPublish 发布]
     * @param  {[String]} id [id]
     * @return {[]} []
     */
    toPublish (id) {
      let $rt = this.$get('palace_org/pubOrganization/', {org_id: id})
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },
    /**
     * [toBack 撤回]
     * @param  {[String]} id [id]
     * @return {[]} []
     */
    toBack (id) {
      let $rt = this.$get('palace_org/revocationOrganization/', {org_id: id})
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },
    /**
     * [goClose 准备删除社团]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    goDel (id) {
      const params = { org_id: id }
      this.$refs.ysconfirm2.toggleShow(params)
    },
    /**
     * [toDel 删除社团]
     * @param  {[String]} id [id]
     * @return {[]} []
     */
    toDel (_params) {
      let $rt = this.$get('palace_org/deleteOrg/', _params)
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
