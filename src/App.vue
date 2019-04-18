<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import store from './store'
import { mapState } from 'vuex'

export default {
  name: 'App',

  data() {
    return {
      config: {
        blockTime: 10000,
        hostname: 'localhost',
        plotSizeBytes: 100000000000, // TODO: this is bytes, correct?
        tcpPort: 8126,
        wsPort: 8226,
      },
    }
  },

  computed: {
    ...mapState(['subspace']),
  },

  async mounted () {
    console.log('Connecting to Subspace...')
    await this.$store.dispatch('connectSubspace')

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

<style>
</style>
