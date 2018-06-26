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

    <!-- <figure> -->
      <LineChart v-if="data.datasets" :chart-data="data" :options="chartOptions"/>
    <!-- </figure> -->
  </section>
</template>

<script>
import { ADMIN_API } from "@/plugins/admin-api-service.js";
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
      chartOptions: chartOptions,
      data: {},
      startDate: null,
      endDate: null,
      tomorrow: {
        from: new Date()
      }
    };
  },
  async mounted() {
    let response = await ADMIN_API.get(`node/${this.$route.params.macaddr}`);

    this.node = response.data;
  },
  methods: {
    getChartData: async function() {
      try {
        const formattedStart = moment(this.startDate).format("YYYY-MM-DD");
        const formattedEnd = moment(this.endDate).format("YYYY-MM-DD");

        let speedDataResponse = await ADMIN_API.get(
          `report/node/${
            this.$route.params.macaddr
          }?interval=daily&start=${formattedStart}&end=${formattedEnd}`
        );

        this.data = convertToChartConfig(speedDataResponse.data);
      } catch (error) {
        console.log(`error caught while GETting speed data: ${error}`);
      }
    }
  }
};

const chartOptions = {
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
};

function convertToChartConfig(rawData) {
  let labels = [];
  let download = {
    maxes: [],
    avgs: [],
    mins: []
  };
  let upload = {
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

    download.maxes.push(point.DownloadMax);
    download.avgs.push(point.DownloadAvg);
    download.mins.push(point.DownloadMin);

    upload.maxes.push(point.UploadMax);
    upload.avgs.push(point.UploadAvg);
    upload.mins.push(point.UploadMin);
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
        label: `Min upload (${max(upload.mins)} Mbps)`,
        borderColor: "rgba(3, 74, 97, 0.2)",
        data: upload.mins
      }
    ]
  };
}

const max = numbers => Math.max(...numbers).toFixed();
const min = numbers => Math.min(...numbers).toFixed();
const avg = numbers =>
  (numbers.reduce((sum, number) => sum + number, 0) / numbers.length).toFixed();
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

form > div {
  padding: 0 0.5em;
}

form > button {
  background-color: var(--primary-color);
  color: var(--white);
}
</style>

