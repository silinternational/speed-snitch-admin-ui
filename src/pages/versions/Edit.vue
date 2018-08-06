<template>
  <section>
    <h1>Change a version</h1>

    <form @submit.prevent="save">
      <label>
        Number: <input v-model="version.Number" v-autofocus>
      </label>
      
      <label>
        Description: <textarea v-model="version.Description" />
      </label>

      <ButtonBar>
        <router-link :to="`/versions/${ $route.params.id }`" tag="button">Back</router-link>
        
        <Spacer/>
        
        <button>Save</button>
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
  data() {
    return {
      version: {}
    };
  },
  async mounted() {
    this.version = await API.get(`version/${this.$route.params.id}`);
  },
  methods: {
    save: async function() {
      this.version = await API.put(`version/${this.version.ID}`, this.version);

      this.$router.push(`/versions?updated=${this.version.ID}`);
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
</style>
