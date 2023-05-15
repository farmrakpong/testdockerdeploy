<template>
  <div>
    <v-row class="text-center">
      <v-col align="center" justify="center">
        <v-img src="otp-verify.svg" max-width="80%"></v-img>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="text-center">
      <v-col>
        <h1 class="header">OTP Verification</h1>
        <h3 class="title">
          นำรหัสความปลอดภัยที่ส่งไปที่เบอร์
          <span
            class="font-weight-black font-italic"
            v-text="memberOTPData?.mobileNumber"
          ></span>
          มากรอกด้านล่าง
        </h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="text-center">
      <v-col>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" lazy-validation @submit.prevent="submit">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                label="รหัสความปลอดภัย"
                prepend-icon="mdi-key"
                inputmode="numeric"
                :prefix="`${memberOTPData?.smsHeader} - `"
                v-model="otp"
                solo
                rounded
                required
              ></v-text-field>
            </validation-provider>
            <v-btn
              type="submit"
              rounded
              color="warning"
              x-large
              :loading="loading"
              :disabled="invalid || loading"
              >ตรวจสอบ</v-btn
            >
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";
export default {
  layout: "blank-color",
  head: {
    title: "Verify OTP",
  },
  data() {
    return {
      otp: "",
      loading: false,
    };
  },

  components: {
    ValidationObserver,
  },

  mounted() {
    this.$store.commit("GET_UUID");
    this.$store.dispatch("otp/onLoad");

    // setTimeout(() => {
    //   this.otp = this.memberOTPData?.smsNumber;
    // }, 1000);
  },

  computed: {
    ...mapState({
      merchantInfoData: (state) => state.merchantInfoData,
      memberOTPData: (state) => {
        const resposeOTP = JSON.parse(sessionStorage.getItem("otp"));
        if (resposeOTP) return resposeOTP;
        else return state.otp.memberOTPData?.responseObj;
      },
    }),
  },

  methods: {
    submit(e) {
      this.loading = true;
      let payload = this.memberOTPData;
      payload.smsNumber = this.otp;

      this.$store.dispatch("otp/validateCode", payload).finally(() => {
        this.loading = false;
        this.$router.push({ name: "register" });
      });
    },
  },
};
</script>
