<template>
  <v-container class="mt-3">
    <v-row align="center" justify="center">
      <v-card
        rounded="pill"
        elevation="10"
        class="background"
        width="160"
        height="85"
        dark
      >
        <v-card-text align="center" justify="center">
          <h3 class="mb-2">แต้มสะสม</h3>
          <h1 v-text="memberData?.memberPoints"></h1>
        </v-card-text>
      </v-card>
    </v-row>
    <br />
    <v-row class="pt-5" v-if="redeemInfoData?.length > 0">
      <v-col cols="12" v-for="(item, index) in redeemInfoData" :key="index" class="pt-0">
        <v-card rounded="xl">
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-avatar size="63%" rounded="xl">
              <v-img :src="item.redeemImage" aspect-ratio="1.7"></v-img>
            </v-avatar>
            <div class="text-center py-2 d-flex flex-column justify-space-between">
              <h5 v-text="item.redeemName"></h5>
              <h6 class="font-weight-light" v-html="item.redeemDesp"></h6>
              <v-card-actions>
                <v-btn
                  large
                  dark
                  rounded
                  color="#5d3b18"
                  width="120"
                  class="mt-1"
                  @click="showRedeemDetail(item)"
                >
                  <v-row class="d-flex flex-column">
                    <h4 v-text="`${item.redeemPoint} points`"></h4>
                    <small>Redeem</small>
                  </v-row>
                </v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pt-10" v-else>
      <v-col cols="12" align="center" justify="center">
        <v-img src="no-redeem-list.svg" max-width="50%"></v-img>
        <h1>ไม่มีรายการให้แลกแต้ม</h1>
        <h3>ตอนนี้ไม่มีรายการให้แลกแต้ม หากมีรายการท่านสามารถนำแต้มที่มีมาแลกได้</h3>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="#f9c016" extended flat>
          <v-toolbar-title v-text="redeemDetailData?.redeemName"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card class="mx-auto" max-width="90%" style="margin-top: -50px">
          <v-img :src="redeemDetailData?.redeemImage" aspect-ratio="1.7" height="200px">
          </v-img>
          <v-card-text class="d-flex flex-column">
            <span
              v-html="redeemDetailData?.redeemCondition"
              class="font-weight-light"
            ></span>
            <br />
            <span class="font-weight-bold">
              <v-icon>mdi-calendar-clock-outline</v-icon>
              {{
                redeemDetailData?.expireDate == "9999-12-31"
                  ? "ไม่มีวันหมดอายุ"
                  : redeemDetailData?.expireDate
              }}
            </span>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="warning"
              block
              v-text="`Redeem ${redeemDetailData?.redeemPoint} Points`"
              @click="redeemPrivilege"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirm" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5" color="#f9c016"> ยืนยันการแลกแต้ม? </v-card-title>
        <v-card-text>หากทำการตกลงแล้ว จะไม่สามารถเรียกคืนแต้มที่แลกไปได้</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" dark @click="dialogConfirm = false"> ยกลิก </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="confirmRedeemPrivilege"
            :loading="loading"
            :disabled="loading"
          >
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <alert-component :show="snackbar" :message="message" :color="color" />
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AlertComponent from "~/components/alert.vue";
export default {
  head: {
    title: "Redeem Privilege",
  },
  data() {
    return {
      loading: false,
      snackbar: false,
      message: "",
      color: "success",
      dialog: false,
      dialogConfirm: false,
      redeemDetailData: null,
    };
  },

  components: {
    AlertComponent,
  },

  beforeMount() {
    this.$vuetify.goTo(0);
  },

  mounted() {
    this.$store.commit("GET_UUID");
    this.$store.dispatch("privilege/getRedeemInfoData").finally(() => {
      if (this.redeemInfo.responseCode == "99") {
        this.message = this.redeemInfo.responseText;
        this.color = "red";
        this.snackbar = true;
      }
    });
  },

  computed: {
    ...mapState({
      memberData: (state) => state.home.loyaltyData?.loyaltyObj?.memberInfo,
      redeemInfo: (state) => state.privilege.redeemInfoData,
      redeemInfoData: (state) =>
        state.privilege.redeemInfoData?.responseObj[0]?.redeemListData,
      redeemCouponData: (state) => state.privilege.redeemCouponData,
    }),
  },

  methods: {
    showRedeemDetail(item) {
      this.redeemDetailData = item;
      this.dialog = true;
      this.snackbar = false;
    },
    confirmRedeemPrivilege() {
      this.loading = true;
      this.$store
        .dispatch("privilege/redeemPrivilege", this.redeemDetailData)
        .finally(() => {
          if (this.redeemCouponData.responseCode == "99") {
            this.message = this.redeemCouponData.responseText;
            this.color = "red";
          } else this.message = `ดำเนินการแลกแต้มเรียบร้อยแล้ว`;

          this.dialog = false;
          this.dialogConfirm = false;
          this.snackbar = true;
          this.loading = false;
        });
    },
    redeemPrivilege() {
      this.dialogConfirm = true;
    },
  },
};
</script>

<style scoped>
.background {
  color: white;
  background: url("/background-reward.svg") center fixed !important;
  background-size: cover;
}
</style>
