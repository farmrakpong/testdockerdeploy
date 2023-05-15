export const state = () => ({
  memberHisoryData: null,
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
  // validate member with line
  async getMemberHistory({ commit }) {
    if (!this.state.merchantInfoData) await this.dispatch('getMerchantInfo')
    if (!this.state.home.loyaltyData) await this.dispatch('home/getMemberData')

    const { data } = await this.$axios.post(
      `/api/posmodule/loyalty_memberhistory?reqid=${this.state.reqId}&langid=${this.state.langId}`,
      this.state.mobileParam
    )
    commit('SET_MEMBER_HISTORY_DATA', data)
  },
}
