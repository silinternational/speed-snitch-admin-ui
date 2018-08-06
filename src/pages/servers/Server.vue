<template>
  <section>
    <h1>Server</h1>

    <DefinitionList>
      <dt>Name</dt>
      <dd>{{ server.Name }}</dd>

      <dt>Country</dt>
      <dd>{{ server.Country || "–" }}</dd>

      <dt>Type</dt>
      <dd>{{ server.Type }}</dd>

      <dt>Host</dt>
      <dd><code>{{ server.Host }}</code></dd>

      <dt>Description</dt>
      <dd>{{ server.Description || "–" }}</dd> <!-- TODO: review all places in app for this emdash handling, make it consistent -->

      <dt>Notes</dt>
      <dd>{{ server.Notes || "–" }}</dd>
    </DefinitionList>

    <ButtonBar>
      <router-link to="/servers" tag="button">Back</router-link>

      <Spacer/>
      
      <button @click="remove" class="caution">Remove</button>

      <Spacer/>

      <router-link :to="`${server.ID}/edit`" tag="button">Edit</router-link>
    </ButtonBar>

  </section>
</template>

<script>
import API from "@/shared/api";
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";
import DefinitionList from "@/components/DefinitionList";

export default {
  components: {
    ButtonBar,
    Spacer,
    DefinitionList
  },
  data() {
    return {
      server: {}
    };
  },
  async mounted() {
    this.server = await API.get(`namedserver/${this.$route.params.id}`);
  },
  methods: {
    remove: async function() {
      await API.delete(`namedserver/${this.server.ID}`);

      this.$router.push(`/servers?removed=${this.server.ID}/`);
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 15em;
}
</style>


