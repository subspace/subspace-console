<template>
  <pre v-if="message" class="details" v-html="syntaxHighlight(jsonParseDeep(message))"></pre>
</template>

<style lang="scss" scoped>
.details {
  // padding: 10px;
  // height: 100vh;
  margin: 0;
  // max-height: 100vh;
  // overflow-y: auto;
  // border-left: 1px solid #ccc;

  /deep/ {
    .string { color: green; }
    .number { color: darkorange; }
    .boolean { color: blue; }
    .null { color: magenta; }
    .key { color: red; }
  }
}
</style>

<script>
import { mapState } from 'vuex'
import store from '../store'

export default {
  name: 'MessageDetails',
  props: {
    message: Object,
  },

  computed: {
    ...mapState(['nodeId']),
  },

  data () {
    return {
    }
  },

  filters: {
  },

  methods: {
    jsonParseDeep(o) {
      Object.keys(o).forEach(key => {
        if (o[key] !== null && typeof(o[key]) === "object") {
          o[key] = this.jsonParseDeep(o[key])
        }

        try {
          const obj = JSON.parse(o[key])
          o[key] = this.jsonParseDeep(obj)
        } catch (e) {
          o[key] = o[key]
        }
      })

      return o
    },

    formatKey(str, depth) {
      const indent = 4
      return `<span class='key'>${str.padStart(str.length + depth * indent, ' ')}</span>`
    },

    formatVal(val, depth) {
      if (typeof val === 'string') {
        // If it's a multi-line string, like a PGP key
        if (val.match(/\r\n/)) {
          val = '\n' + val.split(/\r\n/).map(row => row.padStart(row.length + (depth - 1) * 4)).join('\r\n')
        }
        return `<span class='string'>"${val}"</span>`
      } else if (typeof val === 'number') {
        return `<span class='number'>${val}</span>`
      } else if (typeof val === 'boolean') {
        return `<span class='boolean'>${val}</span>`
      } else if (val === null) {
        return `<span class='null'>${val}</span>`
      } else {
        return `<span>${val}</span>`
      }
    },

    syntaxHighlight(o, depth) {
      if (typeof depth === 'undefined') {
        depth = 1
      }

      const indent = 4

      let str = ''
      if (Array.isArray(o)) {
        str += '[\n'
        o.forEach(el => {
          const val = this.syntaxHighlight(el, depth + 1)
          str += `${val.padStart(val.length + (depth - 1) * indent + 2)},\n`
        })
        str += ']'.padStart((depth - 1) * indent + 1, ' ')
      } else if (typeof o === 'object' && o !== null) {
        str += '{\n'
        Object.keys(o).forEach(key => {
          str += this.formatKey(`"${key}": `, depth)
          str += `${this.syntaxHighlight(o[key], depth + 1)},\n`
        })
        str += '}'.padStart((depth - 1) * indent + 1, ' ')
      } else {
        str += this.formatVal(o, depth + 1)
      }

      return str
    },
  }
}
</script>
