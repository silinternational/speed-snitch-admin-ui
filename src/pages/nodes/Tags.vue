<template>
  <section>
    <h1>{{ node.Nickname || node.MacAddr }} tags</h1>

    <DataTable>
      <caption>Associated tags</caption>
      <thead v-if="nodeHasTags">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(_tag, _i) in associatedTags" :key="_i">
          <td>{{ _tag.Name }}</td>
          <td><Truncate>{{ _tag.Description }}</Truncate></td>
          <td><button @click="remove(_i)">remove</button></td>
        </tr>
      </tbody> 
      <tfoot v-if="! nodeHasTags">
        <tr>
          <td :colspan="numCols">
            No tags currently associated with this node.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <DataTable>
      <caption>Available tags</caption>
      <thead v-if="availableTags.length">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr v-for="_tag in availableTags" :key="_tag.ID">
          <td>{{ _tag.Name }}</td>
          <td><Truncate>{{ _tag.Description }}</Truncate></td>
          <td><button @click="add(_tag)">add</button></td>
        </tr>
      </tbody> 
      <tfoot v-if="! availableTags.length">
        <tr>
          <td :colspan="numCols">
            No tags currently available for this node.
          </td>
        </tr>
      </tfoot>
    </DataTable>
  </section>
</template>

<script>
import API from "@/shared/api";
import DataTable from "@/components/DataTable";
import Truncate from "@/components/Truncate";

export default {
  components: {
    DataTable,
    Truncate
  },
  data() {
    return {
      node: {},
      associatedTags: [],
      allTags: [],
      numCols: 3
    };
  },
  async mounted() {
    this.node = await API.get(`node/${this.$route.params.id}`);
    this.allTags = await API.get("tag");
  },
  methods: {
    add: async function(tag) {
      // some nodes may not have any associated tags yet
      this.node.Tags = this.node.Tags || [];

      this.node.Tags.push(tag);

      this.node = await API.put(`node/${this.node.MacAddr}`, this.node);
    },
    remove: async function(i) {
      this.node.Tags.splice(i, 1); // remove the requested tag id from existing ids for the PUT of the entire node again...don't like this, would prefer to have endpoints for tags...

      this.node = await API.put(`node/${this.node.ID}`, this.node);
    }
  },
  computed: {
    availableTags: vm => {
      vm.node.Tags = vm.node.Tags || [];

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
    },
    nodeHasTags: vm => {
      return vm.node.Tags && vm.node.Tags.length;
    }
  }
};
</script>
