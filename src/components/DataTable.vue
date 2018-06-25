<template>
  <table>
    <slot/>
  </table>
</template>

<style scoped>
table {
  table-layout: fixed;
  border-spacing: initial;
  padding-bottom: 2em;
}
table > caption {
  background-color: var(--primary-color-light);

  text-align: center;
  font-size: smaller;
  text-transform: uppercase;

  padding: 2em 0;
}
table >>> th {
  padding: 0.5em 0;
}
table > tfoot > tr > td[colspan] {
  text-align: left;
  font-style: italic;
}

/*
    '>>>' https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors

    this will ensure if there are child components, the styles will "leak" to them
 */
table >>> td {
  padding: 0.5em;
  text-align: center;
}
table >>> td > button {
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 1em;
  text-transform: lowercase;
  padding: 0.2em 0.5em;
}
table >>> td > button.caution {
  background-color: red;
}
table >>> td > button.secondary {
  background-color: var(--secondary-color);
}
table >>> td > button:hover {
  cursor: pointer;
}
</style>
