<template>
  <section>
    <h1>Nodes</h1>

    <DataTable>
      <caption>Scheduled</caption>
      <thead v-if="scheduledNodes.length > 0">
        <tr>
          <th>Location</th>
          <th>Nickname</th>
          <th></th>
          <th>Last seen</th>
          <th>Uptime</th>
          <th>Reported version</th>
          <th>OS/Arch</th>
          <th>MAC</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="_node in scheduledNodes"
          :key="_node.MacAddr">
          <td>
            <Info :title="_node.Location">{{ locale(_node.Location) }}</Info>
          </td>
          <td>{{ _node.Nickname }}</td>
          <td>
            <router-link :to="`nodes/${ _node.MacAddr }/charts`" title="charts">
              📈
            </router-link>   
          </td>
          <td>{{ _node.LastSeen | timeago }}</td>
          <td>{{ _node.Uptime | duration }}</td>
          <td>{{ _node.RunningVersion }}</td>
          <td>{{ _node.OS }}/{{ _node.Arch }}</td>
          <td><code>{{ _node.MacAddr }}</code></td>
          <td>
            <router-link 
              :to="`nodes/${_node.MacAddr}`" 
              tag="button">Manage</router-link>
          </td>
        </tr>
      </tbody> 
      <tfoot v-if="scheduledNodes.length == 0">
        <tr>
          <td :colspan="numCols">
            No scheduled nodes at this time.
          </td>
        </tr>
      </tfoot>
    </DataTable>

    <DataTable>
      <caption>Unscheduled</caption>
      <thead v-if="unscheduledNodes.length > 0">
        <tr>
          <th>Location</th>
          <th>Nickname</th>
          <th></th>
          <th>Last seen</th>
          <th>Uptime</th>
          <th>Reported version</th>
          <th>OS/Arch</th>
          <th>MAC</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="_node in unscheduledNodes"
          :key="_node.MacAddr">
          <td>
            <Info :title="_node.Location">{{ locale(_node.Location) }}</Info>
          </td>
          <td>{{ _node.Nickname }}</td>
          <td>
            <router-link :to="`nodes/${ _node.MacAddr }/charts`" title="charts">
              📈
            </router-link>   
          </td>
          <td>{{ _node.LastSeen | timeago }}</td>
          <td>{{ _node.Uptime | duration }}</td>
          <td>{{ _node.RunningVersion }}</td>
          <td>{{ _node.OS }}/{{ _node.Arch }}</td>
          <td><code>{{ _node.MacAddr }}</code></td>
          <td>
            <router-link
              :to="`nodes/${_node.MacAddr}`" 
              tag="button">Manage</router-link>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="unscheduledNodes.length == 0">
        <tr>
          <td :colspan="numCols">
            No unscheduled nodes at this time.
          </td>
        </tr>
      </tfoot>
    </DataTable>
    <!-- TODO: notes 
      For super admins, default sort will be oldest "Last seen"
      Shade rows yellow or red to indicate issues, e.g., 3 days since last phone home
      For admins, default sort should be by contact (with theirs at top) and then by location.
    -->
  </section>
</template>

<script>
import API from "@/shared/api";
import DataTable from "@/components/DataTable";
import Info from "@/components/Info";
import { timeago, duration } from "@/shared/filters";

export default {
  // TODO: add a timer on this page for node retrievals?
  components: {
    DataTable,
    Info
  },
  filters: {
    timeago,
    duration
  },
  data() {
    return {
      nodes: [],
      numCols: 8
    };
  },
  async mounted() {
    let response = await API.get("node");

    return (this.nodes = response.data);
  },
  methods: {
    manage: function(id) {
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
    scheduledNodes: function() {
      return this.nodes.filter(node => node.Tasks);
    },
    unscheduledNodes: function() {
      return this.nodes.filter(node => !node.Tasks);
    }
  }
};
</script>
