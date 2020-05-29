<template>
  <div class="classroom">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:addNew="toEdit"
      v-on:eduCalBak="eduChange"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table stripe height="100%"
          :data="items">
          <el-table-column label="年级" width="120" prop="year_grade"></el-table-column>

          <el-table-column label="班级" width="120" prop="name"></el-table-column>

          <el-table-column label="任课老师" min-width="240">
            <template slot-scope="scope">
              <span class="ms"
                v-html="scope.row.musicname"></span>
              <span class="at"
                v-html="scope.row.artname"></span>
            </template>
          </el-table-column>

          <el-table-column label="学生人数" min-width="120">
            <template slot-scope="scope">
              <span
                v-html="scope.row.cnt + '人'"></span>
              (
              <el-link type="primary"
                :underline="false"
                @click="toStudent(scope.row)">查看名单</el-link>
              )
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="160" prop="date"></el-table-column>

          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <!-- <el-link type="primary"
                :underline="false"
                @click="toUpload(scope.row.id)">导入名单</el-link>
              <em></em> -->
              <el-link type="primary"
                :underline="false"
                :disabled="scope.row.cnt === 0 ? true : false"
                @click="toExplore(scope.row.id)">导出考试码</el-link>
              <em></em>
              <el-dropdown
                @command="moreDeals">
                <span class="el-dropdown-link">
                  更多<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="'toEdit,' + scope.row.id">编辑</el-dropdown-item>
                  <el-dropdown-item
                    :command="'goDel,' + scope.row.id">解散</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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

    <!-- 表单模态框 -->
    <ys-modal-form ref="ysform"
      :formData="formData"
      :formRule="formRule"
      v-on:formCalBak="askDatas"></ys-modal-form>

    <!-- 表格模态框 -->
    <ys-drawer-table ref="ystable"
      :tableData="tableData"></ys-drawer-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ysModalForm from '@/components/modalform/addClassroom'
import ysDrawerTable from '@/components/drawertable/viewStudent'

export default {
  components: {
    ysModalForm,
    ysDrawerTable
  },
  props: [
  ],
  data () {
    return {
      items: [], // 班级数据
      itemsEdu: [], // 学段数据
      itemsMusic: [], // 音乐老师数据
      itemsArt: [], // 美术老师数据
      cnt: 0, // 总数
      size: 20, // 单页数目

      params: { page: 1, select_edu_stage: '', year: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'select_edu_stage', value: null, placeholder: '选择阶段', cbk: 'eduCalBak' },
          { key: 'year', value: null, placeholder: '选择年级', reset: true, needed: 'select_edu_stage', cbk: 'yearCalBak' }
        ],
        buttons: [
          { key: 'addNew', value: '新增班级' }
        ]
      },

      // 确认内容数据
      confirmData: { k: 'classroom', v: 0 },

      // 表单内容数据
      formData: {
        id: undefined,
        edu_stage: '',
        year: '',
        name: '',
        remark: '',
        music_teacher_id: '',
        art_teacher_id: ''
      },

      // 表单内容验证
      formRule: [
        ['select', { list: null }],
        ['select', { list: null }],
        ['name', { list: null }],
        ['desc', {}],
        ['select', { list: null }],
        ['select', { list: null }]
      ],

      // 表格数据
      tableData: {},

      // 文件内容数据
      fileData: { name: '班级学生' }
    }
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
        this.setFormData()
      })
    },

    /**
     * [askDatas 请求数据]
     * @param  {[Function]} cbk [回调]
     * @return {[]} []
     */
    askDatas (cbk) {
      console.log(4)
      let $rt = this.$get('v2z/classadmin/', this.params)
      $rt.then((rt) => {
        console.log(5, rt)
        // 班级数据
        this.items = rt.data.list
        this.cnt = rt.data.cnt
        // this.size = rt.data.pagesize

        for (let item of this.items) {
          item.date = this.$timeformat(item.create_time)

          item.musicname = item.uid !== '0' ? rt.data.music_teacher[item.uid]['teacher_name'] : ''
          item.artname = item.art_uid !== '0' ? rt.data.art_teacher[item.art_uid]['teacher_name'] : ''
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

        // 音乐老师数据
        this.itemsMusic = []

        const keys = Object.keys(rt.data.music_teacher)
        for (let index of keys) {
          let item = rt.data.music_teacher[index]
          let music = { id: item.id, name: item.teacher_name }
          this.itemsMusic.push(music)
        }

        // 美术老师数据
        this.itemsArt = []

        const keysArt = Object.keys(rt.data.art_teacher)
        for (let index of keysArt) {
          let item = rt.data.art_teacher[index]
          let art = { id: item.id, name: item.teacher_name }
          this.itemsArt.push(art)
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
      $sel[0].value = JSON.parse(JSON.stringify(this.itemsEdu))
    },

    /**
     * [setFormData 设置表单内容数据]
     * @return {[]} []
     */
    setFormData () {
      const $edu = this.formRule[0][1]
      $edu.list = JSON.parse(JSON.stringify(this.itemsEdu))

      const $room = this.formRule[2][1]
      $room.list = []
      for (let i = 0; i < 99; i++) {
        $room.list.push({ id: (i + 1) + '班', name: (i + 1) + '班' })
      }

      const $music = this.formRule[4][1]
      $music.list = JSON.parse(JSON.stringify(this.itemsMusic))

      const $art = this.formRule[5][1]
      $art.list = JSON.parse(JSON.stringify(this.itemsArt))
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
      $sel[1]['value'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          $sel[1]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(1)
    },

    /**
     * [toStudent 查看名单]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toStudent (item) {
      this.tableData.select_edu_stage = item.edu_stage.toString()
      this.tableData.year = item.grade
      this.tableData.room_id = item.id
      this.$refs.ystable.initial()
    },

    /**
     * [toUpload 导入名单]
     * @param  {[Int]} id [班级ID]
     * @return {[]} []
     */
    toUpload (id) {},

    /**
     * [toExplore 导出考试码]
     * @param  {[Int]} id [班级ID]
     * @return {[]} []
     */
    toExplore (id) {
      window.open(this.url + 'classadmin/download_barcode?room_id=' + id)
    },

    /**
     * [toEdit 编辑班级]
     * @param  {[Int]} id [班级ID]
     * @return {[]} []
     */
    toEdit (id) {
      this.formData.id = id
      this.$refs.ysform.initial()
    },

    /**
     * [goDel 准备解散班级]
     * @param  {[Int]} id [班级ID]
     * @return {[]} []
     */
    goDel (id) {
      const params = { id: id }

      this.$refs.ysconfirm.toggleShow(params)
    },

    /**
     * [toDel 解散班级]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toDel (_params) {
      let $rt = this.$post('classadmin/delete_room/', _params)
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },

    /**
     * [moreDeals 更多操作]
     * @param  {[String]} command [操作命令]
     * @return {[]} []
     */
    moreDeals (command) {
      command = command.split(',')
      this[command[0]](command[1])
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
