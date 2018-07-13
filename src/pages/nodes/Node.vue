<template>
  <section>
    <h1>
      Node 
      <small>
        <span v-if="node.Nickname">({{ node.Nickname }})</span>

        <router-link :to="`${ node.ID }/charts`" title="charts">📈</router-link>
      </small>
    </h1>

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
        <DataTable v-if="$user.Role != 'reporting'">
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

        <span v-else>{{ node.Nickname || '–' }}</span>
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
          <tr v-for="(_task, _i) in node.Tasks" :key="_i">
            <td>{{ _task.Type }}</td>
            <td>{{ _task.Schedule }}</td>
            <td>{{ _task.NamedServer.Name || "–" }}</td>
            <td>
              <button v-if="$user.Role != 'reporting'" @click="removeTask(_i)" class="caution">
                Remove
              </button>
            </td>
          </tr>
          <tr v-if="$user.Role != 'reporting'">
            <td>
              <select v-model="newTaskType">
                <option value="ping">Ping</option>
                <option value="speedTest">Speed test</option>
              </select>
            </td>
            <td>
              <select v-model="newTaskScheduleName" @change="clearPreviousSchedules()">
                <option v-for="_freq in frequencies" :key="_freq" :value="_freq">
                  {{ _freq }}
                </option>
              </select>
            </td>
            <td>
              <select v-model="newTaskNamedServer">
                <option :value="{}" disabled>Select server</option>
                <option v-for="_server in servers" :key="_server.ID" :value="_server">
                  {{ _server.Name }}
                </option>
              </select>
            </td>
            <td>
              <button @click="addTask">Add</button>
            </td>
          </tr>
          <tr v-if="$user.Role != 'reporting' && newTaskScheduleName">
            <td/>
            <td v-if="newTaskScheduleName.includes('Daily')" class="no-wrap">
              Starting at 
              <select v-model="customStartTimeHour" @change="convertStartTimeToCron()">
                <option value="null" disabled>Select hour</option>
                <option v-for="_hr in Array.from(Array(24).keys())" :key="_hr" :value="_hr">
                  {{ String(_hr).padStart(2, '0') }}
                </option>
              </select> 
              <select v-model="customStartTimeMin" @change="convertStartTimeToCron()">
                <option value="null" disabled>Select min</option>
                <option value="0">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select> 
              hours.
            </td>
            <td v-else-if="newTaskScheduleName.includes('hour')" class="no-wrap">
              Every
              <select v-model="customNumHours" @change="convertHoursToCron()">
                <option value="null" disabled>Select one</option>
                <option v-for="_hr in Array.from(Array(12).keys())" :key="_hr" :value="_hr + 1">
                  {{ _hr + 1 }}
                </option>
              </select> 
              hour(s).
            </td>
            <td v-else-if="newTaskScheduleName.includes('minute')" class="no-wrap">
              Every
              <select v-model="customNumMins" @change="convertMinutesToCron()">
                <option value="null" disabled>Select one</option>
                <option v-for="_min in Array.from(Array(30).keys())" :key="_min" :value="_min + 1">
                  {{ _min + 1 }}
                </option>
              </select> 
              minute(s).
            </td>
            <td v-else class="no-wrap">
              Cron schedule: 
              <input v-model="customCron" v-autofocus>
            </td>
          </tr>
        </DataTable>
      </dd>
      
      <dt>Tags</dt>
      <dd>
        <DataTable>
          <tr>
            <td>
              <span v-for="(_tag, _i) in node.Tags" :key="_tag.ID">
                {{ _i > 0 ? ', ': ''}}{{ _tag.Name }}
              </span>
            </td>
            <td>
              <router-link v-if="$user.Role == 'superAdmin'" :to="`${ node.MacAddr }/tags`" tag="button">
                manage
              </router-link>
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
      </dd>
      <dd v-else>–</dd>
      
      <dt>Running version</dt>
      <dd><code>{{ node.RunningVersion.Number }}</code></dd>
      
      <dt>Configured version</dt>
      <dd>
        <DataTable v-if="$user.Role != 'reporting'">
          <tr>
            <td>
              <select v-model="node.ConfiguredVersion">
                <option value="">latest</option>
                <option v-for="_version in versions" :key="_version.ID" :value="_version.Number">
                  {{ _version.Number }}
                </option>
              </select>
            </td>
            <td>
              <button @click="updateVersion">Set</button>
            </td>
          </tr>
        </DataTable>
        <code v-else>{{ node.ConfiguredVersion }}</code>
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
import API from "@/shared/api";
import DataTable from "@/components/DataTable";
import DefinitionList from "@/components/DefinitionList";
import { autofocus } from "@/shared/directives";
import { format, duration } from "@/shared/filters";

export default {
  components: {
    DataTable,
    DefinitionList
  },
  directives: {
    autofocus
  },
  filters: {
    format,
    duration
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
    this.node = await API.get(`node/${this.$route.params.macaddr}`);
    this.versions = await API.get("version");
    this.servers = await API.get("namedserver");
  },
  methods: {
    addTask: async function() {
      this.node.Tasks = this.node.Tasks || [];

      this.node.Tasks.push({
        Type: this.newTaskType,
        Schedule: this.customCron,
        NamedServer: this.newTaskNamedServer
      });

      this.node = await API.put(`node/${this.node.MacAddr}`, this.node);
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

      this.node = await API.put(`node/${this.node.ID}`, this.node);
    },
    editNickname: function() {
      this.newNickname = this.node.Nickname;

      this.isNicknameEditable = true;
    },
    updateNickname: async function() {
      this.node.Nickname = this.newNickname;

      this.node = await API.put(`node/${this.node.ID}`, this.node);
    },
    updateVersion: async function() {
      this.node = await API.put(`node/${this.node.ID}`, this.node);
    }
  },
  computed: {
    mapUrl: vm =>
      `https://maps.googleapis.com/maps/api/staticmap?center=${
        vm.node.Coordinates
      }&zoom=10&size=640x200&sensor=false&markers=${vm.node.Coordinates}&key=${
        process.env.VUE_APP_GOOGLE_MAPS_API_KEY
      }`
  }
};
</script>

<style scoped>
td.no-wrap {
  white-space: nowrap;
}
</style>

