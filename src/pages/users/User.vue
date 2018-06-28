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
      <dd v-if="! hasTags">
        <router-link 
          to="tags" 
          tag="button">Add</router-link>
      </dd>
      <dd v-else>
        {{ user.TagUIDs }}
        <router-link 
          to="tags" 
          tag="button">Edit/Remove?</router-link>
      </dd>

      <dt>Role</dt>
      <dd><code>{{ user.Role }}</code></dd>
    </DefinitionList>

    <ButtonBar>
      <GoBackButton/>
      
      <Spacer/>
      
      <button 
        @click="remove" 
        class="caution">Remove</button>
    </ButtonBar>

  </section>
</template>

<script>
import { ADMIN_API } from "@/plugins/admin-api-service.js";
import ButtonBar from "@/components/ButtonBar";
import GoBackButton from "@/components/GoBackButton";
import Spacer from "@/components/Spacer";
import DefinitionList from "@/components/DefinitionList";

export default {
  components: {
    ButtonBar,
    GoBackButton,
    Spacer,
    DefinitionList
  },
  data() {
    return {
      user: {}
    };
  },
  async mounted() {
    let response = await ADMIN_API.get(`user/${this.$route.params.id}`);

    this.user = response.data;
  },
  methods: {
    remove: async function() {
      try {
        let response = await ADMIN_API.delete(`user/${this.user.UID}`);

        this.$router.push(`/users?removed=${this.user.UID}/`);
      } catch (error) {
        console.log(`error caught while DELETE user: ${error}`);
      }
    }
  },
  computed: {
    hasTags() {
      return this.user.TagUIDs;
    }
  }
};
</script>

<style scoped>
textarea {
  display: block;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 15em;
}
</style>
