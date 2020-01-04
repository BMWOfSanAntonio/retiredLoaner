<template>
  <v-container fluid>
    <v-row>
      <v-col sm="12" md="12" lg="5">
        <!-- in process -->
        <InProcess
          :shop="shop"
          :sublet="sublet"
          :subletInspection="subletInspection"
          :detail="detail"
          :subletQueue="subletQueue"
          :zeroFifteen="zeroFifteen"
          :sixteenThirty="sixteenThirty"
          :thirtyOne="thirtyOne"
          :inProcess="inProcess"
          :numInProcess="numInProcess"
        />
        <!-- complete -->
        <Completed :lastThirty="lastThirty" :lastNinety="lastNinety" />
        <!-- daily metrics -->
        <!-- //?<DailyMetrics :lastThirty="lastThirty" :lastNinety="lastNinety" /> -->
        <!-- bmw vs non bmw breakdown -->
        <!-- //?<BMWBreakdown :lastThirty="lastThirty" :lastNinety="lastNinety" /> -->
      </v-col>
      <v-col sm="12" lg="7">
        <!-- oldest vehicle table -->
        <OldestVehicles
          :inProcessLimit="inProcessLimit"
          :inProcess="inProcess"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "../main";
import firebase from "firebase";

// main components
import InProcess from "../components/InProcess";
import Completed from "../components/Completed";
import OldestVehicles from "../components/OldestVehicles";
import DailyMetrics from "../components/DailyMetrics";
import BMWBreakdown from "../components/BMWBreakdown";
export default {
  name: "Reports",
  components: {
    InProcess,
    Completed,
    OldestVehicles,
    DailyMetrics,
    BMWBreakdown
  },
  data() {
    return {
      dataDumpHeaders: [
        {
          text: "ID",
          value: "id"
        },
        {
          text: "Stock #",
          value: "vin"
        },
        {
          text: "RO #",
          value: "ro"
        },
        {
          text: "Type",
          value: "type"
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
          text: "Initial Timestamp",
          value: "initial_timestamp"
        },
        {
          text: "Shop Complete Timestamp",
          value: "shop_complete_timestamp"
        },
        {
          text: "Sublet Inspection Complete Timestamp",
          value: "sublet_inspection_complete_timestamp"
        },
        {
          text: "Sublet Complete Timestamp",
          value: "sublet_complete_timestamp"
        },
        {
          text: "Detail Complete Timestamp",
          value: "detail_complete_timestamp"
        },
        {
          text: "Sent to Detail",
          value: "shopToDetail"
        },
        {
          text: "Sent to Detail Timestamp",
          value: "toDetailTimestamp"
        },
        {
          text: "Shop Delete Timestamp",
          value: "shop_delete_timestamp"
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
      thirtyOne: null
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
    // calculates lastThirty
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
    // calculates lastNinety
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
    }
  },
  methods: {
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
#chart {
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
.text {
  color: rgba(0, 0, 0, 0.54);
}
</style>
