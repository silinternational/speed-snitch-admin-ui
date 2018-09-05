<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Change a tag</h1>

    <v-form @submit.prevent="save" ref="form">
      <v-text-field 
        label="Name" 
        v-model="tag.Name" 
        :rules="[v => !!v || 'Name is required']"
        required 
        :autofocus="true" />

      <v-textarea 
        label="Description" 
        v-model="tag.Description" 
        :rules="[v => !!v || 'Description is required']"
        required
        class="pt-3" />

      <v-layout align-center justify-space-between class="pt-3">
        <v-btn to="/tags" color="secondary">Cancel</v-btn>

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
      tag: {}
    };
  },
  async mounted() {
    this.tag = await API.get(`tag/${this.$route.params.id}`);
  },
  methods: {
    save: async function() {
      if (this.$refs.form.validate()) {
        await API.put(`tag/${this.tag.ID}`, this.tag);

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
