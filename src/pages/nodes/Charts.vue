<template>
  <section>
    <header>
      <h1>Charts {{ node.Nickname ? `for ${node.Nickname}` : '' }}</h1>

      <form>
        From
        <Datepicker placeholder="Start date" v-model="startDate" :disabledDates="tomorrow" format="MMM d yyyy" />
        to
        <Datepicker placeholder="End date" v-model="endDate" :disabledDates="tomorrow" format="MMM d yyyy" />
        
        <button @click.prevent="getChartData()">See chart</button>
      </form>
    </header>

    <LineChart v-if="speed.data.datasets" :chart-data="speed.data" :options="speed.options"/>
    
    <hr v-if="latency.data.datasets">

    <LineChart v-if="latency.data.datasets" :chart-data="latency.data" :options="latency.options"/>

    <hr v-if="packetLoss.data.datasets">

    <LineChart v-if="packetLoss.data.datasets" :chart-data="packetLoss.data" :options="packetLoss.options"/>
  </section>
</template>

<script>
import API from "@/shared/api";
import LineChart from "@/components/LineChart";
import moment from "moment";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    LineChart,
    Datepicker
  },
  data() {
    return {
      node: {},
      startDate: null,
      endDate: null,
      tomorrow: {
        from: new Date()
      },
      speed: {
        options: {},
        data: {}
      },
      latency: {
        options: {},
        data: {}
      },
      packetLoss: {
        options: {},
        data: {}
      }
    };
  },
  async mounted() {
    this.node = await API.get(`node/${this.$route.params.id}`);
  },
  methods: {
    getChartData: async function() {
      const formattedStart = moment(this.startDate).format("YYYY-MM-DD");
      const formattedEnd = moment(this.endDate).format("YYYY-MM-DD");

      const rawData = await API.get(
        `report/node/${
          this.$route.params.id
        }?interval=daily&start=${formattedStart}&end=${formattedEnd}`
      );

      const chartData = convertToChartData(rawData);

      this.speed = createSpeedChartConfig(
        chartData.labels,
        chartData.speed.downloads,
        chartData.speed.uploads
      );

      this.latency = createLatencyChartConfig(
        chartData.labels,
        chartData.latencies
      );

      this.packetLoss = createPacketLossChartConfig(
        chartData.labels,
        chartData.packetLoss
      );
    }
  }
};

function convertToChartData(rawData) {
  let labels = [],
    downloads = {
      maxes: [],
      avgs: [],
      mins: []
    },
    uploads = {
      maxes: [],
      avgs: [],
      mins: []
    },
    latencies = {
      maxes: [],
      avgs: [],
      mins: []
    },
    packetLoss = {
      maxes: [],
      avgs: [],
      mins: []
    };

  rawData.forEach(point => {
    labels.push(
      moment
        .unix(point.Timestamp)
        .utc() // see UTC note:  https://momentjs.com/docs/#/parsing/unix-timestamp
        .format("MMM DD")
    );

    downloads.maxes.push(point.DownloadMax.toFixed(1));
    downloads.avgs.push(point.DownloadAvg.toFixed(1));
    downloads.mins.push(point.DownloadMin.toFixed(1));

    uploads.maxes.push(point.UploadMax.toFixed(1));
    uploads.avgs.push(point.UploadAvg.toFixed(1));
    uploads.mins.push(point.UploadMin.toFixed(1));

    latencies.maxes.push(point.LatencyMax.toFixed(1));
    latencies.avgs.push(point.LatencyAvg.toFixed(1));
    latencies.mins.push(point.LatencyMin.toFixed(1));

    packetLoss.maxes.push(point.PacketLossMax.toFixed(1));
    packetLoss.avgs.push(point.PacketLossAvg.toFixed(1));
    packetLoss.mins.push(point.PacketLossMin.toFixed(1));
  });

  return {
    labels: labels,
    speed: {
      downloads: downloads,
      uploads: uploads
    },
    latencies: latencies,
    packetLoss: packetLoss
  };
}

function createSpeedChartConfig(labels, downloads, uploads) {
  return {
    options: {
      title: {
        display: true,
        text: "Speed"
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Megabits per second"
            }
          }
        ]
      }
    },
    data: {
      labels: labels,
      // http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
      datasets: [
        {
          label: `Max download (${max(downloads.maxes)} Mbps)`,
          borderColor: "rgba(255, 130, 0, 0.6)",
          data: downloads.maxes
        },
        {
          label: `Average download (${avg(downloads.avgs)} Mbps)`,
          borderColor: "rgba(255, 130, 0, 1)",
          data: downloads.avgs
        },
        {
          label: `Min download (${min(downloads.mins)} Mbps)`,
          borderColor: "rgba(255, 130, 0, 0.2)",
          data: downloads.mins
        },
        {
          label: `Max upload (${max(uploads.maxes)} Mbps)`,
          borderColor: "rgba(3, 74, 97, 0.6)",
          data: uploads.maxes
        },
        {
          label: `Average upload (${avg(uploads.avgs)} Mbps)`,
          borderColor: "rgba(3, 74, 97, 1)",
          data: uploads.avgs
        },
        {
          label: `Min upload (${max(uploads.mins)} Mbps)`,
          borderColor: "rgba(3, 74, 97, 0.2)",
          data: uploads.mins
        }
      ]
    }
  };
}

function createLatencyChartConfig(labels, latencies) {
  return {
    options: {
      title: {
        display: true,
        text: "Latency"
      },
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
    },
    data: {
      labels: labels,
      // http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
      datasets: [
        {
          label: `Max latency (${max(latencies.maxes)} ms)`,
          borderColor: "rgba(255, 130, 0, 0.6)",
          data: latencies.maxes
        },
        {
          label: `Average latency (${avg(latencies.avgs)} ms)`,
          borderColor: "rgba(255, 130, 0, 1)",
          data: latencies.avgs
        },
        {
          label: `Min latency (${min(latencies.mins)} ms)`,
          borderColor: "rgba(255, 130, 0, 0.2)",
          data: latencies.mins
        }
      ]
    }
  };
}

function createPacketLossChartConfig(labels, packetLossData) {
  return {
    options: {
      title: {
        display: true,
        text: "Packet loss"
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Percentage of packets lost (%)"
            }
          }
        ]
      }
    },
    data: {
      labels: labels,
      // http://www.chartjs.org/docs/latest/charts/line.html#dataset-properties
      datasets: [
        {
          label: `Max loss (${max(packetLossData.maxes)} %)`,
          borderColor: "rgba(255, 130, 0, 0.6)",
          data: packetLossData.maxes
        },
        {
          label: `Average loss (${avg(packetLossData.avgs)} %)`,
          borderColor: "rgba(255, 130, 0, 1)",
          data: packetLossData.avgs
        },
        {
          label: `Min loss (${min(packetLossData.mins)} %)`,
          borderColor: "rgba(255, 130, 0, 0.2)",
          data: packetLossData.mins
        }
      ]
    }
  };
}

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

<style scoped>
section {
  width: 90%; /* so the chart is wider */
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1em;
}

form {
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* this is the selector for Datepicker */
form > div {
  padding: 0 0.5em;
}

form > button {
  background-color: var(--primary-color);
  color: var(--white);
}

hr {
  margin: 2em 0;
}
</style>

