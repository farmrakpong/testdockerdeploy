<template>
  <div class="background-star">
    <v-col cols="12" class="d-flex justify-center align-center" style="height: 50vh">
      <!-- <Logo class="mt-10"/> -->
    </v-col>
    <v-col cols="12" class="d-flex flex-column justify-center align-center mt-15" style="height: 50vh">
      <h3>ยินดีต้อนรับเข้าสู่ระบบ</h3>
      <v-btn
        rounded
        filled
        x-large
        color="#5c3915"
        class="my-10 px-10 white--text"
        @click="goToHome"
        >Starry Member</v-btn
      >
    </v-col>
  </div>
</template>

<script>
export default {
  head: {
    title: "Welcome",
  },
  data() {
    return {};
  },

  mounted() {},

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
  background-position: bottom
}
</style>
