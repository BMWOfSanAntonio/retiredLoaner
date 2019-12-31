<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Information</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >Additional Information - {{ item.vin }}</v-toolbar-title
          >
        </v-toolbar>
        <v-container>
          <!-- section three -->
          <v-list three-line subheader>
            <v-subheader>Process Status</v-subheader>
            <template>
              <v-stepper class="elevation-0" value="0">
                <v-stepper-header>
                  <v-stepper-step step="1" color="success" complete
                    >Check In Date
                    <small
                      >{{ dateFormat(item.initial_timestamp) }} @
                      {{ timeFormat(item.initial_timestamp) }}</small
                    ></v-stepper-step
                  >
                  <v-divider></v-divider>
                  <v-stepper-step
                    step="2"
                    :complete="item.shop_complete_timestamp"
                    color="success"
                    :rules="[() => status(item, 'shop')]"
                  >
                    Shop
                    <template v-if="item.shop_complete_timestamp">
                      <small
                        >{{ dateFormat(item.shop_complete_timestamp) }} @
                        {{ timeFormat(item.shop_complete_timestamp) }} </small
                      ><small>{{ item.shop_associate }}</small>
                    </template>
                    <template v-else>
                      <small>Currently in Process</small>
                    </template>
                  </v-stepper-step>

                  <v-divider></v-divider>
                  <v-stepper-step
                    step="3"
                    :complete="item.sublet_inspection_complete_timestamp"
                    color="success"
                    :rules="[() => status(item, 'sublet inspection')]"
                  >
                    Sublet Inspection
                    <template v-if="item.sublet_inspection_complete_timestamp">
                      <small
                        >{{
                          dateFormat(item.sublet_inspection_complete_timestamp)
                        }}
                        @
                        {{
                          timeFormat(item.sublet_inspection_complete_timestamp)
                        }} </small
                      ><small v-if="item.sublet_instpection_associate">{{
                        item.sublet_instpection_associate
                      }}</small>
                      <small v-else>{{
                        item.sublet_inspection_associate
                      }}</small>
                    </template>
                    <template v-else>
                      <small>Currently in Process</small>
                    </template>
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step
                    step="4"
                    :complete="
                      (item.sublet === false &&
                        item.sublet_inspection_complete_timestamp) ||
                        item.sublet_complete_timestamp
                    "
                    color="success"
                    :rules="[() => status(item, 'sublet')]"
                  >
                    Sublet
                    <small
                      v-if="
                        !item.shop_complete_timestamp ||
                          !item.sublet_inspection_complete_timestamp
                      "
                      >Waiting on Process</small
                    >
                    <small v-else-if="item.sublet === true"
                      >Currently in Process</small
                    >
                    <template v-else-if="item.sublet_complete_timestamp">
                      <small
                        >{{ dateFormat(item.sublet_complete_timestamp) }} @
                        {{ timeFormat(item.sublet_complete_timestamp) }}</small
                      >
                      <small>{{ item.sublet_associate }}</small>
                    </template>
                    <template
                      v-else-if="
                        item.sublet === false &&
                          item.sublet_inspection_complete_timestamp
                      "
                    >
                      <small>No Sublet</small>
                      <small>{{ item.sublet_inspection_associate }}</small>
                    </template>
                  </v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step
                    step="5"
                    :complete="item.detail_complete_timestamp"
                    color="success"
                    :rules="[() => status(item, 'detail')]"
                    >Detail
                    <!-- sublet_inspection  -->
                    <small v-if="item.detail === true"
                      >Currently in Process</small
                    >
                    <small v-else-if="item.detail_complete_timestamp"
                      >{{ dateFormat(item.detail_complete_timestamp) }} @
                      {{ timeFormat(item.detail_complete_timestamp) }}</small
                    >
                    <small v-else-if="item.detail === false"
                      >Waiting on Process</small
                    >
                  </v-stepper-step>
                </v-stepper-header>
              </v-stepper>
            </template>
          </v-list>
          <!-- section one -->
          <v-list three-line subheader>
            <v-subheader>Vehicle Information</v-subheader>
            <v-row>
              <v-col>
                <AdditionalInformationLabel label="VIN" :value="item.vin" />
                <AdditionalInformationLabel label="Year" :value="item.year" />
              </v-col>
              <v-col>
                <AdditionalInformationLabel
                  label="Repair Order #"
                  :value="item.ro"
                />
                <AdditionalInformationLabel label="Make" :value="item.make" />
              </v-col>
              <v-col>
                <AdditionalInformationLabel
                  v-if="item.type"
                  label="Type"
                  :value="item.type"
                />
                <AdditionalInformationLabel
                  v-else
                  label="Type"
                  value="No type selected"
                />
                <AdditionalInformationLabel label="Model" :value="item.model" />
              </v-col>
            </v-row>
          </v-list>
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

export default {
  name: "FullScreenDialog",
  props: ["item"],
  components: {
    AdditionalInformationLabel
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
