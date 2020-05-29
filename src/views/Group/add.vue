<template>
  <div class="group" >
    <div class="edit" style="background:#F0F0F0;padding:0 1rem;cursor:pointer;">
      <div class="back" style="color:#79BBF9;padding:1rem 0;font-size: 1rem;"
       @click="$router.back(-1)"
      >
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <el-form ref="elform" label-width="150px" style="background:#fff;border-radius:0.5rem;padding:1rem 0;"
        :model="formData"
        :rules="rules">
        <el-form-item label="社团名称" prop="name">
          <el-col
            :span="15">
            <el-input placeholder="请输入社团名称"
              v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>

         <el-form-item label="封面图片" prop="img_url">
           <el-upload
             class="avatar-uploader"
             :action=this.action
             :data="{ 'userfile': 's.png' }"
             :show-file-list="false"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload">
             <img  class="head-img" v-if="formData.img_url" :src="formData.img_url" >
             <el-button v-else type="primary">上传图片</el-button>
           </el-upload>
        </el-form-item>

        <el-form-item label="活动内容" prop="active_content">
          <el-col
            :span="15">
            <el-input type="textarea" placeholder="请输入活动内容"
              v-model="formData.active_content"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="申请要求" prop="condition">
          <el-col
            :span="15">
            <el-input type="textarea" placeholder="请输入申请要求"
              v-model="formData.condition"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="招募范围" prop="grade">
            <div v-for="(step,index) in stepArr" :key="index">
              <el-select placeholder="请选择阶段"
              @change="changeStep(step.step,index)"
              v-model="step.step">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in steps">
              </el-option>
            </el-select>
            <el-select placeholder="请选择年级"
              @change="changeGrade(index , step.grade)"
              v-model="step.grade">
              <el-option
                :key="item.grade_key"
                :label="item.grade"
                :value="item.grade_key"
                v-for="item in step.grades">
              </el-option>
            </el-select>
             <div class="add-btn" v-if="index == 0" @click="addStep">
               <i class="el-icon-plus"></i>
             </div>
             <div class="class-list">
               <template v-for="(item,index2) in step.class" >
                  <div class="class-item" :class="item.active?'class-item-active':''" @click="changeRooms(index,index2)" :key="index2">{{item.name}}</div>
               </template>
             </div>
            </div>
        </el-form-item>
        <el-form-item label="招募人数" prop="num">
          <el-col
            :span="15">
            <el-input placeholder="请输入招募人数"
              v-model="formData.num"></el-input>
          </el-col>
        </el-form-item>

      <div style="display:flex;">
          <el-form-item label="活动结束时间" prop="end_time">
          <el-col
            :span="15">
            <el-date-picker type="date" placeholder="请选择活动结束时间"
              @change="timeValue(rules.end_time[2]['data'],1)"
              v-model="rules.end_time[2]['data']">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="申请截止时间" prop="bm_end">
          <el-col
            :span="15">
            <el-date-picker type="date" placeholder="请选择申请截止时间"
              @change="timeValue(rules.bm_end[2]['data'],2)"
              v-model="rules.bm_end[2]['data']">
            </el-date-picker>
          </el-col>
        </el-form-item>
      </div>

        <el-form-item label="活动老师" prop="teacher_ids">
          <el-col
            :span="15">
            <el-select multiple placeholder="请选择活动老师"
              v-model="rules.teacher_ids[2]['data']" @change="teacherIds">
              <el-option
                :key="item.id"
                :label="item.teacher_name"
                :value="item.id"
                v-for="item in rules.teacher_ids[2]['list']">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="发起单位" prop="organization">
          <el-col
            :span="15">
            <el-input placeholder="请输入发起单位"
              v-model="formData.organization"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item>
          <div class="submit">
            <el-button type="primary"
              @click="submitForm('elform')">保存</el-button>
            <el-button type="info"
              @click="cancelForm">取消</el-button>
          </div>
        </el-form-item>
      </el-form>

      <!-- 确认模态框 -->
      <ys-modal-confirm ref="ysconfirm"
        :confirmData="confirmData"></ys-modal-confirm>
    </div>
  </div>
</template>

<script>
import mixform from '@/components/mixin/form'

export default {
  mixins: [mixform],
  components: {
  },
  props: [
  ],
  data () {
    return {
      url_name: '',
      action: this.url + 'activity/do_upload2?' + '&uc_sid=' + this.cookie,
      // 确认内容数据
      confirmData: { k: 'project', buttons: [{ name: '我知道了' }] },
      // 表单数据
      formData: {
        id: this.$route.query.id,
        name: '',
        active_content: '',
        condition: '',
        grade: '-1',
        room_ids: '-1',
        room_list: [],
        num: '',
        end_time: '',
        bm_end: '',
        teacher_ids: [],
        organization: '',
        img_url: ''
      },
      // 阶段数组
      steps: [{value: 0, label: '小学'}, {value: 1, label: '初中'}, {value: 2, label: '高中'}],
      stepArr: [{step: '', grade: '', grades: [], class: []}],
      // 表单验证
      formRule: [
        ['name', { }],
        // ['need', { }],
        ['cont', { }],
        ['cont', { }],
        ['need', { list: [], data: '' }],
        ['need', { list: [], data: '' }],
        ['need', { list: [], data: '' }],
        ['number', { }],
        ['datetime', { data: null }],
        ['datetime', { data: null }],
        ['select', { list: [], data: [] }],
        ['cont', { }],
        ['select', { }]
      ],

      // 表单提交
      formSubmit: { info: 'GetProjectDetail' }
    }
  },
  computed: {
  },
  methods: {
    /**
     * [initWeb 初始化]
     * @return {[]} []
     */
    initWeb () {
      this.askDatas(() => {
        this.setFormData()
        this.setFormDetails(this.formRule)
      })
    },

    /**
     * [setFormData 设置表单相关数据]
     * @return {[]} []
     */
    async setFormData () {
      const $rule = this.formRule
      // 班级数据
      let $rt = await this.$get('activity/get_roomlist/')
      $rule[3][1]['list'] = $rt.room_list
      this.room_list = $rt.room_list
      console.log('s', $rule[3][1])
      // 老师数据
      $rt = await this.$get('meiyu/getTeachers/', {school_id: window.Global.database.school_id})
      $rule[9][1]['list'] = $rt.data
    },

    /**
     * [submitForm 提交表单]
     * @param  {[String]} form [表单]
     * @return {[]} []
     */
    submitForm (form) {
      console.log(this.rules)
      this.$refs[form].validate((valid) => {
        if (!valid) return false
        // 提交
        let roomids = ''
        this.stepArr.forEach(item => {
          item.class.forEach(item2 => {
            if (item2.active) {
              console.log(item2.id)
              if (!roomids) {
                roomids = item2.id
              } else {
                roomids += ',' + item2.id
              }
            }
          })
        })
        console.log(roomids)
        console.log(this.formData)
        this.formData.room_ids = roomids
        let $rt = this.$post('meiyu/createOrganization', this.formData)
        $rt.then((rt) => {
          this.$router.push({ name: 'Group' })
        }).catch((rt) => {
        })
      })
    },
    timeValue (date, type) {
      var timestamp = new Date(date).getTime()
      timestamp = timestamp + ''
      timestamp = timestamp.substring(0, 10)
      if (type === 1) {
        this.formData.end_time = timestamp
      } else {
        this.formData.bm_end = timestamp
      }
    },
    teacherIds (ids) {
      this.formData.teacher_ids = ids.join(',')
    },
    roomIds (ids) {
      console.log('ids', ids)
      this.formData.room_ids = ids.join(',')
    },
    // 切换选择年级
    changeGrade (index, value) {
      console.log('step1')
      for (let i = 0; i < this.stepArr.length; i++) {
        console.log('step', i, index, this.stepArr[i].grade, value)
        if (i !== index && this.stepArr[i].grade === value) {
          this.stepArr[index].grade = ''
          this.stepArr[index].class = []
          this.$err('已经选择了该年级')
          return
        }
      }
      console.log(index, value)
      this.room_list.forEach(item => {
        if (item.grade_key === value) {
          item.rooms.forEach(item2 => {
            item2.active = false
          })
          this.stepArr[index].class = item.rooms
        }
      })
      console.log(this.stepArr)
    },
    yinshe (str, id) {
      var n = ''
      switch (str) {
        case '一年级' : n = 1
          break
        case '二年级' : n = 2
          break
        case '三年级' : n = 3
          break
        case '四年级' : n = 4
          break
        case '五年级' : n = 5
          break
        case '六年级' : n = 6
          break
        case '七年级' : n = 7
          break
        case '八年级' : n = 8
          break
        case '九年级' : n = 9
          break
        case '高一' : n = 10
          break
        case '高二' : n = 11
          break
        case '高三' : n = 12
          break
      }
      if (n === id) {
        return true
      }
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      this.formData.img_url = res.data.img_path
    },
    beforeAvatarUpload (file) {
      const isLt = file.size / 1024 / 1024 < 10
      if (!isLt) {
        this.$message.error('图片大小不能超过 10MB!')
      }
      this.url_name = Date.parse(new Date()) + file.name
      return isLt
    },
    // 切换选择阶段
    changeStep (value, index) {
      console.log(value, index)
      console.log(this.room_list)
      let grades = []
      if (value === 0) {
        grades = [ 1, 2, 3, 4, 5, 6 ]
      } else if (value === 1) {
        grades = [7, 8, 9]
      } else if (value === 2) {
        grades = [10, 11, 12]
      }
      console.log(grades)
      this.stepArr[index].grade = ''
      this.stepArr[index].grades = []
      this.stepArr[index].class = []
      for (var i = 0; i < this.room_list.length; i++) {
        for (var j = 0; j < grades.length; j++) {
          // console.log('aaa', this.room_list[i].grade_key, grades[j])
          if (this.room_list[i].grade_key === grades[j]) {
            console.log('bb', this.room_list[i].grade_key, grades[j])
            this.stepArr[index].grades.push(this.room_list[i])
          }
        }
      }
      console.log(this.stepArr)
    },
    changeRooms (index, index2) {
      console.log(index, index2)
      this.stepArr[index].class[index2].active = !this.stepArr[index].class[index2].active
      console.log(this.stepArr)
      this.$set(this.stepArr, 0, this.stepArr[0])
    },
    // 增加阶段 年级
    addStep () {
      this.stepArr.push({step: '', grade: '', grades: [], class: []})
    }
  },
  created () {
    this.initWeb()
  },
  mounted () {
  }
}
</script>
