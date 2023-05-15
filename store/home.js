export const state = () => ({
  memberId: 0,
  mobileNumber: '',
  loyaltyData: null,
})

export const getters = {}

export const mutations = {
  SET_MEMEBER_ID(state, data) {
    state.memberId = data
  },
  SET_MOBILE_NUMBER(state, data) {
    state.mobileNumber = data
  },
  SET_LOYALTY_DATA(state, data) {
    state.loyaltyData = data
  },
}

export const actions = {
  // validate member with line
  async getMemberData({ commit }) {
    if (!this.state.merchantInfoData) await this.dispatch('getMerchantInfo')
    
    const { data } = await this.$axios.post(
      `/api/posmodule/member_data?reqid=${this.state.reqId}&langid=${this.state.langId}`,
      this.state.mobileParam
    )
    commit('SET_LOYALTY_DATA', data)
    commit('SET_MEMEBER_ID', data.loyaltyObj?.memberInfo?.memberID)
    commit('SET_MOBILE_NUMBER', data.loyaltyObj?.memberInfo?.mobileNumber)
  },
}
