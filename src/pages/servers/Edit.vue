<template>
  <section>
    <h1>Change a server</h1>

    <form @submit.prevent="save">
      <label>
        <span>Name:</span> <input v-model="server.Name" v-autofocus>
      </label>
      
      <label>
        <span>Description:</span> <textarea v-model="server.Description" />
      </label>

      <label>
        <span>Notes:</span> <textarea v-model="server.Notes" />
      </label>

      <Info title="Due to system constraints, if you need to change the type, this server will need to be removed and a new one created.">Type: {{ server.Type }}</Info>

      <label>
        <span>Country:</span> 
        <select v-if="server.Type == 'speedTest'" v-model="selectedCountry" @change="countryChosen">
          <option v-if="! countries.length" :value="{}" disabled>
            Retrieving countries...
          </option>
          <option v-for="_country in countries" :value="_country" :key="_country.ID">
            {{ _country.Name }}
          </option>
        </select>
        <input v-else v-model="server.Country">
      </label>

      <label>
        <span>Host:</span> 
        <select v-if="server.Type == 'speedTest'" v-model="server.SpeedTestNetServerID">
          <option value="0" disabled>Select server</option>
          <option v-if="! servers.length" :value="server.SpeedTestNetServerID" disabled>Retrieving servers...</option>
          <option v-else v-for="_server in servers" :value="_server.ID" :key="_server.ID">
            {{ _server.Name }} ({{ _server.Host | domain }})
          </option>
        </select>
        <input v-else v-model="server.Host">
      </label>

      <ButtonBar>
        <router-link :to="`/servers/${ $route.params.id }`" tag="button">Back</router-link>
        
        <Spacer/>
        
        <button>Save</button>
      </ButtonBar>
    </form>
  </section>
</template>

<script>
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";
import Info from "@/components/Info";
import API from "@/shared/api";
import { autofocus } from "@/shared/directives";

export default {
  components: {
    ButtonBar,
    Spacer,
    Info
  },
  directives: {
    autofocus
  },
  filters: {
    domain: domain => domain.split(":")[0]
  },
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
    save: async function() {
      this.server = await API.put(`namedserver/${this.server.ID}`, this.server);

      this.$router.push(`/servers?updated=${this.server.ID}`);
    },
    countryChosen: async function() {
      this.servers = await API.get(
        `speedtestnetserver/country/${this.selectedCountry.Code}`
      );

      this.server.SpeedTestNetServerID = 0;
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

form > * {
  padding-bottom: 1em;
}

/* had to add this one to achieve the same thing as the padding-bottom :-( selects dont take the padding the same as other elements */
form > select {
  margin-bottom: 1em;
}

label {
  display: flex;
  flex-direction: row;
  align-items: center;
}
label > span {
  padding-right: 0.5em;
}

textarea {
  width: 20em;
  height: 4em;
}
</style>
