<template>
  <v-card>
    <v-card-text>
      <div class="display-1">
        <MetricSectionHeader title="In Process" />
        <v-row align="center">
          <v-col cols="4">
            <LargeTotal
              center="text-center"
              :largeCalc="numInProcess"
              largeTitle="Total in Process"
            />
          </v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col cols="6">
            <v-col cols="12">
              <MetricTitle title="Break Down" />
            </v-col>
            <v-row>
              <v-col cols="6">
                <MetricLabelPercentage
                  title="Shop"
                  :calculation="numShop"
                  :percentage="Math.floor((numShop / numInProcess) * 100) + '%'"
                />
                <MetricLabelPercentage
                  title="Sublet Inspection"
                  :calculation="numSubletInspection"
                  :percentage="
                    Math.floor((numSubletInspection / numInProcess) * 100) + '%'
                  "
                />
                <MetricLabelPercentage
                  title="Sublet"
                  :calculation="numSubletQueue"
                  :percentage="
                    Math.floor((numSubletQueue / numInProcess) * 100) + '%'
                  "
                />
                <MetricLabelPercentage
                  title="Detail"
                  :calculation="numDetail"
                  :percentage="
                    Math.floor((numDetail / numInProcess) * 100) + '%'
                  "
                />
              </v-col>
              <v-col cols="6">
                <MetricLabelPercentage
                  title="Total Needing Shop"
                  :calculation="numShop"
                  :percentage="Math.floor((numShop / numInProcess) * 100) + '%'"
                />
                <MetricLabelPercentage
                  title="Total Needing Sublet"
                  :calculation="numSublet"
                  :percentage="
                    Math.floor((numSublet / numInProcess) * 100) + '%'
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="mx-4"></v-divider>
        <v-row class="mt-2">
          <v-col cols="4">
            <LargeTotal
              center="text-center"
              :largeCalc="averageAgeInProcess"
              largeTitle="Avg. Age (days)"
            />
          </v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col>
            <v-row>
              <v-col cols="6">
                <MetricTitle title="Age Buckets" />
              </v-col>
              <v-col cols="6">
                <MetricTitle title="Average Queue Times" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <MetricLabelPercentage
                  title="0-15 Days"
                  :calculation="numZeroFifteen"
                  :percentage="
                    Math.floor((numZeroFifteen / numInProcess) * 100) + '%'
                  "
                />
                <MetricLabelPercentage
                  title="16-30 Days"
                  :calculation="numSixteenThirty"
                  :percentage="
                    Math.floor((numSixteenThirty / numInProcess) * 100) + '%'
                  "
                />
                <MetricLabelPercentage
                  title="31+ Days"
                  :calculation="numThirtyOne"
                  :percentage="
                    Math.floor((numThirtyOne / numInProcess) * 100) + '%'
                  "
                />
              </v-col>
              <v-col cols="6">
                <MetricLabel
                  title="In Shop"
                  :calculation="averageAgeInShop"
                  alternativeMessage="No requests"
                />
                <MetricLabel
                  title="In Sublet Inspection"
                  :calculation="averageAgeInSubletInspection"
                  alternativeMessage="No requests"
                />
                <MetricLabel
                  title="In Sublet"
                  :calculation="averageAgeInSublet"
                  alternativeMessage="No requests"
                />
                <MetricLabel
                  title="In Detail"
                  :calculation="averageAgeInDetail"
                  alternativeMessage="No requests"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <transition name="slide-fade">
          <v-row v-if="slider">
            <div class="text-center">
              <div class="title mb-3">Process Break Down</div>
              <pie-chart
                :donut="true"
                :colors="['#1FDE3A', '#E2F416', '#F44716']"
                legend="bottom"
                :data="{
                  Shop: numShop,
                  'Sublet Inspection': numSubletInspection,
                  Sublet: numSublet,
                  Detail: numDetail
                }"
              ></pie-chart>
            </div>
            <div class="text-center">
              <div class="title mb-3">Age Buckets</div>
              <pie-chart
                :donut="true"
                :colors="['#1FDE3A', '#E2F416', '#F44716']"
                legend="bottom"
                :data="{
                  '0-15 days': numZeroFifteen,
                  '16-30 days': numSixteenThirty,
                  '31+ days': numThirtyOne
                }"
              ></pie-chart>
            </div>
          </v-row>
        </transition>

        <v-row justify="center">
          <v-btn color="primary" v-if="slider === false" @click="open()"
            >View Charts and Graphs</v-btn
          >
          <v-btn v-else-if="slider === true" @click="close()">Close</v-btn>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import LargeTotal from "../components/LargeTotal";
import MetricSectionHeader from "../components/MetricSectionHeader";
import MetricLabel from "../components/MetricLabel";
import MetricLabelPercentage from "../components/MetricLabelPercentage";
import MetricTitle from "../components/MetricTitle";
export default {
  name: "InProcess",
  components: {
    MetricSectionHeader,
    MetricLabel,
    MetricLabelPercentage,
    LargeTotal,
    MetricTitle
  },
  props: [
    "shop",
    "sublet",
    "subletQueue",
    "subletInspection",
    "detail",
    "zeroFifteen",
    "sixteenThirty",
    "thirtyOne",
    "inProcess",
    "numInProcess"
  ],
  data() {
    return {
      slider: false
    };
  },
  methods: {
    open() {
      this.slider = true;
    },
    close() {
      this.slider = false;
    }
  },
  computed: {
    numShop() {
      return this.shop.length;
    },
    numSubletInspection() {
      return this.subletInspection.length;
    },
    numSublet() {
      return this.sublet.length;
    },
    numSubletQueue() {
      return this.subletQueue.length;
    },
    numDetail() {
      return this.detail.length;
    },
    numZeroFifteen() {
      return this.zeroFifteen.length;
    },
    numSixteenThirty() {
      return this.sixteenThirty.length;
    },
    numThirtyOne() {
      return this.thirtyOne.length;
    },
    averageAgeInProcess() {
      let age = 0;
      this.inProcess.forEach(item => {
        age = age + item.initial_timestamp;
      });
      let difference = age / this.inProcess.length;
      let elapsed = Date.now() - difference;
      let minutes = elapsed / 60000;
      let days = minutes / 1440;
      return Math.floor(days);
    },
    averageAgeInShop() {
      let age = 0;
      this.shop.forEach(item => {
        age = age + item.initial_timestamp;
      });
      let difference = age / this.shop.length;
      let elapsed = Date.now() - difference;
      let minutes = elapsed / 60000;
      let days = minutes / 1440;
      return `${Math.floor(days)} days`;
    },
    averageAgeInSubletInspection() {
      let age = 0;
      this.subletInspection.forEach(item => {
        age = age + item.initial_timestamp;
      });
      let difference = age / this.subletInspection.length;
      let elapsed = Date.now() - difference;
      let minutes = elapsed / 60000;
      let days = minutes / 1440;
      return `${Math.floor(days)} days`;
    },
    averageAgeInSublet() {
      let age = 0;
      this.subletQueue.forEach(item => {
        if (
          item.shop_complete_timestamp >
          item.sublet_inspection_complete_timestamp
        ) {
          age = age + item.shop_complete_timestamp;
        } else if (
          item.shop_complete_timestamp <
          item.sublet_inspection_complete_timestamp
        ) {
          age = age + item.sublet_inspection_complete_timestamp;
        }
      });
      let difference = age / this.subletQueue.length;
      let elapsed = Date.now() - difference;
      let minutes = elapsed / 60000;
      let days = minutes / 1440;
      return `${Math.floor(days)} days`;
    },
    averageAgeInDetail() {
      let age = 0;
      this.detail.forEach(item => {
        // send to detail
        if (item.toDetailTimestamp) {
          age = age + item.toDetailTimestamp;
        } else if (item.sublet_complete_timestamp) {
          age = age + item.sublet_complete_timestamp;
        } else if (
          item.sublet_inspection_complete_timestamp &&
          item.shop_complete_timestamp
        ) {
          // sublet took longer to complete work
          if (
            item.sublet_inspection_complete_timestamp >
            item.shop_complete_timestamp
          ) {
            age = age + item.sublet_inspection_complete_timestamp;
            // shop took longer to complete work
          } else {
            age = age + item.shop_complete_timestamp;
          }
        }
      });
      let difference = age / this.detail.length;
      let elapsed = Date.now() - difference;
      let minutes = elapsed / 60000;
      let days = minutes / 1440;
      return `${Math.floor(days)} days`;
    }
  }
};
</script>

<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
