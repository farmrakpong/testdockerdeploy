<template>
  <div>
    <v-col cols="12" align="center" class="my-10">
      <Logo />
    </v-col>
    <v-col cols="12" align="center">
      <v-btn color="warning" rounded x-large to="register">สมัครสมาชิก</v-btn>
    </v-col>
    <v-col cols="12" align="center"> หรือ </v-col>
    <v-col cols="12" align="center">
      <v-btn color="warning" rounded x-large to="login">เข้าสู่ระบบ</v-btn>
    </v-col>

    <v-dialog v-model="dialog" persistent transition="dialog-bottom-transition">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          ตรวจสอบความเป็นสมาชิกด้วยเบอร์โทรศัพท์
        </v-card-title>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" lazy-validation @submit.prevent="register">
            <v-card-text class="mt-2">
              <validation-provider v-slot="{ errors }" rules="required">
                <v-text-field
                  label="เบอร์โทรศัพท์"
                  prepend-icon="mdi-cellphone"
                  v-model="mobileNumber"
                  solo
                  rounded
                  required
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="warning"
                block
                @click="verifyMemberWithMobile"
                :disabled="invalid"
              >
                ตรวจสอบ
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";
export default {
  layout: "blank",
  data() {
    return {
      valid: false,
      dialog: false,
      mobileNumber: "",
      rules: [
        (value) => !!value || "กรุณากรอกเบอร์โทรศัพท์",
        (value) => (value && value.length >= 10) || "กรุณากรอกเบอร์ให้ครับ 10 หลัก",
        (value) => (value && value.length <= 10) || "กรุณากรอกเบอร์ให้ครับ 10 หลัก",
      ],
    };
  },
  components: {
    ValidationObserver,
  },
  mounted() {    
    const code = this.$route.query.code || null
    this.$store.commit("GET_UUID");
    this.$store.dispatch("getMerchantInfo", code);
  },
  watch: {
    memberVerifyLineData: {
      deep: true,
      handler(newVal, oleVal) {
        if (newVal.loyaltyObj) this.$router.push({ name: "home" });
        else this.$router.push({ name: "verifymobile" });
      },
    },
  },
  computed: {
    ...mapState({
      memberVerifyLineData: (state) => state.memberVerifyLine,
    }),
  },
  methods: {
    verifyMemberWithMobile() {
      this.$store.dispatch("validateMemberRegister", this.mobileNumber);
    },
  },
};
</script>