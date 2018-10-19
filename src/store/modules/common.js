
const common = {
  state: {
    comModObject: null,
  },
  mutations: {
    SET_COMMON_OBJECT: (state, comModObject) => {
      state.comModObject = comModObject
    },
  },
  actions: {
    setCommonObjct({ commit, state }) {
      commit('SET_COMMON_OBJECT', state.comModObject)
    },

  }
}

export default common
