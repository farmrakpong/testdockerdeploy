import Vue from 'vue'
import { ValidationProvider, extend, localize } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules.umd.js'

localize({
  en: {
    messages: {
      required: 'กรุณากรอกข้อมูล',
      email: 'อีเมลไม่ถูกต้อง'
    },
  },
})

extend('required', required)
extend('email', email)

// Register it globally
Vue.component('ValidationProvider', ValidationProvider)