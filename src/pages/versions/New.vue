<template>
  <section>
    <h1>Add a new version</h1>

    <form @submit.prevent="add">
      <label>
        Number:
        <input v-model="newVersion.Number" v-autofocus>
      </label>
      <label>
        Description:
        <textarea v-model="newVersion.Description" />
      </label>

      <ButtonBar>
        <router-link to="/versions" tag="button">Back</router-link>
        
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
      newVersion: {
        Number: "",
        Description: ""
      }
    };
  },
  methods: {
    add: async function() {
      try {
        let response = await API.post(`version`, this.newVersion);

        this.$router.push(`/versions?new=${response.data.Number}/`);
      } catch (error) {
        console.log(`error caught while POSTing user: ${error}`);
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
