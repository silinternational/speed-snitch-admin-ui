<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height class="pb-3">
      <h1 class="display-1 secondary--text">Users</h1>

      <v-btn to="users/new" color="secondary" icon title="Add a new user">
        <v-icon>person_add</v-icon>
      </v-btn>
    </v-layout>
    
    <v-data-table :headers="headers" :items="users" :loading="loading" hide-actions item-key="ID" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Name }}</td>
        <td>{{ props.item.Email }}</td>
        <td>{{ props.item.Role | prettyRole }}</td>
        <td class="justify-center layout px-0">
          <v-btn @click="props.expanded = !props.expanded" flat icon title="Details" color="primary">
            <v-icon v-if="! props.expanded">expand_more</v-icon>
            <v-icon v-else>expand_less</v-icon>
          </v-btn>
          <v-btn :href="`#/users/${ props.item.ID }/edit`" flat icon title="Update this user" color="secondary">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn @click="remove(props.item.ID)" flat icon title="Delete this user" color="error">
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="expand" slot-scope="props">
        <p class="body-2 pt-3">
          <span class="pl-5">Tags:</span>
          <span v-if="props.item.Tags">
            <v-chip v-if="props.item.Tags" v-for="_tag in props.item.Tags" :key="_tag.ID">
              {{ _tag.Name }}
            </v-chip>
          </span>
          <span v-else class="body-1 pl-1">None at this time</span>
        </p>
      </template>
      <template slot="no-data">
        No users at this time.
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import API from "@/shared/api";
import roles from "@/shared/roles";

export default {
  filters: {
    prettyRole: uglyRole => roles.find(role => uglyRole == role.value).text
  },
  data() {
    return {
      users: [],
      headers: [
        {
          text: "Name",
          value: "Name"
        },
        {
          text: "Email",
          value: "Email"
        },
        {
          text: "Role",
          value: "Role"
        },
        {
          sortable: false
        }
      ],
      loading: true
    };
  },
  async mounted() {
    this.users = await API.get("user");
    this.loading = false;
  },
  methods: {
    remove: async function(id) {
      confirm("Are you sure?") && (await API.delete(`user/${id}`));

      this.$router.go();
    }
  }
};
</script>
