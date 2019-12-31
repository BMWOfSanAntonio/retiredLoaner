<template>
  <v-card class="mt-2">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <MetricSectionHeader title="Daily Metrics" />
        </v-col>
        <v-col>
          <MetricLabel
            title="Avg Checked in Per Day (30d)"
            :calculation="averagePerDay"
          />
          <MetricLabel
            title="Avg Complete Per Day (30d)"
            :calculation="averageCompletePerDay"
          />
        </v-col>
        <v-col>
          <MetricLabel
            title="Avg Checked in Per Day (90d)"
            :calculation="averagePerDay90"
          />
          <MetricLabel
            title="Avg Complete Per Day (90d)"
            :calculation="averageCompletePerDay90"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import MetricSectionHeader from "../components/MetricSectionHeader";
import MetricLabel from "../components/MetricLabel";

export default {
  name: "DailyMetrics",
  components: {
    MetricSectionHeader,
    MetricLabel
  },
  props: ["lastThirty", "lastNinety"],
  data() {
    return {};
  },
  computed: {
    averagePerDay() {
      let dates = [];
      let prev;
      this.lastThirty.forEach(item => {
        if (item.initial_timestamp > Date.now() - 86400000 * 30) {
          let ms = item.initial_timestamp;
          let msPerDay = 86400 * 1000;
          let beginning = ms - (ms % msPerDay);
          beginning += new Date().getTimezoneOffset() * 60 * 1000;
          dates.push(beginning);
        }
      });
      dates.sort();

      let days = [];
      let occur = [];
      let avg = 0;
      for (var i = 0; i < dates.length; i++) {
        if (dates[i] !== prev) {
          days.push(dates[i]);
          occur.push(1);
        } else {
          occur[occur.length - 1]++;
        }
        prev = dates[i];
      }
      if (occur.length > 0) {
        console.log(avg);
        occur.forEach(item => {
          console.log(avg, item);
          avg = avg + item;
        });
        console.log(avg);
        let test = avg / occur.length;
        return `${Math.round(test)} vehicles`;
      } else {
        return "Broken";
      }
    },
    averagePerDay90() {
      let dates = [];
      let prev;
      this.lastNinety.forEach(item => {
        if (item.initial_timestamp > Date.now() - 86400000 * 90) {
          let ms = item.initial_timestamp;
          let msPerDay = 86400 * 1000;
          let beginning = ms - (ms % msPerDay);
          beginning += new Date().getTimezoneOffset() * 60 * 1000;
          dates.push(beginning);
        }
      });
      dates.sort();
      let days = [];
      let occur = [];
      let avg = 0;
      for (var i = 0; i < dates.length; i++) {
        if (dates[i] !== prev) {
          days.push(dates[i]);
          occur.push(1);
        } else {
          occur[occur.length - 1]++;
        }
        prev = dates[i];
      }
      if (occur.length > 0) {
        console.log(avg);
        occur.forEach(item => {
          console.log(avg, item);
          avg = avg + item;
        });
        console.log(avg);
        let test = avg / occur.length;
        return `${Math.round(test)} vehicles`;
      } else {
        return "Broken";
      }
    },
    averageCompletePerDay() {
      let dates = [];
      let prev;
      this.lastThirty.forEach(item => {
        let times = [
          item.shop_complete_timestamp,
          item.sublet_inspection_complete_timestamp,
          item.detail_complete_timestamp
        ];
        let max = Math.max(...times);
        if (max > Date.now() - 86400000 * 30) {
          let ms = max;
          let msPerDay = 86400 * 1000;
          let beginning = ms - (ms % msPerDay);
          beginning += new Date().getTimezoneOffset() * 60 * 1000;
          dates.push(beginning);
        }
      });
      dates.sort();
      let days = [];
      let occur = [];
      let avg = 0;
      for (var i = 0; i < dates.length; i++) {
        if (dates[i] !== prev) {
          days.push(dates[i]);
          occur.push(1);
        } else {
          occur[occur.length - 1]++;
        }
        prev = dates[i];
      }
      if (occur.length > 0) {
        console.log(avg);
        occur.forEach(item => {
          console.log(avg, item);
          avg = avg + item;
        });
        console.log(avg);
        let test = avg / occur.length;
        return `${Math.round(test)} vehicles`;
      } else {
        return "Broken";
      }
    },
    averageCompletePerDay90() {
      let dates = [];
      let prev;
      this.lastNinety.forEach(item => {
        let times = [
          item.shop_complete_timestamp,
          item.sublet_inspection_complete_timestamp,
          item.detail_complete_timestamp
        ];
        let max = Math.max(...times);
        if (max > Date.now() - 86400000 * 90) {
          let ms = max;
          let msPerDay = 86400 * 1000;
          let beginning = ms - (ms % msPerDay);
          beginning += new Date().getTimezoneOffset() * 60 * 1000;
          dates.push(beginning);
        }
      });
      dates.sort();
      let days = [];
      let occur = [];
      let avg = 0;
      for (var i = 0; i < dates.length; i++) {
        if (dates[i] !== prev) {
          days.push(dates[i]);
          occur.push(1);
        } else {
          occur[occur.length - 1]++;
        }
        prev = dates[i];
      }
      if (occur.length > 0) {
        console.log(avg);
        occur.forEach(item => {
          console.log(avg, item);
          avg = avg + item;
        });
        console.log(avg);
        let test = avg / occur.length;
        return `${Math.round(test)} vehicles`;
      } else {
        return "Broken";
      }
    }
  }
};
</script>
