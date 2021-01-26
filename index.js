let Vue

class Store {
  constructor(options) {
    this.initState(options.state)
    this.initGetters(options.getters)
    this.initMutations(options.mutations)
    this.initActions(options.actions)
  }
  get state() {
    return this.vm.state
  }
  initState(state = {}) {
    this.vm = new Vue({
      data: {
        state
      }
    })
  }
  initGetters(getters = {}) {
    this.getters = {}
    for (const key in getters) {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](this.state)
      })
    }
  }
  initMutations(mutations = {}) {
    this.mutations = {}
    for (const key in mutations) {
      this.mutations[key] = (payload) => {
        mutations[key](this.state, payload)
      }
    }
  }
  initActions(actions = {}) {
    this.actions = {}
    for (const key in actions) {
      this.actions[key] = (payload) => {
        actions[key](this, payload)
      }
    }
  }
  dispatch(method, payload) {
    this.actions[method](payload)
  }
  // this永远指向store
  commit = (method, payload) => {
    this.mutations[method](payload)
  }
}

// ...mapState([
//   // map this.count to store.state.count
//   'count'
// ])
function mapState(state) {
  let obj = {}
  Object.keys(state).forEach((key) => {
    let _key = Array.isArray(state) ? state[key] : key
    let _val = state[key]
    obj[_key] = () => this.state[_val]
  })
  return obj
}

// mix the getters into computed with object spread operator
// ...mapGetters([
//   'doneTodosCount',
//   'anotherGetter',
//   // ...
// ])
// ...mapGetters({
//   // map `this.doneCount` to `this.$store.getters.doneTodosCount`
//   doneCount: 'doneTodosCount'
// })
function mapGetters(getter) {
  let obj = {}
  Object.keys(getter).forEach((key) => {
    let _key = Array.isArray(getter) ? getter[key] : key
    let _val = getter[key]
    obj[_key] = () => this.getters[_val]
  })
  return obj
}

// ...mapMutations([
//   'increment', // map `this.increment()` to `this.$store.commit('increment')`

//   // `mapMutations` also supports payloads:
//   'incrementBy' // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
// ]),
// ...mapMutations({
//   add: 'increment' // map `this.add()` to `this.$store.commit('increment')`
// })
function mapMutations(mutation) {
  let obj = {}
  Object.keys(mutation).forEach((key) => {
    let _key = Array.isArray(mutation) ? mutation[key] : key
    let _val = mutation[key]
    obj[_key] = () => this.mutations[_val]
  })
  return obj
}

// ...mapActions([
//   'increment', // map `this.increment()` to `this.$store.dispatch('increment')`

//   // `mapActions` also supports payloads:
//   'incrementBy' // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
// ]),
// ...mapActions({
//   add: 'increment' // map `this.add()` to `this.$store.dispatch('increment')`
// })
function mapActions(action) {
  let obj = {}
  Object.keys(action).forEach((key) => {
    let _key = Array.isArray(action) ? action[key] : key
    let _val = action[key]
    obj[_key] = () => this.actions[_val]
  })
  return obj
}

function install(vue) {
  Vue = vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

export default {
  install,
  Store,
  mapState,
  mapGetters,
  mapMutations,
  mapActions
}
