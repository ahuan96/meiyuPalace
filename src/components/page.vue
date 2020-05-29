<template>
  <el-pagination background layout="pager, jumper, total" oncontextmenu="return false" onselectstart="return false"
    :total="cnt"
    :page-size="size"
    :current-page="page"
    @current-change="handleCurrentChange"
    v-if="cnt">
  </el-pagination>
</template>

<script>
export default {
  components: {
  },
  props: [
    'cnt', 'size'
  ],
  data () {
    return {
      page: 1
    }
  },
  computed: {
  },
  methods: {
    /**
     * [handleCurrentChange 切换页码]
     * @param  {[Int]} p [页码]
     * @return {[]} []
     */
    handleCurrentChange (p) {
      this.$emit('page', p)
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
