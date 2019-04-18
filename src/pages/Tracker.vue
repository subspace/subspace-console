<template>
  <q-page class="flex" style="min-height: calc(100vh - 119px); max-height: calc(100vh - 119px)">
    <q-splitter
      v-model="splitterModel"
      class="full-width window-height"
      style="height: calc(100vh - 119px) !important"
    >
      <template v-slot:before>
        <table class="q-table q-table--horizontal-separator">
          <thead>
            <tr>
              <th class="text-left">Host</th>
              <th class="text-left">Pledge</th>
              <th class="text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(host, hostId) in trackerLht" v-bind:key="hostId" v-on:click="onHostClick(host)" class="host-row">
              <td>
                {{ hostId | shortHash }}
              </td>
              <td>
                {{ host.pledge }}
              </td>
              <td>
                {{ host.isGateway ? 'Gateway' : '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-slot:separator>
        <q-avatar color="white" text-color="blue" size="40px" icon="drag_indicator" ></q-avatar>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <MessageDetails :message="activeHost" class="details" />
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<style scoped lang="scss">
.host-row {
  cursor: pointer;
}
</style>

<script>
import Subspace from '@subspace/subspace/dist/subspace.browser.js'
import MessageDetails from 'components/MessageDetails.vue'
import { mapState } from 'vuex'
import store from '../store'
import '../filters'

export default {
  name: 'tracker',
  components: {
    MessageDetails,
  },

  computed: {
    ...mapState(['trackerLht']),
  },

  data() {
    return {
      activeHost: null,
      splitterModel: 35, // start at 50%
    }
  },

  methods: {
    onHostClick(host) {
      this.activeHost = host
    },
  },

  async mounted () {
  }
}
</script>
