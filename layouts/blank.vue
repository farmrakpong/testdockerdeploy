<template>
  <v-app>
    <v-main class="background">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
<style scoped>
.background {
  background-color: #ffe9c9;
  background: url("/background.svg") center fixed;
  background-size: cover;
}
</style>
