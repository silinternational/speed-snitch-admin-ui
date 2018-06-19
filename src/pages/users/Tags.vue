<!-- TODO: lots of duplicated code with this and nodes/Tags.vue, need to refactor -->
<template>
  <section>
    <h1>{{ user.Name }}'s tags</h1>

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
            No tags currently associated with this user.
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
          <td><button @click="add(_tag.UID)">add</button></td>
        </tr>
      </tbody> 
      <tfoot v-if="availableTags.length == 0">
        <tr>
          <td :colspan="numCols">
            No tags currently available for this user.
          </td>
        </tr>
      </tfoot>
    </DataTable>
  </section>
</template>

<script>
import { ADMIN_API } from "@/plugins/admin-api-service.js";
import DataTable from "@/components/DataTable";
import Truncate from "@/components/Truncate";

export default {
  components: {
    DataTable,
    Truncate
  },
  data() {
    return {
      user: {},
      associatedTags: [],
      allTags: [],
      numCols: 3
    };
  },
  async mounted() {
    let userResponse = await ADMIN_API.get(`user/${this.$route.params.id}`);
    let associatedTagsResponse = await ADMIN_API.get(
      `user/${this.$route.params.id}/tag`
    );
    let allTagsResponse = await ADMIN_API.get("tag");

    this.user = userResponse.data;
    this.associatedTags = associatedTagsResponse.data || [];
    this.allTags = allTagsResponse.data || [];
  },
  methods: {
    add: async function(tagId) {
      // some nodes may not have any associated tags yet
      if (!this.user.TagUIDs) {
        this.user.TagUIDs = [];
      }
      this.user.TagUIDs.push(tagId);

      await ADMIN_API.put(`user/${this.user.UID}`, this.user);

      this.$router.go();
    },
    remove: async function(i) {
      this.user.TagUIDs.splice(i, 1); // remove the requested tag id from existing ids for the PUT of the entire node again...don't like this, would prefer to have endpoints for tags...

      await ADMIN_API.put(`user/${this.user.UID}`, this.user);

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
