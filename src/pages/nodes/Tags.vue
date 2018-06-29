<template>
  <section>
    <h1>{{ node.MacAddr }} tags</h1>

    <DataTable>
      <caption>Associated tags</caption>
      <thead v-if="associatedTags.length > 0">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(_tag, _i) in associatedTags"
          :key="_i">
          <td>{{ _tag.Name }}</td>
          <td><Truncate>{{ _tag.Description }}</Truncate></td>
          <td><button @click="remove(_i)">remove</button></td>
        </tr>
      </tbody> 
      <tfoot v-if="associatedTags.length == 0">
        <tr>
          <td :colspan="numCols">
            No tags currently associated with this node.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <DataTable>
      <caption>Available tags</caption>
      <thead v-if="availableTags.length > 0">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="_tag in availableTags"
          :key="_tag.UID">
          <td>{{ _tag.Name }}</td>
          <td><Truncate>{{ _tag.Description }}</Truncate></td>
          <td><button @click="add(_tag)">add</button></td>
        </tr>
      </tbody> 
      <tfoot v-if="availableTags.length == 0">
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
    let nodeResponse = await API.get(`node/${this.$route.params.macaddr}`);

    let associatedTagsResponse = await API.get(
      `node/${this.$route.params.macaddr}/tag`
    );

    let allTagsResponse = await API.get("tag");

    this.node = nodeResponse.data;
    this.associatedTags = associatedTagsResponse.data || [];
    this.allTags = allTagsResponse.data || [];
  },
  methods: {
    add: async function(tag) {
      // some nodes may not have any associated tags yet
      if (!this.node.Tags) {
        this.node.Tags = [];
      }
      this.node.Tags.push(tag);

      let response = await API.put(`node/${this.node.MacAddr}`, this.node);

      this.$router.go();
    },
    remove: async function(i) {
      this.node.Tags.splice(i, 1); // remove the requested tag id from existing ids for the PUT of the entire node again...don't like this, would prefer to have endpoints for tags...

      let response = await API.put(`node/${this.node.MacAddr}`, this.node);

      this.$router.go();
    }
  },
  computed: {
    availableTags: function() {
      let availableTags = this.allTags.filter(candidateTag => {
        for (let i = 0; i < this.associatedTags.length; i++) {
          const associatedTag = this.associatedTags[i];
          if (associatedTag.UID == candidateTag.UID) {
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
</style>
