<template>
  <ul class="search" oncontextmenu="return false" onselectstart="return false"
    :changesvalue="changesvalue">
    <li class="text"
      v-html="searchData.text"
      v-if="searchData.text"></li>

    <li class="select"
      :key="item.key"
      v-for="item of searchData.selector"
      v-if="searchData.selector">
      <el-select
        :placeholder="item.placeholder"
        @change="selectChanged(item, $event)"
        v-model="$data.$params[item.key]">
        <el-option
          :key="it.id"
          :label="it.name"
          :value="it.id"
          v-for="it in item.value"></el-option>
      </el-select>
    </li>

    <template
      v-if="searchData.startend">
      <li class="select">
        <el-select placeholder="起始年份"
          v-model="searchData.startend[0]['selected']">
          <el-option
            :key="it.id"
            :label="it.name"
            :value="it.id"
            v-for="it in searchData.startend[0]['value']"></el-option>
        </el-select>
      </li>
      <li style="line-height:2rem">至</li>
      <li class="select">
        <el-select placeholder="截至年份"
          v-model="searchData.startend[1]['selected']">
          <el-option
            :key="it.id"
            :label="it.name"
            :value="it.id"
            v-for="it in searchData.startend[1]['value']"></el-option>
        </el-select>
      </li>
    </template>

    <li class="day"
      v-if="searchData.daterange">
      <el-date-picker :type="searchData.daterange ===2 ? 'daterange':'monthrange'" start-placeholder="起始日期" end-placeholder="截止日期" range-separator="至"
        v-model="$data.$params.start_time" value-format="yyyy-MM-dd">
      </el-date-picker>
    </li>
    <li class="day"
      v-if="searchData.daterange2">
      <el-date-picker type="daterange" start-placeholder="起始日期" end-placeholder="截止日期" range-separator="至"
        v-model="$data.$params.date_time" value-format="yyyy-MM-dd">
      </el-date-picker>
    </li>
    <li class="day"
      v-if="searchData.datetimerange">
      <el-date-picker type="datetimerange" start-placeholder="起始日期" end-placeholder="截止日期" range-separator="至"
        v-model="$data.$params.start_datetime" value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </li>
    <li class="input"
      v-if="searchData.keywords">
      <el-input placeholder="查询内容"
        v-model="$data.$params.searchKey">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </li>
    <li class="input"
      v-if="searchData.searchCont">
      <el-input :placeholder="searchData.placeholder||'查询内容'"
        v-model="$data.$params.keywords">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </li>

    <li
      v-if="searchData.caption">
      <h2
        v-html="searchData.caption[0]"></h2>
      <p
        v-html="searchData.caption[1]"></p>
    </li>

    <li
      v-if="!searchData.nosearchbutton">
      <el-button type="primary"
        @click="askforSearch">查询</el-button>
    </li>

    <li class="last"
      v-if="searchData.buttons || searchData.files">
      <el-select
        :placeholder="searchData.files.placeholder"
        v-model="searchData.files.model"
        @change="filesDeal"
        v-if="searchData.files">
        <el-option
          :key="item.id"
          :label="item.name"
          :value="item.id"
          v-for="item in searchData.files.value"
          v-if="item.id === '0' || item.id === '1'"></el-option>
      </el-select>

      <el-button type="primary"
        :key="item.key"
        @click="$emit(item.key)"
        v-html="item.value"
        v-for="item of searchData.buttons"
        v-if="searchData.buttons"></el-button>
    </li>
  </ul>
</template>

<script>
export default {
  components: {
  },
  props: [
    'searchData'
  ],
  data () {
    return {
      $params: {}, // 搜索参数
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
      for (let item of this.searchData.selector) {
        this.$data.$params[item.key] = item.v
      }
    },

    /**
     * [askforSearch 请求搜索]
     * @return {[]} []
     */
    askforSearch () {
      if (this.searchData.startend) {
        for (let item of this.searchData.startend) {
          this.$data.$params[item.key] = item.selected
        }
      }
      this.$emit('searchCalBak', this.$data.$params)
    },

    /**
     * [selectChanged 切换视图引导]
     * @param  {[Object]} item [元素数据]
     * @param  {[Int]} $event [当前选项]
     * @return {[]} []
     */
    selectChanged (item, $event) {
      this.changesvalue = item.key + '-' + $event
      if (item.cbk) {
        this.$emit(item.cbk, $event)
      }
    },

    /**
     * [resetSelects 切换后同时重置后续选项]
     * @param  {[Int]} i [重置起点序号]
     * @return {[]} []
     */
    resetSelects (i) {
      // 切换后续操作
      const modals = [
        'StudentAdmin', 'ClassroomAdmin', 'KaoqinAdmin' // 教务信息
      ]
      if (modals.indexOf(this.$route.name) === -1) {
        return
      }

      if (this.searchData.selector) {
        for (let item of this.searchData.selector) {
          let index = this.searchData.selector.indexOf(item)
          if (index < i) continue
          if (item.reset) {
            delete this.$data.$params[item.key]
          }
        }
      }
    },

    /**
     * [filesDeal 批量操作]
     * @param  {[Int]} v [编码列表]
     * @return {[]} []
     */
    filesDeal (v) {
      const files = this.searchData.files
      files.model = files.placeholder

      this.$emit(files.key, v)
    }
  },
  created () {
    this.initial()
  },
  mounted () {
  }
}
</script>
