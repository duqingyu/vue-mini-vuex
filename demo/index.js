import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    a: 1,
    b: 2
  },
  getters: {
    getA: (state) => state.a,
    getB: (state) => state.b
  },
  mutations: {
    setA(state, payload) {
      state.a = payload
    },
    setB(state, payload) {
      state.b = payload
    }
  },
  actions: {
    setAB({ commit, dispath, state, getters }, payload) {
      commit('setA')
      commit('setB')
    }
  }
})

// --main.js--
// new Vue({
//   store
// })
