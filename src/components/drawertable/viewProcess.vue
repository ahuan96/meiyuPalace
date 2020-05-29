<template>
  <el-drawer size="70%" title="查看评分细节" direction="rtl" oncontextmenu="return false" onselectstart="return false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <div class="demo-drawer__content" style="bottom:0">
      <div class="student">
        <div class="main" style="top:0;background-color: #FFFFFF">
          <el-menu class="el-menu-demo" mode="horizontal" style="margin:0 1rem"
            :default-active="activeIndex"
            @select="tabChange">
            <el-menu-item index="1">评分规则</el-menu-item>
            <el-menu-item index="2">评分信息</el-menu-item>
          </el-menu>
          <div class="tb"
            v-if="activeIndex === '1'">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <thead>
                <tr>
                  <td class="lan">一级指标</td>
                  <td class="lan">二级指标</td>
                  <td class="lan">三级指标</td>
                  <td class="lan" width="20%">测评要点与分值</td>
                  <td class="lan">测评依据</td>
                  <td class="lan" width="20%">相关说明</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="lan" rowspan="5">
                    <p>基础指标</p>
                    <p>（40分）</p>
                  </td>
                  <td class="cen" rowspan="3">
                    <p>课程学习分</p>
                    <p>（25分）</p>
                  </td>
                  <td class="cen">
                    <p>出勤率</p>
                    <p>（5分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 按时上下课，不迟到、不早退（1.5分）</p>
                    <p>2. 旷课及请假次数累计不超过3次（1分）</p>
                  </td>
                  <td class="cen">班级考勤表</td>
                  <td class="txt">音乐、美术各2.5分</td>
                </tr>
                <tr>
                  <td class="cen">
                    <p>学习参与度</p>
                    <p>（10分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 积极参与艺术课程学习，注意力集中（2分）</p>
                    <p>2. 遵守课堂纪律，认真听讲，每学期举手发言超过5次，表达观点逻辑清晰（2分）</p>
                    <p>3. 积极参与小组讨论学习，与同伴交流，有自己的见解（1分）</p>
                  </td>
                  <td class="cen">课堂表现</td>
                  <td class="txt">音乐、美术各5分</td>
                </tr>
                <tr>
                  <td class="cen">
                    <p>学习任务完成情况</p>
                    <p>（10分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 按时完成老师布置的课堂作业（2分）</p>
                    <p>2. 按时按质按量完成老师布置的课后作业（1分）</p>
                  </td>
                  <td class="cen">音乐抽测教材内容<br />美术抽查作业本</td>
                  <td class="txt">音乐、美术各5分</td>
                </tr>
                <tr>
                  <td class="cen" rowspan="2">
                    <p>课外活动分</p>
                    <p>（15分）</p>
                  </td>
                  <td class="cen">
                    <p>艺术兴趣小组</p>
                    <p>、艺术社团</p>
                    <p>（10分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 参加至少1个学校艺术兴趣小组或艺术社团（3分）</p>
                    <p>2. 参加艺术兴趣小组、艺术社团活动不低于10次（2分）</p>
                    <p>3. 在艺术兴趣小组、艺术社团中承担小管理者角色及任务完成情况良好（2分）</p>
                    <p>4. 在艺术兴趣小组、艺术社团中表现良好（3分）</p>
                  </td>
                  <td class="cen">艺术类兴趣小组<br />社团花名册考勤表</td>
                  <td class="txt" rowspan="2"></td>
                </tr>
                <tr>
                  <td class="cen">
                    <p>其他艺术活动</p>
                    <p>（5分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 积极主动参加学校艺术节、联欢会、展览等艺术活动（3分）</p>
                    <p>2. 至少参与1项艺术活动，艺术表演或艺术作品获奖（2分），未获奖（1分）</p>
                  </td>
                  <td class="cen">获奖证书<br />或参加活动的照片</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td class="lan" rowspan="4">
                    <p>学业指标</p>
                    <p>（50分）</p>
                  </td>
                  <td class="cen" rowspan="2">
                    <p>基础知识分</p>
                    <p>（30分）</p>
                  </td>
                  <td class="cen">
                    <p>音乐知识</p>
                    <p>（15分）</p>
                  </td>
                  <td class="txt">音乐笔试。试题依据课标、教材，以音乐试听选择题为主，满分100分，实际得分乘以15%计入测评成绩。</td>
                  <td class="cen">卷面得分</td>
                  <td class="txt" rowspan="4">
                    <p>说明：</p>
                    <p>1. 学业指标测评（学科性测评）是指学校教师以国家艺术教育各学科课程标准和校本课程大纲为依据，主要是通过学生在校各学期、学年 学科性考试考查考核，评价了解学生理解和掌握艺术（或音乐、美术 等）基础知识，以及基础知识学习后相关的艺术欣赏和表现能力</p>
                    <p>2. 本学业指标三级指标、指标内容和测评要点参照《福建省教育厅关 于印发福建省义务教育美术和音乐学科教学指导意见（试行）的通知》 （闽教基〔2018〕94号）执行。</p>
                    <p>3. 学校也可根据实际情况参照文件要求，在取得上级教育行政部门同 意后，细化测评要点。解学生掌握和运用基本技能的情况。</p>
                  </td>
                </tr>
                <tr>
                  <td class="cen">
                    <p>美术知识</p>
                    <p>（15分）</p>
                  </td>
                  <td class="txt">美术笔试。试题依据课标、教材，以选择题为主，满分100分，实际得分乘以15%计入测评成绩。</td>
                  <td class="cen">卷面得分</td>
                </tr>
                <tr>
                  <td class="cen" rowspan="2">
                    <p>基本技能分</p>
                    <p>（20分）</p>
                  </td>
                  <td class="cen">
                    <p>音乐技能</p>
                    <p>（10分）</p>
                  </td>
                  <td class="txt">学生自选教材内任意一首歌曲，可演唱、歌表演（舞蹈）、识读乐谱、器乐演奏等方式测试。</td>
                  <td class="cen">学生自选或根据<br />学校实际指定项目</td>
                </tr>
                <tr>
                  <td class="cen">
                    <p>美术技能</p>
                    <p>（10分）</p>
                  </td>
                  <td class="txt">学生自选教材内的造型表现、设计应用等领域的内容进行表现，视主题表现情况予以量分。</td>
                  <td class="cen">学生自选或根据<br />学校实际指定项目</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td class="lan" rowspan="3">
                    <p>发展指标</p>
                    <p>（20分）</p>
                  </td>
                  <td class="cen" rowspan="2">
                    <p>校外学习</p>
                    <p>（10分）</p>
                  </td>
                  <td class="cen">
                    <p>校外艺术学习</p>
                    <p>（5分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 有主动参加校外艺术的学习过程和成绩证明（2分）</p>
                    <p>2. 自觉学习和参与传承中华优秀民族民间艺术，对民族民间艺术有一定的了解，能 够现场展示所学艺术内容（2分）</p>
                    <p>3. 在其他学科中，善于表现所学艺术知识（1分）</p>
                  </td>
                  <td class="cen">
                    <p>参阅学习体会、</p>
                    <p>评论、活动记录等</p>
                    <p>文字材料和音视频、</p>
                    <p>图像证明等</p>
                  </td>
                  <td class="txt" rowspan="2"></td>
                </tr>
                <tr>
                  <td class="cen">
                    <p>校外艺术实践</p>
                    <p>（5分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 积极参与校外美育实践基地、社区、乡村文化活动，欣赏高雅的文艺演出和展览 等，参加1次得1分。(3分）</p>
                    <p>2. 参加由学校组织的校外艺术实践活动（1分）</p>
                    <p>3. 能主动充实留存、记录保管好自己的艺术学习档案袋，在学生 艺术素质测评活动 中积极展示。（1分）</p>
                  </td>
                  <td class="cen">课堂表现</td>
                </tr>
                <tr>
                  <td class="cen">
                    <p>艺术特长（加分）</p>
                    <p>（10分）</p>
                  </td>
                  <td class="cen">
                    <p>现场测评中展现的</p>
                    <p>某一艺术项目特长</p>
                    <p>（10分）</p>
                  </td>
                  <td class="txt">
                    <p>1. 有本人或作品参加教育行政部门组织的艺术展演（比赛），具有证明材料的自动获得认定，省级及以上获奖得10分；市级获奖得8分；县（市、区）级获奖得6分。</p>
                    <p>2. 现场测评由专业艺术教师集体评价确分，可按项目类别分批次集中或个别进行， 项目包括声乐、器乐、舞蹈、戏剧、戏曲、绘画、书法等。</p>
                  </td>
                  <td class="cen">
                    <p>参赛或参与活动的证书或其他证明；</p>
                    <p>无证书的学生可直接向科任教师申请现场测试，</p>
                    <p>由教师根据现场展示情况给分。</p>
                  </td>
                  <td></td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td class="lan">备注</td>
                  <td class="cen" colspan="5">90分以上优秀为A级，75～89分良好为B级，60～74分合格为C级，59分以下不合格为D级。</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tb" style="padding-bottom:1rem;overflow-x:auto"
            v-else>
            <table width="2000" cellpadding="0" cellspacing="0" border="0">
              <thead>
                <tr>
                  <td class="lan" rowspan="2">姓名</td>
                  <td class="lan" width="200" colspan="2">出勤率（5分）</td>
                  <td class="lan" width="200" colspan="2">学习参与度（10分）</td>
                  <td class="lan" width="200" colspan="2">学习任务完成情况（10分）</td>
                  <td class="lan" width="200" colspan="2">社团小组（15分）</td>
                  <td class="lan" width="200" colspan="2">基础知识（30分）</td>
                  <td class="lan" width="200" colspan="2">基本技能（20分）</td>
                  <td class="lan" width="200" colspan="2">校外学习（10分）</td>
                  <td class="lan" width="150" rowspan="2">艺术特长（10分）</td>
                  <td class="lan" width="150" rowspan="2">总分（110分）</td>
                  <td class="lan" width="150" rowspan="2">评定等级</td>
                </tr>
                <tr>
                  <td class="lan2" width="100">音乐（2.5）</td>
                  <td class="lan2" width="100">美术（2.5）</td>
                  <td class="lan2" width="100">音乐（5）</td>
                  <td class="lan2" width="100">美术（5）</td>
                  <td class="lan2" width="100">音乐（5）</td>
                  <td class="lan2" width="100">美术（5）</td>
                  <td class="lan2" width="100">参加艺术社团（10）</td>
                  <td class="lan2" width="100">校内活动（5）</td>
                  <td class="lan2" width="100">音乐知识（15）</td>
                  <td class="lan2" width="100">美术知识（15）</td>
                  <td class="lan2" width="100">音乐（10）</td>
                  <td class="lan2" width="100">美术（10）</td>
                  <td class="lan2" width="100">艺术学习（5）</td>
                  <td class="lan2" width="100">校外实践（5）</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  :key="item.id"
                  v-for="item of items">
                  <td class="cen">{{item.name}}</td>
                  <td class="cen">{{item.evaluation.kqf_y}}</td>
                  <td class="cen">{{item.evaluation.kqf_m}}</td>
                  <td class="cen">{{item.evaluation.ktbxf_y}}</td>
                  <td class="cen">{{item.evaluation.ktbxf_m}}</td>
                  <td class="cen">{{item.evaluation.xxrwf_y}}</td>
                  <td class="cen">{{item.evaluation.xxrwf_m}}</td>
                  <td class="cen">{{item.evaluation.stxzpf}}</td>
                  <td class="cen">{{item.evaluation.xyyspf}}</td>
                  <td class="cen">{{item.evaluation.jczsyyf}}</td>
                  <td class="cen">{{item.evaluation.jczsmsf}}</td>
                  <td class="cen">{{item.evaluation.jcjnyyf}}</td>
                  <td class="cen">{{item.evaluation.jcjnmsf}}</td>
                  <td class="cen">{{item.evaluation.sxrwf}}</td>
                  <td class="cen">{{item.evaluation.xwyssjf}}</td>
                  <td class="cen">{{item.evaluation.ystcf}}</td>
                  <td class="cen">{{item.evaluation.score}}</td>
                  <td class="cen">{{item.evaluation.pf}}</td>
                </tr>
              </tbody>
            </table>
          </div>
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

      params: {}, // 参数

      activeIndex: '1',

      // 确认内容数据
      confirmData: { k: 'student' }
    }
  },
  computed: {
    ...mapGetters([
      'xueduan', 'nianji'
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
      let $rt = this.$get('kaoqin/get_students/', this.params)
      $rt.then((rt) => {
        this.items = rt.data
        cbk()
      }).catch((rt) => {
      })
    },

    tabChange (v) {
      this.activeIndex = v
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
