<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Add a new user</h1>

    <v-form @submit.prevent="add" ref="form">
      <v-text-field 
        label="Name" 
        v-model="newUser.Name" 
        :rules="[v => !!v || 'Name is required']"
        required 
        :autofocus="true" />

      <v-text-field 
        label="Email" 
        v-model="newUser.Email" 
        :rules="[
          v => !!v || 'Email is required',
          // W3C's HTML5 type=email regex
          v => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || 'Invalid email'
        ]"
        required
        class="pt-3" />
      
      <v-select 
        label="Role"
        v-model="newUser.Role" 
        :items="roles"
        class="pt-3"></v-select>

      <v-layout align-center justify-space-between class="pt-3">
        <v-btn to="/users" color="secondary">Cancel</v-btn>

        <v-btn type="submit" color="primary">Add</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import API from "@/shared/api";
import roles from "@/shared/roles";

export default {
  data() {
    return {
      newUser: {
        Name: "",
        Email: "",
        Role: "admin"
      },
      roles: roles
    };
  },
  methods: {
    add: async function() {
      if (this.$refs.form.validate()) {
        await API.post("user", this.newUser);

        this.$router.push("/users");
      }
    }
  }
};
</script>

<style scoped>
/* v-container */
.container {
  max-width: 50ch;
}
</style>
