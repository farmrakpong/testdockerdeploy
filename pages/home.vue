<template>
  <v-container>
    <v-card rounded="xl" class="mb-10">
      <v-img src="background-reward.svg">
        <v-row>
          <v-col cols="6" class="d-flex justify-center align-center">
            <v-img src="star.svg" max-width="50%" class="ma-5"></v-img>
          </v-col>
          <v-col cols="6" class="d-flex flex-column justify-center align-center">
            <h1 class="white--text" v-text="memberData?.memberPoints"></h1>
            <h4 class="white--text">Reward Points</h4>
          </v-col>
        </v-row>
      </v-img>
      <v-col
        cols="12"
        class="d-flex justify-end align-end"
        style="position: absolute; bottom: -30px"
      >
        <v-btn dark rounded filled color="#5c3915" to="memberqr">กดเพื่อรับคะแนน</v-btn>
      </v-col>
    </v-card>
    <v-container class="mb-2">
      <v-row>
        <v-btn icon>
          <v-img src="star-title.svg" class="mr-2" max-width="35" />
        </v-btn>
        <h2 class="warning--text">สิทธิพิเศษของคุณ</h2>
      </v-row>
    </v-container>
    <v-container class="mt-10" v-if="couponData?.length == 0 && voucherData?.length == 0">
      <v-row>
        <v-col cols="12" justify="center" align="center">
          <v-img src="no-coupon-list.svg" max-width="50%"></v-img>
          <h1>ไม่มีสิทธิพิเศษของคุณ</h1>
          <h3>ต้องทำการแลกแต้มเป็นบัตรกำนัลหรือคูปอง หรือได้รับจาการซื้อของก่อน</h3>
        </v-col>
      </v-row>
    </v-container>

    <!-- list of coupon -->
    <v-row class="pt-5" v-if="couponData?.length > 0">
      <v-col cols="12" v-for="(item, index) in couponData" :key="index" class="pt-0">
        <v-card rounded="xl" @click="showPrivilegeDetail(item)">
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-avatar size="63%" rounded="xl">
              <v-img :src="item.imageFileName" aspect-ratio="1.7"></v-img>
            </v-avatar>
            <div class="text-center pa-2 d-flex flex-column justify-space-between">
              <h5 v-text="item.couponName"></h5>
              <h6>
                <v-icon>mdi-calendar-clock-outline</v-icon>
                {{
                  item.expireDate == "9999-12-31" ? "ไม่มีวันหมดอายุ" : item.expireDate
                }}
              </h6>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- list of voucher -->
     <v-row class="pt-5" v-if="voucherData?.length > 0">
      <v-col cols="12" v-for="(item, index) in voucherData" :key="index" class="pt-0">
        <v-card rounded="xl" @click="showPrivilegeDetail(item)">
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-avatar size="63%" rounded="xl">
              <v-img :src="item.imageFileName" aspect-ratio="1.7"></v-img>
            </v-avatar>
            <div class="text-center pa-2 d-flex flex-column justify-space-between">
              <h5 v-text="item.voucherName"></h5>
              <h6>
                <v-icon>mdi-calendar-clock-outline</v-icon>
                {{
                  item.expireDate == "No Expiration" ? "ไม่มีวันหมดอายุ" : item.expireDate
                }}
              </h6>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card flat>
        <v-toolbar color="#f9c016" extended flat>
          <v-toolbar-title
            class="font-weight-bold"
            v-text="
              privilegeDetailData?.couponName
                ? privilegeDetailData?.couponName
                : privilegeDetailData?.voucherName
            "
          ></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card class="mx-auto" max-width="90%" style="margin-top: -50px">
          <v-img
            :src="privilegeDetailData?.imageFileName"
            aspect-ratio="1.7"
            height="200px"
          >
          </v-img>
          <v-card-text>
            <span
              v-html="
                privilegeDetailData?.couponNote
                  ? privilegeDetailData?.couponNote
                  : privilegeDetailData?.voucherNote
              "
            ></span>
            <br />
            <v-icon>mdi-calendar-clock-outline</v-icon>
            {{
              privilegeDetailData?.expireDate == "9999-12-31"
                ? "ไม่มีวันหมดอายุ"
                : privilegeDetailData?.expireDate
            }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center" justify="center" class="d-flex flex-column">
              <!-- <barcode
                style="width: 90%; max-width: 800px"
                format="pharmacode"
                :value="
                  privilegeDetailData?.couponSN
                    ? privilegeDetailData?.couponSN
                    : privilegeDetailData?.voucherSN
                "
                :options="{
                  displayValue: false,
                  font: 'Roboto',
                  fontSize: 15,
                  width: 2,
                  height: 200,
                }"
              ></barcode> -->
              <canvas id="canvas"></canvas>
              <span
                class="text-lg-h6 font-weight-black"
                v-text="
                  privilegeDetailData?.couponSN
                    ? privilegeDetailData?.couponSN
                    : privilegeDetailData?.voucherSN
                "
              ></span>
            </v-row>
          </v-card-subtitle>
        </v-card>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import QRCode from "qrcode";
export default {
  head: {
    title: "Home",
  },
  data() {
    return {
      dialog: false,
      picture: "no-coupon.svg",
      privilegeDetailData: null,
    };
  },

  beforeMount() {
    this.$vuetify.goTo(0);
  },

  mounted() {
    this.$store.commit("GET_UUID");
    this.$store.dispatch("home/getMemberData");
  },

  computed: {
    ...mapState({
      merchantInfoData: (state) => state.merchantInfoData,
      memberData: (state) => state.home.loyaltyData?.loyaltyObj?.memberInfo,
      couponData: (state) => state.home.loyaltyData?.loyaltyObj?.couponList,
      voucherData: (state) => state.home.loyaltyData?.loyaltyObj?.voucherList,
      onLoadImage(item) {
        let img = new Image();

        let picture = item.imageFileName;

        img.src = picture;
        img.onload = () => {
          this.picture = picture;
        };
        img.onerror = (e) => {
          this.picture = "no-coupon.svg"; // Image used in case of error (here, the same as that for loading)
        };
        return img;
      },
    }),
  },

  methods: {
    showPrivilegeDetail(item) {
      setTimeout(() => {
        this.generateQRCode(item?.couponSN ? item?.couponSN : item?.voucherSN);
      }, 500);

      this.privilegeDetailData = item;
      this.dialog = true;
    },
    generateQRCode(data) {
      var canvas = document.getElementById("canvas");

      QRCode.toCanvas(canvas, data, { width: 170 }, function (error) {
        if (error) console.error(error);
      });
    },
  },
};
</script>
