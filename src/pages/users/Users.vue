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
        <tr v-for="_user in users" :key="_user.UID">
          <td>{{ _user.Name }}</td>
          <td>{{ _user.Email }}</td>
          <td><code>{{ _user.Role }}</code></td>
          <td>
            <router-link :to="`users/${ _user.UID }`" tag="button" class="secondary">
              Manage
            </router-link>
          </td>
        </tr>
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
        
      <router-link to="users/new" tag="button"> 
        Add a new user
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
      users: [],
      numCols: 4
    };
  },
  async mounted() {
    let response = await API.get("user");

    this.users = response.data;
  }
};
</script>
