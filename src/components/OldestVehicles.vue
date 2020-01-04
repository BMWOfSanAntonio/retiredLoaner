<template>
  <v-card>
    <v-card-title class="text">
      <MetricSectionHeader title="Oldest 20 Vehicles" />
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
            item.shop_complete_timestamp &&
              item.sublet === true &&
              item.sublet_inspection_complete_timestamp
          "
        >
          <Chip
            color="warning"
            :calculation="
              subletStatusFormat(item.sublet_complete_timestamp, item)
            "
          />
        </div>
        <div
          v-else-if="
            !item.shop_complete_timestamp &&
              item.sublet_inspection_complete_timestamp
          "
        >
          <Chip
            color="error"
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
            :calculation="dateFormat(item.detail_complete_timestamp, item)"
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
            :calculation="dateFormat(item.detail_complete_timestamp, item)"
          />
        </div>
        <!-- Detail Complete -->
        <div v-if="item.detail_complete_timestamp">
          <Chip
            color="success"
            :calculation="dateFormat(item.detail_complete_timestamp, item)"
          />
        </div>
      </template>
    </v-data-table>
    <!-- MAKE SHIFT REPORT -->
    <!-- //?<v-data-table :headers="dataDumpHeaders" :items="inProcess">
      <template v-slot:item.shopToDetail="{ item }">
        <div v-if="item.shopToDetail && item.shopToDetail === true">
          Yes
        </div>
        <div v-if="!item.shopToDetail">No</div>
      </template>
    </v-data-table> -->
  </v-card>
</template>

<script>
import MetricSectionHeader from "../components/MetricSectionHeader";
import Chip from "../components/Chip";

export default {
  name: "OldestVehicle",
  components: {
    MetricSectionHeader,
    Chip
  },
  props: ["inProcessLimit", "inProcess"],
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
      search: ""
    };
  },
  methods: {
    elapsedTime(i) {
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
    subletStatusFormat(mili, i) {
      if (i !== undefined) {
        if (!i.sublet_inspection_complete_timestamp) {
          return "Inspection not performed";
        } else if (
          i.sublet_inspection_complete_timestamp &&
          i.shop_complete_timestamp &&
          i.sublet === true
        ) {
          return "In process";
        } else if (
          i.sublet_inspection_complete_timestamp &&
          !i.shop_complete_timestamp
        ) {
          return "Waiting on process";
        } else if (!mili) {
          return "No sublet";
        } else {
          return new Date(mili).toLocaleDateString();
        }
      }
    }
  }
};
</script>
