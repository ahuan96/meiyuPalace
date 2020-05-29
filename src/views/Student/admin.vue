<template>
  <div class="student">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:addNew="toAdd"
      v-on:fileDeal="toFile"
      v-on:eduCalBak="eduChange"
      v-on:yearCalBak="yearChange"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table stripe height="100%"
          :data="items"
          @selection-change="selectionChange">
          <el-table-column prop="id" type="selection" width="35" fixed></el-table-column>

          <el-table-column label="姓名" prop="name" min-width="100" fixed></el-table-column>

          <el-table-column label="学号" prop="student_no" min-width="180"></el-table-column>

          <el-table-column label="系统账号" prop="system_no" width="130"></el-table-column>

          <el-table-column label="年级" prop="yearname" width="120"></el-table-column>

          <el-table-column label="班级" prop="roomname" width="120"></el-table-column>

          <el-table-column label="性别" prop="sexname" width="80"></el-table-column>

          <el-table-column label="任课老师" min-width="240">
            <template slot-scope="scope">
              <span class="ms"
                v-html="scope.row.musicname"></span>
              <span class="at"
                v-html="scope.row.artname"></span>
            </template>
          </el-table-column>

          <el-table-column label="家长电话" prop="home_mobile" width="150"></el-table-column>

          <el-table-column label="操作" width="240" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toEdit(scope.row.id)">修改信息</el-link>
              <em></em>
              <el-link v-if="scope.row.appStatus == 0" type="primary"
                       :underline="false"
                       @click="goActive(scope.row.system_no)">开通移动端</el-link>
              <el-link v-else type="info"
                       :underline="false"
                       >已开通移动端</el-link>
              <em></em>
              <el-link type="primary"
                :underline="false"
                @click="goReset(scope.row.id)">重置密码</el-link>
              <em></em>
              <el-link type="danger"
                :underline="false"
                @click="goDel(scope.row.id)">删除</el-link>
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

        <el-link class="del" type="primary" icon="el-icon-close"
          :underline="false"
          @click="goDel()">全部删除</el-link>
      </div>
    </div>

    <!-- 确认模态框 -->
    <ys-modal-confirm ref="ysconfirm"
      :confirmData="confirmData"
      v-on:confirmCalBak="toReset"></ys-modal-confirm>

    <ys-modal-confirm ref="ysconfirm2"
      :confirmData="confirmData"
      v-on:confirmCalBak="toDel"></ys-modal-confirm>

      <ys-modal-confirm ref="ysconfirm3"
      :confirmData="confirmData"
      v-on:confirmCalBak="toActive"></ys-modal-confirm>

    <!-- 表单模态框 -->
    <ys-modal-form ref="ysform"
      :formData="formData"
      :formRule="formRule"
      v-on:formCalBak="askDatas"></ys-modal-form>

    <ys-modal-edit-form ref="ysform2"
                        :formData="formEditData"
                        :formRule="formEditRule"
                        v-on:formCalBak="askDatas"></ys-modal-edit-form>

    <ys-modal-activate-form ref="ysform3"
      :formData="formActivate"
      :formRule="formActivateRule"
      v-on:formCalBak="askDatas"></ys-modal-activate-form>

    <!-- 文件模态框 -->
    <ys-modal-file ref="ysfile"
      :fileData="fileData"
      v-on:fileCalBak="askDatas"></ys-modal-file>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ysModalForm from '@/components/modalform/addStudent'
import ysModalEditForm from '@/components/modalform/editStudent'
import ysModalActivateForm from '@/components/modalform/ActivateStudent'

export default {
  components: {
    ysModalForm, ysModalEditForm, ysModalActivateForm
  },
  props: [
  ],
  data () {
    return {
      items: [], // 学生数据
      itemsEdu: [], // 学段数据
      itemsRoom: [], // 班级数据
      cnt: 0, // 总数
      size: 20, // 单页数目
      selection: [], // 已勾选列表

      params: { page: 1, select_edu_stage: '', year: '', room_id: '', searchKey: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'select_edu_stage', value: null, placeholder: '选择阶段', cbk: 'eduCalBak' },
          { key: 'year', value: null, placeholder: '选择年级', reset: true, needed: 'select_edu_stage', cbk: 'yearCalBak' },
          { key: 'room_id', value: null, placeholder: '选择班级', reset: true, needed: 'year' }
        ],
        keywords: true,
        buttons: [
          { key: 'addNew', value: '新增学生' }
        ],
        files: { key: 'fileDeal', value: null, placeholder: null, model: '' }
      },

      // 确认内容数据
      confirmData: { k: 'student' },

      // 表单内容数据
      formData: {
        id: undefined,
        select_edu_stage: '',
        year: '',
        room_id: '',
        students: ''
      },

      // 表单内容验证
      formRule: [
        ['needless', { list: null }],
        ['needless', { list: null }],
        ['select', { list: null, data: null }],
        ['cont', {}]
      ],

      // 表单内容数据
      formEditData: {
        id: undefined,
        select_edu_stage: '',
        year: '',
        room_id: '',
        name: '',
        sex: '',
        student_no: '',
        home_mobile: ''
      },

      // 表单内容验证
      formEditRule: [
        ['needless', { list: null }],
        ['needless', { list: null }],
        ['select', { list: null, data: null }],
        ['name', {}],
        ['need', {}],
        ['no', {}],
        ['tel', {}]
      ],
      formActivate: {
        mobile: '',
        system_no: ''
      },
      formActivateRule: [
        ['need', {}],
        ['need', {}]
      ],

      // 文件内容数据
      fileData: { name: '学生' }
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'xueduan', 'nianji',
      'xingbie',
      'piliang'
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
      let $rt = this.$get('v2z/studentList/', this.params)
      $rt.then((rt) => {
        // 学生数据
        this.items = rt.data.list
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize

        for (let item of this.items) {
          let room = rt.data.rooms[item.room_id]
          item.yearname = room.year_grade
          item.roomname = room.name
          item.musicname = room.music_teacher_name
          item.artname = room.art_teacher_name

          for (let v of this.xingbie) {
            if (item.sex === v.id) {
              item.sexname = v.name
              break
            }
          }
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

        const keys = Object.keys(rt.data.rooms)
        for (let index of keys) {
          let item = rt.data.rooms[index]
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
      $sel[0].value = JSON.parse(JSON.stringify(this.itemsEdu))

      const $file = this.searchData.files
      $file.value = this.piliang
      $file.placeholder = this.piliang[0]['name']
    },

    /**
     * [setFormData 设置表单内容数据]
     * @return {[]} []
     */
    setFormData () {
      const $edu = this.formRule[0][1]
      $edu.list = JSON.parse(JSON.stringify(this.itemsEdu))

      const $room = this.formRule[2][1]
      $room.data = JSON.parse(JSON.stringify(this.itemsRoom))

      const $eduEdit = this.formEditRule[0][1]
      $eduEdit.list = JSON.parse(JSON.stringify(this.itemsEdu))

      const $roomEdit = this.formEditRule[2][1]
      $roomEdit.data = JSON.parse(JSON.stringify(this.itemsRoom))
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
      $sel[2]['value'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          $sel[1]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(1)
    },

    /**
     * [yearChange 切换年级]
     * @param  {[Int]} id [年级ID]
     * @return {[]} []
     */
    yearChange (id) {
      const $sel = this.searchData.selector
      $sel[2]['value'] = []

      for (let item of this.itemsRoom) {
        if (id === item.grade) {
          $sel[2]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(2)
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
     * [toAdd 新增学生]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toAdd (id) {
      this.$refs.ysform.initial()
    },

    /**
     * [toEdit 编辑学生]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toEdit (id) {
      this.formEditData.id = id
      this.$refs.ysform2.initial()
    },
    /**
     *激活学生端
     * */
    activate (id) {
      this.formEditData.id = id
      this.$refs.ysform3.initial()
    },
    /**
     * [goReset 准备重置密码]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    goReset (id) {
      const params = { id: id }

      this.$refs.ysconfirm.toggleShow(params)
      this.confirmData.v = 0
    },

    /**
     * [toReset 重置密码]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toReset (_params) {
      let $rt = this.$post('admin/reset_student_pwd/', _params)
      $rt.then((rt) => {
        this.$message({
          type: 'success',
          message: '密码重置成功！当前密码同账号',
          showClose: true
        })
      }).catch((rt) => {
      })
    },

    /**
     * [goDel 准备删除学生]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    goDel (id) {
      let v = 2

      // 批量处理
      if (!id) {
        // 未勾选
        if (this.selection.length === 0) {
          this.$refs.ysconfirm2.toggleShow()
          this.confirmData.v = 3
          return
        }

        id = []
        for (let item of this.selection) {
          id.push(item.id)
        }
        id = id.join(',')
      } else {
        v = 1
      }

      const params = { ids: id }

      this.$refs.ysconfirm2.toggleShow(params)
      this.confirmData.v = v
    },

    /**
     * [toDel 删除学生]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toDel (_params) {
      let $rt = this.$post('admin/del_student/', _params)
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },
    /**
     * [goActive 准备开通移动端]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    goActive (systemNo) {
      let v = 4
      const params = { system_no: systemNo }
      console.log(this.confirmData)
      this.$refs.ysconfirm3.toggleShow(params)
      this.confirmData.v = v
    },
    /**
     * [toDel 开通学生端]
     * @param  {[Object]} _params [中转参数]
     * @return {[]} []
     */
    toActive (_params) {
      let $rt = this.$get('meiyu/compatibleBindSystemNo/', _params)
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },
    /**
     * [toFile 批量操作]
     * @param  {[Int]} v [操作方式]
     * @return {[]} []
     */
    toFile (v) {
      if (v === '0') {
        let file = this.url + 'admin/exportStaudent/?uc_sid=' + this.cookie
        const keys = Object.keys(this.params)
        for (let k of keys) {
          if (k === 'page') continue

          let v = this.params[k]
          file += '&' + k + '=' + v
        }

        window.open(file)
      } else {
        this.$refs.ysfile.initial()
      }
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
