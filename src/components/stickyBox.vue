<template>
  <section class="sticky-box" ref="$box" oncontextmenu="return false" onselectstart="return false"
    :style="boxStyle">
    <div class="content" ref="$content"
      :style="contentStyle">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  components: {
  },
  props: {
    top: {
      type: [String],
      default: 'unset'
    },
    left: {
      type: [String],
      default: 'unset'
    }
  },
  data () {
    return {
      boxStyle: {
        position: 'static',
        top: 0,
        left: 0,
        width: 'auto',
        height: 'auto'
      },

      contentStyle: {
        position: 'static',
        top: 0,
        left: 0,
        width: 'auto',
        height: 'auto'
      },

      isFixedX: false,
      isFixedY: false,
      isSupport: this.stickySupport('position', 'sticky')
    }
  },
  computed: {
  },
  methods: {
    /**
     * [initial 初始化组件]
     * @param  {[Boolean]} v [设置或销毁]
     * @return {[]} []
     */
    initial (v) {
      if (v) this.setStickybox()
      else this.destroyStickybox()
    },

    /**
     * [setStickybox 设置吸顶盒]
     * @return {[]} []
     */
    setStickybox () {
      if (this.isSupport) {
        this.boxStyle = {
          position: 'sticky',
          top: this.top,
          left: this.left
        }
      } else {
        this.getContentSize()
        this.scrollHandler()

        window.addEventListener('resize', this.onResize)
        window.addEventListener('scroll', this.scrollHandler, true)
      }
    },

    /**
     * [destroyStickybox 销毁吸顶盒]
     * @return {[]} []
     */
    destroyStickybox () {
      if (!this.isSupport) {
        window.removeEventListener('resize', this.onResize)
        window.removeEventListener('scroll', this.scrollHandler, true)
      }
    },

    /**
     * [stickySupport 判断是否支持sticky]
     * @param  {[String]} attr [属性]
     * @param  {[String]} value [值]
     * @return {[Boolean]} [是否支持]
     */
    stickySupport (attr, value) {
      let element = document.createElement('div')
      if (attr in element.style) {
        element.style[attr] = value
        return element.style[attr] === value
      } else {
        return false
      }
    },

    /**
     * [getContentSize 获取DOM数据]
     * @return {[]} []
     */
    getContentSize () {
      const style = window.getComputedStyle(this.$refs.$content)

      // 设置盒容器宽高
      this.boxStyle.width = style.width
      this.boxStyle.height = style.height
    },

    /**
     * [scrollHandler 滚轴控制器]
     * @return {[]} []
     */
    scrollHandler () {
      const { $content, $box } = this.$refs
      const { contentStyle } = this
      const boxTop = $box.getBoundingClientRect().top
      const boxLeft = $box.getBoundingClientRect().left
      const contentTop = $content.getBoundingClientRect().top
      const contentLeft = $content.getBoundingClientRect().left

      if (this.top !== 'unset') {
        if (boxTop > parseInt(this.top) && this.isFixedY) {
          this.isFixedY = false
          contentStyle.position = 'static'
        } else if (boxTop < parseInt(this.top) && !this.isFixedY) {
          this.isFixedY = true
          contentStyle.position = 'fixed'
          this.onResize()
        }

        // 重置位置距左异常时left的值
        if (contentLeft !== boxLeft && this.left === 'unset') {
          this.onResize()
        }
      }

      if (this.left !== 'unset') {
        if (boxLeft > parseInt(this.left) && this.isFixedX) {
          this.isFixedX = false
          contentStyle.position = 'static'
        } else if (boxLeft < parseInt(this.left) && !this.isFixedX) {
          this.isFixedX = true
          contentStyle.position = 'fixed'
          this.onResize()
        }

        // 重置位置距左异常时left的值
        if (contentTop !== boxTop && this.top === 'unset') {
          this.onResize()
        }
      }
    },

    /**
     * [onResize 页面重置时样式处理]
     * @return {[]} []
     */
    onResize () {
      const { $box } = this.$refs
      const { contentStyle } = this
      const boxTop = $box.getBoundingClientRect().top
      const boxLeft = $box.getBoundingClientRect().left

      if (contentStyle.position === 'fixed') {
        contentStyle.top = this.top === 'unset' ? `${boxTop}px` : this.top
        contentStyle.left = this.left === 'unset' ? `${boxLeft}px` : this.left
      }
    }
  },
  created () {
  },
  mounted () {
    this.initial(true)
  },
  beforeDestroy () {
    this.initial(false)
  }
}
</script>
