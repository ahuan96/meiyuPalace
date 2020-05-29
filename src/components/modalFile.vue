<template>
  <el-dialog class="modal-file" width="520px" title="批量导入" oncontextmenu="return false" onselectstart="return false"
    :close-on-click-modal="false"
    :visible.sync="isShowing"
    v-if="isShowing">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="top">
          <strong
            v-html="'请先下载' + fileData.name + '名单模板'"></strong>

          <el-button size="small" type="primary"
            @click="toDownload">下载名单模板</el-button>
        </td>
        <td valign="top">
          <strong
            v-html="'请选取待上传' + fileData.name + '名单文件'"></strong>

          <el-upload ref="elupload" name="userfile"
            :action="url + 'admin/importStudent/?uc_sid=' + cookie"
            :data="{ userfile: 'userfile' }"
            :limit="1"
            :auto-upload="false"
            :on-success="uploadFilesSuccess">
            <el-button size="small" type="primary">选取文件</el-button>
            <div class="el-upload__tip" slot="tip"
              v-html="top"></div>
          </el-upload>
        </td>
      </tr>
    </table>

    <span slot="footer">
      <el-button type="primary"
        @click="uploadFiles">确认上传</el-button>
      <el-button type="info"
        @click="cancelFiles">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixmodal from './mixin/modal'

export default {
  mixins: [mixmodal],
  components: {
  },
  props: [
    'fileData'
  ],
  data () {
    return {
      tip: '' // 提示语
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
      this.toggleShow()
    },

    /**
     * [uploadFiles 确认上传文件]
     * @return {[]} []
     */
    uploadFiles () {
      this.$refs.elupload.submit()
    },

    /**
     * [uploadFilesSuccess 成功上传文件]
     * @param  {[Object]} rt [返回]
     * @return {[]} []
     */
    uploadFilesSuccess (rt) {
      if (rt.err_code === 0) {
        this.tip = '上传成功！即将为您返回列表'

        setTimeout(() => {
          this.$emit('fileCalBak')
          this.cancelFiles()
        }, 3000)
      } else {
        this.$notify.error({
          title: '错误',
          message: rt.msg,
          offset: 100
        })
      }
    },

    /**
     * [cancelFiles 取消上传文件]
     * @return {[]} []
     */
    cancelFiles () {
      this.$refs.elupload.clearFiles()
      this.toggleShow()
    },

    /**
     * [toDownload 下载模板]
     * @return {[]} []
     */
    toDownload () {
      let file = this.url + 'static/files/student.xls'
      window.open(file)
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
