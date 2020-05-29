<template>
  <el-drawer size="70%" title="查看考勤" direction="rtl" oncontextmenu="return false" onselectstart="return false"
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
                <li>
                  <div class="chu">出勤（{{datas.chuqin}}人）</div>
                  <div class="que">缺勤（{{datas.queqin}}人）</div>
                  <div>总共：{{datas.sum}}人</div>
                  <div>出勤率：{{datas.percent}}</div>
                </li>
                <li>
                  <div class="ti">鼠标悬停在表现分获取栏上可查看变动原因。</div>
                </li>
              </ul>
            </dt>
            <dd>
              <ul>
                <li
                  :key="item.id"
                  :class="item.attendance === 0 ? '' : 'none'"
                  v-for="item of items">
                  <h3>
                    <i class="n"></i>
                    <p>{{item.name}}</p>
                  </h3>
                  <el-tooltip placement="bottom-start" effect="light">
                    <template
                      v-if="item.log">
                      <div slot="content" class="list">
                        <p
                          :key="it.id"
                          v-for="it of item.log">{{it.remark}} {{it.score}}</p>
                      </div>
                      <el-button>表现分获取：{{item.score}}</el-button>
                    </template>
                    <template
                      v-else>
                      <div slot="content">
                        <p>表现分未变动</p>
                      </div>
                      <el-button>表现分获取：0</el-button>
                    </template>
                  </el-tooltip>
                </li>
              </ul>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
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
      datas: {}, // 考勤概况

      params: {}, // 参数

      // 查询内容数据
      searchData: {
        selector: [],
        text: '',
        nosearchbutton: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'xueke', 'nianji'
    ])
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
      })
    },

    /**
     * [askDatas 请求数据]
     * @param  {[Function]} cbk [回调]
     * @return {[]} []
     */
    askDatas (cbk) {
      let $rt = this.$get('kaoqin/get_logs/', this.params)
      $rt.then((rt) => {
        // 考勤基本信息
        const data = rt.student_attendance
        const arr = []

        for (let item of this.xueke) {
          if (data.stype === item.id) {
            arr.push('<div>科目：' + item.name + '</div>')
            break
          }
        }

        for (let item of this.nianji) {
          if (data.class_year === item.id) {
            arr.push('<div>年级：' + item.name + '</div>')
            break
          }
        }

        arr.push('<div>班级：' + data.class_name + '</div>')
        arr.push('<div>考勤日期：' + (data.class_time.split(' '))[0] + '</div>')
        arr.push('<div>考勤课时：第' + data.attendance + '节课</div>')
        arr.push('<div>考勤老师：' + data.teacher_name + '</div>')

        this.searchData.text = arr.join('')

        // 学生数据
        this.items = rt.data
        for (let item of this.items) {
          item.score = 0
          if (!item.log) continue

          for (let it of item.log) {
            it.score = Number(it.score)
            item.score += it.score

            if (it.score > 0) {
              it.score = '+' + it.score
            }
          }
        }

        // 考勤概况
        this.datas.chuqin = parseInt(data.attendance)
        this.datas.queqin = parseInt(data.absenteeism)
        this.datas.sum = this.datas.chuqin + this.datas.queqin
        this.datas.percent = this.$numformat((this.datas.chuqin / this.datas.sum) * 100) + '%'

        cbk()
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
