import Vue from 'vue'
import Vuex from 'vuex'
import Subspace from '@subspace/subspace/dist/subspace.browser.js'
import ProxyMap from '../lib/proxy-map'

Vue.use(Vuex)

const CONFIG = {
  genesisAddress: '772441c914c75d64a3a7af3b2fd9c367ce6fe5c00450a43efe557c544e479de6:127.0.0.1:8125:8225',
}

const array2hex = (array) => {
  let string, i$, len$, byte
  string = ''
  for (i$ = 0, len$ = array.length; i$ < len$; ++i$) {
    byte = array[i$]
    string += byte.toString(16).padStart(2, '0')
  }
  return string
}

const store = new Vuex.Store({
  state() {
    return {
      activeMessage: null,
      messages: [],
      nodeId: null,
      peers: {},
      peerIds: [],
      subspace: null,
      trackerLht: {},
    }
  },

  getters: {
  },

  mutations: {
    addMessage(state, message) {
      state.messages.push(message)
    },

    addPeerId(state, peerId) {
      if (state.peerIds.indexOf(peerId) === -1) {
        state.peerIds.push(peerId)
      }
    },

    setPeers(state, peers) {
      state.peers = peers
    },

    setActiveMessage(state, message) {
      state.activeMessage = message
    },

    setNodeId(state, nodeId) {
      state.nodeId = nodeId
    },

    setSubspace(state, subspace) {
      state.subspace = subspace
    },

    setTrackerLht(state, trackerLht) {
      state.trackerLht = trackerLht
    },
  },

  actions: {
    async connectSubspace({ commit }) {
      commit('setSubspace', new Subspace(false, [CONFIG.genesisAddress], 1))
      await this.state.subspace.init('browser', false)
      commit('setNodeId', this.state.subspace.wallet.getProfile().id)

      // Make subspace object global for easier debugging
      window.subspace = this.state.subspace

      const messageTypes = [
        'message',
        'sent',
      ]

      messageTypes.forEach(messageType => {
        this.state.subspace.on(messageType, (sender, type, message) => {
          if (type === 'join') {
            // TODO
          } else if (type === 'peer-added') {
            const decoder = new TextDecoder('utf-8')
            message.publicKey = decoder.decode(message.publicKey)
            message.signature = decoder.decode(message.signature)
            message.payload = array2hex(message.payload)

            const peers = Array.from(this.state.subspace.network.connections).reduce((peers, [key, value]) => (
              Object.assign(peers, { [array2hex(key)]: value })
            ), {})

            for(const peerId of Object.keys(peers)) {
              peers[peerId].nodeId = array2hex(peers[peerId].nodeId)
              peers[peerId].peers = peers[peerId].peers.map(pid => array2hex(pid))
              delete peers[peerId].sendRequest
              delete peers[peerId].sendResponse
              delete peers[peerId].destroy
            }

            this.commit('setPeers', peers)
          } else if (type === 'peer-removed') {
            // TODO
          } else if (type === 'tracker-response') {
            // const tracker = this.state.subspace.tracker
          }

          this.commit('addMessage', {
            type: type,
            sender: sender,
            timestamp: message.timestamp,
            verb: message.sender === this.state.nodeId ? 'received' : 'sent',
            class: 'message',
            data: message,
          })

          this.commit('addPeerId', sender)
        })
      })

      const eventTypes = [
        'joined',
        'block',
        'applied-block',
        'joined-hosts',
        'host-added',
        'neighbor-added',
        'shard-request',
        'shard-reply',
        'space-reserved',
        'tracker-request',
        'tracker-response',
      ]
      subspace.on('joined', () => {
        // ...
      })
      eventTypes.forEach(eventType => {
        this.state.subspace.on(eventType, (...args) => {
          console.log(`${eventType}: ${JSON.stringify(args)}`)
          this.commit('addMessage', {
            type: eventType,
            sender: this.state.nodeId,
            timestamp: Date.now(),
            verb: 'emitted',
            class: 'event',
            data: args,
          })
        })
      })

      // Monitor Tracker LHT for updates
      this.state.subspace.tracker = ProxyMap(this.state.subspace.tracker, 'lht', () => {
        const hosts = Array.from(this.state.subspace.tracker.lht).reduce(
          (hosts, [key, value]) => Object.assign(hosts, {[key]: value})
        , {})
        commit('setTrackerLht', hosts)
      })
    },
  }
})

export default store
