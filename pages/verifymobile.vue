<template>
  <div>
    <v-row class="text-center">
      <v-col align="center" justify="center">
        <v-img src="otp.svg" max-width="80%"></v-img>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="text-center">
      <v-col>
        <h1 class="header">OTP Verification</h1>
        <h3 class="title">เราจะส่งรหัสความปลอดภัยไปที่โทรศัพท์ของคุณ</h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="text-center">
      <v-col>
        <h3 class="mb-2">กรุณากรอกเบอร์โทรศัพท์ของคุณ</h3>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" lazy-validation @submit.prevent="submit">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="mobileNumber"
                type="tel"
                inputmode="numeric"
                label="เบอร์โทรศัพท์"
                prepend-icon="mdi-cellphone"
                solo
                rounded
                required
                :masked="false"
                v-mask="'###-###-####'"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>
            <v-btn
              type="submit"
              rounded
              color="warning"
              x-large
              :loading="loading"
              :disabled="invalid || loading"
              >รับรหัสความปลอดภัย</v-btn
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
    title: "Verify Mobile",
  },
  data() {
    return {
      mobileNumber: "",
      loading: false,
    };
  },

  components: {
    ValidationObserver,
  },

  mounted() {
    this.$store.commit("GET_UUID");
    this.$store.dispatch("otp/onLoad");
  },

  computed: {
    ...mapState({
      merchantInfoData: (state) => state.merchantInfoData,
      loyaltyData: (state) => state.home.loyaltyData,
    }),
  },

  methods: {
    submit(e) {
      this.loading = true;
      this.$store
        .dispatch("otp/genValidattionCode", { mobileNumber: this.mobileNumber })
        .finally(() => {
          this.loading = false;
          this.$router.push({ name: "verifyotp" });
        });
    },
  },
};
</script>
