<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Add a new server</h1>

    <v-form @submit.prevent="add" ref="form">
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

      <v-select 
        label="Type"
        placeholder="Select type of test"
        :items="types"
        v-model="server.Type" 
        required
        :rules="[v => !!v || 'Type is required']"
        @change="typeChosen"
        class="pt-3" />

      <v-select 
        v-if="server.Type == 'speedTest'"
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

      <v-select 
        v-if="server.Type == 'speedTest' && selectedCountry.Code"
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
      <v-text-field 
        v-else-if="server.Type == 'ping'"
        label="Host" 
        v-model="server.Host" 
        required 
        :rules="[v => !!v || 'Host is required']"
        :autofocus="true"
        class="pt-3" />

      <v-layout align-center justify-space-between class="pt-3">
        <v-btn to="/servers" color="secondary">Cancel</v-btn>

        <v-btn type="submit" color="primary">Add</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import API from "@/shared/api";

export default {
  data() {
    return {
      server: {
        Type: "",
        SpeedTestNetServerID: 0
      },
      types: [
        {
          text: "Speed test",
          value: "speedTest"
        },
        {
          text: "Ping",
          value: "ping"
        }
      ],
      countries: [],
      selectedCountry: {},
      servers: []
    };
  },
  methods: {
    typeChosen: async function() {
      if (this.server.Type == "speedTest") {
        this.countries = await API.get("speedtestnetserver/country");
      }
    },
    countryChosen: async function() {
      this.servers = await API.get(
        `speedtestnetserver/country/${this.selectedCountry.Code}`
      );
    },
    serverNameAndHost: server =>
      `${server.Name} (${server.Host.split(":")[0]})`, // remove port if present for display only.
    add: async function() {
      if (this.$refs.form.validate()) {
        await API.post("namedserver", this.server);

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
