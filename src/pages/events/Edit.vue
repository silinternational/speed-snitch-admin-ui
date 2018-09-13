<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Change a system-wide event</h1>

    <v-container>
      <v-form @submit.prevent="save" ref="form">
        <v-text-field 
          label="Name" 
          v-model="event.Name" 
          :rules="[v => !!v || 'Name is required']"
          required 
          :autofocus="true" />

        <v-textarea 
          label="Description" 
          v-model="event.Description" 
          :rules="[v => !!v || 'Description is required']"
          required
          class="pt-3" />

          <v-menu>
            <v-text-field
              slot="activator"
              label="Date"
              v-model="prettyDate"
              :rules="[v => !!v || 'Date is required']"
              required
              prepend-icon="event"
              readonly 
              class="pt-3" />
            <v-date-picker v-model="event.Date" :max="today"></v-date-picker>
          </v-menu>

        <v-layout align-center justify-space-between class="pt-3">
          <v-btn to="/events" color="secondary">Cancel</v-btn>

          <v-btn type="submit" color="primary">Save</v-btn>
        </v-layout>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import API from "@/shared/api";
import { format } from "@/shared/filters";
import moment from "moment";

export default {
  data() {
    return {
      event: {},
      today: moment().format("YYYY-MM-DD")
    };
  },
  computed: {
    prettyDate: vm =>
      vm.event.Date ? format(vm.event.Date, "MMM D, YYYY") : null
  },
  async mounted() {
    this.event = await API.get(`reportingevent/${this.$route.params.id}`);
  },
  methods: {
    save: async function() {
      if (this.$refs.form.validate()) {
        await API.put(`reportingevent/${this.event.ID}`, this.event);

        this.$router.push("/events");
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
