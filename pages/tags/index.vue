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
        <ClickableRow
          v-for="_tag in tags"
          :key="_tag.UID"
          :to="`tags/${ _tag.UID }/`"
        >
          <td>{{ _tag.Name }}</td>
          <td><Truncate>{{ _tag.Description }}</Truncate></td>
          <td>
            <router-link 
              :to="`tags/${ _tag.UID }/`" 
              tag="button" 
              class="secondary">Manage</router-link>
          </td>
        </ClickableRow>
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
        to="tags/new/" 
        tag="button">
        Add a new tag
      </router-link>
    </ButtonBar>

  </section>
</template>

<script>
import { ADMIN_API } from "~/plugins/admin-api-service.js";
import DataTable from "~/components/DataTable";
import ClickableRow from "~/components/ClickableRow";
import Info from "~/components/Info";
import ButtonBar from "~/components/ButtonBar";
import Spacer from "~/components/Spacer";
import Truncate from "~/components/Truncate";

export default {
  components: {
    DataTable,
    ClickableRow,
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
  async asyncData() {
    let response = await ADMIN_API.get("tag");

    return {
      tags: response.data
    };
  },
  methods: {
    manage: function(id) {
      this.$router.push(`tags/${id}/`);
    }
  }
};
</script>
