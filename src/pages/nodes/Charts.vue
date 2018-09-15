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

    <v-layout column align-center>
      <v-select 
        :items="[{text: 'All available data', value: false}, {text: 'Business hours only', value: true}]"
        v-model="viewBizData" />
      
      <span v-if="viewBizData" class="caption">
        ({{ node.BusinessStartTime }} – {{ node.BusinessCloseTime }} GMT)
      </span>
    </v-layout>

    <v-layout v-if="rawData.length" class="elevation-3 my-5">
      <v-container>
        <v-layout align-center justify-space-between class="pb-3">
          <h2 class="headline secondary--text">Speed<span v-if="viewBizData"> (business hours)</span></h2>

          <v-btn :href="`${api.baseURL}/report/node/${node.ID}/raw?type=speedTest&start=${range.start}&end=${range.end}`" flat color="secondary">
            Download raw data <v-icon right>cloud_download</v-icon>
          </v-btn>
        </v-layout>

        <SpeedChart v-if="!viewBizData" :data="rawData" :range="range" :annotation="annotation" />
        <SpeedChartBiz v-else :data="rawData" :range="range" :annotation="annotation" />
      </v-container>
    </v-layout>
    
    <v-layout v-if="rawData.length" class="elevation-3 my-5">
      <v-container>
        <v-layout align-center justify-space-between class="pb-3">
          <h2 class="headline secondary--text">Latency<span v-if="viewBizData"> (business hours)</span></h2>

          <v-btn :href="`${api.baseURL}/report/node/${node.ID}/raw?type=ping&start=${range.start}&end=${range.end}`" flat color="secondary">
            Download raw data <v-icon right>cloud_download</v-icon>
          </v-btn>
        </v-layout>

        <LatencyChart v-if="!viewBizData" :data="rawData" :range="range" :annotation="annotation" />
        <LatencyChartBiz v-else :data="rawData" :range="range" :annotation="annotation" />

        <v-layout class="py-3">
          <h2 class="headline secondary--text">Packet loss<span v-if="viewBizData"> (business hours)</span></h2>
        </v-layout>
        <PacketLossChart v-if="!viewBizData" :data="rawData" :range="range" :annotation="annotation" />
        <PacketLossChartBiz v-else :data="rawData" :range="range" :annotation="annotation" />
      </v-container>
    </v-layout>

    <v-layout v-if="rawData.length" class="elevation-3 my-5">
      <v-container>
        <v-layout align-center justify-space-between class="pb-3">
          <h2 class="headline secondary--text">Restarts<span v-if="viewBizData"> (business hours)</span></h2>

          <v-btn :href="`${api.baseURL}/report/node/${node.ID}/raw?type=restarted&start=${range.start}&end=${range.end}`" flat color="secondary">
            Download raw data <v-icon right>cloud_download</v-icon>
          </v-btn>
        </v-layout>

        <RestartsChart v-if="!viewBizData" :data="rawData" :range="range" :annotation="annotation" />
        <RestartsChartBiz v-else :data="rawData" :range="range" :annotation="annotation" />
      </v-container>
    </v-layout>

    <v-layout v-if="rawData.length" class="elevation-3 my-5">
      <v-container>
        <v-layout align-center justify-space-between class="pb-3">
          <h2 class="headline secondary--text">Network outages<span v-if="viewBizData"> (business hours)</span></h2>

          <v-btn :href="`${api.baseURL}/report/node/${node.ID}/raw?type=downtime&start=${range.start}&end=${range.end}`" flat color="secondary">
            Download raw data <v-icon right>cloud_download</v-icon>
          </v-btn>
        </v-layout>

        <NetworkOutagesChart v-if="!viewBizData" :data="rawData" :range="range" :annotation="annotation" />
        <NetworkOutagesChartBiz v-else :data="rawData" :range="range" :annotation="annotation" />

        <v-layout class="py-3">
          <h2 class="headline secondary--text">Network downtime<span v-if="viewBizData"> (business hours)</span></h2>
        </v-layout>

        <NetworkDowntimeChart v-if="!viewBizData" :data="rawData" :range="range" :annotation="annotation" />
        <NetworkDowntimeChartBiz v-else :data="rawData" :range="range" :annotation="annotation" />
      </v-container>
    </v-layout>
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
      viewBizData: false,
      api: API.defaults,
      annotation: {
        annotations: []
      },
      events: []
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

      this.events = await API.get(
        `report/node/${this.$route.params.id}/event?start=${
          this.range.start
        }&end=${this.range.end}`
      );

      this.events.forEach(event => {
        this.annotation.annotations.push({
          type: "line",
          mode: "vertical",
          borderColor: "red",
          borderWidth: 0.5,
          scaleID: "x-axis-0",
          value: moment(event.Date).format("MMM DD"),
          label: {
            enabled: true,
            position: "top",
            content: event.Name
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.layout > .v-select {
  max-width: 21ch; /* "Business hours only" length plus space */
}
</style>

