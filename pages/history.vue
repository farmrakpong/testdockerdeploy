<template>
  <div>
    <v-toolbar
      absolute
      dense
      tile
      style="position: sticky; top: 75px"
      v-if="memberHisoryData?.pointHistoryList.length > 0"
    >
      <h3 class="title">Transactions</h3>
      <v-spacer></v-spacer>
      <h3 class="title">Points</h3>
    </v-toolbar>
    <v-list three-line v-if="memberHisoryData?.pointHistoryList.length > 0">
      <template v-for="(item, index) in memberHisoryData?.pointHistoryList">
        <v-list-item>
          <!-- :key="item.receipt" -->
          <template>
            <!-- for custom when active -->
            <v-list-item-content>
              <v-list-item-title
                v-if="item.pointTypeName != ''"
                class="subtitle-1 font-weight-medium"
                v-text="item.pointTypeName"
              ></v-list-item-title>

              <v-list-item-subtitle
                v-if="item.receiptNumber != ''"
                class="font-weight-medium primary--text"
                v-text="item.receiptNumber"
              >
              </v-list-item-subtitle>

              <v-list-item-subtitle
                v-if="item.shopName != ''"
                v-text="item.shopName"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-action-text
                    v-bind="attrs"
                    v-on="on"
                    v-text="$moment(item.historyDateTime).fromNow()"
                  ></v-list-item-action-text>
                </template>
                <span>{{ $moment(item.historyDateTime).format("LLLL") }}</span>
              </v-tooltip>

              <strong class="title font-weight-black">
                <span
                  v-if="item.tranPoint > 0"
                  class="bold green--text"
                  v-text="`+${item.tranPoint}`"
                ></span>
                <span
                  v-else-if="item.tranPoint < 0"
                  class="red--text"
                  v-text="item.tranPoint"
                ></span>
                <span v-else v-text="item.tranPoint"></span>
              </strong>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider
          v-if="index < memberHisoryData?.pointHistoryList.length - 1"
          :key="index"
        ></v-divider>
      </template>
    </v-list>
    <v-container v-else>
      <v-row class="pt-10">
        <v-col cols="12" justify="center" align="center">
          <v-img src="no-transaction.svg" max-width="80%"></v-img>
          <h1>ไม่มีการทำรายการ</h1>
          <h3>หากที่การทำรายการแลกเต้ม คืนแต้ม หรือปรับแต้ม จะมีรายละเอียดแสดงขึ้นมา</h3>
        </v-col>
      </v-row>
    </v-container>
    <alert-component :show="snackbar" :message="message" :color="color" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import AlertComponent from "~/components/alert.vue";
export default {
  head: {
    title: "History",
  },
  data: () => ({
    snackbar: false,
    message: "",
    color: "red",
  }),

  components: {
    AlertComponent,
  },

  mounted() {
    this.$vuetify.goTo(0);
    this.$store.commit("GET_UUID");
    this.$store.dispatch("history/getMemberHistory").finally(() => {
      if (this.memberHisory.responseCode == "99") {
        this.message = this.memberHisory.responseText;
        this.snackbar = true;
      }
    });
  },

  computed: {
    ...mapState({
      memberHisory: (state) => state.history.memberHisoryData,
      memberHisoryData: (state) => state.history.memberHisoryData?.responseObj,
    }),
  },

  methods: {},
};
</script>
