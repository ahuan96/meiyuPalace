<template>
  <div class="teacher">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:addNew="toAdd"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table  height="100%"
          :cell-class-name="setCellName"
          :data="items">

          <el-table-column class-name="mar_left" label="系统帐号" prop="username"></el-table-column>

          <el-table-column label="老师姓名" prop="name">
              <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toView(scope.row.id )">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>

          <el-table-column label="科目" prop="subjectName"></el-table-column>
          <el-table-column label="类别" prop="category"></el-table-column>

          <el-table-column label="联系电话" prop="tel"></el-table-column>

          <el-table-column label="操作" width="440">
            <template slot-scope="scope">

                <template v-if="curTeacher.level == '1' || (curTeacher.id == scope.row.id) ">
                  <el-link type="primary"
                    :underline="false"
                    @click="toEdit(scope.row.id)">修改信息</el-link>
                  <em></em>
                  <el-link type="primary"
                    :underline="false"
                    @click="toReset(scope.row.id)">修改密码</el-link>
                </template>
                <template v-else>
                  <el-link :underline="false">修改信息</el-link>
                  <em></em>
                  <el-link :underline="false">修改密码</el-link>
                </template>
              <em></em>
              <el-link type="primary"
                  :underline="false"
                  @click="toViewGroup(scope.row.id)">社团信息</el-link>
                <em></em>
                 <el-link  type="primary"  v-if="scope.row.plan_file" target="_blank" :href="scope.row.plan_file" :underline="false">
                   查看教学计划
                </el-link>
                <el-link  v-else target="_blank"  :underline="false">
                   查看教学计划
                </el-link>
                <em></em>
              <el-link  type="primary" v-if="scope.row.report_file" target="_blank" :href="scope.row.report_file" :underline="false">
                查看学期总结
              </el-link>
              <el-link  v-else target="_blank"  :underline="false">
                查看学期总结
              </el-link>
                <em></em>
              <el-link type="danger"
                v-if="(curTeacher.level == '1')"
                :underline="false"
                @click="goDel(scope.row.id)">删除</el-link>
              <el-link v-else :underline="false">删除</el-link>
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

  <ys-modal-form-view ref="ysformview"
      :formData="formDataView"
      :formRule="formRuleEdit"
      v-on:formCalBak="askDatas"></ys-modal-form-view>

    <ys-modal-form-password ref="ysformpassword"
      :formData="formDataPassword"
      :formRule="formRulePassword"
      v-on:formCalBak="askDatas"></ys-modal-form-password>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ysModalForm from '@/components/modalform/addYoung'
import ysModalFormEdit from '@/components/modalform/editYoung'
import ysModalFormView from '@/components/modalform/viewYoung'
import ysModalFormPassword from '@/components/modalform/passwordYoung'

export default {
  components: {
    ysModalForm, ysModalFormEdit, ysModalFormPassword, ysModalFormView
  },
  props: [
  ],
  data () {
    return {
      items: [], // 老师数据
      cnt: 0, // 总数
      size: 20, // 单页数目
      curTeacher: {}, // 当前老师
      params: { page: 1, subject: '', keywords: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'subject', value: null, placeholder: '选择学科' }
        ],
        searchCont: true,
        exitBtn: true,
        placeholder: '查询内容',
        buttons: [
          { key: 'addNew', value: '新增老师' }
        ]
      },

      // 确认内容数据
      confirmData: { k: 'teacher', v: 0 },

      // 表单内容数据
      formData: {
        admin_id: undefined,
        subject: '',
        synopsis: '',
        idcard: '',
        category: '',
        name: '',
        password: '',
        pwd2: '',
        tel: ''
      },

      // 表单内容验证
      formRule: [
        ['select', { list: null }],
        ['cont', {}],
        ['idcard', {}],
        ['cont', {}],
        ['name', {}],
        ['password', {}],
        ['password', {}],
        ['tel', {}]
      ],

      // 表单编辑数据
      formDataEdit: {
        id: undefined,
        subject: '',
        category: '',
        name: '',
        tel: '',
        idcard: '',
        synopsis: ''
      },
      // 查看信息
      formDataView: {
        admin_id: undefined,
        subject: '',
        name: '',
        tel: '',
        idcard: '',
        synopsis: ''
      },
      // 表单编辑验证
      formRuleEdit: [
        ['select', { list: null }],
        ['cont', {}],
        ['name', {}],
        ['tel', {}],
        ['idcard', {}],
        ['cont', {}]
      ],

      // 表单密码数据
      formDataPassword: {
        id: undefined,
        password: '',
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
      'xueke2'
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
      let $rt = this.$get('palace_teacher/plan_list/', this.params)
      $rt.then((rt) => {
        // 老师数据
        this.items = rt.data.list
        this.curTeacher = rt.data.current_teacher
        this.cnt = rt.data.cnt
        // this.size = rt.data.pagesize 默认20

        for (let item of this.items) {
          if (item.subject === '3') {
            item.subjectName = '艺术综合'
          } else if (item.subject === '1') {
            item.subjectName = '音乐'
          } else if (item.subject === '2') {
            item.subjectName = '美术'
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
      $sel[0].value = this.xueke2
    },

    /**
     * [setFormData 设置表单内容数据]
     * @return {[]} []
     */
    setFormData () {
      const $subject = this.formRule[0][1]
      $subject.list = this.xueke2

      const $edit = this.formRuleEdit[0][1]
      $edit.list = this.xueke2
    },
    setCellName (scope) {
      if (scope.row.level === '1' && scope.columnIndex === 0) {
        return 'master'
      }
      return ''
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
      console.log(this.params)
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
      this.formDataEdit.id = id
      this.$refs.ysformedit.initial()
    },
    /**
     * [toEdit 查看老师信息]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toView (id) {
      this.formDataView.admin_id = id
      this.$refs.ysformview.initial()
    },
    /**
     * [toEdit 查看社团信息]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toViewGroup (id) {
      this.formDataView.admin_id = id
      this.$router.push({name: 'TeacherTgroup', params: { id: id }})
    },
    /**
     * [toReset 修改密码]
     * @param  {[Int]} id [用户ID]
     * @return {[]} []
     */
    toReset (id) {
      this.formDataPassword.id = id
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
      let $rt = this.$post('palace_teacher/delete/', {}, _params)
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
