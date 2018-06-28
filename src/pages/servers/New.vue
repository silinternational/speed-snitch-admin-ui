<template>
  <section>
    <h1>Add a new server</h1>

    <form @submit.prevent="add">
      <label>
        Name:
        <input 
          v-model="newServer.Name" 
          v-autofocus>
      </label>

      <label>
        Description:
        <textarea 
          v-model="newServer.Description" />
      </label>

      <label>
        Notes:
        <textarea 
          v-model="newServer.Notes" />
      </label>

      <select 
        v-model="newServer.ServerType" 
        @change="typeChosen">
        <option 
          value="" 
          disabled>Select type of test</option>
        <option value="speedTestNet">Speed test</option>
        <option value="custom">Latency test</option>
      </select>

      <select 
        v-if="newServer.ServerType == 'speedTestNet'"
        v-model="newServer.Country" 
        @change="countryChosen">
        <option 
          :value="{}" 
          disabled>
          <span v-if="countries.length == 0">
            Retrieving countries...
          </span>
          <span v-else>Select country</span>
        </option>
        <option 
          v-for="_country in countries" 
          :value="_country"
          :key="_country.Code">{{ _country.Name }}</option>
      </select>

      <select 
        v-if="newServer.ServerType == 'speedTestNet' && newServer.Country.Code"
        v-model="newServer.SpeedTestNetServerID" >
        <option 
          value=""
          disabled>
          <span v-if="servers.length == 0">
            Retrieving servers...
          </span>
          <span v-else>Select server</span>
        </option>
        <option 
          v-for="_server in servers" 
          :value="_server.ServerID"
          :key="_server.ServerID">{{ _server.Name }}</option>
      </select>

      <label v-if="newServer.ServerType == 'custom'">
        Host:
        <input 
          v-model="newServer.ServerHost"
          v-autofocus>
      </label>

      <ButtonBar>
        <router-link 
          to="/servers" 
          tag="button">Back</router-link>

        <Spacer/>
        
        <button>Add</button>
      </ButtonBar>
    </form>
  </section>
</template>

<script>
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";
import { ADMIN_API } from "@/plugins/admin-api-service.js";

export default {
  components: {
    ButtonBar,
    Spacer
  },
  data() {
    return {
      newServer: {
        Name: "",
        ServerType: "",
        SpeedTestNetServerID: "",
        ServerHost: "",
        Country: {},
        Description: "",
        Notes: ""
      },
      countries: [],
      servers: []
    };
  },
  methods: {
    typeChosen: async function() {
      if (this.newServer.ServerType == "speedTestNet") {
        try {
          let response = await ADMIN_API.get("speedtestnetserver/country");
          this.countries = response.data;
        } catch (error) {
          console.log(`error caught while GETting countries: ${error}`);
        }
      }
    },
    countryChosen: async function() {
      try {
        let response = await ADMIN_API.get(
          `speedtestnetserver/country/${this.newServer.Country.Code}`
        );
        this.servers = response.data.Servers;
      } catch (error) {
        console.log(`error caught while GETting speedtestservers: ${error}`);
      }
    },
    add: async function() {
      try {
        let response = await ADMIN_API.post(`namedserver`, this.newServer);
        this.$router.push(`/servers?new=${response.data.UID}/`);
      } catch (error) {
        console.log(`error caught while POSTing namedserver: ${error}`);
      }
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
</style>
