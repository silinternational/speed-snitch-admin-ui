<template>
  <section>
    <h1>Tag</h1>

    <dl>
      <dt>Name</dt>
      <dd>{{ tag.Name }}</dd>
      <dt>Description</dt>
      <dd 
        v-if="! this.isDescriptionEditable">
        {{ tag.Description }} <button @click="editDescription">Edit</button>
      </dd>
      <dd v-if="this.isDescriptionEditable">
        <textarea v-model="newDescription"/>
        <button @click="cancelEditDescription">Cancel</button>
        <button @click="saveDescription">Save</button>
      </dd>
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
      tag: {},
      newDescription: "",
      isDescriptionEditable: false
    };
  },
  async asyncData({ params }) {
    let response = await ADMIN_API.get(`tag/${params.id}`);

    return {
      tag: response.data
    };
  },
  methods: {
    editDescription: function() {
      this.isDescriptionEditable = true;
      this.newDescription = this.tag.Description;
    },
    cancelEditDescription: function() {
      this.isDescriptionEditable = false;
    },
    saveDescription: async function() {
      try {
        // TODO: create a new Object for the PUT and don't update this.tag until the response is good.
        this.tag.Description = this.newDescription;

        let response = await ADMIN_API.put(`tag/${this.tag.UID}`, this.tag);

        // need to retain intial reference to node since that's what vue is watching.
        Object.assign(this.tag, response.data);
        this.isDescriptionEditable = false;
      } catch (error) {
        console.log(`error caught while PUT tag: ${error}`);
      }
    },
    remove: async function() {
      try {
        let response = await ADMIN_API.delete(`tag/${this.tag.UID}`);

        this.$router.push(`/tags?removed=${this.tag.Name}/`);
      } catch (error) {
        console.log(`error caught while DELETE tag: ${error}`);
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
