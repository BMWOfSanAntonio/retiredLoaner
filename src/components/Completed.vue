<template>
  <v-card class="mt-2">
    <v-card-text>
      <v-row align="center">
        <v-col cols="12">
          <MetricSectionHeader title="Completed" />
        </v-col>
        <v-col cols="4">
          <LargeTotalArrow
            :percentage="percentage"
            :arrow="arrow"
            :center="color"
            :largeCalc="averageCycleTime"
            largeTitle="Avg. Cycle Time 30d"
          />
        </v-col>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-col cols="4">
          <MetricLabel
            title="Num. Vehicles Complete"
            :calculation="lastThirty.length"
          />
          <MetricLabel title="Shop Cycle Time" :calculation="shopCycle30" />
          <MetricLabel
            title="Sublet Inspection Cycle Time"
            :calculation="subletInspectionCycle30"
          />
        </v-col>
        <v-col cols="3">
          <MetricLabel title="Sublet Cycle Time" :calculation="subletCycle30" />
          <MetricLabel title="Detail Cycle Time" :calculation="detailCycle30" />
        </v-col>
      </v-row>
      <v-divider class="mx-4"></v-divider>
      <v-row>
        <v-row align="center">
          <v-col cols="4">
            <LargeTotal
              largeTitle="Avg. Cycle Time 90d"
              :largeCalc="averageCycleTime90"
            />
          </v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col cols="4">
            <MetricLabel
              title="Num. Vehicles Complete"
              :calculation="lastNinety.length"
            />
            <MetricLabel title="Shop Cycle Time" :calculation="shopCycle90" />
            <MetricLabel
              title="Sublet Inspection Cycle Time"
              :calculation="subletInspectionCycle90"
            /> </v-col
          ><v-col cols="3">
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
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import MetricLabel from "../components/MetricLabel";
import LargeTotal from "../components/LargeTotal";
import LargeTotalArrow from "../components/LargeTotalArrow";
import MetricSectionHeader from "../components/MetricSectionHeader";

export default {
  name: "Completed",
  props: ["lastThirty", "lastNinety"],
  components: {
    MetricLabel,
    MetricSectionHeader,
    LargeTotalArrow,
    LargeTotal
  },
  data() {
    return {
      arrow: null
    };
  },
  computed: {
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
    shopCycle30() {
      let age = 0;
      this.lastThirty.forEach(item => {
        let d = item.shop_complete_timestamp - item.initial_timestamp;
        age = age + d;
      });
      let avgAge = age / this.lastThirty.length;
      let minutes = avgAge / 60000;
      let days = minutes / 1440;

      return `${Math.floor(days)} days`;
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
        return `${Math.floor(days)} days`;
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
      return `${Math.floor(days)} days`;
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

      return `${Math.floor(days)} days`;
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

      return `${Math.floor(days)} days`;
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

      return `${Math.floor(days)} days`;
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
        return `${Math.floor(days)} days`;
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
      return `${Math.floor(days)} days`;
    },
    percentage() {
      let decimal = this.averageCycleTime / this.averageCycleTime90;
      let percentage = (1 - decimal) * 100;
      return `${Math.floor(percentage)}%`;
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
    }
  }
};
</script>
