export const state = () => ({
  redeemInfoData: null,
  redeemCouponData: null,
})

export const getters = {
  getRedeemInfoData(state) {
    return state.redeemInfoData
  },
  getRedeemCouponData(state) {
    return state.redeemCouponData
  },
}

export const mutations = {
  SET_REDEEM_INFO_DATA(state, data) {
    state.redeemInfoData = data
  },
  SET_REDEEM_COUPON_DATA(state, data) {
    state.redeemCouponData = data
  },
}

export const actions = {
  // get redeem info
  async getRedeemInfoData({ commit }) {
    if (!this.state.merchantInfoData) await this.dispatch('getMerchantInfo')
    if (!this.state.home.loyaltyData) await this.dispatch('home/getMemberData')

    const { data } = await this.$axios.post(
      `/api/posmodule/loyalty_redeeminfo?reqid=${this.state.reqId}&brandcode=${this.state.brandData?.brandCode}`,
      this.state.mobileParam
    )
    commit('SET_REDEEM_INFO_DATA', data)
  },
  // redeem privilege
  async redeemPrivilege({ commit }, payload) {
    const { data } = await this.$axios.post(
      `/api/posmodule/loyalty_redeemcoupon?reqid=${this.state.reqId}&brandid=${this.state.brandData?.brandID}&redeemid=${payload.redeemID}&langid=${this.state.langId}`,
      this.state.mobileParam
    )
    commit('SET_REDEEM_COUPON_DATA', data)
    if (data.responseObj)
      this.commit('home/SET_LOYALTY_DATA', { loyaltyObj: data.responseObj })
  },
}
