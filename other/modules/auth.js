import { auth as types } from './mutationTypes'

const state = () => ({
  token: null,
  user: null,
  isUserLoggedIn: false,
  authorizing: true
})

const mutations = {
  [types.SET_TOKEN] (state, token) {
    state.token = token
    if (token) {
      state.isUserLoggedIn = true
    } else {
      state.isUserLoggedIn = false
    }
  },
  [types.SET_USER] (state, user) {
    state.user = user
  },
  [types.SET_AUTHORIZING] (state, authorizing) {
    state.authorizing = authorizing
  }
}

const actions = {
  setToken ({ commit }, token) {
    commit(types.SET_TOKEN, token)
  },
  setUser ({ commit }, user) {
    commit(types.SET_USER, user)
  },
  setAuthorizing ({ commit }, authorizing) {
    commit(types.SET_AUTHORIZING, authorizing)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
