<template>
  <section>
    <h1>Servers</h1>

    <DefinitionList>
      <dt>Name</dt>
      <dd>{{ server.Name }}</dd>

      <dt>Country</dt>
      <dd>{{ (server.Country && server.Country.Name) || "–" }}</dd>

      <dt>Type</dt>
      <dd>{{ server.ServerType }}</dd>

      <dt>Host</dt>
      <dd><code>{{ server.ServerHost }}</code></dd>

      <dt>Description</dt>
      <dd>{{ server.Description || "–" }}</dd> <!-- TODO: review all places in app for this emdash handling, make it consistent -->

      <dt>Notes</dt>
      <dd>{{ server.Notes || "–" }}</dd>
    </DefinitionList>

    <ButtonBar>
      <GoBackButton/>
      
      <Spacer/>
      
      <button 
        @click="remove" 
        class="caution">Remove</button>
    </ButtonBar>

  </section>
</template>

<script>
import { ADMIN_API } from "@/plugins/admin-api-service.js";
import ButtonBar from "@/components/ButtonBar";
import GoBackButton from "@/components/GoBackButton";
import Spacer from "@/components/Spacer";
import DefinitionList from "@/components/DefinitionList";

export default {
  components: {
    ButtonBar,
    GoBackButton,
    Spacer,
    DefinitionList
  },
  data() {
    return {
      server: {}
    };
  },
  async mounted() {
    let response = await ADMIN_API.get(`namedserver/${this.$route.params.id}`);

    this.server = response.data;
  },
  methods: {
    remove: async function() {
      try {
        await ADMIN_API.delete(`namedserver/${this.server.UID}`);
        this.$router.push(`servers?removed=${this.server.UID}/`);
      } catch (error) {
        console.log(`error caught while DELETE server: ${error}`);
      }
    }
  },
  computed: {}
};
</script>

<style scoped>
</style>
