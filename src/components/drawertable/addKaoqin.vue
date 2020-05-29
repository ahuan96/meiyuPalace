<template>
  <el-drawer size="70%" title="创建考勤" direction="rtl" oncontextmenu="return false" onselectstart="return false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <div class="demo-drawer__content" style="bottom:0">
      <div class="kaoqin">
        <ys-search ref="yssearch"
          :searchData="searchData"
          v-on:eduCalBak="eduChange"
          v-on:yearCalBak="yearChange"
          v-on:searchCalBak="paramsChange"></ys-search>

        <div class="edit" style="top:2.7rem;bottom:1rem">
          <dl class="ke">
            <dt>
              <h3>学生名单：</h3>
              <ul>
                <li>
                  <div class="chu">出勤</div>
                  <div class="que">缺勤</div>
                </li>
                <li>
                  <div class="ti">请老师根据学生实际情况酌情给予课堂表现分，每次点击扣除0.5分，每次点击增加0.5分，提交后将不予修改！</div>
                </li>
              </ul>
            </dt>
            <dd>
              <div class="column">
                <el-date-picker type="date" placeholder="请选择上课日期" value-format="timestamp"
                  :editable="false"
                  :clearable="false"
                  @change="dateChange"
                  v-model="paramsform.class_time">
                </el-date-picker>

                <el-radio-group
                  @change="kemuChange"
                  v-model="paramsform.stype">
                  <el-radio label="1">音乐</el-radio>
                  <el-radio label="2">美术</el-radio>
                </el-radio-group>

                <el-radio-group
                  @change="classChange"
                  v-model="paramsform.course">
                  <el-radio
                    :key="item.id"
                    :label="item.id"
                    :disabled="item.disabled"
                    v-for="item of itemsCourse">{{item.name}}</el-radio>
                </el-radio-group>
                <div style="margin:0.7rem 0;">
                  <el-switch
                  :disabled="!paramsform.course||!params.room_id"
                  v-model="paramsform.all_absence"
                  @change="absenceChange"
                  active-text="全部缺勤">
                </el-switch>
                </div>
              </div>
              <ul
                :changesvalue="changesvalue">
                <li
                  :key="index"
                  :class="(paramsform.course && item.absence === 0) ? '' : 'none'"
                  v-for="(item, index) of items">
                  <h3>
                    <i
                      @click="chuqinChange(item)"></i>
                    <p>{{item.name}}</p>
                  </h3>
                  <div class="score">
                    <template
                      v-if="paramsform.course && item.absence === 0">
                      <a :class="item.score===5?'disadd':'add'" title="课堂表现 加分"
                       @click="item.score===5?'':goDealScore(item, true)"></a>
                      <a :class="item.score===0?'discut':'cut'" title="课堂表现 扣分"
                        @click="item.score===0?'':goDealScore(item, false)"></a>
                    </template>
                    <template
                      v-else>
                      <a class="add"></a>
                      <a class="cut"></a>
                    </template>
                    <div>{{item.score}}</div>
                  </div>
                </li>
              </ul>

              <el-button type="primary"
                :disabled="!(params.room_id && paramsform.course)"
                @click="toAdd">提交考勤</el-button>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <!-- 加分弹出层 -->
    <el-dialog width="300px" title="加分理由" append-to-body
      :visible.sync="addScoreReason">
      <el-radio-group class="onlyline"
        v-model="addScoreChoose">
        <el-radio label="遵守课堂纪律"></el-radio>
        <el-radio label="认真听讲，注意力集中"></el-radio>
        <el-radio label="积极发言参与，逻辑表达清晰"></el-radio>
        <el-radio label="组织小组讨论交流，有自己见解"></el-radio>
        <el-radio label="其他优秀表现"></el-radio>
      </el-radio-group>
      <span slot="footer">
        <el-button type="primary"
          @click="toDealScore(addScoreChoose, 0.5)">确 定</el-button>
        <el-button type="info"
          @click="addScoreReason = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 扣分弹出层 -->
    <el-dialog width="300px" title="扣分理由" append-to-body
      :visible.sync="cutScoreReason">
      <el-radio-group class="onlyline"
        v-model="cutScoreChoose">
        <el-radio label="不遵守课堂纪律"></el-radio>
        <el-radio label="注意力不集中，经常开小差"></el-radio>
        <el-radio label="不愿意积极发言，逻辑表达不清晰"></el-radio>
        <el-radio label="抵触与同学交流"></el-radio>
        <el-radio label="其他较差表现"></el-radio>
      </el-radio-group>
      <span slot="footer">
        <el-button type="primary"
          @click="toDealScore(cutScoreChoose, -0.5)">确 定</el-button>
        <el-button type="info"
          @click="cutScoreReason = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import mixdrawer from '../mixin/drawer'

export default {
  mixins: [mixdrawer],
  components: {
  },
  props: [
    'itemsEdu', 'itemsRoom'
  ],
  data () {
    return {
      items: [], // 学生数据
      itemsCourse: [
        { id: '1', name: '第1节课', disabled: false }, { id: '2', name: '第2节课', disabled: false },
        { id: '3', name: '第3节课', disabled: false }, { id: '4', name: '第4节课', disabled: false },
        { id: '5', name: '第5节课', disabled: false }, { id: '6', name: '第6节课', disabled: false },
        { id: '7', name: '第7节课', disabled: false }, { id: '8', name: '第8节课', disabled: false },
        { id: '9', name: '第9节课', disabled: false }, { id: '10', name: '第10节课', disabled: false }
      ], // 课程数据

      params: { select_edu_stage: '', year: '', room_id: '' }, // 参数
      paramsform: { room_id: '', class_time: '', stype: '1', course: '', students: [], all_absence: false }, // 提交参数

      // 查询内容数据
      searchData: {
        selector: [
          { key: 'select_edu_stage', value: null, placeholder: '选择阶段', cbk: 'eduCalBak' },
          { key: 'year', value: null, placeholder: '选择年级', reset: true, needed: 'select_edu_stage', cbk: 'yearCalBak' },
          { key: 'room_id', value: null, placeholder: '选择班级', reset: true, needed: 'year' }
        ]
      },

      changesvalue: null, // 切换值
      changesid: null, // 当前操作学生

      addScoreReason: false, // 加分理由弹出层
      addScoreChoose: '遵守课堂纪律', // 加分选项
      cutScoreReason: false, // 扣分理由弹出层
      cutScoreChoose: '不遵守课堂纪律' // 扣分选项
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
      // 重置缓存数据
      this.items = []
      this.params = { select_edu_stage: '', year: '', room_id: '' }
      this.paramsform = { room_id: '', class_time: new Date((new Date()).toLocaleDateString()).getTime(), stype: '1', course: '', students: [] }

      this.setSearchData()
      this.toggleShow()
    },

    /**
     * [askDatas 请求数据]
     * @return {[]} []
     */
    askDatas () {
      let $rt = this.$get('kaoqin/get_students/', this.params)
      $rt.then((rt) => {
        this.items = rt.data
        for (let item of this.items) {
          item.absence = 0
          item.score = Number(this.paramsform.stype === '1' ? item.evaluation.ktbxf_y : item.evaluation.ktbxf_m)
          item.detail = []
        }
      }).catch((rt) => {
      })
    },

    /**
     * [setSearchData 设置查询内容数据]
     * @return {[]} []
     */
    setSearchData () {
      const $sel = this.searchData.selector
      $sel[0]['value'] = JSON.parse(JSON.stringify(this.itemsEdu))
      $sel[1]['value'] = []
      $sel[2]['value'] = []
    },

    /**
     * [paramsChange 切换查询条件]
     * @param  {[Object]} $params [查询参数]
     * @return {[]} []
     */
    paramsChange ($params) {
      const keys = Object.keys(this.params)
      for (let k of keys) {
        if ($params[k]) this.params[k] = $params[k]
        else this.params[k] = ''
      }

      this.askDatas()

      // 重置缓存数据
      this.paramsform.room_id = ''
      this.paramsform.class_time = new Date((new Date()).toLocaleDateString()).getTime()
      this.paramsform.stype = '1'
      this.paramsform.course = ''

      // 选择班级成功则触发切换日期功能
      if (this.params.room_id) {
        this.dateChange(this.paramsform.class_time)
      }
    },

    /**
     * [eduChange 切换学段]
     * @param  {[Int]} id [学段ID]
     * @return {[]} []
     */
    eduChange (id) {
      const $sel = this.searchData.selector
      $sel[1]['value'] = []
      $sel[2]['value'] = []

      for (let item of this.nianji) {
        if (id === item.xueduan) {
          $sel[1]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(1)
    },

    /**
     * [yearChange 切换年级]
     * @param  {[Int]} id [年级ID]
     * @return {[]} []
     */
    yearChange (id) {
      const $sel = this.searchData.selector
      $sel[2]['value'] = []

      for (let item of this.itemsRoom) {
        if (id === item.grade) {
          $sel[2]['value'].push(item)
        }
      }

      this.$refs.yssearch.resetSelects(2)
    },

    /**
     * [dateChange 切换日期]
     * @param  {[Int]} v [时间戳]
     * @return {[]} []
     */
    dateChange (v) {
      if (!this.params.room_id) return

      this.askDatas()

      // 重置缓存数据
      this.paramsform.course = ''

      // 请求当日课程数据
      const params = {
        room_id: this.params.room_id,
        time: v / 1000
      }

      let $rt = this.$get('kaoqin/onceClass/', params)
      $rt.then((rt) => {
        for (let item of this.itemsCourse) {
          item.disabled = false
          for (let it of rt.data) {
            if (item.id === it.course) {
              item.disabled = true
              break
            }
          }
        }
      }).catch((rt) => {
      })
    },

    /**
     * [kemuChange 切换科目]
     * @return {[]} []
     */
    kemuChange () {
      this.askDatas()

      // 重置缓存数据
      this.paramsform.course = ''
    },

    /**
     * [classChange 切换课程]
     * @return {[]} []
     */
    classChange () {
      this.askDatas()
    },
    /**
     * [chuqinChange 设置全部缺勤]
     * @param  {[Object]} item [元素数据]
     * @return {[]} []
     */
    absenceChange (value) {
      this.items.forEach(item => {
        item.absence = value ? 1 : 0
      })
    },
    /**
     * [chuqinChange 判断是否全部缺勤]
     * @param  {[Object]} value [元素数据]
     * @return {[]} []
     */
    isAllAbsence (value) {
      let isAllAbsence = true
      this.items.forEach(item => {
        if (item.absence === 0) {
          isAllAbsence = false
        }
      })
      this.paramsform.all_absence = isAllAbsence
    },
    /**
     * [chuqinChange 切换出勤状态]
     * @return {[]} []
     */
    chuqinChange (item) {
      if (!this.paramsform.course) return

      if (item.absence === 0) {
        item.absence = 1
        item.detail = []
      } else {
        item.absence = 0
      }
      this.changesvalue = Math.random()
      this.isAllAbsence()
    },

    /**
     * [goDealScore 准备加扣分]
     * @param  {[Object]} item [元素数据]
     * @param  {[Boolean]} type [方式]
     * @return {[]} []
     */
    goDealScore (item, type) {
      this.changesid = item.id
      if (type === true) {
        this.addScoreReason = true
      } else {
        this.cutScoreReason = true
      }
    },

    /**
     * [toDealScore 确定加扣分]
     * @param  {[Int]} reason [加扣分理由]
     * @param  {[Number]} score [加扣分值]
     * @return {[]} []
     */
    toDealScore (reason, score) {
      for (let item of this.items) {
        if (this.changesid === item.id) {
          let obj = {
            content: reason,
            score: score
          }
          item.detail.push(obj)

          item.score = (Number(item.score) + Number(score))
          if (item.score > 5) {
            item.score = 5
          } else if (item.score < 0) {
            item.score = 0
          }

          if (score > 0) {
            this.addScoreReason = false
          } else {
            this.cutScoreReason = false
          }

          break
        }
      }
    },

    /**
     * [toAdd 添加考勤]
     * @return {[]} []
     */
    toAdd () {
      const params = {}
      Object.assign(params, this.paramsform)
      params.room_id = this.params.room_id
      params.students = []

      if (!params.room_id) {
        this.$err('请选择考勤班级')
        return
      }

      if (!params.course) {
        this.$err('请选择考勤课程')
        return
      }

      params.class_time = parseInt(params.class_time / 1000)

      for (let item of this.items) {
        let obj = {
          id: item.id,
          absence: item.absence,
          score: item.score,
          detail: item.detail
        }
        params.students.push(obj)
      }
      params.students = JSON.stringify(params.students)

      let $rt = this.$post('kaoqin/createNew/', params)
      // location.reload()
      $rt.then((rt) => {
        this.$notify({
          title: '成功',
          message: '新增考勤成功',
          type: 'success'
        })
        this.$emit('formCalBak')
        this.toggleShow()
        this.$emit('formCalBak')
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
