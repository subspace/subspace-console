import Vue from 'vue'

Vue.filter('shortHash', (value, len) => {
  if (!len) {
    len = 8
  }

  if (!value) {
    value = ''
  }

  return value.substring(0, len)
})

Vue.filter('formatTime', (value) => {
  return [
    new Date(value).getHours().toString().padStart(2, '0'),
    new Date(value).getMinutes().toString().padStart(2, '0'),
    new Date(value).getSeconds().toString().padStart(2, '0'),
  ].join(':')
})