<!-- TODO: lots of duplicated code with this and nodes/Tags.vue, need to refactor -->
<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">{{ user.Name }}'s tags</h1>

    <h2 class="subheading">Associated tags</h2>
    <v-data-table :headers="headers" :items="user.Tags || []" :loading="loading" hide-actions class="elevation-1 mb-4">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.Name }}</td>
          <td>
            <Truncate>{{ props.item.Description }}</Truncate>
          </td>
          <td>
            <v-icon @click="remove(props.index)" color="error" title="Disassociate">remove_circle</v-icon>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        No tags currently associated with this user.
      </template>
    </v-data-table>

    <h2 class="subheading">Available tags</h2>
    <v-data-table :headers="headers" :items="availableTags" :loading="loading" hide-actions class="elevation-1 mb-4">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.Name }}</td>
          <td>
            <Truncate>{{ props.item.Description }}</Truncate>
          </td>
          <td>
            <v-icon @click="add(props.item)" color="success" title="Associate">add_circle</v-icon>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        No tags currently associated with this user.
      </template>
    </v-data-table>

    <v-btn to="/users" color="secondary">Back</v-btn>
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
      user: {},
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
          value: "ID"
        }
      ],
      loading: true,
      allTags: []
    };
  },
  async mounted() {
    this.user = await API.get(`user/${this.$route.params.id}`);
    this.allTags = await API.get("tag");
    this.loading = false;
  },
  methods: {
    add: async function(tag) {
      this.user.Tags = this.user.Tags || [];

      this.user.Tags.push(tag);

      this.loading = true;
      this.user = await API.put(`user/${this.user.ID}`, this.user);
      this.loading = false;
    },
    remove: async function(i) {
      this.user.Tags.splice(i, 1); // remove the requested tag id from existing ids for the PUT of the entire node again...don't like this, would prefer to have endpoints for tags...

      this.loading = true;
      this.user = await API.put(`user/${this.user.ID}`, this.user);
      this.loading = false;
    }
  },
  computed: {
    availableTags: vm => {
      vm.user.Tags = vm.user.Tags || [];
      const availableTags = vm.allTags.filter(candidateTag => {
        for (let i = 0; i < vm.user.Tags.length; i++) {
          const associatedTag = vm.user.Tags[i];
          if (associatedTag.ID == candidateTag.ID) {
            return false;
          }
        }

        return true;
      });

      return availableTags;
    }
  }
};
</script>

<style scoped>
/* v-container */
.container {
  max-width: 80ch;
}
</style>
