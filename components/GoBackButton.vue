<template>
  <button 
    @click="navigate" 
    :title="title"
    v-no-submit
    tabindex="-1"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  data () {
    return {
      text: 'Back',
      title: 'Go to previous page'
    }
  },
  created () {
    if (window.history.length == 1) {
      this.text = 'Home'
      this.title = 'Go home'
    }
  },
  methods: {
    navigate () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
</script>
