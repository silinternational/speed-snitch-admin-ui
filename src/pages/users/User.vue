<template>
  <section>
    <h1>User</h1>

    <DefinitionList>
      <dt>Name</dt>
      <dd>{{ user.Name }}</dd>
      
      <dt>Email</dt>
      <dd>
        {{ user.Email }}
      </dd>
      
      <dt>Tags</dt>
      <dd>
        <DataTable>
          <tr>
            <td>
              <span 
                v-for="(_tag, _i) in user.Tags" 
                :key="_tag.UID">{{ _i > 0 ? ', ': ''}}{{ _tag.Name }}</span>
            </td>
            <td>
              <router-link :to="`${user.UID}/tags`" tag="button">manage</router-link>
            </td>
          </tr>
        </DataTable>
      </dd>

      <dt>Role</dt>
      <dd><code>{{ user.Role }}</code></dd>
    </DefinitionList>

    <ButtonBar>
      <router-link 
        to="/users" 
        tag="button">Back</router-link>
      
      <Spacer/>
      
      <button 
        @click="remove" 
        class="caution">Remove</button>
    </ButtonBar>

  </section>
</template>

<script>
import API from "@/shared/api";
import ButtonBar from "@/components/ButtonBar";
import Spacer from "@/components/Spacer";
import DefinitionList from "@/components/DefinitionList";
import DataTable from "@/components/DataTable";

export default {
  components: {
    ButtonBar,
    Spacer,
    DefinitionList,
    DataTable
  },
  data() {
    return {
      user: {}
    };
  },
  async mounted() {
    let response = await API.get(`user/${this.$route.params.id}`);

    this.user = response.data;
  },
  methods: {
    remove: async function() {
      try {
        await API.delete(`user/${this.user.UID}`);

        this.$router.push(`/users?removed=${this.user.UID}/`);
      } catch (error) {
        console.log(`error caught while DELETE user: ${error}`);
      }
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 15em;
}
</style>
