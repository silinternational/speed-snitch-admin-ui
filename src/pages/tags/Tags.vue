<template>
  <section>
    <h1>Tags</h1>

    <DataTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="_tag in tags"
          :key="_tag.UID">
          <td>{{ _tag.Name }}</td>
          <td><Truncate>{{ _tag.Description }}</Truncate></td>
          <td>
            <router-link 
              :to="`tags/${ _tag.UID }`" 
              tag="button" 
              class="secondary">Manage</router-link>
          </td>
        </tr>
      </tbody> 
      <tfoot v-if="tags.length == 0">
        <tr>
          <td :colspan="numCols">
            No tags at this time.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <ButtonBar>
      <Spacer/>
        
      <router-link 
        to="tags/new" 
        tag="button">
        Add a new tag
      </router-link>
    </ButtonBar>

  </section>
</template>

<script>
import API from "@/shared/api";
import DataTable from "@/components/DataTable";
import Info from "@/components/Info";
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";
import Truncate from "@/components/Truncate";

export default {
  components: {
    DataTable,
    Info,
    ButtonBar,
    Spacer,
    Truncate
  },
  data() {
    return {
      tags: [],
      numCols: 3
    };
  },
  async mounted() {
    this.tags = await API.get("tag");
  },
  methods: {
    manage: function(id) {
      this.$router.push(`tags/${id}`);
    }
  }
};
</script>
