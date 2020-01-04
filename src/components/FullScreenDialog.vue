<template>
  <v-row justify="center">
    <!-- information button -->
    <InformationButton @open-dialog="updateDialog()" />
    <!-- start of the dialog -->
    <v-dialog
      v-model="fullscreenDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!-- process status timeline start -->
      <v-card>
        <!-- dialog header -->
        <DialogHeader @close-dialog="updateDialog()" :item="item" />
        <v-container class="test">
          <div class="progress-stepper">
            <div class="subtitle">Process Status</div>
          </div>
          <v-row justify="center" align="center">
            <v-col>
              <CheckInStep
                class="wrapper"
                :date="dateFormat(item.initial_timestamp)"
                :time="timeFormat(item.initial_timestamp)"
                :item="item"
              />
            </v-col>
            <v-divider></v-divider>
            <v-col>
              <Shop
                class="wrapper"
                :date="dateFormat(item.shop_complete_timestamp)"
                :time="timeFormat(item.shop_complete_timestamp)"
                :item="item"
              />
            </v-col>
            <v-divider></v-divider>
            <v-col>
              <SubletInspection
                class="wrapper"
                :date="dateFormat(item.sublet_inspection_complete_timestamp)"
                :time="timeFormat(item.sublet_inspection_complete_timestamp)"
                :item="item"
              />
            </v-col>
            <v-divider></v-divider>
            <v-col>
              <Sublet
                :date="dateFormat(item.sublet_complete_timestamp)"
                :time="timeFormat(item.sublet_complete_timestamp)"
                :item="item"
              />
            </v-col>
            <v-divider></v-divider>

            <v-col>
              <Detail
                class="wrapper"
                :date="dateFormat(item.detail_complete_timestamp)"
                :time="timeFormat(item.detail_complete_timestamp)"
                :item="item"
              />
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12">
              <v-subheader>Vehicle Information</v-subheader>
            </v-col>
            <v-col
              cols="2"
              v-for="item in vehicleInformation"
              :key="item.label"
            >
              <SectionInformation :label="item.label" :value="item.value" />
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12">
              <v-subheader>Additional Details</v-subheader>
            </v-col>
            <v-col v-for="item in additionalInformation" :key="item.label">
              <SectionInformation :label="item.label" :value="item.value" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import AdditionalInformationLabel from "../components/AdditionalInformationLabel";
import CheckInStep from "./fullDialog/CheckInStep";
import InformationButton from "./fullDialog/InformationButton";
import DialogHeader from "./fullDialog/DialogHeader";
import Shop from "./fullDialog/Shop";
import SubletInspection from "./fullDialog/SubletInspection";
import Sublet from "./fullDialog/Sublet";
import Detail from "./fullDialog/Detail";
import ThreeChoice from "./fullDialog/ThreeChoice";
import FourChoice from "./fullDialog/FourChoice";
import SectionInformation from "./fullDialog/SectionInformation";

export default {
  name: "FullScreenDialog",
  props: ["item"],
  components: {
    CheckInStep,
    InformationButton,
    DialogHeader,
    Shop,
    SubletInspection,
    Sublet,
    Detail,
    SectionInformation
  },
  data() {
    return {
      dialog: false,
      time: null,
      fullscreenDialog: false,
      vehicleInformation: [
        {
          label: "VIN",
          value: this.item.vin
        },
        {
          label: "Repair Order #",
          value: this.item.ro
        },
        {
          label: "Year",
          value: this.item.year
        },
        {
          label: "Make",
          value: this.item.make
        },
        {
          label: "Model",
          value: this.item.model
        },
        {
          label: "Color",
          value: this.item.color
        },
        {
          label: "Type",
          value: this.item.type
        },
        {
          label: "Sold?",
          value: this.item.sold
        },
        {
          label: "Pictures",
          value: this.item.pictures
        }
      ],
      additionalInformation: [
        {
          label: "Age",
          value: this.numberDays(this.item)
        },
        {
          label: "Check In Date",
          value: this.dateFormat(this.item.initial_timestamp)
        },
        {
          label: "Shop In Queue Time",
          value: this.timeDifference(
            this.item.shop_complete_timestamp,
            this.item.initial_timestamp
          )
        },
        {
          label: "Sublet Inspeciton Queue Time",
          value: this.timeDifference(
            this.item.sublet_inspection_complete_timestamp,
            this.item.initial_timestamp
          )
        },
        {
          label: "Sublet Queue Time",
          value: this.subletTimeDifference(this.item)
        },
        {
          label: "Detail Queue Time",
          value: this.detailTimeDifference(this.item)
        }
      ]
    };
  },
  methods: {
    updateDialog() {
      this.fullscreenDialog = !this.fullscreenDialog;
    },
    dateFormat(i) {
      return new Date(i).toLocaleDateString();
    },
    timeFormat(i) {
      return new Date(i).toLocaleTimeString();
    },
    minuteFormat(minutes) {
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
    numberDays(i) {
      let minutes = Math.floor((Date.now() - i.initial_timestamp) / 60000);
      return this.minuteFormat(minutes);
    },
    timeDifference(big, small) {
      let minutes = Math.round((big - small) / 60000);
      return this.minuteFormat(minutes);
    },
    subletTimeDifference(item) {
      let times = [
        item.shop_complete_timestamp,
        item.sublet_inspection_complete_timestamp
      ];
      let max = Math.max(...times);
      // sublet is complete
      if (item.sublet_complete_timestamp) {
        let minutes = Math.round(
          (item.sublet_complete_timestamp - max) / 60000
        );
        this.minuteFormat(minutes);
      } else {
        if (item.sublet === true) {
          let minutes = Math.round((Date.now() - max) / 60000);
          return this.minuteFormat(minutes);
        } else if (!item.sublet_complete_timestamp) {
          return `No Sublet to Perform`;
        } else {
          return `Waiting on Process`;
        }
      }
      // sublet is in process
      // waiting on process
      // no sublet to perform

      if (item.sublet_complete_timestamp) {
      } else if (
        item.sublet_inspection_complete_timestamp &&
        item.sublet === false
      ) {
        return "No Sublet Needed";
      } else if (item.sublet === true) {
        let times = [
          item.shop_complete_timestamp,
          item.sublet_inspection_complete_timestamp
        ];
        let max = Math.max(...times);
        let minutes = Math.round((Date.now() - max) / 60000);
        return this.minuteFormat(minutes);
      } else {
        return "Waiting on Process";
      }
    },
    detailTimeDifference(item) {
      // detail is complete
      if (item.detail_complete_timestamp) {
        if (item.toDetailTimestamp) {
          // detail complete, went to detail early
          let minutes = Math.round(
            (item.detail_complete_timestamp - item.toDetailTimestamp) / 600000
          );
          return this.minuteFormat(minutes);
        } else {
          // detail complete, went through normal process
          let times = [
            item.shop_complete_timestamp,
            item.sublet_inspection_complete_timestamp,
            item.sublet_complete_timestamp
          ];
          let max = Math.max(...times);
          let minutes = Math.round(
            (item.detail_complete_timestamp - max) / 60000
          );
          return this.minuteFormat(minutes);
        }
      } else {
        if (item.detail === true) {
          // in process and sent early
          if (item.toDetailTimestamp) {
            let minutes = Math.round(
              (Date.now() - item.toDetailTimestamp) / 60000
            );
            return this.minuteFormat(minutes);
          } else {
            // in process and followed normal flow
            let times = [
              item.shop_complete_timestamp,
              item.sublet_inspection_complete_timestamp,
              item.sublet_complete_timestamp
            ];
            let max = Math.max(...times);
            let minutes = Math.round((Date.now() - max) / 60000);
            return this.minuteFormat(minutes);
          }
        } else {
          return "waiting on process";
        }
      }

      // did it have sublet
      // did not have sublet
    }
  }
};
</script>

<style scoped>
.wrapper {
  font-size: 12px;
}
.test {
  padding: 20px 125px;
}
</style>
