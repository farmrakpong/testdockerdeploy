export const state = () => ({
  memberQRData: null,
  deviceCode: '1e0a9c2842a49077',
})

export const getters = {
  getLoyaltyData(state) {
    return state.memberQRData
  },
}

export const mutations = {
  SET_MEMBER_QR_DATA(state, data) {
    state.memberQRData = data
  },
}

export const actions = {
  // validate member with line
  async generateMemberQR({ commit, state }) {
    const { data } = await this.$axios.post(
      `/api/posmodule/member_qrcode?reqid=${this.state.reqId}&memberId=${this.state.home.memberId}&devicecode=${state.deviceCode}`
    )
    commit('SET_MEMBER_QR_DATA', data)
  },
}
