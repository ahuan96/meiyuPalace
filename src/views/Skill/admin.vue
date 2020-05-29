<template>
  <div class="group">
    <ys-search ref="yssearch"
      :searchData="searchData"
      v-on:searchCalBak="paramsChange"></ys-search>

    <div class="main long">
      <div class="mid">
        <el-table stripe height="100%"
          :data="items">
          <el-table-column label="认证方式" prop="type">
            <template slot-scope="scope">
              <span>{{scope.row.type == '1'?'线下认证':'线上认证'}}</span>
            </template>
          </el-table-column>

          <el-table-column label="姓名" prop="student_name"></el-table-column>

          <el-table-column label="学号" prop="student_no"></el-table-column>

          <el-table-column label="班级" prop="room_name"></el-table-column>

          <el-table-column label="上传时间" prop="uploadTime"></el-table-column>

          <el-table-column label="状态" prop="stateName"></el-table-column>

          <el-table-column label="查看申请" prop="end_time">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="toView(scope.row)">查看</el-link>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <template v-if="scope.row.state == 2">
                <el-link type="primary"
                :underline="false"
                @click="toViewScore(scope.row)">查看分数</el-link>
              </template>
              <template v-if="scope.row.state == 0 ">
                <em></em>
                  <el-link type="primary"
                :underline="false"
                @click="toScore(scope.row)">评分</el-link>
              <em></em>
              <el-link type="primary"
                :underline="false"
                @click="toBack(scope.row)">驳回</el-link>
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

    <!-- 表单模态框 -->
    <ys-modal-form ref="ysform"
      :formData="formData"
      v-on:formCalBak="askDatas"></ys-modal-form>

    <ys-modal-form-score ref="ysform2"
      :formData="formDataScore"
      v-on:formCalBak="askDatas"></ys-modal-form-score>

    <ys-modal-form-view ref="ysform3"
      :formData="formDataView"
      v-on:formCalBak="askDatas"></ys-modal-form-view>

    <ys-modal-form-preview ref="ysform4"
      :formData="formDataPreview"
      v-on:formCalBak="askDatas"></ys-modal-form-preview>
  </div>
</template>

<script>
import ysModalForm from '@/components/modalform/backSkill'
import ysModalFormScore from '@/components/modalform/scoreSkill'
import ysModalFormView from '@/components/modalform/viewSkill'
import ysModalFormPreview from '@/components/modalform/previewSkill'

export default {
  components: {
    ysModalForm,
    ysModalFormScore,
    ysModalFormView,
    ysModalFormPreview
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
        selector: [],
        keywords: true
      },

      // 表单内容数据
      formData: {},

      formDataScore: {},

      formDataView: {},

      formDataPreview: {}
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
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas () {
      let $rt = this.$get('student_certificate/index/', this.params)
      $rt.then((rt) => {
        // 老师数据
        this.items = rt.data.rows
        this.cnt = parseInt(rt.data.total)
        this.size = rt.data.pagesize

        for (let item of this.items) {
          item.uploadTime = '2019-12-12 19:50'

          if (item.state === '1') {
            item.stateName = '驳回'
          } else if (item.state === '2') {
            item.stateName = '通过'
          } else {
            item.stateName = '待审核'
          }
        }
      }).catch((rt) => {
      })
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
     * [toBack 驳回]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toBack (item) {
      this.formData.id = item.id
      this.$refs.ysform.initial()
    },

    /**
     * [toScore 评分]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toScore (item) {
      this.formDataScore.id = item.id
      this.formDataScore.conf_id = item.conf_id
      this.formDataScore.student_id = item.student_id
      this.$refs.ysform2.initial()
    },

    /**
     * [toViewScore 查看分数]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toViewScore (item) {
      this.formDataView.score = item.score
      this.formDataView.comment = item.comment
      this.$refs.ysform3.initial()
    },

    /**
     * [toView 查看申请]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toView (item) {
      this.formDataPreview.id = item.id
      this.$refs.ysform4.initial()
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
