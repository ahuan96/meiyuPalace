<template>
  <div class="group">
    <div class="edit">
      <h2>发布活动</h2>
      <el-form ref="elform" label-width="150px"
        :model="formData"
        :rules="rules">
        <el-form-item label="活动类型" prop="type">
          <el-col
            :span="15">
            <el-radio-group size="small"
              v-model="formData.type">
              <el-radio-button
                :key="item.id"
                :label="item.id"
                v-for="item in rules.type[2]['list']">
                {{item.name}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item label="活动名称" prop="name">
          <el-col
            :span="15">
            <el-input placeholder="请输入活动名称"
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
            <img v-if="formData.img_url" :src="formData.img_url" >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="活动内容" prop="active_content">
          <el-col
            :span="15">
            <el-input type="textarea" placeholder="请输入活动内容"
              v-model="formData.active_content"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="活动要求" prop="condition">
          <el-col
            :span="15">
            <el-input type="textarea" placeholder="请输入活动要求"
              v-model="formData.condition"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动图片" prop="img_url">
          <el-upload
            class="avatar-uploader"
            :action=this.action
            :data="{ 'userfile': 's.png' }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.img_one" :src="this.img_one" >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            :action=this.action
            :data="{ 'userfile': 's.png' }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.img_two" :src="this.img_two" >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            :action=this.action
            :data="{ 'userfile': 's.png' }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess3"
            :before-upload="beforeAvatarUpload">
            <img v-if="this.img_three" :src="this.img_three" >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动范围" prop="grade">
          <el-col
            :span="15">
            <el-select placeholder="请选择年级"
                       @change="changeGrade(rules.grade[2]['data'])"
                       v-model="rules.grade[2]['data']">
              <el-option
                :key="item.grade_key"
                :label="item.grade"
                :value="item.grade_key"
                v-for="item in rules.grade[2]['list']">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="room_ids">
          <el-col
            :span="15">
            <el-select multiple placeholder="请选择班级"
                       @change="roomIds"
                       v-model="rules.room_ids[2]['data']" >
              <el-option
                :key="item.id"
                :label="rules.room_ids[2]['list']['grade']+item.name"
                :value="item.id"
                v-for="item in rules.room_ids[2]['list']['rooms']">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="上传截止时间" prop="end_time">
          <el-col
            :span="15">
            <el-date-picker type="date" placeholder="请选择上传截止时间"
               @change="timeValue(rules.end_time[2]['data'],1)"
               v-model="rules.end_time[2]['data']">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="活动老师" prop="teacher_ids">
          <el-col
            :span="15">
            <el-select multiple placeholder="请选择活动老师"
              @change="teacherIds"
              v-model="rules.teacher_ids[2]['data']">
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
      img_one: '',
      img_two: '',
      img_three: '',
      action: this.url + 'activity/do_upload2?' + '&uc_sid=' + this.cookie,
      // 确认内容数据
      confirmData: { k: 'project', buttons: [{ name: '我知道了' }] },

      // 表单数据
      formData: {
        id: this.$route.query.id,
        type: '',
        name: '',
        active_content: '',
        condition: '',
        grade: '-1',
        room_ids: '-1',
        end_time: '',
        teacher_ids: '',
        organization: '',
        img_url: '',
        other_img: ''
      },

      // 表单验证
      formRule: [
        ['select', { list: [], data: '校内活动' }],
        ['name', { }],
        ['cont', { }],
        ['cont', { }],
        ['select', { list: [], data: '' }],
        ['need', { list: [], data: '' }],
        ['datetime', { data: null }],
        ['select', { list: [], data: [] }],
        ['cont', { }],
        ['select', { }],
        ['need', { }]
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

      $rule[0][1]['list'] = [
        { id: '1', name: '校内活动' },
        { id: '2', name: '校外实践' }
      ]

      // 班级数据
      let $rt = await this.$get('activity/get_roomlist/')
      $rule[4][1]['list'] = $rt.room_list

      // 老师数据
      $rt = await this.$get('meiyu/getTeachers/', {school_id: window.Global.database.school_id})
      $rule[7][1]['list'] = $rt.data
    },

    /**
     * [submitForm 提交表单]
     * @param  {[String]} form [表单]
     * @return {[]} []
     */
    submitForm (form) {
      console.log(this.rules)
      this.$refs[form].validate((valid) => {
        console.log(this.formData.type)
        if (!valid) return false

        // 提交
        let $rt = this.$post('meiyu/createActivity', this.formData)
        $rt.then((rt) => {
          this.$router.push({ name: 'Activity' })
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
      this.formData.room_ids = ids.join(',')
    },
    changeGrade (id) {
      const $rule = this.formRule
      var list = this.formRule[4][1]['list']
      for (let i = 0; i < list.length; i++) {
        if (this.yinshe(list[i]['grade'], id)) {
          $rule[5][1]['list'] = list[i]
        }
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
    handleAvatarSuccess (res, file) {
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
    handleAvatarSuccess1 (res, file) {
      if (this.formData.other_img) {
        this.formData.other_img = this.formData.other_img + ';' + res.data.img_path
      } else {
        this.formData.other_img = this.formData.other_img + res.data.img_path
      }
      this.img_one = res.data.img_path
    },
    handleAvatarSuccess2 (res, file) {
      if (this.formData.other_img) {
        this.formData.other_img = this.formData.other_img + ';' + res.data.img_path
      } else {
        this.formData.other_img = this.formData.other_img + res.data.img_path
      }
      this.img_two = res.data.img_path
    },
    handleAvatarSuccess3 (res, file) {
      if (this.formData.other_img) {
        this.formData.other_img = this.formData.other_img + ';' + res.data.img_path
      } else {
        this.formData.other_img = this.formData.other_img + res.data.img_path
      }
      this.img_three = res.data.img_path
    }
  },
  created () {
    this.initWeb()
  },
  mounted () {
  }
}
</script>
