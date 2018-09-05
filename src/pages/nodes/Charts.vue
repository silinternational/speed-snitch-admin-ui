<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-4">
      Charts {{ node.Nickname ? `for ${node.Nickname}` : '' }}
    </h1>

    <v-layout row align-center justify-center>
      <v-menu>
        <v-text-field
          slot="activator"
          v-model="range.start"
          label="Start date"
          prepend-icon="event"
          readonly />
        <v-date-picker v-model="range.start" :max="today"></v-date-picker>
      </v-menu>

      <v-menu>
        <v-text-field
          slot="activator"
          v-model="range.end"
          label="End date"
          prepend-icon="event"
          readonly />
        <v-date-picker v-model="range.end" :max="today"></v-date-picker>
      </v-menu>

      <v-btn @click="getChartData" color="secondary">See chart</v-btn>
    </v-layout>

    <v-layout row align-center justify-center>
      <v-select 
        :items="[{text: 'All available data', value: false}, {text: 'Business hours only', value: true}]"
        v-model="viewBizData" />
    </v-layout>

    <hr>

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
  </v-container>
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
    NetworkDowntimeChartBiz
  },
  data() {
    return {
      node: {},
      range: {
        start: moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD"),
        end: moment().format("YYYY-MM-DD")
      },
      today: moment().format("YYYY-MM-DD"),
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
      this.rawData = await API.get(
        `report/node/${this.$route.params.id}?interval=daily&start=${
          this.range.start
        }&end=${this.range.end}`
      );
    }
  }
};
</script>

<style scoped>
.layout > .v-select {
  max-width: 21ch; /* "Business hours only" length plus space */
}

hr {
  margin: 2em 0;
}
</style>

