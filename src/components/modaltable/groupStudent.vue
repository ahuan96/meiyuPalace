<template>
  <el-dialog width="960px" title="社团小组申请列表" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing">
    <el-table ref="eltable" stripe
      :data="items"
      @selection-change="selectionChange">
      <el-table-column prop="id" type="selection" width="35"></el-table-column>

      <el-table-column label="姓名" prop="name" width="100"></el-table-column>

      <el-table-column label="学号" prop="student_no" width="120"></el-table-column>

      <el-table-column label="班级" prop="class_name" width="120"></el-table-column>

      <el-table-column label="申请理由" prop="apply_content" width="120"></el-table-column>

      <el-table-column label="申请图片  " prop="imgs">
        <template slot-scope="scope">
          <div class="row-box" v-if="scope.row.imgs && scope.row.imgs.length > 0">
            <el-image class="row-img"  :src="scope.row.imgs[0]"  alt="" :preview-src-list="scope.row.imgs"></el-image>
            <span>  共{{scope.row.imgs.length}}张</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-link type="primary"
            :underline="false"
            @click="toPass(scope.row)">通过</el-link>
          <em></em>
          <el-link type="danger"
            :underline="false"
            @click="toNone(scope.row)">拒绝</el-link>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer"
      v-if="cnt">
      <ys-page
        :cnt="cnt"
        :size="size"
        v-on:page="pageChange"></ys-page>

      <div class="deal">
        <el-link type="primary" icon="el-icon-check"
          :underline="false"
          @click="toPass()">全部通过</el-link>
        <el-link type="danger"
          :underline="false" icon="el-icon-close"
          @click="toNone()">全部拒绝</el-link>
      </div>
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
        this.setImg()
      })
      this.toggleShow()
    },
    setImg () {
      console.log('aaa')
      console.log(this.items)

      this.items.forEach(item => {
        if (item.file) {
          if (item.file[item.file.length - 1] === ';') {
            item.file = item.file.substring(0, item.file.length - 1)
          }
          item.imgs = item.file.split(';')
        } else {
          item.imgs = []
        }
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
    /**
     * [pageChange 切换页码]
     * @param  {[Int]} p [页码]
     * @return {[]} []
     */
    pageChange (p) {
      this.params.page = p
      this.askDatas(() => {
        this.setImg()
      })
    },

    /**
     * [toPass 通过]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toPass (item) {
      const params = {
        student_id: [],
        org_id: this.tableData.org_id,
        apply_state: 1
      }

      if (!item) {
        for (let it of this.selection) {
          params.student_id.push(it.id)
        }
      } else {
        params.student_id.push(item.id)
      }
      params.student_id = params.student_id.join(',')

      let $rt = this.$get('palace_org/alterApplyState/', params)
      let _this = this
      $rt.then((rt) => {
        _this.askDatas(() => {
          this.setImg()
        })
      }).catch((rt) => {
      })
    },

    /**
     * [toNone 拒绝]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toNone (item) {
      const params = {
        student_id: [],
        org_id: this.tableData.org_id,
        apply_state: -1
      }

      if (!item) {
        for (let it of this.selection) {
          params.student_id.push(it.id)
        }
      } else {
        params.student_id.push(item.id)
      }
      params.student_id = params.student_id.join(',')

      let $rt = this.$get('palace_org/alterApplyState/', params)
      let _this = this
      $rt.then((rt) => {
        this.askDatas(() => {
          _this.setImg()
        })
      }).catch((rt) => {
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
