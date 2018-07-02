<template>
  <section>
    <h1>Version</h1>

    <DefinitionList>
      <dt>Number</dt>
      <dd>{{ version.Number }}</dd>
      
      <dt>Description</dt>
      <dd>
        {{ version.Description }}
      </dd>
    </DefinitionList>

    <ButtonBar>
      <router-link to="/versions" tag="button">Back</router-link>
      
      <Spacer/>
      
      <button @click="remove" class="caution">Remove</button>
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
    let response = await API.get(`version/${this.$route.params.id}`);

    this.version = response.data;
  },
  methods: {
    remove: async function() {
      try {
        await API.delete(`version/${this.version.Number}`);

        this.$router.push(`/versions?removed=${this.version.Number}/`);
      } catch (error) {
        console.log(`error caught while DELETE version: ${error}`);
      }
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
