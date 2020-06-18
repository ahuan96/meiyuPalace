<template>
  <div class="index">
    <div class="title">
      <ul class="r">
        <li class="sq1">
          <section>
            <strong>授课班级</strong>
            <i
              v-html="datas.roomSum"></i>
          </section>
        </li>
        <li class="sq2">
          <section>
            <strong>授课学生</strong>
            <i
              v-html="datas.studentSum"></i>
          </section>
        </li>
        <li class="sq3">
          <section>
            <strong>平台积分</strong>
            <i
              v-html="datas.userScore"></i>
          </section>
        </li>
      </ul>

      <div class="photo">
        <div class="pic">
          <img src="../assets/default.jpg" width="80" height="80" />
          <div class="cont">
            <h3>
              {{datas.userName +  '老师，' + datas.loginTime + '好！'}}
              <span class="exit-btn" @click="exit">退出登录</span>
              </h3>
            <span
              :key="v.id"
              v-html="v.name"
              v-for="v of datas.userType"></span>
          </div>
        </div>
        <div class="txt"
          v-html="(datas.cityName + ' / ' + datas.schoolName) + (!datas.roomId ? '' : (' / ' + datas.roomName))"></div>
      </div>
    </div>

    <div class="link">
      <a class="lk1"
        @click="$emit('_hrefTo', 'question/edit/')">制作试题</a>
      <a class="lk2"
        @click="$emit('_hrefTo', 'paper/add/')">制作试卷</a>
      <a class="lk3"
        @click="$emit('_pathTo', 'KaoqinAdmin')">添加考勤</a>
    </div>

    <dl class="over">
      <dt><h3>进行中的考试（共{{recordNum}}场）</h3></dt>
      <dd>
        <el-table stripe
          :data="items">
          <el-table-column label="类型" prop="exam_type" width="60" fixed></el-table-column>

          <el-table-column label="科目" prop="stype" width="60" fixed></el-table-column>

          <el-table-column label="考试内容" prop="exam_name" min-width="200" fixed></el-table-column>

          <el-table-column label="考场教室" width="120" prop="class_name"></el-table-column>

          <el-table-column label="截止时间" width="160" prop="date"></el-table-column>

          <el-table-column label="参考人数" width="120" prop="sum"></el-table-column>

          <el-table-column label="交卷进度" width="200">
            <template slot-scope="scope">
              <el-progress style="float:left;width:7.5rem;margin-right:.5rem"
                :text-inside="true"
                :stroke-width="17"
                :percentage="scope.row.percent"></el-progress>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="90" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary"
                :underline="false"
                @click="$emit('_hrefTo', 'exam/monitor?record_id=' + scope.row.id)"
                v-if="datas.roomId === scope.row.classroom_id">监考</el-link>
              <i class="none"
                v-else></i>
            </template>
          </el-table-column>
        </el-table>
      </dd>
    </dl>

    <div class="clearfix">
      <dl class="over">
        <dt>
          <h3>待验收练习（共{{homeworksNum}}篇）</h3>
          <a class="r" style="margin-right:2rem"
            @click="toHomework()">更多</a>
        </dt>
        <dd>
          <ul class="shou">
            <div v-if="itemsExe.length == 0" style="height:9.5rem;padding:.45rem 1rem;background:#fff;font-size:1rem;">
              暂无数据
            </div>
            <li
              :key="item.unique_no"
              v-for="item of itemsExe">
              <div class="tit">
                <i
                  v-html="item.date"></i>
                <a
                  @click="toHomework(item)"
                  v-html="item.name"></a>
              </div>
              <div class="bot">
                <span
                  v-html="item.statename"></span>
                <section>
                  <i
                    :key="ix"
                    v-html="it.name"
                    v-for="(it, ix) of item.rooms"></i>
                </section>
              </div>
            </li>
          </ul>
        </dd>
      </dl>

      <dl class="over">
        <dt>
          <h3>未读消息</h3>
          <a class="r"
            @click="$emit('_hrefTo', 'admin/msg_center/')">更多</a>
        </dt>
        <dd>
          <ul class="mes">
            <li
              :key="item.id"
              v-for="item of itemsMes">
              <i
                v-html="item.date"></i>
              <span
                v-html="item.type"></span>
              <a
                @click="$emit('_hrefTo', 'admin/msg_center/')"
                v-html="item.title"></a>
            </li>
          </ul>
        </dd>
      </dl>
    </div>

    <dl class="over">
      <dt>
        <h3>学情统计</h3>
        <div class="lnk">
          <a
            :class="active === 7 ? 'active' : ''"
            @click="eduTong(7)">近7天</a>
          <a
            :class="active === 30 ? 'active' : ''"
            @click="eduTong(30)">近30天</a>
          <a
            :class="active === 90 ? 'active' : ''"
            @click="eduTong(90)">近3月</a>
          <a
            :class="active === 180 ? 'active' : ''"
            @click="eduTong(180)">近半年</a>
        </div>
      </dt>
      <dd>
        <ul class="tong">
          <li class="tg1">
            <h4>出勤率</h4>
            <p
              v-html="datasStudy.total_attendance + '%'"></p>
          </li>
          <li class="tg2">
            <h4>练习完成率</h4>
            <p
              v-html="datasStudy.total_done + '%'"></p>
          </li>
          <li class="tg3">
            <h4>考试合格率</h4>
            <p
              v-html="datasStudy.total_pass + '%'"></p>
          </li>
        </ul>
      </dd>
    </dl>

    <!-- 确认模态框 -->
    <ys-modal-confirm ref="ysconfirm"
      :confirmData="confirmData"></ys-modal-confirm>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: [
  ],
  data () {
    return {
      items: [], // 进行中的考试数据
      itemsExe: [], // 待验收练习数据
      itemsMes: [], // 未读消息数据
      datas: window.Global.database, // 用户信息
      datasStudy: {}, // 学情统计信息

      // 确认内容数据
      confirmData: { k: 'home', v: 0, buttons: [{ name: '我知道了' }] },

      recordNum: 0, // 考试数量
      homeworksNum: 0, // 作业数量
      active: 7 // 当前学情统计时长
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
      let $rt = this.$get('v2/ajaxworkbench/', {})
      $rt.then((rt) => {
        // 进行中的考试数据
        this.items = rt.data.exam_record
        this.recordNum = this.items.length
        for (let item of this.items) {
          item.sum = item.student_num + ' / ' + item.cnt
          item.percent = this.$numformat(Number(item.student_num) / Number(item.cnt) * 100)
          item.percent = Number(item.percent)

          if (item.endtime === '0') {
            item.date = '不限'
          } else {
            item.date = this.$timeformat(item.endtime)
          }
        }

        // 待验收练习数据
        this.itemsExe = rt.data.homeworks
        this.homeworksNum = this.itemsExe.length
        for (let item of this.itemsExe) {
          item.date = this.$timeformat(item.deadline_time)

          if (item.state === 1) {
            item.statename = '进行中'
          } else if (item.state === 2) {
            item.statename = '未完成'
          } else if (item.state === 3) {
            item.statename = '部分完成'
          } else if (item.state === 4) {
            item.statename = '全部完成'
          }
        }

        // 未读消息数据
        this.itemsMes = rt.data.msg_list
        for (let item of this.itemsMes) {
          item.date = this.$timeformat(item.time)

          if (item.method === '0') {
            item.type = '系统消息'
          } else if (item.method === '1') {
            item.type = '区域消息'
          } else if (item.method === '2') {
            item.type = '学校消息'
          } else if (item.method === '3') {
            item.type = '个人消息'
          }
        }

        // 学情统计信息
        this.datasStudy = rt.data.tongji
      }).catch((rt) => {
      })
    },

    /**
     * [toHomework 前往练习记录]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toHomework (item) {
      if (item) {
        this.$emit('_hrefTo', 'homeworks/homework_overview/?homeworks_id=' + item.id + '&homeworks_state=' + item.state + '&unique_no=' + item.unique_no)
      } else {
        this.$emit('_hrefTo', 'homeworks/checking/')
      }
    },

    /**
     * [eduTong 学情统计]
     * @param  {[Int]} v [统计时长]
     * @return {[]} []
     */
    eduTong (v) {
      this.active = v

      let $rt = this.$get('v2/ajaxworkbench/', { day: v })
      $rt.then((rt) => {
        this.datasStudy = rt.data.tongji
      }).catch((rt) => {
      })
    },
    // 退出登录
    exit () {
      console.log(document.cookie)
      var keys = document.cookie.match(/[^ =;]+(?==)/g)
      if (keys) {
        for (var i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
          document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
          document.cookie = keys[i] + '=0;path=/;domain=xinzhimeiyu.com;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
        }
        const loginUrl = this.url.replace('laoshi', 'login')
        window.location.href = loginUrl
      }
    }
  },
  created () {
    this.initPages()
  },
  mounted () {
  }
}
</script>
