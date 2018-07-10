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
        <tr
          v-for="_server in servers"
          :key="_server.UID">
          <td>{{ _server.Name }}</td>
          <td>{{ _server.Country.Name || "N/A" }}</td>
          <td>{{ _server.ServerType }}</td>
          <td>
            <router-link 
              :to="`servers/${ _server.UID }`" 
              tag="button" 
              class="secondary">Manage</router-link>
          </td>
        </tr>
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
      servers: [],
      numCols: 4
    };
  },
  async mounted() {
    this.servers = await API.get("namedserver");
  }
};
</script>
