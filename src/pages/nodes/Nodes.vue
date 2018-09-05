<template>
  <v-container>
    <h1 class="display-1 secondary--text pb-3">Nodes</h1>
    
    <h2 class="subheading">Scheduled</h2>
    <v-data-table :headers="headers" :items="scheduledNodes" :loading="loading" hide-actions class="elevation-1 mb-4">
      <template slot="items" slot-scope="props">
        <tr @click="view(props.item.ID)" style="cursor: pointer">
          <td>
            <Info :info="props.item.Location">{{ locale(props.item.Location) }}</Info>
          </td>
          <td>{{ props.item.Nickname || '–'}}</td>
          <td>
            <v-btn :href="`#/nodes/${ props.item.ID }/charts`" icon>📈</v-btn>
          </td>
          <td>{{ props.item.LastSeen | timeago }}</td>
          <td>{{ props.item.Uptime | duration }}</td>
          <td>{{ props.item.RunningVersion.Number || '–' }}</td>
          <td>{{ props.item.OS }}/{{ props.item.Arch }}</td>
        </tr>
      </template>
      <template slot="no-data">
        No scheduled nodes at this time.
      </template>
    </v-data-table>

    <h2 class="subheading">Unscheduled</h2>
    <v-data-table :headers="headers" :items="unscheduledNodes" :loading="loading" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr @click="view(props.item.ID)" style="cursor: pointer">
          <td>
            <Info :info="props.item.Location">{{ locale(props.item.Location) }}</Info>
          </td>
          <td>{{ props.item.Nickname || '–' }}</td>
          <td>
            <v-btn :href="`#/nodes/${ props.item.ID }/charts`" icon>📈</v-btn>
          </td>
          <td>{{ props.item.LastSeen | timeago }}</td>
          <td>{{ props.item.Uptime | duration }}</td>
          <td>{{ props.item.RunningVersion.Number || '–' }}</td>
          <td>{{ props.item.OS }}/{{ props.item.Arch }}</td>
        </tr>
      </template>
      <template slot="no-data">
        No unscheduled nodes at this time.
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import API from "@/shared/api";
import Info from "@/components/Info";
import { timeago, duration } from "@/shared/filters";

export default {
  components: {
    Info
  },
  filters: {
    timeago,
    duration
  },
  data() {
    return {
      nodes: [],
      headers: [
        {
          text: "Location",
          value: "Location"
        },
        {
          text: "Nickname",
          value: "Nickname"
        },
        {
          text: "Charts",
          value: "ID"
        },
        {
          text: "Last seen",
          value: "LastSeen"
        },
        {
          text: "Uptime",
          value: "Uptime"
        },
        {
          text: "Version",
          value: "RunningVersion.Number"
        },
        {
          text: "OS/Arch",
          value: "OS"
        }
      ],
      loading: true
    };
  },
  async mounted() {
    this.nodes = await API.get("node");
    this.loading = false;
  },
  methods: {
    view: function(id) {
      this.$router.push(`nodes/${id}`);
    },
    locale: function(location) {
      // sometimes the data is missing for the location so this will try to
      // get the most specific, available, locale, e.g.:
      //
      //     "US, North Carolina, Waxhaw" => "Waxhaw"
      //     "US, North Carolina, "       => "North Carolina"
      //     "US, , "                     => "US"
      //     ", , "                       => "–"
      //     ""                           => "–"
      return (
        location
          .split(",")
          .reverse()
          .filter(x => x != false)[0] || "–"
      );
    }
  },
  computed: {
    scheduledNodes: vm => vm.nodes.filter(node => node.Tasks.length),
    unscheduledNodes: vm => vm.nodes.filter(node => !node.Tasks.length)
  }
};
</script>
