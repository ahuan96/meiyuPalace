<template>
  <div class="teacher">
    <div class="r-header">
           <button ><a href="/static/palace/file/泉州教学计划模板.xls" download="教学计划模板.xls">下载教学计划模板</a></button>
           <button ><a href="/static/palace/file/泉州教学年度总结.xls" download="学期总结模板.xls">下载学期总结模板</a></button>
    </div>
    <div class="main long">
      <div class="mid">
        <el-table  height="100%"
          :cell-class-name="setCellName"
          :data="items">

          <el-table-column label="系统帐号" prop="username"></el-table-column>

          <el-table-column label="老师姓名" prop="name">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toView(scope.row.id )">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>

          <el-table-column label="科目" prop="subjectName"></el-table-column>

          <el-table-column label="联系电话" prop="tel"></el-table-column>

          <el-table-column label="操作" width="340" >
            <template slot-scope="scope" >
              <div style="display:flex;flex-wrap:wrap;align-items: center;">
                <el-link type="primary"
                :underline="false"
                @click="toEdit(scope.row.id)">修改信息</el-link>
              <em></em>
              <el-link type="primary"
                :underline="false"
                @click="toReset(scope.row.id)">修改密码</el-link>
                <em></em>
                 <el-link type="primary"
                  :underline="false"
                  @click="toViewGroup(scope.row.id)">社团信息</el-link>
                <em></em>
                 <el-link   v-if="scope.row.plan_file" target="_blank" :href="scope.row.plan_file" :underline="false">
                   已上传教学计划
                </el-link>
                <el-upload
                  v-else
                  class="avatar-uploader"
                  :action="action"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  name="userfile"
                  list-type="text"
                  :before-upload="beforeAvatarUpload">
                <el-link type="primary"
                :underline="false">上传教学计划</el-link>
              </el-upload>
              <em></em>
              <el-link  v-if="scope.row.report_file" target="_blank" :href="scope.row.report_file" :underline="false">
                已上传学期总结
              </el-link>
                <el-upload
                v-else
                  class="avatar-uploader"
                  :action="action2"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  name="userfile"
                  list-type="text"
                  :before-upload="beforeAvatarUpload">
                <el-link type="primary"
                :underline="false">上传学期总结</el-link>
              </el-upload>
              </div>
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
import ysModalFormView from '@/components/modalform/viewTeacher'
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
      action: this.url + 'palace_teacher/upload?' + '&p_token=' + this.cookie + '&type=plan_file',
      action2: this.url + 'palace_teacher/upload?' + '&p_token=' + this.cookie + '&type=report_file',
      params: { page: 1, subject: '', keywords: '' }, // 参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'subject', value: null, placeholder: '选择学科' }
        ],
        searchCont: true,
        placeholder: '请输入老师姓名',
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
        name: '',
        password: '',
        pwd2: '',
        tel: ''
      },

      // 表单内容验证
      formRule: [
        ['select', { list: null }],
        ['desc', {}],
        ['idcard', {}],
        ['name', {}],
        ['password', {}],
        ['password', {}],
        ['tel', {}]
      ],

      // 表单编辑数据
      formDataEdit: {
        id: undefined,
        subject: '',
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
        ['password2', {}]
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
      let $rt = this.$get('palace_teacher/plan_list/')
      $rt.then((rt) => {
        // 老师数据
        // this.$set(this.items, rt.data.list)
        this.items = rt.data.list
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
      // this.$set(this.items, 0, this.$userInfo)
      // for (let item of this.items) {
      //   if (item.subject === '3') {
      //     item.subjectName = '艺术综合'
      //   } else if (item.subject === '1') {
      //     item.subjectName = '音乐'
      //   } else if (item.subject === '2') {
      //     item.subjectName = '美术'
      //   }
      // }
    },
    beforeAvatarUpload (file) {
    },
    handleAvatarSuccess (res, file) {
      this.$notify({
        title: '成功',
        message: '上传文件成功',
        type: 'success'
      })
      this.initPages()
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
      // if (scope.row.level === '1' && scope.columnIndex === 0) {
      //   return 'master'
      // }
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
      this.$router.push({name: 'TeacherTgroup', query: { id: id }})
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
      let $rt = this.$post('admin/delete_account/', _params)
      $rt.then((rt) => {
        this.askDatas()
      }).catch((rt) => {
      })
    },
    /**
     * [toUpfile 上传文件]
     * @param  {[Number]} type [类型]
     * @return {[]} []
     */
    toUpfile (type) {
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
