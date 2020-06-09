<template>
<div>
  <el-drawer size="70%" title="创建考勤" direction="rtl" oncontextmenu="return false" onselectstart="return false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <div class="demo-drawer__content" style="bottom:0">
      <div class="kaoqin">
        <div>
          <div class="tit-head">
            <div class="d-date">
              <h3>{{searchData.text}}</h3>
              <ul>
                <li style="margin:0">
                   <el-date-picker
                    v-model="now_date"
                    type="date"
                    readonly
                    placeholder="选择日期">
                  </el-date-picker>
                </li>
              </ul>
            </div>
            <el-button type="primary"
                @click="dialogVisible=true">{{teacher_record?'查看活动记录':'填写活动记录'}}</el-button>
          </div>
          <div></div>
        </div>
        <div class="edit" style="top:4.7rem;bottom:1rem">
          <dl class="ke">
            <dt class="fcen">
              <div>
                <h3>学生名单：</h3>
              <ul>
                <li>
                  <div class="chu">出勤</div>
                  <div class="que">缺勤</div>
                </li>
              </ul>
              </div>
              <el-button type="primary"
                     v-if="!allCheck"
                     @click="toAllCheck">全 选</el-button>
                  <el-button type="primary"
                     v-else
                     @click="toNoCheck">反 选</el-button>
            </dt>
            <dd>
              <ul
                :changesvalue="changesvalue">
                <li
                  :key="index"
                  :class="item.absence === 0 ? '' : 'none'"
                  v-for="(item, index) of items">
                  <h3>
                    <i
                      @click="chuqinChange(index)"></i>
                    <p>{{item.name}}</p>
                  </h3>
                </li>
              </ul>

              <el-button type="primary"
                @click="toAdd">提交考勤</el-button>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </el-drawer>
   <!-- 填写教师记录 -->
    <el-dialog
      title="教师活动记录"
      :visible.sync="dialogVisible"
      width="500px">
      <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="teacher_record"
          show-word-limit
        >
        </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixdrawer from '../mixin/drawer'
import mixtable from '../mixin/table'

export default {
  mixins: [mixdrawer, mixtable],
  components: {
  },
  props: [
  ],
  data () {
    return {
      dialogVisible: false, // 填写教师记录弹框显示
      teacher_record: '', // 活动记录信息
      allCheck: false, // 全选
      items: [], // 学生数据
      now_date: new Date(), // 当前日期
      params: {}, // 参数

      // 查询内容数据
      searchData: {
        selector: [],
        text: '',
        nosearchbutton: true
      },

      changesvalue: null // 切换值
    }
  },
  computed: {
  },
  watch: {
    items: {
      handler (value) {
        console.log(9, value)
        var count = 0
        for (var i = 0; i < value.length; i++) {
          if (value[i].absence === 0) {
            count++
          }
        }
        // 如果子集全部选中，全选按钮设置选中状态
        console.log(count)
        if (count === value.length) {
          this.allCheck = true
        } else {
          this.allCheck = false
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial () {
      Object.assign(this.params, this.tableData)

      // 重置缓存数据
      this.items = []

      this.askDatas(() => {
        this.toggleShow()
      })
    },

    /**
     * [askDatas 请求数据]
     * @param  {[Function]} cbk [回调]
     * @return {[]} []
     */
    askDatas (cbk) {
      let $rt = this.$get('palace_org/attendanceList/', this.params)
      $rt.then((rt) => {
        // 考勤基本信息
        this.searchData.text = '社团名：' + rt.data.data.name

        // 学生数据
        this.items = rt.data.studentList
        for (let item of this.items) {
          item.absence = 0
        }

        cbk()
      }).catch((rt) => {
      })
    },

    /**
     * [chuqinChange 切换出勤状态]
     * @param  {[Object]} index [元素序号]
     * @return {[]} []
     */
    chuqinChange (index) {
      let item = this.items[index]
      if (item.absence === 0) {
        item.absence = 1
        item.detail = []
      } else {
        item.absence = 0
      }
      this.$set(this.items, index, item)
      console.log(this.items)
      this.changesvalue = Math.random()
    },

    /**
     * [toAdd 添加考勤]
     * @return {[]} []
     */
    toAdd () {
      const params = {
        teacher_record: this.teacher_record,
        absenteeism_num: 0,
        attendance_num: 0,
        bsenteeism: [],
        queqin: [],
        org_id: this.tableData.org_id
      }
      if (!params.teacher_record) {
        this.$err('请填写考勤记录')
        return
      }
      for (let item of this.items) {
        if (item.absence === 0) {
          params.attendance_num++
          params.bsenteeism.push(item.student_id)
        } else {
          params.absenteeism_num++
          params.queqin.push(item.student_id)
        }
      }
      if (params.bsenteeism) {
        params.bsenteeism = params.bsenteeism.join(',')
      }
      if (params.queqin) {
        params.queqin = params.queqin.join(',')
      }

      let $rt = this.$get('palace_org/addAttendance/', params)
      $rt.then((rt) => {
        this.toggleShow()
      }).catch((rt) => {
      })
    },
    // 全选
    toAllCheck () {
      const items = this.items
      for (var i = 0; i < items.length; i++) {
        let item = this.items[i]
        item.absence = 0
        this.$set(this.items, i, item)
      }
    },
    // 反选
    toNoCheck () {
      const items = this.items
      for (var i = 0; i < items.length; i++) {
        let item = this.items[i]
        item.absence = 1
        this.$set(this.items, i, item)
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
