<template>
  <div class="background-star">
    <v-col cols="12" class="d-flex justify-center align-center" style="height: 50vh">
      <!-- <Logo class="mt-10"/> -->
    </v-col>
    <v-col
      cols="12"
      class="d-flex flex-column justify-center align-center mt-15"
      style="height: 50vh"
    >
      <h3>ยินดีต้อนรับเข้าสู่ระบบ</h3>
      <!-- <v-btn
        rounded
        filled
        x-large
        color="#5c3915"
        class="my-10 px-10 white--text"
        @click="goToHome"
        >Starry Member</v-btn
      > -->
    </v-col>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  head: {
    title: "Welcome",
  },
  data() {
    return {};
  },

  mounted() {
    const code = this.$route.query.code || null;
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
    goToHome() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped>
.background-star {
  background-image: url("/welcome.png");
  background-size: cover;
  background-position: bottom;
}
</style>
