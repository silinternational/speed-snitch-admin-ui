import Vue from "vue";
import App from "@/pages/App";
import configuredRouter from "@/pages/RouterConfig";
import API from "@/shared/api";

API.get("user/me")
  .then(response => mount(response.data))
  .catch(error => mount());

function mount(user = {}) {
  Vue.prototype.$user = user;

  new Vue({
    render: h => h(App),
    router: configuredRouter
  }).$mount("#app"); //TODO: consider making this id available via App since they have to be the same.
}
