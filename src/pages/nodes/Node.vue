<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height class="pb-4">
      <h1 class="display-1 secondary--text">Node</h1>

      <v-btn :to="`${ node.ID }/charts`" color="secondary" round>
        charts <v-icon right>show_chart</v-icon>
      </v-btn>
    </v-layout>

    <dl class="body-1">
      <dt class="title">Nickname</dt>
      <dd v-if="! isNicknameEditable" class="pl-5 pt-2">
        {{ node.Nickname || '–' }}
        <v-btn @click="isNicknameEditable = true" color="secondary" icon small>
          <v-icon small>edit</v-icon>
        </v-btn>
      </dd>
      <dd v-else class="pl-5 pt-2">
        <v-layout align-center>
          <v-text-field v-model="node.Nickname" :autofocus="true" />
          <v-btn @click="isNicknameEditable = false; updateNode()" color="secondary" icon small>
            <v-icon small>save</v-icon>
          </v-btn>
        </v-layout>
      </dd>

      <dt class="title pt-2">Location</dt>
      <dd  class="pl-5 pt-2">{{ node.Location }}</dd>
      <dd class="pl-5 pt-2"><img :src="mapUrl"></dd>

      <dt class="title pt-4">MAC address</dt>
      <dd class="pl-5 pt-2">{{ node.MacAddr }}</dd>

      <dt class="title pt-4">IP address</dt>
      <dd class="pl-5 pt-2">{{ node.IPAddress }}</dd>

      <dt class="title pt-4">Notes</dt>
      <dd v-if="! isNotesEditable" class="pl-5 pt-2">
        {{ node.Notes || '–' }}
        <v-btn @click="isNotesEditable = true" color="secondary" icon small>
          <v-icon small>edit</v-icon>
        </v-btn>
      </dd>
      <dd v-else class="pl-5 pt-2">
        <v-layout align-center>
          <v-text-field v-model="node.Notes" :autofocus="true" />
          <v-btn @click="isNotesEditable = false; updateNode()" color="secondary" icon small>
            <v-icon small>save</v-icon>
          </v-btn>
        </v-layout>
      </dd>

      <dt class="title pt-4">Tasks</dt>
      <dd class="pl-5 pt-2">
        <v-data-table :headers="task.headers" :items="node.Tasks" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.Type }}</td>
            <td>{{ props.item.Schedule }}</td>
            <td>{{ (props.item.NamedServer && props.item.NamedServer.Name) || "–" }}</td>
            <td class="justify-center layout px-0">
              <v-btn @click="removeTask(props.item.ID)" icon>
                <v-icon color="error" small>delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="footer">
            <tr>
              <td>
                <v-select 
                  :items="task.types"
                  v-model="newTask.Type"
                  @change="taskTypeChanged()" />
              </td>
              <td>
                <v-select 
                  :items="task.frequencies"
                  v-model="newTask.ScheduleName"
                  @change="updateCron()" />
              </td>
              <td>
                <v-select 
                  v-if="newTask.Type != 'reboot'"
                  :items="servers"
                  :loading="task.serversLoading"
                  no-data-text="No servers available"
                  item-text="Name"
                  item-value="ID"
                  v-model="newTask.NamedServerID"
                  @change="updateCron()" />
                <span v-else>N/A</span>
              </td>

              <td rowspan="2">
                <v-btn @click="addTask" color="success" icon small>
                  <v-icon>add</v-icon>
                </v-btn>
              </td>
            </tr>

            <tr no-border-top>
              <td>
              </td>
              <td>
                <v-layout v-if="newTask.ScheduleName == 'daily'" row align-center class="pb-3">
                  <v-dialog ref="dialog" v-model="task.custom.dialog" persistent width="290">
                    <v-text-field
                      slot="activator"
                      label="Starting at"
                      v-model="task.custom.startTime"
                      prepend-icon="access_time"
                      readonly />
                    <v-time-picker v-model="task.custom.startTime" actions>
                      <v-spacer />
                      <v-btn flat color="primary" @click="$refs.dialog.save()">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-layout>
                <v-layout v-else-if="newTask.ScheduleName == 'everyHours'" row align-center min-width>
                  Every
                  <v-select 
                    :items="task.hours"
                    v-model="task.custom.everyHours"
                    class="px-3" />
                  hour(s).
                </v-layout>
                <v-layout v-else-if="newTask.ScheduleName == 'everyMinutes'" row align-center min-width>
                  Every
                  <v-select 
                    :items="task.minutes"
                    v-model="task.custom.everyMinutes"
                    class="px-3"  />
                  minute(s).
                </v-layout>
                <v-layout v-else row align-center>
                  <v-text-field label="Cron schedule" v-model="task.custom.cron" />
                </v-layout>
              </td>
              <td>
                <span v-if="newTask.Type == 'speedTest'" class="caption">
                  <v-icon color="warning" class="pr-1">warning</v-icon>
                  <span v-if="newTask.ScheduleName == 'advanced'">
                     When estimating your monthly usage, please note each test will use approximately <span class="body-2">{{ task.mbPerTest }} MB</span>.
                  </span>
                  <span v-else>
                    This configuration will use approximately <span class="body-2">{{ gbPerMonth }} GB</span> per month.
                  </span>
                </span>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            No tasks at this time.
          </template>
        </v-data-table> 
      </dd>

      <dt class="title pt-4">Tags</dt>
      <dd v-if="node.Tags && node.Tags.length" class="pl-5 pt-2">
        <v-layout align-center>
          <v-chip v-for="_tag in node.Tags" :key="_tag.ID">
            {{ _tag.Name }}
          </v-chip>
          <v-btn v-if="$user.Role == 'superAdmin'" :to="`${ node.ID }/tags`" color="secondary" icon small>
            <v-icon small>edit</v-icon>
          </v-btn>
        </v-layout>
      </dd>
      <dd v-else class="pl-5 pt-2">
        <v-layout align-center>
          –
          <v-btn v-if="$user.Role == 'superAdmin'" :to="`${ node.ID }/tags`" color="secondary" icon small>
            <v-icon small>library_add</v-icon>
          </v-btn>
        </v-layout>
      </dd>

      <dt class="title pt-4">Business hours</dt>
      <dd v-if="isBizHoursEditable" class="pl-5 pt-2">
        <v-layout row align-center>
          <v-dialog ref="dialog" v-model="bizHours.dialog" persistent width="290">
            <v-text-field
              slot="activator"
              label="Starting at"
              v-model="node.BusinessStartTime"
              prepend-icon="access_time"
              readonly />
            <v-time-picker v-model="node.BusinessStartTime" actions>
              <v-spacer />
              <v-btn flat color="primary" @click="$refs.dialog.save()">OK</v-btn>
            </v-time-picker>
          </v-dialog>
          
          <v-dialog ref="dialog" v-model="bizHours.dialog" persistent width="290">
            <v-text-field
              slot="activator"
              label="Ending at"
              v-model="node.BusinessCloseTime"
              prepend-icon="access_time"
              readonly />
            <v-time-picker v-model="node.BusinessCloseTime" actions>
              <v-spacer />
              <v-btn flat color="primary" @click="$refs.dialog.save()">OK</v-btn>
            </v-time-picker>
          </v-dialog>
          GMT
          <v-btn @click="isBizHoursEditable = false; updateNode()" color="secondary" icon small class="ml-3">
            <v-icon small>save</v-icon>
          </v-btn>
        </v-layout>
      </dd>
      <dd v-else class="pl-5 pt-2">
        <v-layout align-center>
          <span v-if="node.BusinessStartTime && node.BusinessCloseTime">
            {{ node.BusinessStartTime }} – {{ node.BusinessCloseTime }} GMT
          </span>
          <v-btn @click="isBizHoursEditable = true" color="secondary" icon small>
            <v-icon small>edit</v-icon>
          </v-btn>
        </v-layout>
      </dd>

      <dt class="title pt-4">First seen</dt>
      <dd v-if="node.FirstSeen" class="pl-5 pt-2">{{ node.FirstSeen | format }}</dd>
      <dd v-else class="pl-5 pt-2">–</dd>

      <dt class="title pt-4">Last seen</dt>
      <dd v-if="node.LastSeen" class="pl-5 pt-2">{{ node.LastSeen | format }}</dd>
      <dd v-else class="pl-5 pt-2">–</dd>

      <dt class="title pt-4">Uptime</dt>
      <dd v-if="node.Uptime" class="pl-5 pt-2">{{ node.Uptime | duration }}</dd>
      <dd v-else class="pl-5 pt-2">–</dd>

      <dt class="title pt-4">Events</dt>
      <dd class="pl-5 pt-2">
        <v-data-table :headers="event.headers" :items="event.associated" :pagination.sync="event.initialSort" 
                      :loading="event.loading" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.Name }}</td>
            <td><Truncate>{{ props.item.Description || '–' }}</Truncate></td>
            <td>{{ props.item.Date | format('MMM D, YYYY') }}</td>
            <td class="layout justify-center px-0">
              <v-btn :href="`#/nodes/${ node.ID }/events/${ props.item.ID }/edit`" flat icon title="Update this event" color="secondary">
                <v-icon small>edit</v-icon>
              </v-btn>
              <v-btn @click="removeEvent(props.item.ID)" icon>
                <v-icon color="error" small>delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="footer">
            <tr>
              <td colspan="3" />
              <td class="layout justify-center px-0">
                <v-btn :to="`${ node.ID }/events/new`" color="secondary" flat>
                  Add event
                </v-btn>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            No events at this time.
          </template>
        </v-data-table> 
      </dd>

      <dt class="title pt-4">Running version</dt>
      <dd class="pl-5 pt-2">{{ node.RunningVersion && node.RunningVersion.Number || '–' }}</dd>

      <dt class="title pt-4">Configured version</dt>
      <dd class="pl-5 pt-2">
        <v-layout align-center min-width>
          <v-select 
            :items="versions"
            :loading="! versions.length" 
            item-text="Number"
            item-value="ID"
            v-model="node.ConfiguredVersionID" />

          <v-btn @click="updateNode" color="secondary" icon small class="ml-3">
            <v-icon small>save</v-icon>
          </v-btn>
        </v-layout>
      </dd>

      <dt class="title pt-4">Configured by</dt>
      <dd class="pl-5 pt-2">{{ node.ConfiguredBy || '–' }}</dd>

      <dt class="title pt-4">Operating system</dt>
      <dd class="pl-5 pt-2"><PlatformLogo :uname="node.OS" :architecture="node.Arch" /></dd>

      <dt class="title pt-4">Architecture</dt>
      <dd class="pl-5 pt-2">{{ node.Arch }}</dd>
    </dl>
  </v-container>
</template>

<script>
import API from '@/shared/api';
import { format, duration } from '@/shared/filters';
import Truncate from '@/components/Truncate';
import PlatformLogo from '@/components/PlatformLogo';

export default {
  components: {
    Truncate,
    PlatformLogo
  },
  filters: {
    format,
    duration
  },
  data() {
    return {
      node: {},
      task: {
        headers: [
          {
            text: 'Type',
            value: 'Type',
            width: '20%'
          },
          {
            text: 'Frequency',
            sortable: false
          },
          {
            text: 'Server',
            sortable: false
          },
          {
            sortable: false
          }
        ],
        types: [
          {
            text: 'Ping',
            value: 'ping'
          },
          {
            text: 'Speed test',
            value: 'speedTest'
          },
          {
            text: 'Reboot',
            value: 'reboot'
          }
        ],
        frequencies: [
          {
            text: 'Daily',
            value: 'daily'
          },
          {
            text: 'Every X hour(s)',
            value: 'everyHours'
          },
          {
            text: 'Every X minutes(s)',
            value: 'everyMinutes'
          },
          {
            text: 'Advanced',
            value: 'advanced'
          }
        ],
        hours: Array.from(Array(12).keys()).map(num => String(num + 1)),
        minutes: Array.from(Array(30).keys()).map(num => String(num + 1)),
        custom: {
          everyHours: '12',
          everyMinutes: '15',
          startTime: '23:45',
          cron: '45 23 * * *',
          dialog: false
        },
        serversLoading: true,
        mbPerTest: 112
      },
      newTask: {
        Type: 'ping',
        ScheduleName: 'daily',
        NamedServerID: 0
      },
      isNicknameEditable: false,
      isNotesEditable: false,
      versions: [],
      servers: [],
      isBizHoursEditable: false,
      bizHours: {
        dialog: false
      },
      event: {
        headers: [
          {
            text: 'Name',
            value: 'Name'
          },
          {
            text: 'Description',
            value: 'Description'
          },
          {
            text: 'Date',
            value: 'Timestamp'
          },
          {
            sortable: false
          }
        ],
        initialSort: {
          sortBy: 'Timestamp',
          descending: true
        },
        associated: [],
        loading: true,
        new: {}
      }
    };
  },
  watch: {
    'task.custom.startTime': function(newValue) {
      const mm = newValue.split(':')[0];
      const HH = newValue.split(':')[1];

      this.task.custom.cron = `${mm} ${HH} * * *`;
    },
    'task.custom.everyHours': function(newValue) {
      this.task.custom.cron = `0 */${newValue} * * *`;
    },
    'task.custom.everyMinutes': function(newValue) {
      this.task.custom.cron = `*/${newValue} * * * *`;
    }
  },
  async mounted() {
    this.node = await API.get(`node/${this.$route.params.id}`);
    this.versions = await API.get('version');
    this.servers = await API.get(`namedserver?type=${this.newTask.Type}`);
    this.task.serversLoading = false;

    this.newTask.NamedServerID = (this.servers[0] && this.servers[0].ID) || -1;

    this.event.associated = await API.get(
      `reportingevent?node_id=${this.node.ID}`
    );
    this.event.loading = false;
  },
  methods: {
    updateNode: async function() {
      this.node = await API.put(`node/${this.node.ID}`, this.node);
    },
    taskTypeChanged: async function() {
      this.newTask.NamedServerID = 0;

      if (this.newTask.Type != 'reboot') {
        this.servers = [];
        this.task.serversLoading = true;
        this.servers = await API.get(`namedserver?type=${this.newTask.Type}`);
        this.newTask.NamedServerID =
          (this.servers[0] && this.servers[0].ID) || -1;

        this.task.serversLoading = false;
      }
    },
    updateCron: function() {
      switch (this.newTask.ScheduleName) {
        case 'everyHours':
          this.convertHoursToCron();
          break;
        case 'everyMinutes':
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
        Schedule: this.task.custom.cron,
        NamedServerID: this.newTask.NamedServerID
      });

      this.updateNode();
    },
    convertStartTimeToCron: function() {
      const mm = this.task.custom.startTime.split(':')[0];
      const HH = this.task.custom.startTime.split(':')[1];
      // daily at 2345 => 45 23 * * *
      this.task.custom.cron = `${mm} ${HH} * * *`;
    },
    convertHoursToCron: function() {
      // every 7 hours => 0 */7 * * *
      this.task.custom.cron = `0 */${this.task.custom.everyHours} * * *`;
    },
    convertMinutesToCron: function() {
      // every 2 minutes => */2 * * * *
      this.task.custom.cron = `*/${this.task.custom.everyMinutes} * * * *`;
    },
    removeTask: async function(id) {
      if (confirm('Are you sure?')) {
        // remove the requested task from existing tasks for the PUT of the entire node again...don't like this, would prefer to have endpoints for tasks...
        this.node.Tasks = this.node.Tasks.filter(task => task.ID != id);

        this.updateNode();
      }
    },
    removeEvent: async function(id) {
      if (confirm('Are you sure?')) {
        // remove the requested task from existing tasks for the PUT of the entire node again...don't like this, would prefer to have endpoints for tasks...
        await API.delete(`reportingevent/${id}`);

        this.event.loading = true;
        this.event.associated = await API.get(
          `reportingevent?node_id=${this.node.ID}`
        );
        this.event.loading = false;
      }
    }
  },
  computed: {
    mapUrl: vm =>
      `https://maps.googleapis.com/maps/api/staticmap?center=${
        vm.node.Coordinates
      }&zoom=10&size=640x200&sensor=false&markers=${vm.node.Coordinates}&key=${
        process.env.VUE_APP_GOOGLE_MAPS_API_KEY
      }`,
    gbPerMonth: vm => {
      const daysPerMonth = 30;
      var testsPerDay = 1;

      if (vm.newTask.ScheduleName == 'everyHours') {
        testsPerDay = 24 / vm.task.custom.everyHours;
      } else if (vm.newTask.ScheduleName == 'everyMinutes') {
        testsPerDay = (60 / vm.task.custom.everyMinutes) * 24;
      }

      const mbPerMonth = vm.task.mbPerTest * testsPerDay * daysPerMonth;

      return Number(mbPerMonth / 1000).toLocaleString();
    }
  }
};
</script>

<style scoped>
dd > .layout {
  max-width: 50%;
}
dd > .layout.min-width,
td > .layout.min-width {
  max-width: min-content;
}
.v-table tfoot tr[no-border-top] {
  border-top: initial;
}
td.no-wrap {
  white-space: nowrap;
}
</style>

