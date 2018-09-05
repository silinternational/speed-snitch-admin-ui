<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">{{ node.Nickname || node.MacAddr }} tags</h1>

    <h2 class="subheading">Associated tags</h2>
    <v-data-table :headers="headers" :items="node.Tags || []" :loading="loading" hide-actions class="elevation-1 mb-4">
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
        No tags currently associated with this node.
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
        No tags currently associated with this node.
      </template>
    </v-data-table>

    <v-btn :to="`/nodes/${ $route.params.id }`" color="secondary">Back</v-btn>
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
      node: {},
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
    this.node = await API.get(`node/${this.$route.params.id}`);
    this.allTags = await API.get("tag");
    this.loading = false;
  },
  methods: {
    add: async function(tag) {
      // some nodes may not have any associated tags yet
      this.node.Tags = this.node.Tags || [];

      this.node.Tags.push(tag);

      this.loading = true;
      this.node = await API.put(`node/${this.node.ID}`, this.node);
      this.loading = false;
    },
    remove: async function(i) {
      this.node.Tags.splice(i, 1); // remove the requested tag id from existing ids for the PUT of the entire node again...don't like this, would prefer to have endpoints for tags...

      this.loading = true;
      this.node = await API.put(`node/${this.node.ID}`, this.node);
      this.loading = false;
    }
  },
  computed: {
    availableTags: vm => {
      vm.node.Tags = vm.node.Tags || []; // some nodes may not have any associated tags yet

      const availableTags = vm.allTags.filter(candidateTag => {
        for (let i = 0; i < vm.node.Tags.length; i++) {
          const associatedTag = vm.node.Tags[i];
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
