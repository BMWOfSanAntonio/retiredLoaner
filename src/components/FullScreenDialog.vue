<template>
  <v-row justify="center">
    <!-- information button -->
    <InformationButton />
    <!-- start of the dialog -->
    <v-dialog
      v-model="$store.state.fullscreenDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!-- process status timeline start -->
      <v-card>
        <!-- dialog header -->
        <DialogHeader :item="item" />
        <v-container>
          <v-list three-line subheader>
            <v-subheader>Process Status</v-subheader>
            <template>
              <v-stepper class="elevation-0" value="0">
                <v-stepper-header>
                  <!-- check in -->
                  <CheckInStep
                    step="1"
                    :complete="true"
                    title="Check In Date"
                    :date="dateFormat(item.initial_timestamp)"
                    :time="timeFormat(item.initial_timestamp)"
                  />
                  <v-divider></v-divider>
                  <!-- Shop -->
                  <TwoChoice
                    step="2"
                    :callback="status(item, 'shop')"
                    title="Shop"
                    :completed="item.shop_complete_timestamp"
                    :date="dateFormat(item.shop_complete_timestamp)"
                    :time="timeFormat(item.shop_complete_timestamp)"
                    :user="item.shop_associate"
                  />
                  <v-divider></v-divider>
                  <!-- sublet inspection -->
                  <TwoChoice
                    step="3"
                    :callback="status(item, 'sublet inspection')"
                    title="Sublet Inspection"
                    :completed="item.sublet_inspection_complete_timestamp"
                    :date="
                      dateFormat(item.sublet_inspection_complete_timestamp)
                    "
                    :time="
                      timeFormat(item.sublet_inspection_complete_timestamp)
                    "
                    :user="item.sublet_instpection_associate"
                  />
                  <v-divider></v-divider>
                  <!-- sublet -->
                  <FourChoice
                    step="4"
                    :completed="
                      (item.sublet === false &&
                        item.sublet_inspection_complete_timestamp) ||
                        item.sublet_complete_timestamp
                    "
                    :callback="status(item, 'sublet')"
                    title="Sublet"
                    :waiting="
                      !item.shop_complete_timestamp ||
                        !item.sublet_inspection_complete_timestamp
                    "
                    :inProcess="item.sublet === true"
                    :complete="complete"
                    :final="
                      item.sublet === false &&
                        item.sublet_inspection_complete_timestamp
                    "
                    :date="dateFormat(item.sublet_complete_timestamp)"
                    :time="timeFormat(item.sublet_complete_timestamp)"
                    :associate="item.sublet_associate"
                    finalInformation="No Sublet"
                    :finalSubInformation="item.sublet_instpection_associate"
                  />
                  <v-divider></v-divider>
                  <!-- detail -->
                  <ThreeChoice
                    step="5"
                    :completed="item.detail_complete_timestamp"
                    :callback="status(item, 'detail')"
                    title="Detail"
                    :inProcess="item.detail === true"
                    :complete="item.detail_complete_timestamp"
                    :date="dateFormat(item.detail_complete_timestamp)"
                    :time="timeFormat(item.detail_complete_timestamp)"
                    :waiting="item.detail === false"
                  />
                </v-stepper-header>
              </v-stepper>
            </template>
          </v-list>
          <!-- section one -->
          <SectionInformation :item="item" />
          <v-divider></v-divider>
          <!-- section two -->
          <v-list three-line subheader>
            <v-subheader>Additional Details</v-subheader>
            <AdditionalInformationLabel label="Age" :value="numberDays(item)" />
            <AdditionalInformationLabel
              label="Check In Date"
              :value="dateFormat(item.initial_timestamp)"
            />
            <AdditionalInformationLabel
              label=""
              :value="dateFormat(item.initial_timestamp)"
            />
          </v-list>
          <v-divider></v-divider>
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
import TwoChoice from "./fullDialog/TwoChoice";
import ThreeChoice from "./fullDialog/ThreeChoice";
import FourChoice from "./fullDialog/FourChoice";
import SectionInformation from "./fullDialog/SectionInformation";

export default {
  name: "FullScreenDialog",
  props: ["item"],
  components: {
    AdditionalInformationLabel,
    CheckInStep,
    InformationButton,
    DialogHeader,
    TwoChoice,
    ThreeChoice,
    FourChoice,
    SectionInformation
  },
  data() {
    return {
      dialog: false,
      time: null
    };
  },
  methods: {
    status(item, step) {
      // shop logic
      if (step === "shop") {
        // finished
        if (item.shop_complete_timestamp) {
          return true;
        } else {
          // working
          return false;
        }
      } else if (step === "sublet inspection") {
        if (item.sublet_inspection_complete_timestamp) {
          return true;
        } else {
          return false;
        }
      } else if (step === "sublet") {
        // no sublet
        if (item.sublet_complete_timestamp) {
          return true;
        } else if (item.sublet === true) {
          // sublet in process
          return false;
        } else if (
          !item.shop_complete_timestamp ||
          !item.sublet_inspection_complete_timestamp
        ) {
          // waiting on process to start
          return false;
        } else {
          return true;
        }
      } else if (step === "detail") {
        if (item.detail === true) {
          return false;
        } else if (item.detail_complete_timestamp) {
          return true;
        } else {
          false;
        }
      } else {
        return false;
      }
    },
    dateFormat(i) {
      return new Date(i).toLocaleDateString();
    },
    timeFormat(i) {
      return new Date(i).toLocaleTimeString();
    },
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
    }
  }
};
</script>
