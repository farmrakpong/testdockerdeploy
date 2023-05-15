export const state = () => ({
  memberHisoryData: null,
  clientId: process.env.CLIENT_ID || 1660964800,
  clientSecret: process.env.CLIENT_SECRET || 'eeccb14c8f56544cf6af34ea88c853c0',
})

export const getters = {
  getLoyaltyData(state) {
    return state.memberHisoryData
  },
}

export const mutations = {
  SET_MEMBER_HISTORY_DATA(state, data) {
    state.memberHisoryData = data
  },
}

export const actions = {
  async lineAuth({ commit, state }, payload) {
    const {data} = await this.$axios.get(
      `/auth/oauth2/v2.1/authorize?response_type=code&client_id=${state.clientId}&redirect_uri=https%3A%2F%2F8ff1-183-89-251-66.ngrok-free.app&state=${payload}&scope=profile%20openid`
    )
  },
}
