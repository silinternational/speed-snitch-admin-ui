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
        Description
        <textarea 
          v-model="newTag.Description" />
      </label>

      <ButtonBar>
        <GoBackButton/>
        
        <Spacer/>
        
        <button>Add</button>
      </ButtonBar>
    </form>
  </section>
</template>

<script>
import ButtonBar from "~/components/ButtonBar";
import GoBackButton from "~/components/GoBackButton";
import Spacer from "~/components/Spacer";
import { ADMIN_API } from "~/plugins/admin-api-service.js";

export default {
  components: {
    ButtonBar,
    GoBackButton,
    Spacer
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
        let response = await ADMIN_API.post(`tag`, this.newTag);

        this.$router.push(`/tags?new=${response.data.UID}`);
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
