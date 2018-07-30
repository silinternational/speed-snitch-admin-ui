<!-- TODO: lots of duplicated code with this and nodes/Tags.vue, need to refactor -->
<template>
  <section>
    <h1>{{ user.Name }}'s tags</h1>

    <DataTable>
      <caption>Associated tags</caption>
      <thead v-if="userHasTags">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(_tag, _i) in user.Tags" :key="_i">
          <td>{{ _tag.Name }}</td>
          <td><Truncate>{{ _tag.Description }}</Truncate></td>
          <td><button @click="remove(_i)">remove</button></td>
        </tr>
      </tbody> 
      <tfoot v-if="! userHasTags">
        <tr>
          <td :colspan="numCols">
            No tags currently associated with this user.
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
            No tags currently available for this user.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <ButtonBar>
      <router-link :to="`/users/${ $route.params.id }`" tag="button">Back</router-link>
      
      <Spacer/>
    </ButtonBar>
  </section>
</template>

<script>
import API from "@/shared/api";
import DataTable from "@/components/DataTable";
import Truncate from "@/components/Truncate";
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";

export default {
  components: {
    DataTable,
    Truncate,
    ButtonBar,
    Spacer
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
    this.allTags = await API.get("tag");
  },
  methods: {
    add: async function(tag) {
      this.user.Tags = this.user.Tags || [];

      this.user.Tags.push(tag);

      this.user = await API.put(`user/${this.user.ID}`, this.user);
    },
    remove: async function(i) {
      this.user.Tags.splice(i, 1); // remove the requested tag id from existing ids for the PUT of the entire node again...don't like this, would prefer to have endpoints for tags...

      this.user = await API.put(`user/${this.user.ID}`, this.user);
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
    },
    userHasTags: vm => {
      return vm.user.Tags && vm.user.Tags.length;
    }
  }
};
</script>
