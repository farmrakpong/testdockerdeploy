<template>
  <div>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form ref="form" lazy-validation @submit.prevent="register">
        <v-col cols="12" align="center" class="my-5">
          <v-avatar color="orange" size="100">
            <v-icon>mdi-account</v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="12" align="center">
          <v-card class="mx-auto" color="#ffe9c9" max-width="500">
            <v-card-title>
              <v-icon large left> mdi-pencil </v-icon>
              <span class="text-h6 font-weight-light">ตรวจสอบข้อมูลและลงทะเบียน</span>
            </v-card-title>

            <v-card-text>
              <template>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <validation-provider v-slot="{ errors }" rules="required">
                        <v-text-field
                          v-model="memberData.memberFirstName"
                          label="ชื่อ"
                          filled
                          rounded
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>
                      <validation-provider v-slot="{ errors }" rules="required">
                        <v-text-field
                          v-model="memberData.memberLastName"
                          label="นามสกุล"
                          filled
                          rounded
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>
                      <v-autocomplete
                        :items="genderData"
                        item-text="GenderName"
                        item-value="GenderID"
                        v-model="memberData.memberGenderID"
                        label="เพศ"
                        filled
                        rounded
                        placeholder="เลือก..."
                      ></v-autocomplete>
                      <validation-provider v-slot="{ errors }" rules="required">
                        <v-text-field
                          v-model="memberData.memberMobile"
                          label="โทรศัพท์"
                          filled
                          rounded
                          required
                          disabled
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>
                      <validation-provider v-slot="{ errors }" rules="email">
                        <v-text-field
                          v-model="memberData.memberEmail"
                          type="email"
                          label="อีเมล"
                          filled
                          rounded
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="memberData.memberBirthDay"
                            label="วันเกิด"
                            filled
                            rounded
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="memberData.memberBirthDay"
                          :active-picker.sync="activePicker"
                          :max="
                            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                              .toISOString()
                              .substr(0, 10)
                          "
                          min="1950-01-01"
                          @change="save"
                        ></v-date-picker>
                      </v-menu>
                      <v-sheet color="white" class="py-2 px-4" rounded="lg">
                        <validation-provider v-slot="{ errors }" rules="required">
                          <v-checkbox
                            v-model="consent1"
                            :error-messages="errors"
                            value="1"
                            required
                          >
                            <template v-slot:label>
                              <div>
                                ยินยอมรับข่าวสาร บริการหรือสิทธิประโยชน์ต่าง ๆของบริษัท
                                มิกซ์เซี่ยน ฟู้ดส์ จำกัด ที่น่าสนใจได้
                                <a @click.stop="show = true">รายละเอียดเพิ่มเติม</a>
                              </div>
                            </template>
                          </v-checkbox>
                        </validation-provider>
                        <v-divider></v-divider>
                        <validation-provider v-slot="{ errors }" rules="required">
                          <v-checkbox
                            v-model="consent2"
                            :error-messages="errors"
                            value="1"
                            required
                          >
                            <template v-slot:label>
                              <div>
                                ยินยอมรับข่าวสาร โปรโมชั่น บริการหรือสิทธิประโยชน์ต่าง
                                ๆของบริษัท มิกซ์เซี่ยน ฟู้ดส์ จำกัด ที่น่าสนใจได้
                              </div>
                            </template>
                          </v-checkbox>
                        </validation-provider>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-container>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
        <v-footer app padless>
          <v-btn
            type="submit"
            block
            x-large
            tile
            height="75"
            color="warning"
            :loading="loading"
            :disabled="loading"
            >ตกลง</v-btn
          >
        </v-footer>
      </v-form>
    </validation-observer>
    <alert-component :show="snackbar" :message="message" :color="color" />
    <terms-component :show="show" @close="onAccept" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";
import AlertComponent from "~/components/alert.vue";
import TermsComponent from "~/components/terms.vue";
export default {
  layout: "blank",
  head: {
    title: "Registration",
  },
  data() {
    return {
      checkbox: false,
      snackbar: false,
      loading: false,
      message: "",
      color: "",
      memberData: {},
      valid: false,
      activePicker: null,
      menu: false,
      show: false,
      consent1: null,
      consent2: null,
      genderData: [
        {
          GenderID: 1,
          GenderName: "ชาย",
        },
        {
          GenderID: 2,
          GenderName: "หญิง",
        },
        {
          GenderID: 3,
          GenderName: "ไม่ระบุ",
        },
      ],
    };
  },

  components: {
    ValidationObserver,
    AlertComponent,
    TermsComponent,
  },

  mounted() {
    this.$store.dispatch("otp/validateMemberRegister").finally(() => {
      if (this.memberVerifyData.responseCode == "99") {
        this.$store.commit("register/SET_MEMBER_STATE", true);
        this.memberData = {
          memberMobile: this.mobileNumber,
          membetLoginType: 0,
          memberDeviceCode: this.$store.state.lineId,
          memberTitle: "",
          memberNickName: "",
          memberNationalID: "",
          memberPassportNo: "",
          memberImage: "",
          memberProvinceID: 0,
        };
      } else {
        this.$store.commit("register/SET_MEMBER_STATE", false);
        this.memberData = { ...this.memberVerifyData?.responseObj };
      }
    });
  },

  computed: {
    ...mapState({
      memberVerifyData: (state) => state.otp.memberVerifyData,
      mobileNumber: (state) => state.otp.mobileNumber,
      memberRegisterData: (state) => state.register.memberRegisterData,
    }),
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    register() {
      this.$refs.observer.validate().then((result) => {
        if (result) {
          this.loading = true;

          this.memberData.registerChannel = 3;
          this.memberData.memberSignInUdid = this.$store.state.lineId;
          this.memberData.memberDeviceCode = this.$store.state.lineId;
          this.memberData.memberPass = "line-oa";
          this.memberData.memberMobile = this.memberData.memberMobile.replaceAll("-", "");
          // protected error from api
          this.memberData.memberLogin = this.memberData.memberMobile;

          for (const key in this.memberData) {
            if (this.memberData[key] == null) this.memberData[key] = "";
          }
          this.$store.dispatch("register/registerMember", this.memberData).finally(() => {
            if (this.memberRegisterData.responseCode == "99") {
              this.message = this.memberRegisterData.responseText;
              this.color = "red";
            } else {
              this.color = "success";
              this.message = `ดำเนินการลงทะเบียนเรียบร้อยแล้ว`;
              this.$store.commit(
                "UPDATE_MOBILE_PARAM_DATA",
                this.memberRegisterData.loyaltyObj?.memberInfo
              );
              this.$router.push({ name: "home" });
            }

            this.loading = false;
            this.snackbar = true;
          });
        }
      });
    },
    onAccept(data) {
      this.show = data;
    },
  },
};
</script>
