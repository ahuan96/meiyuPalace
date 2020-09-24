<template>
    <!-- 预览弹框 -->
    <el-dialog title="社团详情"  :visible.sync="isShowing"
    v-if="isShowing"  width="320px">
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
        <div class="m-cont">{{this.formData.bm_end}}</div>
        <div class="m-tip">发起单位</div>
        <div class="m-cont">{{formData.organization}}</div>
     </div>
  </el-dialog>
</template>
<script>
import mixdrawer from '../mixin/drawer'
export default {
  mixins: [mixdrawer],
  data () {
    return {
      formData: {},
      class_list: ''
    }
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @return {[]} []
     */
    initial (params) {
      this.formData = params.formData
      this.class_list = params.class_list
      this.toggleShow()
    }
  }

}
</script>
