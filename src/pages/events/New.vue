<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">
      <span>Add a new {{ node.Nickname || 'system-wide' }} event</span>
    </h1>

    <v-container>
      <v-form @submit.prevent="add" ref="form">
        <v-text-field 
          label="Name" 
          v-model="newEvent.Name" 
          :rules="[v => !!v || 'Name is required']"
          required 
          :autofocus="true" />

        <v-textarea label="Description" v-model="newEvent.Description" class="pt-3" />

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
          <v-date-picker v-model="newEvent.Date" :max="today"></v-date-picker>
        </v-menu>

        <v-layout align-center justify-space-between class="pt-3">
          <v-btn :to="$route.params.id ? `/nodes/${this.$route.params.id}` : '/events'" color="secondary">Cancel</v-btn>

          <v-btn type="submit" color="primary">Add</v-btn>
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
      newEvent: {
        Name: "",
        Description: "",
        NodeID: Number(this.$route.params.id) || 0,
        Date: null
      },
      node: {},
      today: moment().format("YYYY-MM-DD")
    };
  },
  computed: {
    prettyDate: vm =>
      vm.newEvent.Date ? format(vm.newEvent.Date, "MMM D, YYYY") : null
  },
  async mounted() {
    if (this.$route.params.id) {
      this.node = await API.get(`node/${this.$route.params.id}`);
    }
  },
  methods: {
    add: async function() {
      if (this.$refs.form.validate()) {
        await API.post("reportingevent", this.newEvent);

        if (this.$route.params.id) {
          this.$router.push(`/nodes/${this.$route.params.id}`);
        } else {
          this.$router.push("/events");
        }
      }
    }
  }
};
</script>

<style scoped>
/* v-container */
.container {
  max-width: 70ch;
}
.container > form {
  max-width: 50ch;
}
</style>
