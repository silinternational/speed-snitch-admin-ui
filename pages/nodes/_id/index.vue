<template>
  <section>
    <h1>Node</h1>

    <img :src="mapUrl">

    <DefinitionList>
      <dt>MAC address</dt>
      <dd><code>{{ node.MacAddr }}</code></dd>
      
      <dt>IP address</dt>
      <dd><code>{{ node.IPAddress }}</code></dd>
      
      <dt>Location</dt>
      <dd>{{ node.Location }}</dd>

      <dt>Nickname</dt>
      <dd>
        <DataTable>
          <tr>
            <td v-if="node.Nickname && ! isNicknameEditable">
              {{ node.Nickname }}
            </td>
            <td v-else>
              <input v-model="newNickname">
            </td>

            <td v-if="node.Nickname && ! isNicknameEditable">
              <button @click="editNickname">Update</button>
            </td>
            <td v-else-if="isNicknameEditable">
              <button @click="updateNickname">Change</button>
            </td>
            <td v-else>
              <button @click="updateNickname">Add</button>
            </td>
          </tr>
        </DataTable>
      </dd>

      <dt>Notes</dt>
      <dd>{{ node.Notes }}</dd>

      <dt>Tasks</dt>
      <dd>
        <DataTable>
          <thead>
            <tr>
              <th>Type</th>
              <th>Frequency</th>
              <th/>
            </tr>
          </thead>
          <tr 
            v-for="(_task, _i) in node.Tasks" 
            :key="_i">
            <td >
              {{ _task.Type }}
            </td>
            <td>{{ name(_task.Schedule) }}</td>
            <td>
              <button 
                @click="removeTask(_i)" 
                class="caution">Remove</button>
            </td>
          </tr>
          <tr>
            <td>
              <select v-model="newTaskType">
                <option value="ping">Ping</option>
                <option value="speedTest">Speed test</option>
              </select>
            </td>
            <td>
              <select v-model="newTaskSchedule">
                <option 
                  v-for="_schedule in schedules" 
                  :key="_schedule.name" 
                  :value="_schedule.cron">{{ _schedule.name }}</option>
              </select>
            </td>
            <td>
              <!-- TODO: add the ability to request the time, e.g., daily at 11:00 pm or every x hours. -->
              <button @click="addTask">Add</button>
            </td>
          </tr>
        </DataTable>
      </dd>
      
      <dt>Tags</dt>
      <dd v-if="! hasTags">
        <router-link 
          :to="`${ node.MacAddr }/tags`" 
          tag="button">Add</router-link>
      </dd>
      <dd v-else>
        {{ node.TagUIDs }}
        <router-link 
          :to="`${ node.MacAddr }/tags`" 
          tag="button">Edit/Remove?</router-link>
      </dd>
      
      <dt>First seen</dt>
      <dd>{{ node.FirstSeen | format }}</dd>
      
      <dt>Last seen</dt>
      <dd>{{ node.LastSeen | format }}</dd>
      
      <dt>Uptime</dt>
      <dd>{{ node.Uptime | duration }}</dd>
      
      <dt>Running version</dt>
      <dd><code>{{ node.RunningVersion }}</code></dd>
      
      <dt>Configured version</dt>
      <dd>
        <DataTable>
          <tr>
            <td>
              <select v-model="node.ConfiguredVersion">
                <option value="">latest</option>
                <option 
                  v-for="_version in versions" 
                  :key="_version.ID" 
                  :value="_version.Number">{{ _version.Number }}</option>
              </select>
            </td>
            <td>
              <!-- TODO: add the ability to request the time, e.g., daily at 11:00 pm or every x hours. -->
              <button @click="updateVersion">Set</button>
            </td>
          </tr>
        </DataTable>
      </dd>
      
      <dt>Configured by</dt>
      <dd>{{ node.ConfiguredBy || 'N/A' }}</dd>
      
      <dt>OS</dt>
      <dd><code>{{ node.OS }}</code></dd>
      
      <dt>Architecture</dt>
      <dd><code>{{ node.Arch }}</code></dd>
    </DefinitionList>
  </section>
</template>

<script>
import { ADMIN_API } from "~/plugins/admin-api-service.js";
import DataTable from "~/components/DataTable";
import DefinitionList from "~/components/DefinitionList";

export default {
  components: {
    DataTable,
    DefinitionList
  },
  data() {
    return {
      node: {},
      schedules: [
        {
          name: "Every 2 minutes",
          cron: "*/2 * * * *"
        },
        {
          name: "Hourly",
          cron: "0 * * * *"
        },
        {
          name: "Every 4 hours",
          cron: "0 */4 * * *"
        },
        {
          name: "Daily",
          cron: "59 23 * * *"
        }
      ],
      newTaskType: "ping",
      newTaskSchedule: "0 * * * *",
      isNicknameEditable: false,
      newNickname: "",
      versions: []
    };
  },
  async asyncData({ params }) {
    let nodeResponse = await ADMIN_API.get(`node/${params.id}`);
    let versionsResponse = await ADMIN_API.get("version");

    return {
      node: nodeResponse.data,
      versions: versionsResponse.data
    };
  },
  methods: {
    addTask: async function() {
      // "unscheduled" nodes will not have any Tasks on them.
      if (!this.node.Tasks) {
        this.node.Tasks = [];
      }

      this.node.Tasks.push({
        Type: this.newTaskType,
        Schedule: this.newTaskSchedule
      });

      let response = await ADMIN_API.put(
        `node/${this.node.MacAddr}`,
        this.node
      );

      // need to retain intial reference to node since that's what vue is watching.
      Object.assign(this.node, response.data);
    },
    removeTask: async function(i) {
      this.node.Tasks.splice(i, 1); // remove the requested task from existing tasks for the PUT of the entire node again...don't like this, would prefer to have endpoints for tasks...

      let response = await ADMIN_API.put(
        `node/${this.node.MacAddr}`,
        this.node
      );

      // need to retain intial reference to node since that's what vue is watching.
      Object.assign(this.node, response.data);
    },
    name: function(cron) {
      const matchingSchedule = this.schedules.find(
        schedule => schedule.cron == cron
      );

      return matchingSchedule ? matchingSchedule.name : cron;
    },
    editNickname: function() {
      this.newNickname = this.node.Nickname;

      this.isNicknameEditable = true;
    },
    updateNickname: async function() {
      this.node.Nickname = this.newNickname;

      try {
        let response = await ADMIN_API.put(
          `node/${this.node.MacAddr}`,
          this.node
        );

        this.$router.go();
      } catch (error) {
        console.log(`error caught while updating nickname: ${error}`);
      }
    },
    updateVersion: async function() {
      try {
        let response = await ADMIN_API.put(
          `node/${this.node.MacAddr}`,
          this.node
        );

        this.$router.go();
      } catch (error) {
        console.log(`error caught while updating version: ${error}`);
      }
    }
  },
  computed: {
    mapUrl() {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${
        this.node.Coordinates
      }&zoom=10&size=640x200&sensor=false&markers=${
        this.node.Coordinates
      }&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    },
    hasTags() {
      return this.node.TagUIDs;
    }
  }
};
</script>
