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
              <th class="text-left">Peer</th>
              <th class="text-left">Status</th>
              <th class="text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(peer, peerId) in peers" v-bind:key="peerId" v-on:click="onPeerClick(peer)" class="peer-row">
              <td>
                {{ peerId | shortHash }}
              </td>
              <td>
                {{ peer.status }}
              </td>
              <td>
                {{ peer.type }}
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
          <MessageDetails :message="activePeer" class="details" />
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<style scoped lang="scss">
.peer-row {
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
  name: 'peers',
  components: {
    MessageDetails,
  },

  computed: {
    ...mapState(['peers']),
  },

  data () {
    return {
      activePeer: null,
      splitterModel: 35, // start at 50%
    }
  },

  methods: {
    onPeerClick(peer) {
      this.activePeer = peer
    }
  },

  async mounted () {
  }
}
</script>
