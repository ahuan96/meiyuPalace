<template>
  <div class="group" >
    <div class="edit" style="background:#F0F0F0;">
      <div class="back" style="color:#79BBF9;padding:1rem 0;font-size: 1rem;cursor:pointer;display:inline-block;"
       @click="$router.back(-1)"
      >
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <el-form ref="elform" label-width="150px" style="background:#fff;border-radius:0.5rem;padding:1rem 0;min-height:calc(100% - 5rem)"
        :model="formData"
        :rules="rules">
        <el-form-item label="社团名称" prop="name">
          <el-col
            :span="15">
            <el-input placeholder="请输入社团名称" :disabled="isDis"
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
            <el-input class="high_text" type="textarea" placeholder="请输入活动内容"
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
          <div><el-checkbox :disabled="isDis" @change="changeStepAll" v-model="isStepAll">所有年级班级</el-checkbox></div>
            <div v-for="(step,index) in stepArr" :key="index">
              <el-select placeholder="请选择阶段"
              @change="changeStep(step.step,index)"
              :disabled="isDis" v-model="step.step">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in steps">
              </el-option>
            </el-select>
            <el-select placeholder="请选择年级"
              @change="changeGrade(index , step.grade)"
              :disabled="isDis" v-model="step.grade">
              <el-option
                :key="item.grade_key"
                :label="item.grade"
                :value="item.grade_key"
                v-for="item in step.grades">
              </el-option>
            </el-select>
            <template v-if="!isDis">
               <div class="add-btn" v-if="index == 0" @click="addStep">
               <i class="el-icon-plus"></i>
             </div>
             <div class="add-btn"  @click="delStep(index)">
               <i class="el-icon-minus"></i>
             </div>
            </template>
             <div class="class-list">
               <template v-for="(item,index2) in step.class" >
                  <div class="class-item" :class="item.active?'class-item-active':''" @click="!isDis&&changeRooms(index,index2)" :key="index2">{{item.name}}</div>
               </template>
             </div>
            </div>
        </el-form-item>
        <el-form-item label="招募人数" prop="num">
          <el-col
            :span="15">
            <el-input placeholder="请输入招募人数"
             :disabled="isDis" v-model="formData.num"></el-input>
          </el-col>
        </el-form-item>

      <div style="display:flex;">
          <el-form-item label="活动结束时间" prop="end_time">
          <el-col
            :span="15">
            <el-date-picker type="date" placeholder="请选择活动结束时间"
              @change="timeValue(rules.end_time[2]['data'],1)" :disabled="isDis"
              v-model="rules.end_time[2]['data']">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="申请截止时间" prop="bm_end">
          <el-col
            :span="15">
            <el-date-picker type="date" placeholder="请选择申请截止时间"
              @change="timeValue(rules.bm_end[2]['data'],2)" :disabled="isDis"
              v-model="rules.bm_end[2]['data']">
            </el-date-picker>
          </el-col>
        </el-form-item>
      </div>

        <el-form-item label="活动老师" prop="teacher_ids">
          <el-col
            :span="15">
            <el-select multiple placeholder="请选择活动老师" :disabled='isDis'
              v-model="rules.teacher_ids[2]['data']" @change="teacherIds">
              <el-option
                :key="item.id"
                :label="item.name"
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
              @click="toViewDialog('elform')">预览</el-button>
            <el-button type="primary"
              @click="submitForm('elform',3)">保存</el-button>
            <el-button type="primary"
              @click="submitForm('elform',1)">发布</el-button>
            <el-button type="info"
              @click="cancelForm">取消</el-button>
          </div>
        </el-form-item>
      </el-form>

      <!-- 确认模态框 -->
      <ys-modal-confirm ref="ysconfirm"
        :confirmData="confirmData"></ys-modal-confirm>
    </div>
      <!-- 预览弹框 -->
    <el-dialog title="预览" :visible.sync="dialogVisible" width="320px">
     <div>
        <div class="m-tip">{{formData.name}}</div>
        <div>
          <img class="m-himg" :src="formData.img_url" alt="">
        </div>
        <div class="m-tip">活动内容</div>
        <div class="m-cont">{{formData.active_content}}</div>
        <!-- <div class="m-mimg">
          <img v-if="this.img_one" :src="this.img_one" >
          <img v-if="this.img_two" :src="this.img_two" >
          <img v-if="this.img_three" :src="this.img_three" >
        </div> -->
        <div class="m-tip">申请要求</div>
        <div class="m-cont">{{formData.condition}}</div>
        <div class="m-tip">活动范围</div>
        <div class="m-cont">{{class_list}}</div>
        <div class="m-tip">上传截至时间</div>
        <div class="m-cont">{{$timeformat(this.formData.bm_end, 1)}}</div>
        <div class="m-tip">发起单位</div>
        <div class="m-cont">{{formData.organization}}</div>
     </div>
  </el-dialog>
  <!-- 预览 -->
  <avtivity-preview ref="ystable1" ></avtivity-preview>
  </div>
</template>

<script>
import mixform from '@/components/mixin/form'
import { mapGetters } from 'vuex'
import avtivityPreview from '@/components/drawertable/avtivityPreview'

export default {
  mixins: [mixform],
  components: {
    avtivityPreview
  },
  props: [
  ],
  data () {
    return {
      isDis: false, // 是否禁用关键词
      url_name: '',
      dialogVisible: false,
      class_list: '',
      action: this.url + 'palace_org/do_upload2?' + '&p_token=' + this.cookie,
      // 确认内容数据
      confirmData: { k: 'project', buttons: [{ name: '我知道了' }] },
      // 表单数据
      formData: {
        org_id: this.$route.query.id,
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
      isStepAll: false,
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
      formSubmit: { info: 'palace_org/getOrganization', column: 'org_' }
    }
  },
  computed: {
    ...mapGetters([
      'nianji'
    ])
  },
  methods: {
    /**
     * [initWeb 初始化]
     * @return {[]} []
     */
    initWeb () {
      // 如果是继续编辑 关键词不能修改
      if (this.$route.query.state === 1) {
        this.isDis = true
      }
      this.askDatas(() => {
        this.setFormData()
        this.setFormDetails(this.formRule)
        this.getGroupDetail()
      })
    },
    /**
     *[getGroupDetail 社团详情-回显]
     *@return {[]} []
     */
    getGroupDetail () {
      let orgId = this.$route.query.id
      if (!orgId) { return }
      let $rt = this.$get(this.formSubmit.info, {org_id: orgId})
      $rt.then((rt) => {
        console.log(rt)
        let data = rt.data.data
        this.formData.name = data.name
        this.formData.active_content = data.active_content
        this.formData.condition = data.condition
        this.formData.num = data.num
        this.formData.end_time = data.end_time
        this.formData.bm_end = data.bm_end
        this.formData.img_url = data.img_url
        this.rules.end_time[2]['data'] = data.end_time
        this.timeValue(data.end_time, 1)
        this.rules.bm_end[2]['data'] = data.bm_end
        this.timeValue(data.bm_end, 1)
        this.formData.organization = data.organization
        // 初始化老师 去掉拼接开始的逗号
        this.formData.teacher_ids = (data.teacher_ids[0] === ',') ? data.teacher_ids.substring(1) : data.teacher_ids
        this.rules.teacher_ids[2]['data'] = this.formData.teacher_ids.split(',')
        // 初始化班级-回显
        this.initClass(data.class)
      })
    },
    /**
     *|String,Object,Number,Boolean|
     *[initClass 初始化班级]
     *@param  {[Array]} classList [参数名]
     *@return {[]} []
     */
    initClass (classList) {
      this.stepArr = []
      for (let item of classList) {
        item.grade = parseInt(item.grade)
        item.step = this.getStep(parseInt(item.grade))
        item.grades = []
        let grades = []
        if (item.step === 0) {
          grades = [ 1, 2, 3, 4, 5, 6 ]
        } else if (item.step === 1) {
          grades = [7, 8, 9]
        } else if (item.step === 2) {
          grades = [10, 11, 12]
        }
        for (var i = 0; i < this.room_list.length; i++) {
          for (var j = 0; j < grades.length; j++) {
            if (this.room_list[i].grade_key === grades[j]) {
              item.grades.push(this.room_list[i])
            }
          }
          if (this.room_list[i].grade_key === item.grade) {
            this.room_list[i].rooms.forEach((room) => {
              room.active = false
            })
            item.class = this.room_list[i].rooms
          }
        }
        item.flag = true
        for (let item2 of this.stepArr) {
          if (item.grade === item2.grade) {
            item.flag = false
          }
        }
        if (item.flag) {
          this.stepArr.push({step: item.step, grade: parseInt(item.grade), grades: item.grades, class: item.class})
        }
      }
      this.stepArr.forEach((step) => {
        step.class.forEach((room) => {
          for (let item of classList) {
            if (item.room_id === room.id) {
              room.active = true
            }
          }
        })
      })
    },

    /**
     * [setFormData 设置表单相关数据]
     * @return {[]} []
     */
    async setFormData () {
      const $rule = this.formRule
      // 班级数据
      let $rt = await this.$get('palace_org/get_roomlist/')
      // 对班级顺序 从小到大排序
      function sortNumber (a, b) {
        let c = a.name.replace(/班/, '')
        let d = b.name.replace(/班/, '')
        return c - d
      }
      $rt.room_list.forEach(item => {
        item.rooms.sort(sortNumber)
      })
      $rule[3][1]['list'] = $rt.room_list
      this.room_list = $rt.room_list
      console.log('s', $rule[3][1])
      // 老师数据
      $rt = await this.$get('palace_org/getTeachers/', {school_id: window.Global.database.school_id})
      $rule[9][1]['list'] = $rt.data
    },

    /**
     * [submitForm 提交表单]
     * @param  {[String]} form [表单]
     * @return {[]} []
     */
    submitForm (form, state) {
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
        this.formData.room_ids = roomids
        this.formData.state = state
        let url = 'palace_org/createOrganization'

        // 如果是继续编辑
        if (this.$route.query.state === 1) {
          url = 'palace_org/updateOrganization'
        }
        let $rt = this.$post(url, this.formData)

        $rt.then((rt) => {
          this.$notify({
            title: '成功',
            message: state === 1 ? '发布社团成功' : '保存社团成功',
            type: 'success'
          })
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
      console.log(this.formData.teacher_ids)
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
    changeStepAll (value) {
      if (value) {
        this.stepArr = []
        this.room_list.forEach(item => {
          let obj = {}
          obj.grades = []
          obj.grade = item.grade_key
          obj.step = this.getStep(item.grade_key)
          let grades = []
          if (obj.step === 0) {
            grades = [ 1, 2, 3, 4, 5, 6 ]
          } else if (obj.step === 1) {
            grades = [7, 8, 9]
          } else if (obj.step === 2) {
            grades = [10, 11, 12]
          }
          for (var i = 0; i < this.room_list.length; i++) {
            for (var j = 0; j < grades.length; j++) {
              // console.log('aaa', this.room_list[i].grade_key, grades[j])
              if (this.room_list[i].grade_key === grades[j]) {
                console.log('bb', i, this.room_list[i], grades[j])
                obj.grades.push(this.room_list[i])
              }
            }
          }
          obj.class = item.rooms
          obj.class.forEach(item2 => {
            item2.active = true
          })
          this.stepArr.push(obj)
        })
        // this.stepArr = [{step: '', grade: '', grades: [], class: []}]
      } else {
        this.stepArr = [{step: '', grade: '', grades: [], class: []}]
      }
    },
    getStep (n) {
      if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5 || n === 6) {
        return 0
      } else if (n === 7 || n === 8 || n === 9) {
        return 1
      } else {
        return 2
      }
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
    reyinshe (id) {
      var n = ''
      switch (id) {
        case 1 : n = '1年级'
          break
        case 2: n = '2年级'
          break
        case 3: n = '3年级'
          break
        case 4: n = '4年级'
          break
        case 5: n = '5年级'
          break
        case 6: n = '6年级'
          break
        case 7: n = '7年级'
          break
        case 8: n = '8年级'
          break
        case 9: n = '9年级'
          break
        case 10: n = '高一年级'
          break
        case 11: n = '高二年级'
          break
        case 12: n = '高三年级'
          break
      }
      return n
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      this.formData.img_url = res.data.img_path
    },
    isImage (fileName) {
      if (typeof fileName !== 'string') return
      let name = fileName.toLowerCase()
      return name.endsWith('.png') || name.endsWith('.jpeg') || name.endsWith('.jpg')
    },
    beforeAvatarUpload (file) {
      let type = this.isImage(file.name)
      if (!type) {
        this.$message.error('图片上传只支持jpg,jpeg,png格式')
        return false
      }
      const isLt = file.size / 1024 / 1024 < 10
      if (!isLt) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
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
      this.stepArr[index].grade = ''
      this.stepArr[index].grades = []
      this.stepArr[index].class = []
      for (var i = 0; i < this.room_list.length; i++) {
        for (var j = 0; j < grades.length; j++) {
          if (this.room_list[i].grade_key === grades[j]) {
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
    },
    delStep (index) {
      if (this.stepArr.length === 1) { this.$err('最后一项不准删除'); return }
      this.stepArr.splice(index, 1)
      this.isStepAll = false
    },
    toViewDialog (form) {
      this.$refs[form].validate((valid) => {
        console.log(this.formData.type)
        if (!valid) {
          this.$err('请先填写完整内容')
          return false
        } else {
          var classList = ''
          this.stepArr.forEach(step => {
            step.class.forEach(item => {
              if (classList) {
                classList += ' 、' + this.reyinshe(step.grade) + item.name
              } else {
                classList = this.reyinshe(step.grade) + item.name
              }
            })
          })
          this.class_list = classList
          // this.dialogVisible = true
          let formData = Object.assign({}, this.formData)
          formData.bm_end = this.$timeformat(formData.bm_end, 1)
          this.$refs.ystable1.initial({formData: formData, class_list: this.class_list})
        }
      })
    }
  },
  created () {
    this.initWeb()
  },
  mounted () {
  }
}
</script>
