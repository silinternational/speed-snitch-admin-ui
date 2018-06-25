<template>
  <header>
    <img src="@/assets/logo.svg">
    <ol>
      <li><a href="#/nodes">Nodes</a></li>
      <li><a href="#/users">Users</a></li>
      <li><a href="#/tags">Tags</a></li>
      <li><a href="#/servers">Servers</a></li>
    </ol>
  </header>
</template>

<style scoped>
header {
  background-color: var(--primary-color);
  color: var(--white);
  min-height: 2em;
  max-height: 4em;
  padding: 0.5em;

  display: flex;
  flex-direction: row;
  align-items: center;
}

header > img {
  max-height: inherit;
  max-width: 15%;
}

ol {
  display: flex;
  flex-direction: row;

  list-style-type: none;
}
ol > li {
  padding-right: 1em;
}

header > ol > li > a {
  color: var(--white);
  text-decoration: none;
}
</style>
