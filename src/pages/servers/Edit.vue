<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Change a server</h1>

    <v-form @submit.prevent="save" ref="form">
      <v-text-field 
        label="Name" 
        v-model="server.Name" 
        :rules="[v => !!v || 'Name is required']"
        required 
        :autofocus="true" />
      
      <v-textarea 
        label="Description" 
        v-model="server.Description" 
        class="pt-3" />

      <v-textarea 
        label="Notes" 
        v-model="server.Notes"
        class="pt-3" />

      <v-tooltip right>
        <v-text-field 
          label="Type" 
          :value="server.Type"
          append-icon="help"
          readonly 
          slot="activator" />
        <span>Due to system constraints, if you need to change the type, this server will need to be removed and a new one created.</span>
      </v-tooltip>

      <v-select v-if="server.Type == 'speedTest'"
        label="Country"
        placeholder="Select country"
        :items="countries"
        :loading="! countries.length" 
        item-text="Name"
        return-object
        v-model="selectedCountry"
        required
        :rules="[v => !!v || 'Country is required']"
        @change="countryChosen"
        class="pt-3" />
      <v-text-field v-else
        label="Country"
        v-model="server.Country"
        :autofocus="true"
        class="pt-3" />

      <v-select v-if="server.Type == 'speedTest'"
        label="Host"
        placeholder="Select server"
        :items="servers"
        :loading="! servers.length" 
        :item-text="serverNameAndHost"
        item-value="ID"
        v-model="server.SpeedTestNetServerID"
        required
        :rules="[v => !!v || 'Server is required']"
        class="pt-3" />
      <v-text-field v-else
        label="Host" 
        v-model="server.Host" 
        required 
        :rules="[v => !!v || 'Host is required']"
        :autofocus="true"
        class="pt-3" />

      <v-layout align-center justify-space-between class="pt-3">
        <v-btn to="/servers" color="secondary">Cancel</v-btn>

        <v-btn type="submit" color="primary">Save</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import API from "@/shared/api";

export default {
  data() {
    return {
      server: {},
      countries: [],
      servers: [],
      selectedCountry: {},
      selectedServer: {}
    };
  },
  async mounted() {
    this.server = await API.get(`namedserver/${this.$route.params.id}`);

    if (this.server.Type == "speedTest") {
      this.countries = await API.get("speedtestnetserver/country");

      this.selectedCountry = this.countries.find(
        country => this.server.CountryCode == country.Code
      );

      this.servers = await API.get(
        `speedtestnetserver/country/${this.selectedCountry.Code}`
      );
    }
  },
  methods: {
    serverNameAndHost: server =>
      `${server.Name} (${server.Host.split(":")[0]})`, // remove port if present for display only.
    countryChosen: async function() {
      this.servers = await API.get(
        `speedtestnetserver/country/${this.selectedCountry.Code}`
      );
    },
    save: async function() {
      if (this.$refs.form.validate()) {
        await API.put(`namedserver/${this.server.ID}`, this.server);

        this.$router.push("/servers");
      }
    }
  }
};
</script>

<style scoped>
/* v-container */
.container {
  max-width: 60ch;
}
</style>
