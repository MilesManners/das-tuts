import types from './mutationTypes'

const state = () => ({
  theme: null
})

const mutations = {
  [types.SET_THEME] (state, theme) {
    state.theme = theme
  }
}

const actions = {
  setTheme ({ commit }, token) {
    commit(types.SET_THEME, token)
  }
}

export default {
  state,
  mutations,
  actions
}
