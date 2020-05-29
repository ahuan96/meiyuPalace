<template>
  <div class="teacher">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:addNew="toAdd"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table stripe height="100%"
          :data="items">
          <el-table-column label="系统帐号" prop="login_account"></el-table-column>

          <el-table-column label="老师姓名" prop="teacher_name"></el-table-column>

          <el-table-column label="科目" prop="subject"></el-table-column>

          <el-table-column label="联系电话" prop="phone"></el-table-column>

          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toEdit(scope.row.id)">修改信息</el-link>
              <em></em>
              <el-link type="primary"
                :underline="false"
                @click="toReset(scope.row.id)">修改密码</el-link>
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

    <ys-modal-form-edit ref="ysformedit"
      :formData="formDataEdit"
      :formRule="formRuleEdit"
      v-on:formCalBak="askDatas"></ys-modal-form-edit>

    <ys-modal-form-password ref="ysformpassword"
      :formData="formDataPassword"
      :formRule="formRulePassword"
      v-on:formCalBak="askDatas"></ys-modal-form-password>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ysModalForm from '@/components/modalform/addTeacher'
import ysModalFormEdit from '@/components/modalform/editTeacher'
import ysModalFormPassword from '@/components/modalform/passwordTeacher'

export default {
  components: {
    ysModalForm, ysModalFormEdit, ysModalFormPassword
  },
  props: [
  ],
  data () {
    return {
      items: [], // 老师数据
      cnt: 0, // 总数
      size: 20, // 单页数目

      params: { page: 1, type: '', searchKey: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'type', value: null, placeholder: '选择学科' }
        ],
        keywords: true,
        buttons: [
          { key: 'addNew', value: '新增老师' }
        ]
      },

      // 确认内容数据
      confirmData: { k: 'teacher', v: 0 },

      // 表单内容数据
      formData: {
        admin_id: undefined,
        type: '',
        name: '',
        pwd: '',
        pwd2: '',
        mobile: ''
      },

      // 表单内容验证
      formRule: [
        ['select', { list: null }],
        ['name', {}],
        ['password', {}],
        ['password', {}],
        ['tel', {}]
      ],

      // 表单编辑数据
      formDataEdit: {
        admin_id: undefined,
        type: '',
        name: '',
        mobile: ''
      },

      // 表单编辑验证
      formRuleEdit: [
        ['select', { list: null }],
        ['name', {}],
        ['tel', {}]
      ],

      // 表单密码数据
      formDataPassword: {
        admin_id: undefined,
        pwd: '',
        pwd2: ''
      },

      // 表单密码验证
      formRulePassword: [
        ['password', {}],
        ['password', {}]
      ]
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'xueke'
    ])
  },
  methods: {
    /**
     * [initPages 初始化]
     * @return {[]} []
     */
    initPages () {
      this.askDatas()

      this.setSearchData()
      this.setFormData()
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas () {
      let $rt = this.$get('palace_org/getTeachers', this.params)
      $rt.then((rt) => {
        // 老师数据
        this.items = rt.data.list
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize

        for (let item of this.items) {
          if (item.type === '-1') {
            item.subject = '艺术综合'
          } else if (item.type === '1') {
            item.subject = '音乐'
          } else if (item.type === '2') {
            item.subject = '美术'
          }
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
      $sel[0].value = this.xueke
    },

    /**
     * [setFormData 设置表单内容数据]
     * @return {[]} []
     */
    setFormData () {
      const $type = this.formRule[0][1]
      $type.list = this.xueke

      const $edit = this.formRuleEdit[0][1]
      $edit.list = this.xueke
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
     * [toAdd 新增老师]
     * @return {[]} []
     */
    toAdd () {
      this.$refs.ysform.initial()
    },

    /**
     * [toEdit 修改老师]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toEdit (id) {
      this.formDataEdit.admin_id = id
      this.$refs.ysformedit.initial()
    },

    /**
     * [toReset 修改密码]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toReset (id) {
      this.formDataPassword.admin_id = id
      this.$refs.ysformpassword.initial()
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
