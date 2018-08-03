<template>
  <section>
    <h1>Add a new server</h1>

    <form @submit.prevent="add">
      <label>
        <span>Name:</span> <input v-model="server.Name" v-autofocus>
      </label>

      <label>
        <span>Description:</span> <textarea v-model="server.Description" />
      </label>

      <label>
        <span>Notes:</span> <textarea v-model="server.Notes" />
      </label>

      <label>
        <span>Type:</span>
        <select v-model="server.Type" @change="typeChosen">
          <option value="" disabled>Select type of test</option>
          <option value="speedTest">Speed test</option>
          <option value="ping">Ping</option>
        </select>
      </label>

      <label v-if="server.Type">
        <span>Country:</span>
        <select v-if="server.Type == 'speedTest'" v-model="selectedCountry" @change="countryChosen">
          <option :value="{}" disabled>
            <span v-if="! countries.length">
              Retrieving countries...
            </span>
            <span v-else>Select country</span>
          </option>
          <option v-for="_country in countries" :value="_country" :key="_country.ID">
            {{ _country.Name }}
          </option>
        </select>
        <input v-else v-model="server.Country">
      </label>

      <label v-if="server.Type == 'ping' || (server.Type == 'speedTest' && selectedCountry.Code)">
        <span>Host:</span> 
        <select v-if="server.Type == 'speedTest'" v-model="server.SpeedTestNetServerID">
          <option value="0" disabled>
            <span v-if="! servers.length">
              Retrieving servers...
            </span>
            <span v-else>Select server</span>
          </option>
          <option v-for="_server in servers" :value="_server.ID" :key="_server.ID">
            {{ _server.Name }} ({{ _server.Host | domain }})
          </option>
        </select>
        <input v-else v-model="server.Host">
      </label>

      <ButtonBar>
        <router-link to="/servers" tag="button">Back</router-link>

        <Spacer/>
        
        <button>Add</button>
      </ButtonBar>
    </form>
  </section>
</template>

<script>
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";
import API from "@/shared/api";
import { autofocus } from "@/shared/directives";

export default {
  components: {
    ButtonBar,
    Spacer
  },
  directives: {
    autofocus
  },
  filters: {
    domain: domain => domain.split(":")[0]
  },
  data() {
    return {
      server: {
        Type: "",
        SpeedTestNetServerID: 0
      },
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
    add: async function() {
      this.server = await API.post(`namedserver`, this.server);

      this.$router.push(`/servers?new=${this.server.ID}/`);
    }
  }
};
</script>

<style scoped>
/* TODO: move these form styles to a more global level since they are getting repetitive */
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
