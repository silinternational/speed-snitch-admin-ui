<template>
  <section>
    <slot/>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

section button:last-child {
  background-color: var(--primary-color);
  color: white;

  padding: 0.5em;
  text-transform: uppercase;
}
section button:last-child.caution {
  background-color: red;
}
</style>
