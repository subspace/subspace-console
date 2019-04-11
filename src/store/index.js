import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state() {
    return {
      activeMessage: null,
      nodeId: null,
      peers: [],
    }
  },

  getters: {

  },

  mutations: {
    addPeer(state, peer) {
      if (!state.peers.includes(peer)) {
        state.peers.push(peer)
      }
    },

    setActiveMessage(state, message) {
      state.activeMessage = message
    },

    setNodeId(state, nodeId) {
      state.nodeId = nodeId
    },
  },

  actions: {

  }
})

export default store
