/**
 * Library
 * * For convert json to form-urlencoded
 * ! this is required for OAuth authenticated >> 'Content-Type:application/x-www-form-urlencoded'
 */
import qs from 'qs'
/**
 * State
 * * For this state look like a global variables connect to anywhere
 */
export const state = () => ({
  /**
   * Credential
   * * Prepare credential for auth our system before get data
   * ! Set format that ready to convert to application/x-www-form-urlencoded
   */
  credential: {
    data: {
      username: process.env.AUTH_USER || 'mobileUser',
      password: process.env.AUTH_PASS || 'mB1975VTEC',
    },
  },
  // for generate unique id
  reqId: null,
  // for collect brand data to use with redeem info
  brandData: null,
  /**
   * Lang ID
   * * for collect language system id
   * TODO: In the future can be changed by user
   */
  langId: 2,
  //* unique id by user from line authen
  lineId: localStorage.getItem('id') || 'U250cb50dc308f4daf5420b5795243e57',
  //* unique id from line portal
  clientId: process.env.CLIENT_ID || 1660910515,
  //* unique secret from line portal
  clientSecret: process.env.CLIENT_SECRET || 'eeccb14c8f56544cf6af34ea88c853c0',
  /**
   * Redirect Url
   * * A URL-encoded string of the callback URL registered on the LINE Developers Console. You can add any query parameter.
   * ! If authen successfully line will be redirected automatically
   */
  redirectUri:
    process.env.REDIRECT_URI || 'https://dakasi-webloyalty.vtec-system.com',
  /**
   * Host
   * * get current host name to get property
   * ! (important) This host name have to equal in VTEC_Register
   */
  host:
    process.env.NODE_ENV === 'production'
      ? parent.location.hostname
      : '9751-8622-0057-9285',
  //* collect auth data from our system
  grantAccessData: null,
  //* collect profile data from Line Login including LineUUID
  lineProfileData: null,
  //* collect profile data from Line Login including LineUUID
  merchantInfoData: null,
  //* collect merchant data
  propertyData: null,
  //* collect verify(compare) lineId with member data in our system
  memberVerifyLine: null,
  //? never used it
  loyaltyData: null,
  /**
   * Mobile Param
   * * this object preparing to put to body any API
   * ! (important) Even lost it or some value change might be get return error from API
   */
  mobileParam: null,
})

export const getters = {
  getRequestData(state) {
    return state.reqId
  },
  getLineProfileData(state) {
    return state.lineProfileData
  },
  getPropertyData(state) {
    return state.propertyData
  },
  getLoyaltyData(state) {
    return state.loyaltyData
  },
  getMemberVerifyLine(state) {
    return state.memberVerifyLine
  },
}

export const mutations = {
  SET_REQUEST_ID(state, data) {
    state.reqId = data
  },
  SET_GRANT_ACCESS_DATA(state, data) {
    state.grantAccessData = data
  },
  SET_LINE_PROFILE_DATA(state, data) {
    state.lineProfileData = data
  },
  SET_LINE_ID(state, data) {
    state.lineId = data
  },
  SET_MERCHANT_INFO_DATA(state, data) {
    state.merchantInfoData = data
  },
  SET_BRAND_DATA(state, data) {
    state.brandData = data
  },
  SET_PROPERTY_DATA(state, data) {
    state.propertyData = data
  },
  SET_LOYALTY_DATA(state, data) {
    state.loyaltyData = data
  },
  SET_MEMBER_VERIFY_LINE(state, data) {
    state.memberVerifyLine = data
  },
  SET_MOBILE_PARAM_DATA(state, data) {
    state.mobileParam = data
  },
  /**
   * UPDATE_MOBILE_PARAM_DATA
   * * this mutation updating loyaltyMemberID and loyaltyMemberGroupID
   * ! (important) Even lost it or some value change might be get return error from API
   */
  UPDATE_MOBILE_PARAM_DATA(state, data) {
    state.mobileParam.loyaltyMemberID = data?.memberID
    state.mobileParam.loyaltyMemberGroupID = data?.memberGroupID
  },

  // generate and check uuid
  GET_UUID(state, data) {
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
    state.reqId = sessionStorage.getItem('rq')
    if (!state.reqId) state.reqId = uuid
    sessionStorage.setItem('rq', state.reqId)
  },
}

export const actions = {
  //* authenticate our system
  async auth({ commit, state }) {
    const { data } = await this.$auth.loginWith('local', state.credential)
    this.$auth.$storage.setLocalStorage('token', data.token)
    commit('SET_GRANT_ACCESS_DATA', data)
  },
  /**
   * getMerchantInfo
   * * get merchant info
   * @param payload that unique code from Line authen
   */
  async getMerchantInfo({ commit, state }, payload) {
    // check lineId if null go down to get token
    if (!state.lineId) {
      // if found payload take it to get token from Line
      if (payload) await this.dispatch('getLineToken', payload)
      // if line token exists going to get Line profile
      else {
        const payload = JSON.parse(sessionStorage.getItem('line-token'))
        await this.dispatch('getLineProfile', payload)
      }
    }

    // if never logged in or expired authen again
    if (!this.$auth.loggedIn) await this.dispatch('auth')

    const { data } = await this.$axios.get(
      `/api/merchantInfo/merchantInfo?reqid=${state.reqId}&weburl=${state.host}`
    )
    commit('SET_MERCHANT_INFO_DATA', data)
    commit('SET_BRAND_DATA', data.responseObj?.brandData[0])

    await this.dispatch('getPropertyData')
  },
  // get property data
  async getPropertyData({ commit, state }) {
    const { data } = await this.$axios.post(
      `/api/posmodule/propertydata?reqid=${state.reqId}`
    )
    commit('SET_PROPERTY_DATA', data)
    commit('SET_MOBILE_PARAM_DATA', data?.responseObj?.mobileParam)
    await this.dispatch('validateMemberWithLine')
  },
  // validate member with line
  async validateMemberWithLine({ commit }) {
    const { data } = await this.$axios.post(
      `/api/posmodule/member_line_validate?reqid=${this.state.reqId}&langid=${this.state.langId}&lineid=${this.state.lineId}`
    )
    commit('SET_MEMBER_VERIFY_LINE', data)
    commit('UPDATE_MOBILE_PARAM_DATA', data.loyaltyObj?.memberInfo)
  },

  // get line token
  async getLineToken({ commit, state }, payload) {
    const item = qs.stringify({
      grant_type: 'authorization_code',
      code: payload,
      client_id: state.clientId,
      redirect_uri: state.redirectUri,
      client_secret: state.clientSecret,
    })

    const { data } = await this.$lineApi.post(`/oauth2/v2.1/token`, item)
    sessionStorage.setItem('line-token', JSON.stringify(data))
    await this.dispatch('getLineProfile', data)
  },
  // get line token
  async getLineProfile({ commit }, payload) {
    const { data } = await this.$lineApi.get(`/v2/profile`, {
      headers: {
        Authorization: `${payload.token_type} ${payload.access_token}`,
      },
    })
    commit('SET_LINE_PROFILE_DATA', data)
    commit('SET_LINE_ID', data.userId)
    localStorage.setItem('id', data.userId)
  },
}
