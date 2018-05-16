<template>
  <section>
    <h1>User</h1>

    <dl>
      <dt>Name</dt>
      <dd>{{ user.Name }}</dd>
      <dt>Email</dt>
      <dd>
        {{ user.Email }}
      </dd>
      <dt>Role</dt>
      <dd><code>{{ user.Role }}</code></dd>
    </dl>

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
import { ADMIN_API } from "~/plugins/admin-api-service.js";
import ButtonBar from "~/components/ButtonBar";
import GoBackButton from "~/components/GoBackButton";
import Spacer from "~/components/Spacer";

export default {
  components: {
    ButtonBar,
    GoBackButton,
    Spacer
  },
  data() {
    return {
      user: {}
    };
  },
  async asyncData({ params }) {
    let response = await ADMIN_API.get(`user/${params.id}`);

    return {
      user: response.data
    };
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
  }
};
</script>

<style scoped>
textarea {
  display: block;
}
/* TODO: refactor these styles to be shared with the node/{id} page as well */
dt {
  font-weight: bold;
  padding-bottom: 0.5em;
}
dd {
  padding-bottom: 1em;
}
table {
  border-spacing: 0.5em;
}
tr > td:last-child {
  text-align: center;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 15em;
}
</style>
