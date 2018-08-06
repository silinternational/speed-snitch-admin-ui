<template>
  <section>
    <h1>Change user info</h1>

    <form @submit.prevent="save">
      <label>
        Name: <input v-model="user.Name" v-autofocus>
      </label>
      
      <label>
        Email: <input type="email" v-model="user.Email">
      </label>
      
      <label>
        Role:
        <select v-model="user.Role">
          <option v-for="_role in roles" :key="_role" :value="_role">{{ _role }}</option>
        </select>
      </label>

      <ButtonBar>
        <router-link :to="`/users/${ $route.params.id }`" tag="button">Back</router-link>
        
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
      user: {},
      roles: ["superAdmin", "admin"]
    };
  },
  async mounted() {
    this.user = await API.get(`user/${this.$route.params.id}`);
  },
  methods: {
    save: async function() {
      this.user = await API.put(`user/${this.user.ID}`, this.user);

      this.$router.push(`/users?updated=${this.user.ID}`);
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
