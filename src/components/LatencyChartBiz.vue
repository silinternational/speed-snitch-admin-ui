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
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Milliseconds"
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    chartInfo: vm => {
      const labels = [],
        maxes = [],
        avgs = [],
        mins = [];

      vm.data.forEach(point => {
        labels.push(
          moment
            .unix(point.Timestamp)
            .utc() // see UTC note:  https://momentjs.com/docs/#/parsing/unix-timestamp
            .format("MMM DD")
        );

        maxes.push(point.BizLatencyMax.toFixed(1));
        avgs.push(point.BizLatencyAvg.toFixed(1));
        mins.push(point.BizLatencyMin.toFixed(1));
      });

      return {
        labels: labels,
        // http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
        datasets: [
          {
            label: `Max latency (${max(maxes)} ms)`,
            borderColor: "rgba(255, 130, 0, 0.6)",
            data: maxes
          },
          {
            label: `Average latency (${avg(avgs)} ms)`,
            borderColor: "rgba(255, 130, 0, 1)",
            data: avgs
          },
          {
            label: `Min latency (${min(mins)} ms)`,
            borderColor: "rgba(255, 130, 0, 0.2)",
            data: mins
          }
        ]
      };
    }
  }
};

const max = numbers => Math.max(...numbers).toFixed(1);
const min = numbers => Math.min(...numbers).toFixed(1);
const avg = numbers => {
  const sum = numbers.reduce(
    (sum, number) => sum + Number.parseFloat(number),
    0
  );

  const avg = sum / numbers.length;

  return avg.toFixed(1);
};
</script>


