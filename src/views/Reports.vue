<template>
  <div>
    <v-card class="mx-auto mt-3 elevation-2" max-width="1500" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-container>
            <v-row justify="center" align="center">
              <v-col cols="4">
                <p class="main-metric-title">Total # In Progress</p>
                <p class="main-metric-information">{{ totalInProgress }}</p>
              </v-col>

              <v-col cols="2">
                <div class="font-weight-bold metric-title">Current Oldest:</div>
                <div class="metric-information">
                  Age: {{ oldestInProgress }} days
                </div>
                <div class="metric-information">VIN: {{ document.vin }}</div>
                <div class="metric-information">RO: {{ document.ro }}</div>
                <div class="metric-information">Make: {{ document.make }}</div>
                <div class="metric-information">Make: {{ document.model }}</div>
                <v-btn
                  class="mt-2"
                  small
                  color="primary"
                  outlined
                  dark
                  @click="dialog = true"
                >
                  See Oldest 15
                </v-btn>
                <!-- MODAL STARTS -->
                <div class="text-center">
                  <v-dialog v-model="dialog" width="500">
                    <v-card>
                      <v-card-title class="headline" primary-title>
                        Oldest 15 Vehicles in Progress
                      </v-card-title>

                      <v-card-text>
                        <table class="table">
                          <thead>
                            <th>Age</th>
                            <th>Stock #</th>
                            <th>RO #</th>
                            <th>Make</th>
                            <th>Model</th>
                          </thead>
                          <tbody>
                            <tr v-for="doc in oldestFifteen" :key="doc.id">
                              <td>{{ elapsedTime(doc) }}</td>
                              <td>{{ doc.vin }}</td>
                              <td>{{ doc.ro }}</td>
                              <td>{{ doc.make }}</td>
                              <td>{{ doc.model }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="dialog = false">
                          I accept
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
                <!-- MODEL ENDS -->
                <div class="font-weight-bold metric-title mt-3">
                  Average Age:
                </div>
                <div class="metric-information">
                  {{ inProgressAvgAge }} days
                </div>
              </v-col>
              <v-col>
                <v-row>
                  <v-col cols="12">
                    <div class="title text-center">Age Buckets</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="font-weight-bold metric-title">
                      0 - 15 Days
                    </div>
                    <div>{{ agezeroToFifteen }}</div>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold metric-title">
                      16 - 30 Days
                    </div>
                    <div>{{ agesixteenToThirty }}</div>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold metric-title">
                      31+ Days
                    </div>
                    <div>{{ ageThirtyPlus }}</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="font-weight-bold metric-title">
                      # in Shop
                    </div>
                    <div>{{ ageThirtyPlus }}</div>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold metric-title">
                      # in Sublet Inspection
                    </div>
                    <div>{{ ageThirtyPlus }}</div>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold metric-title">
                      # in Sublet
                    </div>
                    <div>{{ ageThirtyPlus }}</div>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold metric-title">
                      # in Detail
                    </div>
                    <div>{{ ageThirtyPlus }}</div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <p>Total cars complete last 30 days</p>
    <p>{{ completeLast30 }}</p>

    <p>Total cars complete last 90 days</p>
    <p>{{ completeLast90 }}</p>

    <p>Average Age of completed cars in last 30 days</p>
    <p>{{ averageAge }}</p>

    <p>Oldest car in progress</p>
    <p>{{ oldestInProgress }}</p>
  </div>
</template>

<script>
import { db } from "../main";
import firebase from "firebase";
export default {
  name: "Reports",
  data() {
    return {
      complete: [],
      complete90: [],
      averageAge30: [],
      inProgress: [],
      zeroToFifteen: [],
      sixteenToThirty: [],
      thirtyPlus: [],
      oldestFifteen: [],
      document: null,
      dialog: false
    };
  },
  computed: {
    totalInProgress() {
      return this.inProgress.length;
    },
    oldestInProgress() {
      let low = Date.now();
      this.inProgress.forEach(doc => {
        if (doc.initial_timestamp < low) {
          low = doc.initial_timestamp;
          this.document = {
            vin: doc.vin,
            ro: doc.ro,
            make: doc.make,
            model: doc.model
          };
        }
      });
      low = Date.now() - low;
      low = low / 60000;
      low = low / 1440;
      return Math.floor(low);
    },
    completeLast30() {
      return this.complete.length;
    },
    completeLast90() {
      return this.complete90.length;
    },
    agezeroToFifteen() {
      return this.zeroToFifteen.length;
    },
    agesixteenToThirty() {
      return this.sixteenToThirty.length;
    },
    ageThirtyPlus() {
      return this.thirtyPlus.length;
    },
    averageAge() {
      let age = 0;
      this.averageAge30.forEach(doc => {
        age = age + doc.initial_timestamp;
      });
      age = age / this.averageAge30.length;
      let diff = Date.now() - age;
      diff = diff / 60000;
      diff = diff / 1440;
      return Math.floor(diff);
    },
    inProgressAvgAge() {
      let age = 0;
      this.inProgress.forEach(doc => {
        age = age + doc.initial_timestamp;
      });
      age = age / this.inProgress.length;
      let diff = Date.now() - age;
      diff = diff / 60000;
      diff = diff / 1440;
      return Math.floor(diff);
    }
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
    }
  },
  firestore() {
    let lapse = Date.now() - 2592000000;
    let lapsed = Date.now() - 7889229000;
    let fifteen = Date.now() - 1296000000;
    let sixteen = Date.now() - 1382400000;
    return {
      complete: db
        .collection("tpo")
        .where("detail", "==", "Complete")
        .where("detail_complete_timestamp", "<=", Date.now())
        .where("detail_complete_timestamp", ">=", lapse)
        .orderBy("detail_complete_timestamp"),
      complete90: db
        .collection("tpo")
        .where("detail", "==", "Complete")
        .where("detail_complete_timestamp", "<=", Date.now())
        .where("detail_complete_timestamp", ">=", lapsed)
        .orderBy("detail_complete_timestamp"),
      averageAge30: db
        .collection("tpo")
        .where("detail", "==", "Complete")
        .where("detail_complete_timestamp", "<=", Date.now())
        .where("detail_complete_timestamp", ">=", lapse)
        .orderBy("detail_complete_timestamp"),
      inProgress: db.collection("tpo").where("detail", "==", "In process"),
      zeroToFifteen: db
        .collection("tpo")
        .where("detail", "==", "In process")
        .where("initial_timestamp", "<=", Date.now())
        .where("initial_timestamp", ">=", fifteen),
      sixteenToThirty: db
        .collection("tpo")
        .where("detail", "==", "In process")
        .where("initial_timestamp", "<=", sixteen)
        .where("initial_timestamp", ">=", lapse),
      thirtyPlus: db
        .collection("tpo")
        .where("detail", "==", "In process")
        .where("initial_timestamp", "<", lapse),
      oldestFifteen: db
        .collection("tpo")
        .where("detail", "==", "In process")
        .orderBy("initial_timestamp")
        .limit(15)
    };
  }
};
</script>

<style>
.main-metric-title {
  font-weight: bold;
  font-size: 3rem;
  text-align: center;
}
.main-metric-information {
  text-align: center;
  font-size: 3rem;
}
.metric-title {
  padding-bottom: 3px;
}
.metric-information {
  margin-top: 3px;
}
</style>
