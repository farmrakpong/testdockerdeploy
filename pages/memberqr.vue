<template>
  <div>
    <v-container class="mb-2">
      <v-row>
        <v-col cols="12" class="d-flex flex-column justify-center align-center">
          <h1 v-text="memberData?.memberGroupName"></h1>
          <h3>สะสมแต้มของคุณ</h3>
          <br />
          <canvas id="canvas"></canvas>
          <br />
          <h3 v-text="memberData?.memberCode"></h3>
          <br />
          <h2>แสดงคิวอาร์โค้ดที่พนักงาน</h2>
          <br />
          <h4>จะหมดเวลาอีกใน</h4>
          <countdown :time="originalTime" v-if="originalTime > 0">
            <template slot-scope="props">
              <h1 class="text-center"
                v-text="
                  `${props.minutes < 10 ? `0${props.minutes}` : props.minutes}:${
                    props.seconds < 10 ? `0${props.seconds}` : props.seconds
                  }`
                "
              ></h1>
              <v-row v-if="props.minutes <= 0 && props.seconds <= 0">
                <v-col cols="12" justify="center" align="center">
                  <v-btn color="warning" @click="getMemberQRCode">
                    <v-icon>mdi-refresh</v-icon>
                    สร้างคิวอาร์โค้ดใหม่
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </countdown>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import QRCode from "qrcode";
import { mapState } from "vuex";
export default {
  head: {
    title: "Member QR Code",
  },
  data() {
    return {
      originalTime: 0, // in seccond
    };
  },

  mounted() {
    this.getMemberQRCode();
  },

  computed: {
    ...mapState({
      memberData: (state) => state.home.loyaltyData?.loyaltyObj?.memberInfo,
      memberQRData: (state) => state.memberqr.memberQRData?.responseObj,
    }),
  },

  methods: {
    getMemberQRCode() {
      this.originalTime = 0;
      this.$store.dispatch("memberqr/generateMemberQR");
      setTimeout(() => {
        this.generateQRCode();
        this.originalTime = this.memberQRData?.expireMinute * 60 * 1000;
      }, 500);

      this.$nuxt.refresh();
    },
    generateQRCode() {
      var canvas = document.getElementById("canvas");

      QRCode.toCanvas(
        canvas,
        this.memberQRData?.qrCode,
        { width: 250 },
        function (error) {
          if (error) console.error(error);
          console.log("success!");
        }
      );
    },
  },
};
</script>
