<script>
import { Line, mixins } from "vue-chartjs";
import Chart from "chart.js";

import Vue from "vue";

// needed to import this plugin to make it work.
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
Vue.use(chartjsPluginAnnotation); // did this to avoid the lint errors

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ["options"],
  mounted() {
    // this.chartData is created in the mixin.
    this.renderChart(this.chartData, this.options);
  }
};

// https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-configuration
Chart.defaults.global.tooltips.intersect = false;

// https://www.chartjs.org/docs/latest/configuration/legend.html#configuration-options
Chart.defaults.global.legend.position = "bottom";
Chart.defaults.global.legend.labels.boxWidth = 0.1;

// https://www.chartjs.org/docs/latest/charts/line.html
Chart.defaults.global.elements.line.fill = false;
Chart.defaults.global.elements.line.tension = 0;

// https://www.chartjs.org/docs/latest/configuration/elements.html#point-configuration
Chart.defaults.global.elements.point.radius = 0;

// couldn't find docs for this...
Chart.defaults.scale.ticks.autoSkip = false;
Chart.defaults.scale.ticks.beginAtZero = true;

Chart.defaults.global.maintainAspectRatio = false;
</script>
