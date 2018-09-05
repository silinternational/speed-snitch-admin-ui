<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Add a new version</h1>

    <v-form @submit.prevent="add" ref="form">
      <v-text-field 
        label="Number" 
        v-model="newVersion.Number" 
        :rules="[v => !!v || 'Number is required']"
        required 
        :autofocus="true" />
      
      <v-textarea 
        label="Description" 
        v-model="newVersion.Description" 
        :rules="[v => !!v || 'Description is required']"
        required
        class="pt-3" />
  
      <v-layout align-center justify-space-between class="pt-3">
        <v-btn to="/versions" color="secondary">Cancel</v-btn>

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
      newVersion: {
        Number: "",
        Description: ""
      }
    };
  },
  methods: {
    add: async function() {
      if (this.$refs.form.validate()) {
        await API.post("version", this.newVersion);

        this.$router.push("/versions");
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
