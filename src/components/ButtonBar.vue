<template>
  <div>
    <slot/>
  </div>
</template>

<style scoped>
div {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

div button:last-child {
  background-color: var(--primary-color);
  color: var(--white);

  padding: 0.5em;
  text-transform: uppercase;
}
div button:last-child.caution {
  background-color: red;
}
</style>
