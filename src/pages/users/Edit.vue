<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Change user info</h1>

    <v-form @submit.prevent="save" ref="form">
      <v-text-field 
        label="Name" 
        v-model="user.Name" 
        :rules="[v => !!v || 'Name is required']"
        required 
        :autofocus="true" />
      
      <v-text-field 
        label="Email" 
        v-model="user.Email" 
        :rules="[
          v => !!v || 'Email is required',
          // W3C's HTML5 type=email regex
          v => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || 'Invalid email'
        ]"
        required
        class="pt-3" />
      
      <v-select 
        label="Role"
        v-model="user.Role" 
        :items="roles"
        class="pt-3"></v-select>

      <v-layout align-center class="pt-3">
        <v-btn to="/users" color="secondary">Cancel</v-btn>

        <v-spacer />
        
        <v-btn :to="`/users/${this.$route.params.id}/tags`" color="secondary">Manage tags</v-btn>
        <v-btn type="submit" color="primary">Save</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import API from "@/shared/api";

export default {
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
      if (this.$refs.form.validate()) {
        await API.put(`user/${this.user.ID}`, this.user);

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
