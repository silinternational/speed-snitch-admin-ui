<template>
  <section>
    <h1>Add a new user</h1>

    <form @submit.prevent="add">
      <label>
        Name:
        <input 
          v-model="newUser.Name" 
          v-autofocus>
      </label>
      <label>
        Email:
        <input 
          type="email" 
          v-model="newUser.Email">
      </label>
      <label>
        Role:
        <select v-model="newUser.Role">
          <option 
            v-for="_role in roles" 
            :key="_role" 
            :value="_role">{{ _role }}</option>
        </select>
      </label>

      <ButtonBar>
        <router-link 
          to="/users" 
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
      newUser: {
        Name: "",
        Email: "",
        Role: "reporting"
      },
      roles: ["superAdmin", "admin", "reporting"]
    };
  },
  methods: {
    add: async function() {
      try {
        let user = await API.post(`user`, this.newUser);

        this.$router.push(`/users?new=${user.UID}/`);
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
