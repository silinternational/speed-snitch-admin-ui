<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Change a version</h1>

    <v-form @submit.prevent="save" ref="form">
      <v-text-field 
        label="Number" 
        v-model="version.Number" 
        :rules="[v => !!v || 'Number is required']"
        required 
        :autofocus="true" />
      
      <v-textarea 
        label="Description" 
        v-model="version.Description" 
        :rules="[v => !!v || 'Description is required']"
        required
        class="pt-3" />

      <v-layout align-center justify-space-between class="pt-3">
        <v-btn to="/versions" color="secondary">Cancel</v-btn>

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
      version: {}
    };
  },
  async mounted() {
    this.version = await API.get(`version/${this.$route.params.id}`);
  },
  methods: {
    save: async function() {
      if (this.$refs.form.validate()) {
        await API.put(`version/${this.version.ID}`, this.version);

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
