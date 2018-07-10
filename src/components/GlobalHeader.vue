<template>
  <header>
    <img src="@/assets/logo.svg">
    <ol>
      <li><a href="#/nodes">Nodes</a></li>
      <li v-if="$user.Role == 'superAdmin'"><a href="#/users">Users</a></li>
      <li v-if="$user.Role == 'superAdmin'"><a href="#/tags">Tags</a></li>
      <li v-if="$user.Role == 'superAdmin'"><a href="#/servers">Servers</a></li>
      <li v-if="$user.Role == 'superAdmin'"><a href="#/versions">Versions</a></li>
    </ol>

    <Spacer />

    <ol>
      <li>{{ $user.Name }}</li>
      <li>
        <a :href="logoutURL"><small>logout</small></a>
      </li>
    </ol>
  </header>
</template>

<script>
import Spacer from "@/components/Spacer";
import API from "@/shared/api";

export default {
  components: {
    Spacer
  },
  computed: {
    logoutURL: function() {
      return `${
        API.defaults.baseURL
      }/ssp/module.php/core/authenticate.php?as=default-sp&logout`;
    }
  }
};
</script>

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
