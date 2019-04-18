<template>
  <q-page class="flex" style="min-height: calc(100vh - 119px); max-height: calc(100vh - 119px)">
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
import Message from 'components/Message.vue'
import MessageDetails from 'components/MessageDetails.vue'
import { mapState } from 'vuex'
import '../filters'

export default {
  name: 'messages',
  components: {
    Message,
    MessageDetails,
  },

  computed: {
    ...mapState(['messages', 'nodeId']),
  },

  data () {
    return {
      activeMessage: null,
      splitterModel: 35, // start at 50%
    }
  },

  methods: {
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

      // allow 20px inaccuracy
      const messagesEl = this.$refs.messages.parentElement
      const isScrolledToBottom = messagesEl && messagesEl.scrollHeight - messagesEl.clientHeight <= messagesEl.scrollTop + 40

      // this.messages.push(message)

      if (isScrolledToBottom) {
        messagesEl.scrollTop = messagesEl.scrollHeight + 100
      }
    },

    onMessageDetails(message) {
      this.activeMessage = message
    },
  },

  async mounted () {
  },

  watch: {
    messages (value) {
      // console.log('new message:', value[value.length - 1].type, value[value.length - 1])
    }
  }
}
</script>
