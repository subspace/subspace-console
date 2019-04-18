<template>
  <div :class="componentClass">
    <div v-if="message.type === 'error'">
      <span class="time">[{{ message.timestamp | formatTime }}]</span>
      ERROR: {{ message }}
    </div>
    <div v-if="message.type === 'peer-connection'">
      <span class="time">[{{ message.timestamp | formatTime }}]</span>
      PEER-CONNECTION: {{ message }}
    </div>
    <div v-else>
      <span class="time">[{{ message.timestamp | formatTime }}]</span>
      <span class="message-sender" :style="senderStyle">
        {{ message.sender ? message.sender : '-' | shortHash }}
      </span>
      {{ message.verb }}
      a
      <span v-on:click="$emit('messageDetails')" class="message-type">
        {{ message.type }}
        <span v-if="message.type === 'block'">({{ message.data.data._key | shortHash }})</span>
        <span v-else-if="message.type === 'applied-block'">{{ message.data[0]._key | shortHash }}</span>
      </span>

      {{ message.class }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  display: flex;
  flex: row;

  .time {
    color: #999;
  }

  &.is-sender {
    .message-sender {
      font-style: italic;
      color: #090;
    }
  }

  .message-type {
    color: #009;
    cursor: pointer;
    text-decoration: underline;
  }

  &.active {
    background-color: #ddd;
  }

  &:hover {
    background-color: #ddd;
  }
}
</style>

<script>
import { mapState } from 'vuex'
import store from '../store'
import '../filters'

export default {
  name: 'Message',
  props: {
    message: Object,
  },

  computed: {
    ...mapState(['nodeId', 'peerIds']),

    componentClass() {
      const classes = [ 'message' ]

      if (this.message.sender === this.nodeId) {
        classes.push('is-sender')
      }

      return classes
    },

    senderStyle() {
      const colors = [ '#099', '#909', '#900', '#990' ]
      const color = this.message.sender === this.nodeId ?
        '#090' :
        colors[this.peerIds.indexOf(this.message.sender) % colors.length]

      return `color: ${color}`
    },
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>
