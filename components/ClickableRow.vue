<template>
  <tr @click="navigate()">
    <slot/>
  </tr>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
      default: ""
    }
  },
  methods: {
    navigate: function() {
      this.$router.push(this.to);
    }
  }
};
</script>

<style scoped>
tr {
  cursor: pointer;
}
tr:hover {
  background-color: var(--primary-color-light);
}
tr > td > button {
  cursor: pointer;
}
</style>
