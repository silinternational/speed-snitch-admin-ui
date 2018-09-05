<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height class="pb-3">
      <h1 class="display-1 secondary--text">Servers</h1>

      <v-btn to="servers/new" color="secondary" icon title="Add a new server">
        <v-icon>add_to_queue</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table :headers="headers" :items="servers" :loading="loading" hide-actions item-key="ID" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Name }}</td>
        <td>{{ props.item.Country || '–' }}</td>
        <td>{{ props.item.Type }}</td>
        <td class="justify-center layout px-0">
          <v-btn @click="props.expanded = !props.expanded" flat icon title="Details" color="primary">
            <v-icon v-if="! props.expanded">expand_more</v-icon>
            <v-icon v-else>expand_less</v-icon>
          </v-btn>
          <v-btn :href="`#/servers/${ props.item.ID }/edit`" flat icon title="Update this server" color="secondary">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn @click="remove(props.item.ID)" flat icon title="Delete this server" color="error">
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="expand" slot-scope="props">
        <p class="body-2 pt-3">
          <span class="pl-5">Host:</span>
          <span class="body-1">
            {{ props.item.Host }}
          </span>
          <span class="pl-5">Description:</span>
          <span class="body-1">
            {{ props.item.Description || '–'}}
          </span>
          <span class="pl-5">Notes:</span>
          <span class="body-1">
            {{ props.item.Notes || '–' }}
          </span>
        </p>
      </template>
      <template slot="no-data">
        No servers at this time.
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import API from "@/shared/api";

export default {
  data() {
    return {
      servers: [],
      headers: [
        {
          text: "Name",
          value: "Name"
        },
        {
          text: "Country",
          value: "Country"
        },
        {
          text: "Type",
          value: "Type"
        },
        {
          sortable: false
        }
      ],
      loading: true
    };
  },
  async mounted() {
    this.servers = await API.get("namedserver");
    this.loading = false;
  },
  methods: {
    remove: async function(id) {
      confirm("Are you sure?") && (await API.delete(`namedserver/${id}`));

      this.$router.go();
    }
  }
};
</script>
