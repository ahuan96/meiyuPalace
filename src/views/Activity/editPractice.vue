<template>
  <div class="practice" >
    <div class="edit" style="background:#F0F0F0;padding:0 1rem;">
      <div class="back" style="color:#79BBF9;padding:1rem 0;font-size: 1rem;cursor:pointer;"
       @click="$router.back(-1)"
      >
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <div class="cont">
          <div class="model">
              <div class="model-tip">基本信息</div>
              <el-table
              :data="studentData"
              style="width: 100%">
              <el-table-column
                prop="student_name"
                label="姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="student_no"
                label="学号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="gradeName"
                label="年级"
                width="180">
              </el-table-column>
              <el-table-column
                prop="room_name"
                label="班级"
                width="180">
                </el-table-column>
                <el-table-column
                prop="count"
                label="活动次数"
                width="180">
                </el-table-column>
                <el-table-column
                prop="parent_score"
                label="家长评分"
                width="180">
                </el-table-column>
                <el-table-column
                prop="teacher_point"
                label="老师评分"
                width="180">
                <template  slot-scope="scope">
                  <span v-if="scope.row.teacher_point">{{scope.row.teacher_point}}</span>
                  <span v-else>
                    <i @click="toScore(scope.row)" class="cli-btn">打分</i>
                    <!-- <i @click="toScore(scope.row)" style="font-size:1rem" class="el-icon-edit"></i> -->
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="teacher_remark"
                label="教师评语">
                <template  slot-scope="scope">
                  <span v-if="scope.row.teacher_remark">{{scope.row.teacher_remark}}</span>
                  <span v-else>
                    <i @click="toScore(scope.row)" class="cli-btn">评语</i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
               <el-link v-if="scope.row.isScore"  type="primary"
                :underline="false"
                @click="lookScore(scope.row)">查看</el-link>
              <el-link v-else type="primary"
                :underline="false"
                @click="upScore">提交</el-link>
            </template>
          </el-table-column>
            </el-table>
          </div>
          <div class="model">
            <div class="model-tip">活动记录</div>
            <div class="active-list">
              <div  class="active-item" v-for="(item,index) in activeList" :key="item.id">
                  <div class="active-no">#{{index+1}}</div>
                  <div class="row-item">
                    <div class="row-label">实践类型</div>
                    <div class="row-cont">{{activeType[item.type]}}</div>
                  </div>
                  <div class="row-item">
                    <div class="row-label">参与时间</div>
                    <div class="row-cont">{{item.pra_time}}</div>
                  </div>
                  <div class="row-item">
                    <div class="row-label">参与地点</div>
                    <div class="row-cont">{{item.pra_addr}}</div>
                  </div>
                  <div class="row-item">
                    <div class="row-label">活动内容</div>
                    <div class="row-cont">{{item.pra_context}}</div>
                  </div>
                  <div class="row-item">
                    <div class="row-label">活动档案</div>
                  </div>
                  <div class="img-list">
                    <img v-for="(img) in item.imgs" :key="img" :src="img" alt="">
                  </div>
                  <div class="row-item">
                    <div class="row-label">家长评分</div>
                    <div class="row-cont">{{item.parent_score}}分</div>
                  </div>
                  <div class="row-item">
                    <div class="row-label">家长评价</div>
                    <div class="row-cont">{{item.parent_comment}}</div>
                  </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <!-- 表单模态框 -->
     <ys-modal-form-score ref="ysform2"
      :formData="formDataScore"
      v-on:formCalBak="setScore"></ys-modal-form-score>

       <ys-modal-form-view-score ref="ysform1"
      :formData="formDataScore"
      v-on:formCalBak="setScore"></ys-modal-form-view-score>
  </div>
</template>

<script>
import ysModalFormScore from '@/components/modalform/scorePractice'
import ysModalFormViewScore from '@/components/modalform/viewScorePractice'
import { mapGetters } from 'vuex'

export default {
  // mixins: [mixform],
  components: {
    ysModalFormScore, ysModalFormViewScore
  },
  props: [
  ],
  data () {
    return {
      url_name: '',
      studentData: [],
      activeList: {},
      activeType: ['美育实践基地艺术活动', '社区乡村文化艺术活动', '高雅文艺演出/展览', '校组织校外艺术实践'],
      action: this.url + 'activity/do_upload2?' + '&uc_sid=' + this.cookie,
      // 确认内容数据
      confirmData: { k: 'project', buttons: [{ name: '我知道了' }] },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      // 表单内容数据
      formDataScore: {}
    }
  },
  computed: {
    ...mapGetters(['nianji'])
  },
  methods: {
    /**
     * [initWeb 初始化]
     * @return {[]} []
     */
    initWeb () {
      let studentId = this.$route.query.student_id
      let $rt = this.$get('meiyu/practiceOutsideDetail/', {student_id: studentId})
      $rt.then((rt) => {
        this.nianji.forEach(item => { // 设置年级名称
          if (item.id === rt.data.detail.grade) {
            rt.data.detail.gradeName = item.name
          }
        })
        rt.data.detail.isScore = rt.data.detail.teacher_point
        rt.data.detail.count = rt.data.list.length
        this.$set(this.studentData, 0, rt.data.detail)
        rt.data.list.forEach(item => { // 设置图片 # 分割
          if (item.pra_imgs) {
            item.imgs = item.pra_imgs.split('#')
          } else {
            item.imgs = []
          }
        })
        this.activeList = rt.data.list
        console.log(this.studentData)
      })
    },
    /**
     * [toScore 评分]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    toScore (item) {
      console.log(item)
      console.log(item.student_id)
      this.formDataScore.student_id = item.student_id
      this.$refs.ysform2.initial()
    },
    setScore (data) {
      let reData = this.studentData[0]
      reData.teacher_point = data.score
      reData.teacher_remark = data.comment
      this.$set(this.studentData, 0, reData)
    },
    // 提交评分
    upScore () {
      let reData = this.studentData[0]
      console.log(reData)
      let $rt = this.$get('meiyu/teacherContent/', { student_id: reData.student_id, point: reData.teacher_point, remark: reData.teacher_remark })
      $rt.then((rt) => {
        this.initWeb()
      })
    },
    // 查看评分
    lookScore (item) {
      this.formDataScore = item
      this.$refs.ysform1.initial()
    }
  },
  created () {
    this.initWeb()
  },
  mounted () {
  }
}
</script>
