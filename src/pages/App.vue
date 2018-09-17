<template>
  <v-app>
    <v-toolbar app color="primary">
      <img src="@/assets/logo.svg">

      <v-toolbar-items>
        <v-btn href="#/nodes" flat dark>Nodes</v-btn>
        <v-btn v-if="$user.Role == 'superAdmin'" href="#/users" flat dark>Users</v-btn>
        <v-btn v-if="$user.Role == 'superAdmin'" href="#/tags" flat dark>Tags</v-btn>
        <v-btn v-if="$user.Role == 'superAdmin'" href="#/servers" flat dark>Servers</v-btn>
        <v-btn v-if="$user.Role == 'superAdmin'" href="#/versions" flat dark>Versions</v-btn>
        <v-btn v-if="$user.Role == 'superAdmin'" href="#/events" flat dark>Events</v-btn>
      </v-toolbar-items>
    
      <v-spacer></v-spacer>
    
      <v-toolbar-title class="white--text">{{ $user.Name }}</v-toolbar-title>

      <v-divider vertical dark class="ml-3" inset />

      <v-tooltip left>
        <v-btn :href="logoutURL" slot="activator" icon dark small>
          <v-icon small>exit_to_app</v-icon>
        </v-btn>

        Log out
      </v-tooltip>
    </v-toolbar>
    
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import API from "@/shared/api";

export default {
  data() {
    return {
      logoutURL: `${
        API.defaults.baseURL
      }/ssp/module.php/core/authenticate.php?as=default-sp&logout`
    };
  }
};
</script>

<style scoped>
img {
  height: 100%; /* contain img to the toolbar's height */
}
</style>
