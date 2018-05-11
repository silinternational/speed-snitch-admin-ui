<template>
  <section id="body-replacement">
    <GlobalHeader/>
    
    <main>
      <!-- TODO: review https://nuxtjs.org/examples/auth-routes for authn/authz -->
      <nuxt/>
    </main>
  </section>
</template>

<script>
import GlobalHeader from "~/components/GlobalHeader.vue";

export default {
  components: {
    GlobalHeader
  }
};
</script>

<style scoped>
section#body-replacement {
  --primary-color: rgb(121, 31, 94);
  --primary-color-light: rgb(121, 31, 94, 0.05);
  --secondary-color: rgb(14, 105, 164);
  height: 100vh;
  width: 100vw;
}

main {
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5em;
}
</style>

<!-- TODO: review https://nuxtjs.org/examples/global-css -->
<style>
body {
  font-family: sans-serif;
}

p {
  max-width: 70ch; /* "ideal" paragraph width for reading ease TODO: although I don't think this applies since there won't be much reading... */
}

/* TODO: remove these if a style library is brought in for form validation 
    https://vuejs.org/v2/cookbook/form-validation.html
*/
input:invalid {
  border: dashed red 1px;
}
input:focus:invalid {
  border: initial;
}
</style>
