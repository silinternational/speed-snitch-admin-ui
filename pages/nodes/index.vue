<template>
  <section>
    <h1>Nodes</h1>

    <DataTable>
      <caption>Scheduled</caption>
      <thead v-if="scheduledNodes.length > 0">
        <tr>
          <th>Location</th>
          <!-- TODO: add Nickname -->
          <th>Last seen</th>
          <th>Uptime</th>
          <th>Reported version</th>
          <th>OS</th>
          <th>Architecture</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <ClickableRow
          v-for="_node in scheduledNodes"
          :key="_node.MacAddr"
          :to="`nodes/${ _node.MacAddr }/`"
        >
          <td>
            <Info :title="_node.Location">{{ locale(_node.Location) }}</Info>
          </td>
          <td>{{ _node.LastSeen | timeago }}</td>
          <td>{{ _node.Uptime | duration }}</td>
          <td>{{ _node.RunningVersion }}</td>
          <td>{{ _node.OS }}</td>
          <td>{{ _node.Arch }}</td>
          <td>
            <router-link 
              :to="`nodes/${ _node.MacAddr }/`" 
              tag="button/">Manage</router-link>
          </td>
        </ClickableRow>
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
          <th>Last seen</th>
          <th>Uptime</th>
          <th>Reported version</th>
          <th>OS</th>
          <th>Architecture</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <ClickableRow
          v-for="_node in unscheduledNodes"
          :key="_node.MacAddr" 
          :to="`nodes/${ _node.MacAddr }/`"
        >
          <td>
            <Info :title="_node.Location">{{ locale(_node.Location) }}</Info>
          </td>
          <td>{{ _node.LastSeen | timeago }}</td>
          <td>{{ _node.Uptime | duration }}</td>
          <td>{{ _node.RunningVersion }}</td>
          <td>{{ _node.OS }}</td>
          <td>{{ _node.Arch }}</td>
          <td>
            <router-link
              :to="`nodes/${ _node.MacAddr }/`" 
              tag="button">Manage</router-link>
          </td>
        </ClickableRow>
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
import { ADMIN_API } from "~/plugins/admin-api-service.js";
import DataTable from "~/components/DataTable";
import ClickableRow from "~/components/ClickableRow";
import Info from "~/components/Info";

export default {
  // TODO: add a timer on this page for node retrievals?
  components: {
    DataTable,
    ClickableRow,
    Info
  },
  data() {
    return {
      nodes: [],
      numCols: 6
    };
  },
  async asyncData() {
    let response = await ADMIN_API.get("node");

    return {
      nodes: response.data
    };
  },
  methods: {
    manage: function(id) {
      this.$router.push(`nodes/${id}/`);
    },
    locale: function(location) {
      return location.split(",").pop();
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
