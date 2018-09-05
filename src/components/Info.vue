<template>
  <aside>
    <slot/>

    <v-tooltip right>
      <v-icon slot="activator" size="14">help</v-icon>
      <span>{{ info }} </span>
    </v-tooltip>
  </aside>
</template>

<script>
export default {
  props: {
    info: String
  }
};
</script>

<style scoped>
aside {
  /* ensure the help icon is always right next to the text */
  white-space: nowrap;
}

.v-tooltip {
  /* move it up and to the right a little, like a superscript */
  position: relative;
  top: -0.5em;
  left: 0.3em;

  cursor: help;
}
</style>
