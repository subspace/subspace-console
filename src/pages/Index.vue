<template>
  <q-page class="flex" style="min-height: calc(100vh - 119px); max-height: calc(100vh - 119px)">
    <q-tabs
      v-model="tab"
      align="left"
      inline-label
      class="bg-grey-3 full-width align-left"
    >
      <q-route-tab name="logs" icon="list" label="Logs" to="/"></q-route-tab>
      <q-route-tab name="settings" icon="settings" label="Settings" to="/settings"></q-route-tab>
    </q-tabs>

    <q-splitter
      v-model="splitterModel"
      class="full-width window-height"
      style="height: calc(100vh - 119px) !important"
    >
      <template v-slot:before>
        <div ref="messages" class="q-pa-md">
          <Message
            v-for="(message, index) in messages"
            :class="['message', message === activeMessage ? 'active' :  null ]"
            :message="message"
            v-on:messageDetails="onMessageDetails(message)"
            v-bind:key="index" />
        </div>
      </template>

      <template v-slot:separator>
        <q-avatar color="white" text-color="blue" size="40px" icon="drag_indicator" ></q-avatar>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <MessageDetails :message="activeMessage" class="details" />
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<style scoped lang="scss">
.messages {
  // width: 35%;
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  padding: 10px;

  background-color: #eee;
  font-family: monospace;
}

.details {
  // width: 65%;
}
</style>

<script>
import Subspace from '@subspace/subspace/dist/subspace.browser.js'
import Message from 'components/Message.vue'
import MessageDetails from 'components/MessageDetails.vue'
import { mapState } from 'vuex'
import store from '../store'
import '../filters'

export default {
  name: 'messages',
  components: {
    Message,
    MessageDetails,
  },

  computed: {
    ...mapState(['nodeId']),
  },

  data () {
    return {
      activeMessage: null,
      config: {
        blockTime: 10000,
        genesisAddress: '772441c914c75d64a3a7af3b2fd9c367ce6fe5c00450a43efe557c544e479de6:127.0.0.1:8125:8225',
        hostname: 'localhost',
        plotSizeBytes: 100000000000, // TODO: this is bytes, correct?
        tcpPort: 8126,
        wsPort: 8226,
      },
      messages: [],
      splitterModel: 35, // start at 50%
      subspace: null,
      tab: 'logs'
    }
  },

  methods: {
    array2hex(array) {
      let string, i$, len$, byte
      string = ''
      for (i$ = 0, len$ = array.length; i$ < len$; ++i$) {
        byte = array[i$]
        string += byte.toString(16).padStart(2, '0')
      }
      return string
    },

    log(message) {
      if (message.type === 'error') {
        // Add toast...
      } else if (message.type === 'peer-connection') {
        // Add toast...
      } else if (message.type === 'applied-block') {
        if (message.sender === this.nodeId) {
          this.$q.notify({
            color: 'green',
            textColor: null,
            icon: null,
            message: `Block ${message.data[0]._key.substring(0,8)} accepted`,
            position: 'top',
            avatar: null,
            multiLine: false,
            actions: [
              { label: 'View', color: 'white', handler: () => this.activeMessage = message },
              { label: 'Dismiss', color: 'white' },
            ],
            timeout: 5000,
          })
        }
      }

      if (message.type === 'join') {
        // TODO - when does this event occur?
      } else if (message.type === 'peer-added') {
        const decoder = new TextDecoder('utf-8')
        message.data.publicKey = decoder.decode(message.data.publicKey)
        message.data.signature = decoder.decode(message.data.signature)
        message.data.payload = this.array2hex(message.data.payload)
      } else if (message.type === 'peer-removed') {
        // TODO - when does this event occur?
      }

      // allow 20px inaccuracy
      const messagesEl = this.$refs.messages.parentElement
      const isScrolledToBottom = messagesEl && messagesEl.scrollHeight - messagesEl.clientHeight <= messagesEl.scrollTop + 40

      console.log('BEFORE: isScrolledToBottom=',isScrolledToBottom,',messagesEl.scrollTop=',messagesEl.scrollTop,'messagesEl.scrollHeight=',messagesEl.scrollHeight)
      this.messages.push(message)

      console.log('AFTER: isScrolledToBottom=',isScrolledToBottom,',messagesEl.scrollTop=',messagesEl.scrollTop,'messagesEl.scrollHeight=',messagesEl.scrollHeight)
      if (isScrolledToBottom) {
        messagesEl.scrollTop = messagesEl.scrollHeight + 100
      }
    },

    onMessageDetails(message) {
      this.activeMessage = message
    },
  },

  async mounted () {
    this.subspace = new Subspace(false, [this.config.genesisAddress], 1)
    await this.subspace.init('browser', false)
    window.subspace = this.subspace
    this.$store.commit('setNodeId', this.subspace.wallet.getProfile().id)

    this.subspace.on('connection', connection => {
      alert('new connection')
      this.log({
        type: 'connection',
        sender: sender,
        timestamp: message.timestamp,
        verb: message.sender,
        class: 'message',
        data: message,
      })
    })

    // this.subspace.on('disconnection', nodeId => this.messages.push(`Lost connection to ${nodeId}`))
    // this.subspace.on('joined', () => this.log(`Joined the network with id ${this.nodeId.substring(0,8)}`))
    const messageTypes = [
      'message',
      'sent',
    ]

    messageTypes.forEach(messageType => {
      this.subspace.on(messageType, (sender, type, message) => {
        this.$store.commit('addPeer', sender)
        let binaryType = null

        this.log({
          type: type,
          sender: sender,
          timestamp: message.timestamp,
          verb: message.sender === this.nodeId ? 'received' : 'sent',
          class: 'message',
          data: message,
        })
      })
    })

    const eventTypes = [
      'joined',
      'block',
      'applied-block',
      'joined-hosts',
      'host-added',
      'neighbor-added',
      'space-reserved',
    ]
    eventTypes.forEach(eventType => {
      this.subspace.on(eventType, (...args) => {
        console.log(`${eventType}: ${JSON.stringify(args)}`)
        this.log({
          type: eventType,
          sender: this.nodeId,
          timestamp: Date.now(),
          verb: 'emitted',
          class: 'event',
          data: args,
        })
      })
    })

    // console.log(`Seeding ${this.config.plotSizeBytes} byte plot...`)
    // await this.subspace.seedPlot(this.config.plotSizeBytes)

    console.log('Joining network...')
    await this.subspace.join(0, this.config.hostname)

    // console.log('Starting farmer...')
    // await this.subspace.startFarmer(this.config.blockTime)

    // console.log('Pledging space...')
    // await this.subspace.pledgeSpace()
  }

}
</script>
