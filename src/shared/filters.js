import moment from "moment";

export const timeago = date => moment(date).fromNow();
export const duration = ms => moment.duration(ms).humanize();
export const format = (date, format = "dddd, MMMM Do YYYY, h:mm:ss a") =>
  moment(date).format(format);
