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
          <td><button @click="add(_tag)">add</button></td>
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
      user: {},
      associatedTags: [],
      allTags: [],
      numCols: 3
    };
  },
  async mounted() {
    this.user = await API.get(`user/${this.$route.params.id}`);
    this.associatedTags =
      (await API.get(`user/${this.$route.params.id}/tag`)) || [];
    this.allTags = (await API.get("tag")) || [];
  },
  methods: {
    add: async function(tag) {
      // some nodes may not have any associated tags yet
      if (!this.user.Tags) {
        this.user.Tags = [];
      }
      this.user.Tags.push(tag);

      await API.put(`user/${this.user.UID}`, this.user);

      this.$router.go();
    },
    remove: async function(i) {
      this.user.Tags.splice(i, 1); // remove the requested tag id from existing ids for the PUT of the entire node again...don't like this, would prefer to have endpoints for tags...

      await API.put(`user/${this.user.UID}`, this.user);

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
