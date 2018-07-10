<template>
  <section>
    <h1>Add a new tag</h1>

    <form @submit.prevent="add">
      <label>
        Name:
        <input 
          v-model="newTag.Name" 
          v-autofocus>
      </label>
      <label>
        Description:
        <textarea 
          v-model="newTag.Description" />
      </label>

      <ButtonBar>
        <router-link 
          to="/tags" 
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
      newTag: {
        Name: "",
        Description: ""
      }
    };
  },
  methods: {
    add: async function() {
      try {
        let tag = await API.post(`tag`, this.newTag);

        this.$router.push(`/tags?new=${tag.UID}/`);
      } catch (error) {
        console.log(`error caught while POSTing tag: ${error}`);
      }
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
