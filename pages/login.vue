<template>
  <div>
    <v-col cols="12" align="center" class="my-10">
      <Logo />
    </v-col>

    <v-col cols="12" align="center">
      <v-card class="mx-auto" color="#ffe9c9" max-width="500">
        <v-card-title class="d-flex justify-center">
          <span class="text-h6 font-weight-light">เข้าสู่ระบบ</span>
        </v-card-title>

        <v-card-text>
          <template>
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="ชื่อผู้ใช้"
                      filled
                      rounded
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                      label="รหัสผ่าน"
                      type="password"
                      filled
                      rounded
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </template>
        </v-card-text>
        <v-card-actions class="d-flex justify-center flex-column">
          <v-btn large filled rounded color="warning" class="px-10" to="welcome"
            >เข้าสู่ระบบ</v-btn
          >
          <span class="text--warning mt-3">ลืมรหัสผ่านใช่ไหม?</span>
        </v-card-actions>
      </v-card>
    </v-col>
  </div>
</template>

<script>
export default {
  layout: "blank",
  head: {
    title: "Login",
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "กรุณากรอกข้อมูลในช่องนี้",
      },
    };
  },
  methods: {},
};
</script>
