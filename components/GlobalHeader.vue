<template>
  <header>
    <img src="/logo.svg">
  </header>
</template>

<style scoped>
header {
  background-color: var(--primary-color);
  min-height: 2em;
  max-height: 4em;
  padding: 0.5em;
}

header > img {
  max-height: inherit;
  max-width: 15%;
}
</style>
