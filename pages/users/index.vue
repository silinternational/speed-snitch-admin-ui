<template>
  <section>
    <h1>Users</h1>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="_user in users"
          :key="_user.id"
        >
          <td>{{ _user.name }}</td>
          <td>{{ _user.email }}</td>
          <td>{{ _user.phone }}</td>
          <td>{{ _user.role }}</td>
          <td>
            <button>Manage</button>
          </td>
        </tr>
      </tbody> 
    </table>

    <ButtonBar>
      <Spacer/>
      
      <button>
        Add
      </button>
    </ButtonBar>
  </section>
</template>

<script>
import ButtonBar from "~/components/ButtonBar";
import Spacer from "~/components/Spacer";

export default {
  components: {
    ButtonBar,
    Spacer
  },
  data() {},
  computed: {
    users() {
      return this.$store.state.users.list;
    }
  }
};
</script>

<style scoped>
/* table {
  border-spacing: initial;
}
tbody tr:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.03);
}
td {
  padding: 0.5em;
}
td > button {
  background-color: var(--secondary-color);
  color: white;
  border-radius: 1em;
} */
</style>
