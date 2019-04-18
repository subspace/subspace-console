
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/settings', component: () => import('pages/Settings.vue') },
      { path: '/feed', component: () => import('pages/Feed.vue') },
      { path: '/peers', component: () => import('pages/Peers.vue') },
      { path: '/tracker', component: () => import('pages/Tracker.vue') },
      { path: '/wallet', component: () => import('pages/Wallet.vue') },
    ],
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
