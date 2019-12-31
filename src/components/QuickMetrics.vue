<template>
  <v-container>
    <v-card>
      <v-container>
        <!-- header -->
        <v-row justify="center" align="center">
          <v-col cols="10">
            <div class="headline font-weight-bold">
              <v-icon large color="yellow">mdi-flash</v-icon> Quick Metrics
            </div>
          </v-col>
          <v-col cols="2">
            <!-- user avatar -->
            <v-avatar class="mr-2">
              <img :src="user.photoURL" alt="Principle Auto Employee" />
            </v-avatar>
            <!-- user name -->
            <div class="title inline">
              {{ user.displayName }}
            </div>
          </v-col>
        </v-row>

        <!-- metrics -->
        <v-row class="mt-2">
          <!-- total in process -->
          <v-col cols="3">
            <MetricFocusWithSubData
              center="text-center"
              largeTitle="Total in Process"
              title="Avg. Age in Process"
              :largeCalc="numInProcess"
              :calculation="averageAgeInProcess"
              alternativeMessage="No requests in process"
            />
          </v-col>

          <!-- in process break down -->
          <v-col offset="1" cols="3">
            <MetricTitle title="In Process Break Down" />
            <!-- total needing shop -->
            <MetricLabel
              :calculation="numShop"
              title="Total Needing Shop"
              alternativeMessage="No requests in process"
            />
            <!-- total needing sublet -->
            <MetricLabel
              :calculation="numSublet"
              title="Total Needing Sublet"
              alternativeMessage="No requests in process"
            />
            <!-- total in sublet inspection -->
            <MetricLabel
              :calculation="numSubletInspection"
              title="Total in Sublet Inspection"
              alternativeMessage="No requests in process"
            />
            <!-- total in sublet -->
            <MetricLabel
              :calculation="numSubletQueue"
              title="Total in Sublet"
              alternativeMessage="No requests in process"
            />
            <!-- total in detail -->
            <MetricLabel
              :calculation="numDetail"
              title="Total in Detail"
              alternativeMessage="No requests in process"
            />
          </v-col>
          <!-- age buckets -->
          <v-col cols="2">
            <MetricTitle title="Age Buckets" />
            <!-- zero to fifteen days -->
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

          <!-- averages -->
          <v-col cols="3">
            <MetricTitle title="Average Queue Time" />
            <MetricLabel
              :calculation="averageAgeInShop"
              title="Avg. Age In Shop"
              alternativeMessage="No requests in process"
            />
            <MetricLabel
              :calculation="averageAgeInSubletInspection"
              title="Avg. Age In Sublet Insp."
              alternativeMessage="No requests in process"
            />
            <MetricLabel
              :calculation="averageAgeInSublet"
              title="Avg. Age In Sublet"
              alternativeMessage="No requests in process"
            />
            <MetricLabel
              :calculation="averageAgeInDetail"
              title="Avg. Age In Detail"
              alternativeMessage="No requests in process"
            />
          </v-col>
        </v-row>
        <v-row>
          <transition name="slide-fade">
            <v-col v-if="slider" cols="12">
              <v-data-table
                :headers="header"
                :items="inProcess"
                :search="search"
              >
                <template v-slot:top>
                  <v-row>
                    <v-card-title class="display-2 font-weight-light">
                      In Process
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-col cols="3">
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:item.age="{ item }">
                  {{ numberDays(item) }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <FullScreenDialog :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </transition>
          <v-col class="text-center">
            <v-btn
              v-if="slider === false"
              @click="slider = !slider"
              text
              small
              color="info"
              >See All in Process</v-btn
            >
            <v-btn v-else @click="slider = !slider" text small color="info"
              >Close</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";

// components
import LargeTotal from "./LargeTotal";
import MetricTitle from "./MetricTitle";
import MetricLabel from "./MetricLabel";
import MetricLabelPercentage from "./MetricLabelPercentage";
import MetricFocusWithSubData from "./MetricFocusWithSubData";
import FullScreenDialog from "./FullScreenDialog";

export default {
  name: "QuickMetrics",
  props: ["user"],
  components: {
    LargeTotal,
    MetricTitle,
    MetricLabel,
    MetricLabelPercentage,
    MetricFocusWithSubData,
    FullScreenDialog
  },
  data() {
    return {
      shop: [],
      subletInspection: [],
      sublet: [],
      detail: [],
      subletQueue: [],
      inProcess: null,
      zeroFifteen: null,
      sixteenThirty: null,
      thirtyOne: null,
      slider: false,
      search: "",
      header: [
        {
          text: "Age",
          value: "age"
        },
        {
          text: "RO #",
          value: "ro"
        },
        {
          text: "VIN",
          value: "vin"
        },
        {
          text: "Year",
          value: "year"
        },
        {
          text: "Make",
          value: "make"
        },
        {
          text: "Model",
          value: "model"
        },
        {
          text: "Color",
          value: "color"
        },
        {
          text: "Actions",
          value: "actions"
        }
      ]
    };
  },
  computed: {
    numInProcess() {
      this.mergeInProcess();
      this.calculateAgeZeroFifteen();
      this.calculateAgeSixteenThirty();
      this.calculateAgeThirtyOne();
      return this.inProcess.length;
    },
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
      return `${Math.floor(days)} days`;
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
          console.log("shop", item.id);
          age = age + item.shop_complete_timestamp;
        } else if (
          item.shop_complete_timestamp <
          item.sublet_inspection_complete_timestamp
        ) {
          console.log("sublet-inspection", item.id);
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
  },
  methods: {
    numberDays(i) {
      let minutes = Math.floor((Date.now() - i.initial_timestamp) / 60000);
      if (minutes >= 1440) {
        let day = Math.floor(minutes / 1440);
        if (day === 1) {
          return `${day} day`;
        } else {
          return `${day} days`;
        }
      } else if (minutes >= 60) {
        let hour = Math.floor(minutes / 60);
        if (hour === 1) {
          return `${hour} hour`;
        } else {
          return `${hour} hours`;
        }
      } else if (minutes < 60 && minutes !== 0) {
        if (minutes === 1) {
          return `${Math.floor(minutes)} minute`;
        } else {
          return `${Math.floor(minutes)} minutes`;
        }
      } else if (minutes === 0) {
        return `A few seconds ago`;
      }
    },
    mergeInProcess() {
      let combineAll = this.shop.concat(
        this.detail,
        this.subletInspection,
        this.sublet
      );
      let allNoDuplicates = Array.from(new Set(combineAll.map(a => a.id))).map(
        id => {
          return combineAll.find(a => a.id === id);
        }
      );
      this.inProcess = allNoDuplicates;
      this.inProcess.sort((a, b) => a.initial_timestamp - b.initial_timestamp);
    },
    calculateAgeZeroFifteen() {
      let now = Date.now();
      let day = 86400000;
      let fifteen = now - day * 15;
      let zeroFifteen = this.inProcess.filter(p => {
        if (p.initial_timestamp > fifteen) {
          return p;
        }
      });
      this.zeroFifteen = zeroFifteen;
    },
    calculateAgeSixteenThirty() {
      let now = Date.now();
      let day = 86400000;
      let fifteen = now - day * 15;
      let thirty = now - day * 30;
      let sixteenThirty = this.inProcess.filter(p => {
        if (p.initial_timestamp > thirty) {
          if (p.initial_timestamp < fifteen) {
            return p;
          }
        }
      });
      this.sixteenThirty = sixteenThirty;
    },
    calculateAgeThirtyOne() {
      let now = Date.now();
      let day = 86400000;
      let thirty = now - day * 30;
      let thirtyOnePlus = this.inProcess.filter(p => {
        if (p.initial_timestamp < thirty) {
          return p;
        }
      });
      this.thirtyOne = thirtyOnePlus;
    }
  },
  firestore() {
    return {
      shop: db.collection("tpo").where("shop", "==", true),
      subletInspection: db
        .collection("tpo")
        .where("sublet_inspection", "==", true),
      sublet: db.collection("tpo").where("sublet", "==", true),
      detail: db.collection("tpo").where("detail", "==", true),
      subletQueue: db
        .collection("tpo")
        .where("shop", "==", false)
        .where("sublet_inspection", "==", false)
        .where("sublet", "==", true)
    };
  }
};
</script>

<style>
.inline {
  display: inline;
}
</style>
