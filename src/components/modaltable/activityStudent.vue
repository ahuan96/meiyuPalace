<template>
  <el-dialog width="960px" title="校外实践待审核列表" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing">
    <el-table ref="eltable" stripe
      :data="items"
      @selection-change="selectionChange">

      <el-table-column label="姓名" prop="student_name" width="100"></el-table-column>

      <el-table-column label="学号" prop="student_no" width="180"></el-table-column>

      <el-table-column label="班级" prop="class_name" width="120"></el-table-column>

      <el-table-column label="上传档案">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.srcImg"
            :preview-src-list="scope.row.srcList">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="打分">
        <template slot-scope="scope">
          <input type="text" v-model="scope.row.point" class="el-input__inner" placeholder="请输入分数">
        </template>
      </el-table-column>

      <el-table-column label="评语">
        <template slot-scope="scope">
          <input type="text" v-model="scope.row.remark" class="el-input__inner" placeholder="请输入评语">
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-link type="primary"
            :underline="false"
            @click="toSubmit(scope.row)">提交</el-link>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer"
      v-if="cnt">
      <ys-page
        :cnt="cnt"
        :size="size"
        v-on:page="pageChange"></ys-page>
    </span>
  </el-dialog>
</template>

<script>
import mixmodal from '../mixin/modal'
import mixtable from '../mixin/table'

export default {
  mixins: [mixmodal, mixtable],
  components: {
  },
  props: [
  ],
  data () {
    return {
      selection: [], // 已勾选列表
      items: [], // 学生数据
      itemsEdu: [], // 学段数据
      itemsRoom: [], // 班级数据
      formData: {
        point: '',
        remark: ''
      },
      params: {} // 参数
    }
  },
  computed: {
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial () {
      Object.assign(this.params, this.tableData)
      this.askDatas(() => {
        this.toggleShow()
        this.fileSegmentation()
      })
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas (cbk) {
      let $rt = this.$get('meiyu/getActivityApply/', this.params)
      $rt.then((rt) => {
        // 学生数据
        this.items = rt.data.list
        this.cnt = rt.data.cnt
        this.size = rt.data.pagesize
        console.log('items', this.items)
        cbk()
      }).catch((rt) => {
      })
    },
    /**
     * [selectionChange 切换勾选项]
     * @param  {[Array]} arr [勾选列表]
     * @return {[]} []
     */
    selectionChange (arr) {
      this.selection = arr
    },
    fileSegmentation () {
      for (var key of this.items) {
        let i = this.items.indexOf(key)
        this.items[i].srcList = []
        this.items[i].srcImg = ''
        var file = key.file
        var imgUrl = file.split(';')
        let num = 0
        for (var item of imgUrl) {
          this.items[i].srcList[num] = item
          ++num
        }
        this.items[i].srcImg = this.items[i].srcList[0]
      }
    },

    /**
     * [toSubmit 提交]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toSubmit (item) {
      var param = {'student_id': item.student_id, 'a_id': item.a_id, 'state': 1, 'point': item.point, 'remark': item.remark}
      if (!this.isNumber(param.point)) {
        this.$err('请输入数字')
        return
      } else if (param.point < 0 || param.point > 5) {
        this.$err('请输入0-5之间的数字')
        return
      }
      console.log('param', param)
      let $rt = this.$get('meiyu/alterActivityApplyState/', param)
      $rt.then((rt) => {
        this.$message({
          type: 'success',
          message: '成功',
          showClose: true
        })
      }).catch((rt) => {
      })
    },
    // 验证是否为数字
    isNumber (value) {
      let patrn = /^(-)?\d+(\.\d+)?$/
      if (patrn.exec(value) == null || value === '') {
        return false
      } else {
        return true
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
