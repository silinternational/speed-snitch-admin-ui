<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height class="pb-3">
      <h1 class="display-1 secondary--text">Versions</h1>

      <v-btn to="versions/new" color="secondary" icon title="Add a new version">
        <v-icon>note_add</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table :headers="headers" :items="versions" :loading="loading" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Number }}</td>
        <td><Truncate>{{ props.item.Description || '–' }}</Truncate></td>
        <td class="justify-center layout px-0">
          <v-btn :href="`#/versions/${ props.item.ID }/edit`" flat icon title="Update this version" color="secondary">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn @click="remove(props.item.ID)" flat icon title="Delete this version" color="error">
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        No versions at this time.
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import API from "@/shared/api";
import Truncate from "@/components/Truncate";

export default {
  components: {
    Truncate
  },
  data() {
    return {
      versions: [],
      headers: [
        {
          text: "Number",
          value: "Number"
        },
        {
          text: "Description",
          value: "Description"
        },
        {
          sortable: false
        }
      ],
      loading: true
    };
  },
  async mounted() {
    this.versions = await API.get("version");
    this.loading = false;
  },
  methods: {
    remove: async function(id) {
      confirm("Are you sure?") && (await API.delete(`version/${id}`));

      this.$router.go();
    }
  }
};
</script>
