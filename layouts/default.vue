<template>
  <v-app>
    <v-main>
      <v-card tile class="overflow-hidden">
        <v-app-bar
          absolute
          elevate-on-scroll
          scroll-target="#scrolling"
          height="75"
          color="#f9c016"
        >
          <v-avatar color="orange" size="40" class="mr-5">
            <v-icon>mdi-account</v-icon>
          </v-avatar>

          <v-toolbar-title v-if="memberData?.memberFirstName" v-text="`สวัสดีคุณ ${memberData?.memberFirstName}`"></v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon class="mr-1">
            <LogoS />
          </v-btn>
        </v-app-bar>

        <v-sheet
          id="scrolling"
          class="overflow-y-auto d-flex"
          color="#f8f1e7"
          max-height="100vh"
        >
          <v-container
            class="pa-0"
            style="height: calc(100vh); position: relative; top: 75px"
          >
            <Nuxt />
          </v-container>
        </v-sheet>
      </v-card>
      <v-bottom-navigation app background-color="#f9c016" height="75">
        <v-btn to="home" color="#f9c016" height="75">
          <span>หน้าหลัก</span>

          <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn to="privilege"  color="#f9c016" height="75">
          <span>สิทธิพิเศษ</span>

          <v-icon>mdi-gift</v-icon>
        </v-btn>

        <v-btn to="history"  color="#f9c016" height="75">
          <span>ประวัติ</span>

          <v-icon>mdi-history</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },

  mounted() {},

  computed: {
    ...mapState({
      memberData: (state)=> state.home.loyaltyData?.loyaltyObj?.memberInfo
    }),
  },

  methods: {},
};
</script>
