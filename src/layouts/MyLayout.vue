<template>
  <q-layout view="HHH Lpr LFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-avatar>
          <img alt="Quasar logo" src="~assets/logo.png">
        </q-avatar>

        <q-toolbar-title class="text-center">
          Subspace Console
        </q-toolbar-title>

        <div title="Node ID">{{ nodeId | shortHash }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-drawer
        v-model="leftDrawerOpen"
        bordered
        content-class="bg-grey-3"
        :width="100"
      >
        <q-list>
          <q-item clickable tag="a" to="/" class="column flex-center" exact>
            <q-icon name="home" size="56px" />
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/wallet" class="column flex-center" exact>
            <q-icon name="account_balance_wallet" size="56px" />
            <q-item-section>
              <q-item-label>Wallet</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/feed" class="column flex-center">
            <q-icon name="rss_feed" size="56px" />
            <q-item-section>
              <q-item-label>Feed</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/settings" class="column flex-center">
            <q-icon name="settings" size="56px" />
            <q-item-section>
              <q-item-label>Settings</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <q-tabs
        v-model="tab"
        align="left"
        inline-label
        class="bg-grey-3 full-width align-left"
      >
        <q-route-tab name="logs" icon="list" label="Logs" to="/"></q-route-tab>
        <q-route-tab name="peers" icon="linear_scale" label="Peers" to="/peers"></q-route-tab>
        <q-route-tab name="tracker" icon="linear_scale" label="Tracker" to="/tracker"></q-route-tab>
      </q-tabs>

      <keep-alive include="messages">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import store from '../store'
import { mapState } from 'vuex'
import '../filters'

export default {
  name: 'MyLayout',
  computed: {
    ...mapState(['nodeId']),
  },

  data () {
    return {
      leftDrawerOpen: true,
      tab: 'logs',
    }
  },
  methods: {
    openURL
  }
}
</script>

<style lang="scss" scoped>
.q-header {
  padding: 0.5em;
}

.q-item {
  .q-item__label {
    visibility: hidden;
  }

  &:hover {
    .q-item__label {
      visibility: visible;
    }
  }
}
</style>
