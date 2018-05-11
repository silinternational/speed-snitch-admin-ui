<template>
  <aside>
    <slot/> <div>i</div>
  </aside>
</template>

<style scoped>
aside {
  white-space: nowrap;
}
div {
  /* using these to center the letter */
  display: inline-block;
  font-family: monospace;
  width: 1em;
  padding-left: 0.05em;

  /* move it up and to the right a little, like a superscript */
  position: relative;
  top: -1em;
  left: 0.3em;
  font-size: xx-small;

  /* now give it a bubble */
  color: whitesmoke;
  background-color: var(--secondary-color);
  border-radius: 1em;
}
</style>
