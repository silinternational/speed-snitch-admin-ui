<template>
  <span>
    <img v-if="uname == 'linux' && architecture == 'arm'" src="@/assets/raspberry-pi.svg" alt="Raspberry Pi"/>
    <img v-else-if="uname == 'linux'" src="@/assets/linux.svg" alt="Linux"/>
    <img v-else-if="uname == 'darwin'" src="@/assets/darwin.svg" alt="Apple"/>
    <img v-else-if="uname == 'windows'" src="@/assets/windows.svg" alt="Windows"/>
    <span v-else>{{ uname }}</span>
  </span>
</template>

<script>
export default {
  props: {
    uname: String,
    architecture: String
  }
};
</script>

<style scoped>
img {
  height: 100%;
  max-height: 36px;
  padding: 0.5em;
}
</style>
