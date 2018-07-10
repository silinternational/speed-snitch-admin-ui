<template>
  <section>
    <h1>Tag</h1>

    <DefinitionList>
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
    </DefinitionList>

    <ButtonBar>
      <router-link 
        to="/tags" 
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

export default {
  components: {
    ButtonBar,
    Spacer,
    DefinitionList
  },
  data() {
    return {
      tag: {},
      newDescription: "",
      isDescriptionEditable: false
    };
  },
  async mounted() {
    this.tag = await API.get(`tag/${this.$route.params.id}`);
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

        let tag = await API.put(`tag/${this.tag.UID}`, this.tag);

        // need to retain intial reference to node since that's what vue is watching.
        Object.assign(this.tag, tag);
        this.isDescriptionEditable = false;
      } catch (error) {
        console.log(`error caught while PUT tag: ${error}`);
      }
    },
    remove: async function() {
      try {
        await API.delete(`tag/${this.tag.UID}`);

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

section {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 15em;
}
</style>
