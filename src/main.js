import Vue from "vue";
import App from "@/pages/App";
import configuredRouter from "@/pages/RouterConfig";
import API from "@/shared/api";

API.get("user/me")
  .then(response => startApp(response))
  .catch(error => startApp());

function startApp(user = {}) {
  Object.defineProperty(Vue.prototype, "$user", { value: user }); // similar to Vue.prototype.$user = user but creates it "read-only"

  new Vue({
    render: h => h(App),
    router: configuredRouter
  }).$mount(`#${App.data().id}`);
}
