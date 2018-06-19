<template>
  <section>
    <h1>Users</h1>

    <DataTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <ClickableRow
          v-for="_user in users"
          :key="_user.UID"
          :to="`users/${ _user.UID }/`"
        >
          <td>{{ _user.Name }}</td>
          <td>{{ _user.Email }}</td>
          <td><code>{{ _user.Role }}</code></td>
          <td>
            <router-link 
              :to="_user.UID" 
              tag="button" 
              class="secondary">Manage</router-link>
          </td>
        </ClickableRow>
      </tbody> 
      <tfoot v-if="users.length == 0">
        <tr>
          <td :colspan="numCols">
            No users at this time.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <ButtonBar>
      <Spacer/>
        
      <router-link 
        to="users/new" 
        tag="button">
        Add a new user
      </router-link>
    </ButtonBar>

  </section>
</template>

<script>
import { ADMIN_API } from "@/plugins/admin-api-service.js";
import DataTable from "@/components/DataTable";
import ClickableRow from "@/components/ClickableRow";
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";

export default {
  components: {
    DataTable,
    ClickableRow,
    ButtonBar,
    Spacer
  },
  data() {
    return {
      users: [],
      numCols: 4
    };
  },
  async mounted() {
    let response = await ADMIN_API.get("user");

    this.users = response.data;
  },
  methods: {
    manage: function(id) {
      this.$router.push(`users/${id}`);
    }
  }
};
</script>
