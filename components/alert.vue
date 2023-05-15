<template>
  <div>
    <v-snackbar v-model="show" :color="color">
      {{ message }}
      <!-- <template v-slot:action="{ attrs }">
        <v-btn color="danger" text v-bind="attrs" @click="show = false"> ปิด </v-btn>
      </template> -->
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },

  props: {
    show: {
      type: Boolean,
      required: true,
      default() {
        return false;
      },
    },
    message: {
        type: String,
        required: true,
        default() {
            return 'This is toast!';
        },
    },
    color: {
        type: String,
        required: false,
        default() {
            return 'success';
        },
    },
  },

  mounted() {},

  methods: {},
};
</script>
