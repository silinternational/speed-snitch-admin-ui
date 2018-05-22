import Vue from "vue";
import moment from "moment";

// http://momentjs.com/docs/#/displaying
Vue.filter("timeago", date => moment(date).fromNow());

// https://momentjs.com/docs/#/durations
Vue.filter("duration", ms => moment.duration(ms).humanize());

// https://momentjs.com/docs/#/displaying/format
Vue.filter("format", date =>
  moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")
);
