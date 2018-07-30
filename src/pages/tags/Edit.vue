<template>
  <section>
    <h1>Change a tag</h1>

    <form @submit.prevent="save">
      <label>
        Name: <input v-model="tag.Name" v-autofocus>
      </label>
      
      <label>
        Description: <textarea v-model="tag.Description" />
      </label>

      <ButtonBar>
        <router-link :to="`/tags/${ $route.params.id }`" tag="button">Back</router-link>
        
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
      tag: {}
    };
  },
  async mounted() {
    this.tag = await API.get(`tag/${this.$route.params.id}`);
  },
  methods: {
    save: async function() {
      this.tag = await API.put(`tag/${this.tag.ID}`, this.tag);

      this.$router.push(`/tags?updated=${this.tag.ID}`);
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
