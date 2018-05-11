<template>
  <div>
    <!-- TODO: if the content IS truncated, add a :title with the full content. -->
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    at: {
      type: String,
      default: "10ch"
    }
  }
};
</script>

<style scoped>
div {
  display: block;
  max-width: 30ch; /* TODO: take this from 'at' prop */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
