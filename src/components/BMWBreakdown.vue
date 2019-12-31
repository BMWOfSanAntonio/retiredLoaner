<template>
  <v-card class="mt-2">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <MetricSectionHeader title="BMW vs Non-BMW" />
        </v-col>
        <v-col cols="3">
          <LargeTotal largeTitle="BMW (30d)" :largeCalc="totalBMW30" />
        </v-col>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-col cols="3">
          <LargeTotal largeTitle="BMW (90d)" :largeCalc="totalBMW90" />
        </v-col>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-col>
          <MetricLabel
            title="Average Cycle Time (30d)"
            :calculation="totalBMW30Cycle"
          />
          <MetricLabel
            title="Average Cycle Time (90d)"
            :calculation="totalBMW90Cycle"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <LargeTotal largeTitle="Non BMW (30d)" :largeCalc="totalNonBMW30" />
        </v-col>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-col cols="3">
          <LargeTotal largeTitle="Non BMW (90d)" :largeCalc="totalNonBMW90" />
        </v-col>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-col>
          <MetricLabel
            title="Average Cycle Time (30d)"
            :calculation="totalNonBMW30Cycle"
          />
          <MetricLabel
            title="Average Cycle Time (90d)"
            :calculation="totalNonBMW90Cycle"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import MetricSectionHeader from "../components/MetricSectionHeader";
import LargeTotal from "../components/LargeTotal";
import MetricLabel from "../components/MetricLabel";

export default {
  name: "BMWBreakdown",
  components: {
    MetricSectionHeader,
    LargeTotal,
    MetricLabel
  },
  props: ["lastThirty", "lastNinety"],
  data() {
    return {};
  },
  computed: {
    totalBMW30() {
      let bmw = 0;
      this.lastThirty.filter(item => {
        if (item.make === "BMW") {
          return bmw++;
        }
      });
      return bmw;
    },
    totalNonBMW30() {
      let other = 0;
      this.lastThirty.filter(item => {
        if (item.make !== "BMW") {
          return other++;
        }
      });
      return other;
    },
    totalBMW90() {
      let bmw = 0;
      this.lastNinety.filter(item => {
        if (item.make === "BMW") {
          return bmw++;
        }
      });
      return bmw;
    },
    totalNonBMW90() {
      let other = 0;
      this.lastNinety.filter(item => {
        if (item.make !== "BMW") {
          other++;
        }
      });
      return other;
    },
    totalBMW30Cycle() {
      let filtered = this.lastThirty.filter(item => {
        if (item.make === "BMW") {
          return item;
        }
      });
      let final;
      filtered.forEach(item => {
        if (item.sublet_complete_timestamp) {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        } else {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        }
      });
      return Math.floor(final);
    },
    totalBMW90Cycle() {
      let filtered = this.lastNinety.filter(item => {
        if (item.make === "BMW") {
          return item;
        }
      });
      let final;
      filtered.forEach(item => {
        if (item.sublet_complete_timestamp) {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        } else {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        }
      });
      return Math.floor(final);
    },
    totalNonBMW30Cycle() {
      let filtered = this.lastThirty.filter(item => {
        if (item.make !== "BMW") {
          return item;
        }
      });
      let final;
      filtered.forEach(item => {
        if (item.sublet_complete_timestamp) {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        } else {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        }
      });
      return Math.floor(final);
    },
    totalNonBMW90Cycle() {
      let filtered = this.lastNinety.filter(item => {
        if (item.make !== "BMW") {
          return item;
        }
      });
      let final;
      filtered.forEach(item => {
        if (item.sublet_complete_timestamp) {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.sublet_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        } else {
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.detail_complete_timestamp
          ];
          let max = Math.max(...times);
          let initial = item.initial_timestamp;
          let difference = max - initial;
          let minutes = difference / 60000;
          final = minutes / 1440;
        }
      });
      return Math.floor(final);
    }
  }
};
</script>
