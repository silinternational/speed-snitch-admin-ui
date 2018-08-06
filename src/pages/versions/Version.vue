<template>
  <section>
    <h1>Version</h1>

    <DefinitionList>
      <dt>Number</dt>
      <dd>{{ version.Number }}</dd>
      
      <dt>Description</dt>
      <dd>{{ version.Description }}</dd>
    </DefinitionList>

    <ButtonBar>
      <router-link to="/versions" tag="button">Back</router-link>
      
      <Spacer/>
      
      <button @click="remove" class="caution">Remove</button>

      <Spacer/>

      <router-link :to="`${version.ID}/edit`" tag="button">Edit</router-link>
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
      version: {}
    };
  },
  async mounted() {
    this.version = await API.get(`version/${this.$route.params.id}`);
  },
  methods: {
    remove: async function() {
      await API.delete(`version/${this.version.ID}`);

      this.$router.push(`/versions?removed=${this.version.ID}`);
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
