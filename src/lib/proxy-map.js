// ProxyMap monitors Map objects for two things:
//
// 1. Assignment of the map itself
// 2. Calls to the map's `set` method
//
// The below implementation assumes that the map is available as a property on
// some other object (e.g. `lht` on `subspace.tracker`)
//
// Args:
//
// * mapContext: an object containing a map
// * mapProp: the prop on which the map is stored
// * callback: a callback to run when an assignment to map is made
//
const ProxyMap = (mapContext, mapProp, callback) => {
  mapContext[mapProp] = new Proxy(mapContext[mapProp], {
    // Monitor the map's `set` method
    get(target, prop) {
      let value = Reflect.get(target, prop)

      // Proxies make it easy to intercept gets and sets, but method calls
      // are actually two calls in one: (1) a `get` to retrieve the
      // function, and (2) an `apply` to execute the function. To intercept a
      // method call, we intercept the get, and return the function to be
      // applied.
      if (typeof value === 'function') {
        return (...args) => {
          const res = value.apply(target, args)

          if (prop === 'set') {
            callback()
          }
          return res
        }
      }

      return value
    }
  })

  return new Proxy(mapContext, {
    // Monitor the `mapContext` for assignment to the map object
    set(target, prop, value, receiver) {
      console.log(`set ${prop.toString()} to ${JSON.stringify(value)}`)
      Reflect.set(target, prop, value, receiver)
      if (prop === mapProp) {
        callback(value)
      }
      return true
    }
  })
}

export default ProxyMap
