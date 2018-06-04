<template>
  <section>
    <h1>Servers</h1>

    <DataTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Region</th>
          <th>Type</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <ClickableRow
          v-for="_server in servers"
          :key="_server.UID"
          :to="`servers/${ _server.UID }`"
        >
          <td>{{ _server.Name }}</td>
          <td>{{ _server.Country.Name || "N/A" }}</td>
          <td>{{ _server.ServerType }}</td>
          <td>
            <router-link 
              :to="`servers/${ _server.UID }`" 
              tag="button" 
              class="secondary">Manage</router-link>
          </td>
        </ClickableRow>
      </tbody> 
      <tfoot v-if="servers.length == 0">
        <tr>
          <td :colspan="numCols">
            No servers at this time.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <ButtonBar>
      <GoBackButton/>
      
      <Spacer/>
        
      <router-link 
        to="servers/new" 
        tag="button">
        Add a new server
      </router-link>
    </ButtonBar>
  </section>
</template>

<script>
import { ADMIN_API } from "~/plugins/admin-api-service.js";
import DataTable from "~/components/DataTable";
import ClickableRow from "~/components/ClickableRow";
import ButtonBar from "~/components/ButtonBar";
import GoBackButton from "~/components/GoBackButton";
import Spacer from "~/components/Spacer";

export default {
  components: {
    DataTable,
    ClickableRow,
    ButtonBar,
    GoBackButton,
    Spacer
  },
  data() {
    return {
      servers: [],
      numCols: 4
    };
  },
  async asyncData() {
    let response = await ADMIN_API.get("namedserver");

    return {
      servers: response.data
    };
  }
};
</script>
