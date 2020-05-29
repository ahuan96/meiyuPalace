<template>
  <el-drawer size="70%" title="创建考勤" direction="rtl" oncontextmenu="return false" onselectstart="return false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <div class="demo-drawer__content" style="bottom:0">
      <div class="kaoqin">
        <ys-search ref="yssearch"
          :searchData="searchData"></ys-search>

        <div class="edit" style="top:2.7rem;bottom:1rem">
          <dl class="ke">
            <dt>
              <h3>学生名单：</h3>
              <ul>
                <li style="margin:0">
                  <div class="chu">出勤</div>
                  <div class="que">缺勤</div>
                </li>
              </ul>
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
                      @click="chuqinChange(item)"></i>
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
      items: [], // 学生数据

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
      let $rt = this.$get('meiyu/attendanceList/', this.params)
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
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    chuqinChange (item) {
      if (item.absence === 0) {
        item.absence = 1
        item.detail = []
      } else {
        item.absence = 0
      }
      this.changesvalue = Math.random()
    },

    /**
     * [toAdd 添加考勤]
     * @return {[]} []
     */
    toAdd () {
      const params = {
        absenteeism_num: 0,
        attendance_num: 0,
        bsenteeism: [],
        queqin: [],
        org_id: this.tableData.org_id
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

      let $rt = this.$get('meiyu/addAttendance/', params)
      $rt.then((rt) => {
        this.toggleShow()
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
