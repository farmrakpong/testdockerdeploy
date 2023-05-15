export const state = () => ({
  memberRegisterData: null,
  isNewMember: false,
})

export const getters = {
  getMemberData(state) {
    return state.memberRegisterData
  },
}

export const mutations = {
  SET_MEMBER_REGISTER_DATA(state, data) {
    state.memberRegisterData = data
  },
  SET_MEMBER_STATE(state, data) {
    state.isNewMember = data
  },
}

export const actions = {
  // member registration
  async registerMember({ commit, state }, payload) {
    const { data } = await this.$axios.post(
      `/api/posmodule/member_register?reqid=${this.state.reqId}&langid=${this.state.langId}&vieworderinfo=false&isnewmember=${state.isNewMember}`,
      payload
    )
    commit('SET_MEMBER_REGISTER_DATA', data)
  },
}
