<template>
  <section>
    <h1>
      Node 
      <small>
        <span v-if="node.Nickname">({{ node.Nickname }}) </span>

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
        <DataTable>
          <tr>
            <td v-if="node.Nickname && ! isNicknameEditable">
              {{ node.Nickname }}
            </td>
            <td v-else>
              <input v-model="node.Nickname">
            </td>

            <td v-if="node.Nickname && ! isNicknameEditable">
              <button @click="isNicknameEditable = true">Update</button>
            </td>
            <td v-else>
              <button @click="updateNickname">{{ isNicknameEditable ? 'Change' : 'Add' }}</button>
            </td>
          </tr>
        </DataTable>
      </dd>

      <dt>Notes</dt>
      <dd>
        <DataTable>
          <tr>
            <td v-if="node.Notes && ! isNotesEditable">
              {{ node.Notes }}
            </td>
            <td v-else>
              <input v-model="node.Notes">
            </td>

            <td v-if="node.Notes && ! isNotesEditable">
              <button @click="isNotesEditable = true">Update</button>
            </td>
            <td v-else>
              <button @click="updateNotes">{{ isNotesEditable ? 'Change' : 'Add' }}</button>
            </td>
          </tr>
        </DataTable>
      </dd>

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
            <td>{{ (_task.NamedServer && _task.NamedServer.Name) || "–" }}</td>
            <td>
              <button @click="removeTask(_i)" class="caution">
                Remove
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <select v-model="newTask.Type" @change="taskTypeChanged()">
                <option value="ping">Ping</option>
                <option value="speedTest">Speed test</option>
                <option value="reboot">Reboot</option>
              </select>
            </td>
            <td>
              <select v-model="newTask.ScheduleName" @change="updateCron()">
                <option value="daily">Daily</option>
                <option value="everyHours">Every X hour(s)</option>
                <option value="everyMinutes">Every X minute(s)</option>
                <option value="advanced">Advanced</option>
              </select>
            </td>
            <td>
              <select v-model="newTask.NamedServerID" v-if="newTask.Type != 'reboot'">
                <option v-if="newTask.NamedServerID == 0" value="0" disabled>retrieving servers...</option>
                <option v-if="newTask.NamedServerID == -1" value="-1" disabled>No servers available</option>
                <option v-for="_server in servers" :key="_server.ID" :value="_server.ID">
                  {{ _server.Name }}
                </option>
              </select>
              <span v-else>N/A</span>
            </td>
            <td>
              <button @click="addTask">Add</button>
            </td>
          </tr>
          <tr v-if="newTask.ScheduleName">
            <td/>
            <td v-if="newTask.ScheduleName == 'daily'" class="no-wrap">
              Starting at 
              <vue-timepicker v-model="custom.startTime" @change="convertStartTimeToCron()"></vue-timepicker>
              hours.
            </td>
            <td v-else-if="newTask.ScheduleName == 'everyHours'" class="no-wrap">
              Every
              <select v-model="custom.everyHours" @change="convertHoursToCron()">
                <option v-for="_hr in Array.from(Array(12).keys())" :key="_hr" :value="_hr + 1">
                  {{ _hr + 1 }}
                </option>
              </select> 
              hour(s).
            </td>
            <td v-else-if="newTask.ScheduleName == 'everyMinutes'" class="no-wrap">
              Every
              <select v-model="custom.everyMinutes" @change="convertMinutesToCron()">
                <option v-for="_min in Array.from(Array(30).keys())" :key="_min" :value="_min + 1">
                  {{ _min + 1 }}
                </option>
              </select> 
              minute(s).
            </td>
            <td v-else class="no-wrap">
              Cron schedule: 
              <input v-model="custom.cron" v-autofocus>
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
              <router-link v-if="$user.Role == 'superAdmin'" :to="`${ node.ID }/tags`" tag="button">
                <span v-if="node.Tags">{{ node.Tags.length ? 'manage' : 'add' }}</span>
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
      <dd><code>{{ node.RunningVersion && node.RunningVersion.Number || '–' }}</code></dd>
      
      <dt>Configured version</dt>
      <dd>
        <DataTable>
          <tr>
            <td>
              <select v-model="node.ConfiguredVersionID">        
                <option v-for="_version in versions" :key="_version.ID" :value="_version.ID">
                  {{ _version.Number }}
                </option>
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
import API from "@/shared/api";
import DataTable from "@/components/DataTable";
import DefinitionList from "@/components/DefinitionList";
import { autofocus } from "@/shared/directives";
import { format, duration } from "@/shared/filters";
import VueTimepicker from "vue2-timepicker";

export default {
  components: {
    DataTable,
    DefinitionList,
    VueTimepicker
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
      newTask: {
        Type: "ping",
        ScheduleName: "daily",
        NamedServerID: 0
      },
      isNicknameEditable: false,
      newNickname: "",
      isNotesEditable: false,
      newNotes: "",
      versions: [],
      servers: [],
      typedServers: [],
      custom: {
        everyHours: 12,
        everyMinutes: 15,
        startTime: {
          HH: 23,
          mm: 45
        },
        cron: ""
      }
    };
  },
  async mounted() {
    this.node = await API.get(`node/${this.$route.params.id}`);
    this.versions = await API.get("version");
    this.servers = await API.get(`namedserver?type=${this.newTask.Type}`);

    this.newTask.NamedServerID = (this.servers[0] && this.servers[0].ID) || -1;
  },
  methods: {
    taskTypeChanged: async function() {
      this.newTask.NamedServerID = 0;

      if (this.newTask.Type != "reboot") {
        this.servers = [];
        this.servers = await API.get(`namedserver?type=${this.newTask.Type}`);
        this.newTask.NamedServerID =
          (this.servers[0] && this.servers[0].ID) || -1;
      }
    },
    updateCron: function() {
      switch (this.newTask.ScheduleName) {
        case "everyHours":
          this.convertHoursToCron();
          break;
        case "everyMinutes":
          this.convertMinutesToCron();
          break;
        default:
          this.convertStartTimeToCron();
      }
    },
    addTask: async function() {
      this.node.Tasks = this.node.Tasks || [];

      this.node.Tasks.push({
        Type: this.newTask.Type,
        Schedule: this.custom.cron,
        NamedServerID: this.newTask.NamedServerID
      });

      this.node = await API.put(`node/${this.node.ID}`, this.node);
    },
    convertStartTimeToCron: function() {
      // daily at 2345 => 45 23 * * *
      this.custom.cron = `${this.custom.startTime.mm} ${
        this.custom.startTime.HH
      } * * *`;
    },
    convertHoursToCron: function() {
      // every 7 hours => 0 */7 * * *
      this.custom.cron = `0 */${this.custom.everyHours} * * *`;
    },
    convertMinutesToCron: function() {
      // every 2 minutes => */2 * * * *
      this.custom.cron = `*/${this.custom.everyMinutes} * * * *`;
    },
    removeTask: async function(i) {
      this.node.Tasks.splice(i, 1); // remove the requested task from existing tasks for the PUT of the entire node again...don't like this, would prefer to have endpoints for tasks...

      this.node = await API.put(`node/${this.node.ID}`, this.node);
    },
    updateNickname: async function() {
      this.node = await API.put(`node/${this.node.ID}`, this.node);

      this.isNicknameEditable = false;
    },
    updateNotes: async function() {
      this.node = await API.put(`node/${this.node.ID}`, this.node);

      this.isNotesEditable = false;
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

