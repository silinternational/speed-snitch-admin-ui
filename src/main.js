import Vue from "vue";
import App from "@/pages/App";
import configuredRouter from "@/pages/RouterConfig";

//TODO: find a better way to load directives:
Vue.directive("autofocus", {
  inserted: function(el) {
    el.focus();
  }
});

//TODO: find a better way to load filters:
import moment from "moment";
// http://momentjs.com/docs/#/displaying
Vue.filter("timeago", date => moment(date).fromNow());
// https://momentjs.com/docs/#/durations
Vue.filter("duration", ms => moment.duration(ms).humanize());
// https://momentjs.com/docs/#/displaying/format
Vue.filter("format", date =>
  moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")
);

new Vue({
  render: h => h(App),
  router: configuredRouter
}).$mount("#app");
