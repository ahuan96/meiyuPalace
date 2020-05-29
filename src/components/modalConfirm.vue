<template>
  <el-dialog class="modal-confirm" width="420px" title="提示" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <p
      v-html="letter[confirmData.k][confirmData.v]"
      v-if="confirmData"></p>

    <span slot="footer">
      <template
        v-if="confirmData.buttons">
        <el-button type="primary"
          :key="item.name"
          @click="item.fun ? item.fun() : toggleShow()"
          v-html="item.name"
          v-for="item of confirmData.buttons"></el-button>
      </template>
      <template
        v-else>
        <el-button type="primary"
          @click="confirmDeal">确 定</el-button>
        <el-button type="info"
          @click="toggleShow()">取 消</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import mixmodal from './mixin/modal'

export default {
  mixins: [mixmodal],
  components: {
  },
  props: [
    'confirmData'
  ],
  data () {
    return {
      letter: {
        home: [
          '暂无学生提交练习，请晚些时候再试'
        ],
        teacher: [
          '确定删除该老师账号吗？'
        ],
        student: [
          '确定为该学生账号重置密码吗？重置成功后密码同账号',
          '确定删除该学生账号吗？',
          '确定批量删除当前已勾选的学生账号吗？',
          '至少勾选一个学生账号',
          '确定为该学生开通移动端吗？'
        ],
        classroom: [
          '确定解散该班级吗？'
        ],
        group: [
          '确定关闭该社团吗？'
        ],
        process: [
          '确定上报所选班级的评价报表吗？'
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    /**
     * [confirmDeal 确定操作]
     * @return {[]} []
     */
    confirmDeal () {
      this.$emit('confirmCalBak', this._params)
      this.toggleShow()
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
