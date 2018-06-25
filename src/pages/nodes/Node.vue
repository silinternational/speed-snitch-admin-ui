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
      <dd>{{ node.Notes || "–" }}</dd>

      <dt>Tasks</dt>
      <dd>
        <DataTable>
          <thead>
            <tr>
              <th>Type</th>
              <th>Frequency</th>
              <th>Server</th>
              <th/>
            </tr>
          </thead>
          <tr 
            v-for="(_task, _i) in node.Tasks" 
            :key="_i">
            <td >
              {{ _task.Type }}
            </td>
            <td>{{ _task.Schedule }}</td>
            <td>{{ _task.NamedServer.Name || "–" }}</td>
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
              <select 
                v-model="newTaskScheduleName" 
                @change="clearPreviousSchedules()">
                <option 
                  v-for="_freq in frequencies" 
                  :key="_freq" 
                  :value="_freq">{{ _freq }}</option>
              </select>
            </td>
            <td>
              <select v-model="newTaskNamedServer">
                <option 
                  :value="{}" 
                  disabled>Select server</option>
                <option 
                  v-for="_server in servers" 
                  :key="_server.UID" 
                  :value="_server">{{ _server.Name }}</option>
              </select>
            </td>
            <td>
              <button @click="addTask">Add</button>
            </td>
          </tr>
          <tr v-if="newTaskScheduleName">
            <td/>
            <td 
              v-if="newTaskScheduleName.includes('Daily')" 
              class="no-wrap">
              Starting at 
              <select
                v-model="customStartTimeHour" 
                @change="convertStartTimeToCron()">
                <option 
                  value="null" 
                  disabled>Select hour</option>
                <option 
                  v-for="_hr in Array.from(Array(24).keys())" 
                  :key="_hr" 
                  :value="_hr">{{ String(_hr).padStart(2, '0') }}</option>
              </select> 
              <select 
                v-model="customStartTimeMin" 
                @change="convertStartTimeToCron()">
                <option 
                  value="null" 
                  disabled>Select min</option>
                <option value="0">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select> 
              hours.
            </td>
            <td 
              v-else-if="newTaskScheduleName.includes('hour')" 
              class="no-wrap">
              Every
              <select
                v-model="customNumHours" 
                @change="convertHoursToCron()">
                <option 
                  value="null" 
                  disabled>Select one</option>
                <option 
                  v-for="_hr in Array.from(Array(12).keys())" 
                  :key="_hr" 
                  :value="_hr + 1">{{ _hr + 1 }}</option>
              </select> 
              hour(s).
            </td>
            <td 
              v-else-if="newTaskScheduleName.includes('minute')" 
              class="no-wrap">
              Every
              <select
                v-model="customNumMins" 
                @change="convertMinutesToCron()">
                <option 
                  value="null" 
                  disabled>Select one</option>
                <option 
                  v-for="_min in Array.from(Array(30).keys())" 
                  :key="_min" 
                  :value="_min + 1">{{ _min + 1 }}</option>
              </select> 
              minute(s).
            </td>
            <td 
              v-else 
              class="no-wrap">
              Cron schedule: 
              <input 
                v-model="customCron" 
                v-autofocus>
            </td>
          </tr>
        </DataTable>
      </dd>
      
      <dt>Tags</dt>
      <dd>
        <DataTable>
          <tr>
            <td>
              <span 
                v-for="(_tag, _i) in node.Tags" 
                :key="_tag.UID">{{ _i > 0 ? ', ': ''}}{{ _tag.Name }}</span>
            </td>
            <td>
              <router-link 
                :to="`${ node.MacAddr }/tags`" 
                tag="button">manage</router-link>
            </td>
          </tr>
        </DataTable>
      </dd>
      
      <dt>First seen</dt>
      <dd v-if="node.FirstSeen">{{ node.FirstSeen | format }}</dd>
      <dd v-else>–</dd>
      
      <dt>Last seen</dt>
      <dd v-if="node.LastSeen">{{ node.LastSeen | format }}</dd>
      <dd v-else>–</dd>
      
      <dt>Uptime</dt>
      <dd v-if="node.Uptime">
        {{ node.Uptime | duration }}
        <router-link 
          :to="`${ node.MacAddr }/charts`"><small>(charts)</small></router-link>
      </dd>
      <dd v-else>–</dd>
      
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
import { ADMIN_API } from "@/plugins/admin-api-service.js";
import DataTable from "@/components/DataTable";
import DefinitionList from "@/components/DefinitionList";

export default {
  components: {
    DataTable,
    DefinitionList
  },
  data() {
    return {
      node: {},
      frequencies: [
        "Daily",
        "Every X hour(s)",
        "Every X minute(s)",
        "Advanced"
      ],
      newTaskType: "ping",
      newTaskScheduleName: "Daily",
      newTaskNamedServer: {},
      isNicknameEditable: false,
      newNickname: "",
      versions: [],
      servers: [],
      customNumHours: null,
      customNumMins: null,
      customStartTimeHour: null,
      customStartTimeMin: null,
      customCron: ""
    };
  },
  async mounted() {
    let nodeResponse = await ADMIN_API.get(
      `node/${this.$route.params.macaddr}`
    );
    let versionsResponse = await ADMIN_API.get("version");
    let serversResponse = await ADMIN_API.get("namedserver");

    this.node = nodeResponse.data;
    this.versions = versionsResponse.data;
    this.servers = serversResponse.data;
  },
  methods: {
    addTask: async function() {
      // "unscheduled" nodes will not have any Tasks on them.
      if (!this.node.Tasks) {
        this.node.Tasks = [];
      }

      this.node.Tasks.push({
        Type: this.newTaskType,
        Schedule: this.customCron,
        NamedServer: this.newTaskNamedServer
      });

      try {
        let response = await ADMIN_API.put(
          `node/${this.node.MacAddr}`,
          this.node
        );

        this.node = response.data;
      } catch (error) {
        console.log(`error caught while PUTting tasks: ${error}`);
      }
    },
    clearPreviousSchedules: function() {
      this.customCron = "";
      this.customNumHours = null;
      this.customNumMins = null;
      this.customStartTimeHour = null;
      this.customStartTimeMin = null;
    },
    convertStartTimeToCron: function() {
      // daily at 2345 => 45 23 * * *
      this.customCron = `${this.customStartTimeMin} ${
        this.customStartTimeHour
      } * * *`;
    },
    convertHoursToCron: function() {
      // every 7 hours => 0 */7 * * *
      this.customCron = `0 */${this.customNumHours} * * *`;
    },
    convertMinutesToCron: function() {
      // every 2 minutes => */2 * * * *
      this.customCron = `*/${this.customNumMins} * * * *`;
    },
    removeTask: async function(i) {
      this.node.Tasks.splice(i, 1); // remove the requested task from existing tasks for the PUT of the entire node again...don't like this, would prefer to have endpoints for tasks...

      try {
        let response = await ADMIN_API.put(
          `node/${this.node.MacAddr}`,
          this.node
        );

        this.node = response.data;
      } catch (error) {
        console.log(`error caught while DELETEing task: ${error}`);
      }
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
        await ADMIN_API.put(`node/${this.node.MacAddr}`, this.node);

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
      }&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
    }
  }
};
</script>

<style scoped>
dt > small {
  font-weight: lighter;
  font-size: 50%;
}

td.no-wrap {
  white-space: nowrap;
}
</style>

