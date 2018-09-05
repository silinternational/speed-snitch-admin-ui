<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Add a new tag</h1>

    <v-form @submit.prevent="add" ref="form">
      <v-text-field 
        label="Name" 
        v-model="newTag.Name" 
        :rules="[v => !!v || 'Name is required']"
        required 
        :autofocus="true" />

      <v-textarea 
        label="Description" 
        v-model="newTag.Description" 
        :rules="[v => !!v || 'Description is required']"
        required
        class="pt-3" />

      <v-layout align-center justify-space-between class="pt-3">
        <v-btn to="/tags" color="secondary">Cancel</v-btn>

        <v-btn type="submit" color="primary">Add</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import API from "@/shared/api";

export default {
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
      if (this.$refs.form.validate()) {
        await API.post("tag", this.newTag);

        this.$router.push("/tags");
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
