<template>
  <LineChart :chart-data="chartInfo" :options="options"/>
</template>

<script>
import LineChart from "@/components/LineChart";
import moment from "moment";

export default {
  components: {
    LineChart
  },
  props: ["data", "annotation"],
  data() {
    return {
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Count"
              },
              ticks: {
                stepSize: 1
              }
            }
          ]
        },
        annotation: this.annotation
      }
    };
  },
  computed: {
    chartInfo: vm => {
      const days = [],
        counts = [];

      vm.data.forEach(point => {
        days.push(
          moment
            .unix(point.Timestamp)
            .utc() // see UTC note:  https://momentjs.com/docs/#/parsing/unix-timestamp
            .format("MMM DD")
        );

        counts.push(point.NetworkOutagesCount);
      });

      return {
        labels: days,
        // http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
        datasets: [
          {
            label: `Outages`,
            borderColor: "rgba(255, 130, 0, 0.6)",
            data: counts
          }
        ]
      };
    }
  }
};
</script>


