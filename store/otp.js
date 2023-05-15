export const state = () => ({
  memberOTPData: null,
  memberValidateOTPData: null,
  memberVerifyData: null,
  mobileNumber: '',
})

export const getters = {
  getMemberOTPData(state) {
    return state.memberOTPData
  },
  getMemberValidateOTPData(state) {
    return state.memberValidateOTPData
  },
  getMemberVerifyData(state) {
    return state.memberVerifyData
  },
}

export const mutations = {
  SET_MEMBER_OTP_DATA(state, data) {
    state.memberOTPData = data
  },
  SET_MEMBER_VALIDATE_OTP_DATA(state, data) {
    state.memberValidateOTPData = data
  },
  SET_MEMBER_VERIFY_DATA(state, data) {
    state.memberVerifyData = data
  },
  SET_MOBILE_NUMBER(state, data) {
    state.mobileNumber = data
  },
}

export const actions = {
  async onLoad({ commit }) {
    if (!this.state.merchantInfoData) await this.dispatch('getMerchantInfo')
  },
  // generate validation code
  async genValidattionCode({ commit }, payload) {
    const { data } = await this.$axios.post(
      `/api/posmodule/sms_genvalidatecode?reqid=${
        this.state.reqId
      }&mobilenumber=${payload.mobileNumber.replaceAll('-', '')}&validatetype=2`
    )
    commit('SET_MEMBER_OTP_DATA', data)
    sessionStorage.setItem('otp', JSON.stringify(data.responseObj))
  },
  // validate code
  async validateCode({ commit }, payload) {
    const { data } = await this.$axios.post(
      `/api/posmodule/sms_validatecode?reqid=${this.state.reqId}&mobilenumber=${payload.mobileNumber}&validatetype=${payload.validateType}&smsheader=${payload.smsHeader}&smsnumber=${payload.smsNumber}`
    )
    commit('SET_MEMBER_VALIDATE_OTP_DATA', data)
    commit('SET_MOBILE_NUMBER', payload.mobileNumber)
  },
  // validate member register
  async validateMemberRegister({ commit, state }) {
    const { data } = await this.$axios.post(
      `/api/posmodule/member_register_validate?reqid=${this.state.reqId}&mobilenumber=${state.mobileNumber}`
    )
    commit('SET_MEMBER_VERIFY_DATA', data)
  },
}
