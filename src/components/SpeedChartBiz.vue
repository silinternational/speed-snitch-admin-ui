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
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Megabits per second"
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
      const labels = [],
        download = {
          maxes: [],
          avgs: [],
          mins: []
        },
        upload = {
          maxes: [],
          avgs: [],
          mins: []
        };

      vm.data.forEach(point => {
        labels.push(
          moment
            .unix(point.Timestamp)
            .utc() // see UTC note:  https://momentjs.com/docs/#/parsing/unix-timestamp
            .format("MMM DD")
        );

        download.maxes.push(point.BizDownloadMax.toFixed(1));
        download.avgs.push(point.BizDownloadAvg.toFixed(1));
        download.mins.push(point.BizDownloadMin.toFixed(1));

        upload.maxes.push(point.BizUploadMax.toFixed(1));
        upload.avgs.push(point.BizUploadAvg.toFixed(1));
        upload.mins.push(point.BizUploadMin.toFixed(1));
      });

      return {
        labels: labels,
        // http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
        datasets: [
          {
            label: `Max download (${max(download.maxes)} Mbps)`,
            borderColor: "rgba(255, 130, 0, 0.6)",
            data: download.maxes
          },
          {
            label: `Average download (${avg(download.avgs)} Mbps)`,
            borderColor: "rgba(255, 130, 0, 1)",
            data: download.avgs
          },
          {
            label: `Min download (${min(download.mins)} Mbps)`,
            borderColor: "rgba(255, 130, 0, 0.2)",
            data: download.mins
          },
          {
            label: `Max upload (${max(upload.maxes)} Mbps)`,
            borderColor: "rgba(3, 74, 97, 0.6)",
            data: upload.maxes
          },
          {
            label: `Average upload (${avg(upload.avgs)} Mbps)`,
            borderColor: "rgba(3, 74, 97, 1)",
            data: upload.avgs
          },
          {
            label: `Min upload (${min(upload.mins)} Mbps)`,
            borderColor: "rgba(3, 74, 97, 0.2)",
            data: upload.mins
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


