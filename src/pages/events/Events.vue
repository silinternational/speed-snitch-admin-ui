<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height class="pb-3">
      <h1 class="display-1 secondary--text">System-wide events</h1>

      <v-btn to="events/new" color="secondary" icon title="Add a new event">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table :headers="headers" :items="events" :pagination.sync="initialSort"
                  :loading="loading" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Name }}</td>
        <td><Truncate>{{ props.item.Description || '–' }}</Truncate></td>
        <td>{{ props.item.Date | format('MMM D, YYYY') }}</td>
        <td class="justify-center layout px-0">
          <v-btn :href="`#/events/${ props.item.ID }/edit`" flat icon title="Update this event" color="secondary">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn @click="remove(props.item.ID)" flat icon title="Delete this event" color="error">
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        No events at this time.
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import API from "@/shared/api";
import Truncate from "@/components/Truncate";
import { format } from "@/shared/filters";

export default {
  components: {
    Truncate
  },
  filters: {
    format
  },
  data() {
    return {
      events: [],
      headers: [
        {
          text: "Name",
          value: "Name"
        },
        {
          text: "Description",
          value: "Description"
        },
        {
          text: "Date",
          value: "Timestamp"
        },
        {
          sortable: false
        }
      ],
      initialSort: {
        sortBy: "Timestamp",
        descending: true
      },
      loading: true
    };
  },
  async mounted() {
    this.getEvents();
  },
  methods: {
    getEvents: async function() {
      this.loading = true;
      this.events = await API.get("reportingevent");
      this.loading = false;
    },
    remove: async function(id) {
      if (confirm("Are you sure?")) {
        await API.delete(`reportingevent/${id}`);

        this.getEvents(); //TODO: would like to see this update pattern used everywhere instead of $router.go()
      }
    }
  }
};
</script>
