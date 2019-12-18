<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <div class="display-1">
              <MetricSectionHeader title="In Process" />
              <!-- metrics -->
              <v-row class="mt-2">
                <!-- total in process -->
                <v-col cols="4">
                  <LargeTotal
                    center="text-center"
                    :largeCalc="numInProcess"
                    largeTitle="Total in Process"
                  />
                </v-col>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-col>
                  <LargeTotal
                    center="text-center"
                    :largeCalc="averageAgeInProcess"
                    largeTitle="Avg. Age (d)"
                  />
                </v-col>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-col>
                  <LargeTotalArrow
                    :percentage="percentage"
                    :arrow="arrow"
                    :center="color"
                    :largeCalc="averageCycleTime"
                    largeTitle="Avg. Cycle Time 30d"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <MetricTitle title="In Process Break Down" />
                </v-col>

                <v-col cols="6">
                  <MetricLabelPercentage
                    title="Shop"
                    :calculation="numShop"
                    :percentage="
                      Math.floor((numShop / numInProcess) * 100) + '%'
                    "
                  />
                  <MetricLabelPercentage
                    title="Sublet Inspection"
                    :calculation="numSubletInspection"
                    :percentage="
                      Math.floor((numSubletInspection / numInProcess) * 100) +
                        '%'
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
                    :percentage="
                      Math.floor((numShop / numInProcess) * 100) + '%'
                    "
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
              <v-row>
                <v-col cols="12">
                  <MetricTitle title="Age Buckets" />
                </v-col>
                <v-col>
                  <MetricLabelPercentage
                    title="0-15 Days"
                    :calculation="numZeroFifteen"
                    :percentage="
                      Math.floor((numZeroFifteen / numInProcess) * 100) + '%'
                    "
                  />
                </v-col>
                <v-col>
                  <MetricLabelPercentage
                    title="16-30 Days"
                    :calculation="numSixteenThirty"
                    :percentage="
                      Math.floor((numSixteenThirty / numInProcess) * 100) + '%'
                    "
                  />
                </v-col>
                <v-col>
                  <MetricLabelPercentage
                    title="31+ Days"
                    :calculation="numThirtyOne"
                    :percentage="
                      Math.floor((numThirtyOne / numInProcess) * 100) + '%'
                    "
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <MetricTitle title="Average Queue Times" />
                </v-col>
                <v-col>
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
                </v-col>
                <v-col>
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
            </div>
          </v-card-text>
        </v-card>
        <v-card class="mt-2">
          <v-card-text>
            <MetricSectionHeader title="Completed" />
            <v-row justify="center" align="center">
              <v-col cols="5">
                <LargeTotalArrow
                  :percentage="percentage"
                  :arrow="arrow"
                  :center="color"
                  :largeCalc="averageCycleTime"
                  largeTitle="Avg. Cycle Time 30d"
                />
                <MetricLabel
                  title="Num. Vehicles Complete"
                  :calculation="lastThirty.length"
                />
                <MetricLabel
                  title="Shop Cycle Time"
                  :calculation="shopCycle30"
                />
                <MetricLabel
                  title="Sublet Inspection Cycle Time"
                  :calculation="subletInspectionCycle30"
                />
                <MetricLabel
                  title="Sublet Cycle Time"
                  :calculation="subletCycle30"
                />
                <MetricLabel
                  title="Detail Cycle Time"
                  :calculation="detailCycle30"
                />
              </v-col>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-col cols="5">
                <LargeTotal
                  largeTitle="Avg. Cycle Time 90d"
                  :largeCalc="averageCycleTime90"
                />
                <MetricLabel
                  title="Num. Vehicles Complete"
                  :calculation="lastNinety.length"
                />
                <MetricLabel
                  title="Shop Cycle Time"
                  :calculation="shopCycle90"
                />
                <MetricLabel
                  title="Sublet Inspection Cycle Time"
                  :calculation="subletInspectionCycle90"
                />
                <MetricLabel
                  title="Sublet Cycle Time"
                  :calculation="subletCycle90"
                />
                <MetricLabel
                  title="Detail Cycle Time"
                  :calculation="detailCycle90"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            Oldest 20 Vehicles
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon=""
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="inProcessLimit"
            :search="search"
            :hide-default-footer="true"
            :items-per-page="20"
          >
            <template v-slot:item.age="{ item }">
              {{ elapsedTime(item) }}
            </template>
            <template v-slot:item.year="{ item }">
              {{ item.year }}
            </template>
            <template v-slot:item.make="{ item }">
              {{ item.make }}
            </template>
            <template v-slot:item.model="{ item }">
              {{ item.model }}
            </template>
            <template v-slot:item.shop="{ item }">
              <!-- Date -->
              <div v-if="item.shop_complete_timestamp">
                <Chip
                  color="success"
                  :calculation="dateFormat(item.shop_complete_timestamp)"
                />
              </div>
              <!-- In process -->
              <div v-else>
                <Chip
                  color="warning"
                  :calculation="dateFormat(item.shop_complete_timestamp)"
                />
              </div>
            </template>
            <template v-slot:item.sublet="{ item }">
              <!-- Sublet inspection is not done -->
              <div v-if="!item.sublet_inspection_complete_timestamp">
                <Chip
                  color="warning"
                  :calculation="
                    subletStatusFormat(item.sublet_complete_timestamp, item)
                  "
                />
              </div>
              <!-- Sublet in process -->
              <div
                v-else-if="
                  item.sublet_inspection_complete_timestamp &&
                    item.sublet === true
                "
              >
                <Chip
                  color="warning"
                  :calculation="
                    subletStatusFormat(item.sublet_complete_timestamp, item)
                  "
                />
              </div>
              <div v-else>
                <Chip
                  color="success"
                  :calculation="
                    subletStatusFormat(item.sublet_complete_timestamp, item)
                  "
                />
              </div>
            </template>
            <template v-slot:item.detail="{ item }">
              <!-- In process -->
              <div v-if="item.detail === true">
                <Chip
                  color="warning"
                  :calculation="
                    dateFormat(item.detail_complete_timestamp, item)
                  "
                />
              </div>
              <!-- Waiting on process -->
              <div
                v-if="
                  dateFormat(item.detail_complete_timestamp, item) ===
                    'Waiting on process'
                "
              >
                <Chip
                  color="error"
                  :calculation="
                    dateFormat(item.detail_complete_timestamp, item)
                  "
                />
              </div>
              <!-- Detail Complete -->
              <div v-if="item.detail_complete_timestamp">
                <Chip
                  color="success"
                  :calculation="
                    dateFormat(item.detail_complete_timestamp, item)
                  "
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "../main";
import firebase from "firebase";

// components
import MetricSectionHeader from "../components/MetricSectionHeader";
import MetricLabel from "../components/MetricLabel";
import MetricLabelPercentage from "../components/MetricLabelPercentage";
import MetricTitle from "../components/MetricTitle";
import LargeTotal from "../components/LargeTotal";
import LargeTotalArrow from "../components/LargeTotalArrow";
import Chip from "../components/Chip";
import { async } from "q";
export default {
  name: "Reports",
  components: {
    MetricSectionHeader,
    MetricLabelPercentage,
    MetricTitle,
    MetricLabel,
    LargeTotal,
    LargeTotalArrow,
    Chip
  },
  data() {
    return {
      headers: [
        {
          text: "Age",
          value: "age"
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
          text: "Shop",
          value: "shop"
        },
        {
          text: "Sublet",
          value: "sublet"
        },
        {
          text: "Detail",
          value: "detail"
        }
      ],
      shop: [],
      subletInspection: [],
      sublet: [],
      detail: [],
      subletQueue: [],
      cycle: [],
      lastThirty: [],
      lastNinety: [],
      inProcessLimit: null,
      loaded: false,
      cycleTime: null,
      inProcess: null,
      zeroFifteen: null,
      sixteenThirty: null,
      thirtyOne: null,
      arrow: null,
      search: "",
      currentTime: Date.now()
    };
  },
  computed: {
    numInProcess() {
      this.filterCycle();
      this.mergeInProcess();
      this.mergeInProcessLimit();
      this.calculateAgeZeroFifteen();
      this.calculateAgeSixteenThirty();
      this.calculateAgeThirtyOne();
      this.last30Days;
      this.last90Days;
      return this.inProcess.length;
    },
    numBMWShop() {
      let bmw = 0;
      this.shop.forEach(item => {
        if (item.make === "BMW") {
          bmw++;
        }
      });
      return bmw;
    },
    numNonBMWShop() {
      let nonbmw = 0;
      this.shop.forEach(item => {
        if (item.make !== "BMW") {
          nonbmw++;
        }
      });
      return nonbmw;
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
        } else if (
          item.sublet_complete_timestamp &&
          item.shop_complete_timestamp
        ) {
          // sublet took longer to complete work
          if (item.sublet_complete_timestamp > item.shop_complete_timestamp) {
            age = age + item.sublet_complete_timestamp;
            // shop took longer to complete work
          } else {
            age = age + item.shop_complete_timestamp;
          }
        } else {
          // no sublet to perform
          age = age + item.sublet_inspection_complete_timestamp;
        }
      });
      let difference = age / this.detail.length;
      let elapsed = Date.now() - difference;
      let minutes = elapsed / 60000;
      let days = minutes / 1440;
      return `${Math.floor(days)} days`;
    },
    averageCycleTime() {
      let times = [];
      let totalTime = 0;
      this.lastThirty.forEach(item => {
        if (!item.sublet_complete_timestamp) {
          let completeTimes = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let initial = item.initial_timestamp;
          let max = Math.max(...completeTimes);
          let difference = max - initial;
          times.push(difference);
        } else {
          let completeTimes = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let initial = item.initial_timestamp;
          let max = Math.max(...completeTimes);
          let difference = max - initial;
          times.push(difference);
        }
      });
      times.forEach(time => {
        totalTime = totalTime + time;
      });
      let avgMili = totalTime / times.length;
      let minutes = avgMili / 60000;
      let days = minutes / 1440;
      return Math.floor(days);
    },
    averageCycleTime90() {
      let times = [];
      let totalTime = 0;
      this.lastNinety.forEach(item => {
        if (!item.sublet_complete_timestamp) {
          let completeTimes = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let initial = item.initial_timestamp;
          let max = Math.max(...completeTimes);
          let difference = max - initial;
          times.push(difference);
        } else {
          let completeTimes = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let initial = item.initial_timestamp;
          let max = Math.max(...completeTimes);
          let difference = max - initial;
          times.push(difference);
        }
      });
      times.forEach(time => {
        totalTime = totalTime + time;
      });
      let avgMili = totalTime / times.length;
      let minutes = avgMili / 60000;
      let days = minutes / 1440;
      return Math.floor(days);
    },
    last30Days() {
      let filtered = this.cycleTime.filter(item => {
        if (!item.sublet_complete_timestamp) {
          let times = [
            item.shop_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let day = 86400000;
          let thirty = day * 30;
          let lastThirty = Date.now() - thirty;
          if (max >= lastThirty) {
            return item;
          }
        } else {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let day = 86400000;
          let thirty = day * 30;
          let lastThirty = Date.now() - thirty;
          if (max >= lastThirty) {
            return item;
          }
        }
      });
      this.lastThirty = filtered;
    },
    last90Days() {
      let filtered = this.cycleTime.filter(item => {
        if (!item.sublet_complete_timestamp) {
          let times = [
            item.shop_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let day = 86400000;
          let ninety = day * 90;
          let lastNinety = Date.now() - ninety;
          if (max >= lastNinety) {
            return item;
          }
        } else {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let day = 86400000;
          let thirty = day * 30;
          let ninety = day * 90;
          let lastNinety = Date.now() - ninety;
          if (max >= lastNinety) {
            return item;
          }
        }
      });
      this.lastNinety = filtered;
    },
    shopCycle30() {
      let age = 0;
      this.lastThirty.forEach(item => {
        let d = item.shop_complete_timestamp - item.initial_timestamp;
        age = age + d;
      });
      let avgAge = age / this.lastThirty.length;
      let minutes = avgAge / 60000;
      let days = minutes / 1440;

      return `${Math.floor(days)}`;
    },
    subletInspectionCycle30() {
      let age = 0;
      this.lastThirty.forEach(item => {
        let d =
          item.sublet_inspection_complete_timestamp - item.initial_timestamp;
        age = age + d;
      });
      let avgAge = age / this.lastThirty.length;
      let minutes = avgAge / 60000;
      let days = minutes / 1440;

      return `${Math.floor(days)}`;
    },
    subletCycle30() {
      let age = 0;
      let filtered = this.lastThirty.filter(item => {
        if (item.sublet_complete_timestamp) {
          return item;
        }
      });
      if (filtered.length > 0) {
        filtered.forEach(item => {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp
          ];
          let max = Math.max(...times);

          let d = item.sublet_complete_timestamp - max;
          age = age + d;
        });
        let avgAge = age / filtered.length;
        let minutes = avgAge / 60000;
        let days = minutes / 1440;
        return `${Math.floor(days)}`;
      } else {
        return "No request have gone through sublet";
      }
    },
    detailCycle30() {
      let age = 0;
      this.lastThirty.forEach(item => {
        let times = [];
        if (item.sublet_complete_timestamp) {
          times = [
            item.shop_complete_timestamp,
            item.sublet_complete_timestamp
          ];
        } else {
          times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp
          ];
        }

        let max = Math.max(...times);
        let d = item.detail_complete_timestamp - max;
        age = age + d;
      });
      let avgAge = age / this.lastThirty.length;
      let minutes = avgAge / 60000;
      let days = minutes / 1440;
      return `${Math.floor(days)}`;
    },
    shopCycle90() {
      let age = 0;
      this.lastNinety.forEach(item => {
        let d = item.shop_complete_timestamp - item.initial_timestamp;
        age = age + d;
      });
      let avgAge = age / this.lastNinety.length;
      let minutes = avgAge / 60000;
      let days = minutes / 1440;

      return `${Math.floor(days)}`;
    },
    subletInspectionCycle90() {
      let age = 0;
      this.lastNinety.forEach(item => {
        let d =
          item.sublet_inspection_complete_timestamp - item.initial_timestamp;
        age = age + d;
      });
      let avgAge = age / this.lastNinety.length;
      let minutes = avgAge / 60000;
      let days = minutes / 1440;

      return `${Math.floor(days)}`;
    },
    subletCycle90() {
      let age = 0;
      let filtered = this.lastNinety.filter(item => {
        if (item.sublet_complete_timestamp) {
          return item;
        }
      });
      if (filtered.length > 0) {
        filtered.forEach(item => {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp
          ];
          let max = Math.max(...times);

          let d = item.sublet_complete_timestamp - max;
          age = age + d;
        });
        let avgAge = age / filtered.length;
        let minutes = avgAge / 60000;
        let days = minutes / 1440;
        return `${Math.floor(days)}`;
      } else {
        return "No request have gone through sublet";
      }
    },
    detailCycle90() {
      let age = 0;
      this.lastNinety.forEach(item => {
        let times = [];
        if (item.sublet_complete_timestamp) {
          times = [
            item.shop_complete_timestamp,
            item.sublet_complete_timestamp
          ];
        } else {
          times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp
          ];
        }

        let max = Math.max(...times);
        let d = item.detail_complete_timestamp - max;
        age = age + d;
      });
      let avgAge = age / this.lastNinety.length;
      let minutes = avgAge / 60000;
      let days = minutes / 1440;
      return `${Math.floor(days)}`;
    },
    color() {
      if (this.averageCycleTime > this.averageCycleTime90) {
        this.arrow = "mdi-arrow-up-bold";
        return "bad";
      } else if (this.averageCycleTime90 === this.averageCycleTime) {
        return;
      } else {
        this.arrow = "mdi-arrow-down-bold";
        return "good";
      }
    },
    percentage() {
      let decimal = this.averageCycleTime / this.averageCycleTime90;
      let percentage = (1 - decimal) * 100;
      return `${Math.floor(percentage)}%`;
    }
  },
  methods: {
    subletStatusFormat(mili, i) {
      if (i !== undefined) {
        if (!i.sublet_inspection_complete_timestamp) {
          return "Inspection not performed";
        } else if (
          i.sublet_inspection_complete_timestamp &&
          i.sublet === true
        ) {
          return "In process";
        } else if (!mili) {
          return "No sublet";
        } else {
          return new Date(mili).toLocaleDateString();
        }
      } else {
      }
    },
    dateFormat(mili, i) {
      if (i !== undefined) {
        if (i.detail === true) {
          return "In process";
        } else if (i.detail_complete_timestamp) {
          return "Detail complete";
        } else {
          return "Waiting on process";
        }
      } else {
        if (!mili) {
          return "In process";
        } else {
          return new Date(mili).toLocaleDateString();
        }
      }
    },
    filterCycle() {
      let result = this.cycle.filter(c => {
        if (
          c.shop_complete_timestamp &&
          c.sublet_inspection_complete_timestamp &&
          c.detail_complete_timestamp
        ) {
          return !c.shop_delete_timestamp;
        }
      });
      this.cycleTime = result;
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
    },
    mergeInProcessLimit() {
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
      let sorted = allNoDuplicates.sort(function(a, b) {
        return a.initial_timestamp - b.initial_timestamp;
      });
      let limited = sorted.splice(0, 20);

      this.inProcessLimit = limited;
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
    },
    elapsedTime(i) {
      let minutes = Math.floor(
        (this.currentTime - i.initial_timestamp) / 60000
      );
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
        .where("sublet", "==", true),
      cycle: db
        .collection("tpo")
        .where("shop", "==", false)
        .where("sublet_inspection", "==", false)
        .where("sublet", "==", false)
        .where("detail", "==", false)
    };
  }
};
</script>

<style scoped>
#inprocesschart {
  max-width: 500px;
}
.vl {
  border-left: 1px solid grey;
  height: 450px;
}
.good {
  color: green;
}
.bad {
  color: red;
}
</style>
