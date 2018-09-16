<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height class="pb-3">
      <h1 class="display-1 secondary--text">Tags</h1>

      <v-btn to="tags/new" color="secondary" icon title="Add a new tag">
        <v-icon>library_add</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table :headers="headers" :items="tags" :loading="loading" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Name }}</td>
        <td><Truncate>{{ props.item.Description }}</Truncate></td>
        <td class="justify-center layout px-0">
          <v-btn :href="`#/tags/${ props.item.ID }/edit`" flat icon title="Update this tag" color="secondary">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn @click="remove(props.item.ID)" flat icon title="Delete this tag" color="error">
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        No tags at this time.
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
      tags: [],
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
          sortable: false
        }
      ],
      loading: true
    };
  },
  async mounted() {
    this.getTags();
  },
  methods: {
    getTags: async function() {
      this.loading = true;
      this.tags = await API.get("tag");
      this.loading = false;
    },
    remove: async function(id) {
      if (confirm("Are you sure?")) {
        await API.delete(`tag/${id}`);

        this.getTags();
      }
    }
  }
};
</script>
