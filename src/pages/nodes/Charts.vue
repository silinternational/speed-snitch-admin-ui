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

    <SpeedChart v-if="rawData.length" :data="rawData" />
    
    <hr v-if="rawData.length">
    <LatencyChart v-if="rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <PacketLossChart v-if="rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <RestartsChart v-if="rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <NetworkOutagesChart v-if="rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <NetworkDowntimeChart v-if="rawData.length" :data="rawData" />
  </section>
</template>

<script>
import API from "@/shared/api";
import SpeedChart from "@/components/SpeedChart";
import LatencyChart from "@/components/LatencyChart";
import PacketLossChart from "@/components/PacketLossChart";
import RestartsChart from "@/components/RestartsChart";
import NetworkOutagesChart from "@/components/NetworkOutagesChart";
import NetworkDowntimeChart from "@/components/NetworkDowntimeChart";
import moment from "moment";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    SpeedChart,
    LatencyChart,
    PacketLossChart,
    RestartsChart,
    NetworkOutagesChart,
    NetworkDowntimeChart,
    Datepicker
  },
  data() {
    return {
      node: {},
      startDate: moment()
        .subtract(7, "days")
        .toDate(),
      endDate: new Date(),
      tomorrow: {
        from: new Date()
      },
      rawData: []
    };
  },
  async mounted() {
    this.node = await API.get(`node/${this.$route.params.id}`);

    this.getChartData();
  },
  methods: {
    getChartData: async function() {
      const formattedStart = moment(this.startDate).format("YYYY-MM-DD");
      const formattedEnd = moment(this.endDate).format("YYYY-MM-DD");

      this.rawData = await API.get(
        `report/node/${
          this.$route.params.id
        }?interval=daily&start=${formattedStart}&end=${formattedEnd}`
      );
    }
  }
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

