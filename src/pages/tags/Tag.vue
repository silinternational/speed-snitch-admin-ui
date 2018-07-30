<template>
  <section>
    <h1>Tag</h1>

    <DefinitionList>
      <dt>Name</dt>
      <dd>{{ tag.Name }}</dd>

      <dt>Description</dt>
      <dd>
        {{ tag.Description }}
      </dd>
    </DefinitionList>

    <ButtonBar>
      <router-link to="/tags" tag="button">Back</router-link>
      
      <Spacer/>
      
      <button @click="remove" class="caution">Remove</button>

      <Spacer/>

      <router-link :to="`${tag.ID}/edit`" tag="button">Edit</router-link>
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
      tag: {}
    };
  },
  async mounted() {
    this.tag = await API.get(`tag/${this.$route.params.id}`);
  },
  methods: {
    remove: async function() {
      await API.delete(`tag/${this.tag.ID}`);

      this.$router.push(`/tags?removed=${this.tag.ID}/`);
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
