export default function ({ $axios, store, redirect, error: nuxtError }, inject) {
  const lineApi = $axios.create()

  lineApi.setBaseURL('https://api.line.me')

  $axios.onRequest((config) => {
    const token = store.$auth.$storage.getLocalStorage('token')
    $axios.setToken(token, 'Bearer')
  })
  $axios.onResponseError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      store.dispatch('auth').finally(() => {
        parent.location.reload()
      })
    }
    else return Promise.reject(error)
  })
  $axios.onResponse(({ data }) => {
    if (data.ResponseCode === '98') {
      sessionStorage.removeItem('rq')
    } else if (data.ResponseCode === '99' && data.ResponseText !== '') {
      Swal.fire('Info', data.ResponseText, 'info')
    }
  })
  
  inject('lineApi', lineApi)
}
