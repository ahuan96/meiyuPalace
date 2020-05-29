<template>
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>
</template>

<script>
export default {
  components: {
  },
  props: [
  ],
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created () {
    console.log(-1)
  },
  mounted () {
  }
}
</script>
