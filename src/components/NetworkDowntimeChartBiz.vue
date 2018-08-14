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
  props: ["data"],
  data() {
    return {
      options: {
        title: {
          display: true,
          text: "Network downtime (business hours)"
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Seconds"
              }
            }
          ]
        }
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

        counts.push(point.BizNetworkDowntimeSeconds);
      });

      return {
        labels: days,
        // http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
        datasets: [
          {
            label: `Downtime`,
            borderColor: "rgba(255, 130, 0, 0.6)",
            data: counts
          }
        ]
      };
    }
  }
};
</script>


