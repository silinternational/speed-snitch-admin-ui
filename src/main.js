import Vue from "vue";
import App from "@/pages/App";
import configuredRouter from "@/pages/RouterConfig";

new Vue({
  render: h => h(App),
  router: configuredRouter
}).$mount("#app");
