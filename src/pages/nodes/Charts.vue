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

      <select v-model="viewBizData">
        <option :value="false">All available data</option>
        <option :value="true">Business hours only</option>
      </select>
    </header>

    <SpeedChart v-if="!viewBizData && rawData.length" :data="rawData" />
    <SpeedChartBiz v-if="viewBizData && rawData.length" :data="rawData" />
    
    <hr v-if="rawData.length">
    <LatencyChart v-if="!viewBizData && rawData.length" :data="rawData" />
    <LatencyChartBiz v-if="viewBizData && rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <PacketLossChart v-if="!viewBizData && rawData.length" :data="rawData" />
    <PacketLossChartBiz v-if="viewBizData && rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <RestartsChart v-if="!viewBizData && rawData.length" :data="rawData" />
    <RestartsChartBiz v-if="viewBizData && rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <NetworkOutagesChart v-if="!viewBizData && rawData.length" :data="rawData" />
    <NetworkOutagesChartBiz v-if="viewBizData && rawData.length" :data="rawData" />

    <hr v-if="rawData.length">
    <NetworkDowntimeChart v-if="!viewBizData && rawData.length" :data="rawData" />
    <NetworkDowntimeChartBiz v-if="viewBizData && rawData.length" :data="rawData" />
  </section>
</template>

<script>
import API from "@/shared/api";
import SpeedChart from "@/components/SpeedChart";
import SpeedChartBiz from "@/components/SpeedChartBiz";
import LatencyChart from "@/components/LatencyChart";
import LatencyChartBiz from "@/components/LatencyChartBiz";
import PacketLossChart from "@/components/PacketLossChart";
import PacketLossChartBiz from "@/components/PacketLossChartBiz";
import RestartsChart from "@/components/RestartsChart";
import RestartsChartBiz from "@/components/RestartsChartBiz";
import NetworkOutagesChart from "@/components/NetworkOutagesChart";
import NetworkOutagesChartBiz from "@/components/NetworkOutagesChartBiz";
import NetworkDowntimeChart from "@/components/NetworkDowntimeChart";
import NetworkDowntimeChartBiz from "@/components/NetworkDowntimeChartBiz";
import moment from "moment";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    SpeedChart,
    SpeedChartBiz,
    LatencyChart,
    LatencyChartBiz,
    PacketLossChart,
    PacketLossChartBiz,
    RestartsChart,
    RestartsChartBiz,
    NetworkOutagesChart,
    NetworkOutagesChartBiz,
    NetworkDowntimeChart,
    NetworkDowntimeChartBiz,
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
      rawData: [],
      viewBizData: false
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
  padding-bottom: 1em;
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

