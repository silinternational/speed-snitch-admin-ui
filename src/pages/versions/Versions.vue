<template>
  <section>
    <h1>Versions</h1>

    <DataTable>
      <thead>
        <tr>
          <th>Number</th>
          <th>Description</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr v-for="_version in versions" :key="_version.Number">
          <td><code>{{ _version.Number }}</code></td>
          <td>{{ _version.Description }}</td>
          <td>
            <router-link :to="`versions/${ _version.Number }`" tag="button" class="secondary">
              Manage
            </router-link>
          </td>
        </tr>
      </tbody> 
      <tfoot v-if="versions.length == 0">
        <tr>
          <td :colspan="numCols">
            No versions at this time.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <ButtonBar>
      <Spacer/>
        
      <router-link to="versions/new" tag="button"> 
        Add a new version 
      </router-link>
    </ButtonBar>

  </section>
</template>

<script>
import API from "@/shared/api";
import DataTable from "@/components/DataTable";
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";

export default {
  components: {
    DataTable,
    ButtonBar,
    Spacer
  },
  data() {
    return {
      versions: [],
      numCols: 3
    };
  },
  async mounted() {
    this.versions = await API.get("version");
  }
};
</script>
