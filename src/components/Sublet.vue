<template>
  <v-container class="sublet mt-10">
    <!-- // * Table: Start -->
    <v-data-table
      :headers="$store.state.subletsublet"
      :items="sublet"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.numDays="{ item }">{{ numberDays(item) }}</template>
      <template v-slot:item.elapsed="{ item }">{{
        elapsedTime(item)
      }}</template>
      <template v-slot:item.sold="{ item }">
        <v-img
          v-if="item.sold && item.sold === true"
          src="../assets/sold.png"
          max-height="50px"
          max-width="50px"
        ></v-img
      ></template>
      <template v-slot:item.status="{ item }">
        <span v-if="item.shop === true">Shop Incomplete</span>
        <span v-else-if="item.shop === false">Shop Complete</span>
      </template>
      <template v-slot:top>
        <v-row justify="end" class="mr-5">
          <v-col>
            <v-card-title class="display-2 font-weight-light">
              Sublet
            </v-card-title>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- // * Dialog: Start -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <!-- Dialog title -->
            <v-card-title>
              <span class="headline">Additional Information</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <!-- // * Vehicle Information -->
                <v-row>
                  <v-col cols="12">
                    <div class="title">Information:</div>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- // * VIN -->
                  <v-col cols="6">
                    <div class="body-1">VIN: {{ editedItem.vin }}</div>
                  </v-col>
                  <!-- // * Year -->
                  <v-col cols="6">
                    <div class="body-1">Year: {{ editedItem.year }}</div>
                  </v-col>
                  <!-- // * Make-->
                  <v-col cols="6">
                    <div class="body-1">Make: {{ editedItem.make }}</div>
                  </v-col>
                  <!-- // * Model -->
                  <v-col cols="6">
                    <div class="body-1">Model: {{ editedItem.model }}</div>
                  </v-col>
                  <!-- // * Color -->
                  <v-col cols="6">
                    <div class="body-1">Color: {{ editedItem.color }}</div>
                  </v-col>
                  <!-- // * Comments -->
                  <v-col cols="6">
                    <div class="body-1">
                      Comments:
                      <span class="comment-text">{{
                        editedItem.comments
                      }}</span>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mt-5">
                  <!-- // * Repair Information -->
                  <v-col cols="12">
                    <!-- Title -->
                    <div class="title">
                      Repairs:
                      <template v-for="repair in editedItem.repairs">
                        <!-- // * If the repair string contains the word "Complete" then this will show, will be green -->
                        <v-chip
                          v-if="repair.includes('Complete')"
                          @click="completeRepair(repair, editedItem)"
                          dark
                          class="mr-1"
                          color="success"
                          :key="repair"
                          >{{ repair }}</v-chip
                        >

                        <!-- // * If the repair has not been completed then it will show up gray -->
                        <v-chip
                          v-else
                          @click="completeRepair(repair, editedItem)"
                          dark
                          class="mr-1"
                          color="null"
                          :key="repair"
                          >{{ repair }}</v-chip
                        >
                      </template>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn @click="sendback(editedItem)" color="blue darken-1" text
                >Send Back</v-btn
              >
              <v-btn color="blue darken-1" text @click="complete(editedItem)"
                >Complete</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Dialog: End -->
      </template>
      <!-- // * Chips for the table -->
      <template v-slot:item.repairs="{ item }">
        <v-progress-linear :value="progress(item)" height="25" reactive>
          <strong>{{ Math.ceil(progress(item)) }}%</strong>
        </v-progress-linear>
        <!-- <v-progress-linear :value="progress(item)"></v-progress-linear> -->
      </template>
      <!-- more actions button and menu -->
      <template v-slot:item.action="{ item }">
        <div>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <!-- see more actions button -->
              <v-btn small color="primary" v-on="on">
                See Actions
              </v-btn>
            </template>

            <!-- action links -->
            <v-list>
              <!-- mark as sold -->
              <v-list-item v-if="item.sold !== true">
                <v-list-item-title @click="sell(item)">
                  <v-icon class="mr-1" color="success">mdi-currency-usd</v-icon>
                  Mark Sold Unit
                </v-list-item-title>
              </v-list-item>

              <!-- unmark as sold -->
              <v-list-item v-if="item.sold === true">
                <v-list-item-title @click="unsell(item)">
                  <v-icon class="mr-1" color="error"
                    >mdi-currency-usd-off</v-icon
                  >
                  Unmark Sold Unit
                </v-list-item-title>
              </v-list-item>

              <!-- send to detail -->
              <v-list-item>
                <v-list-item-title @click="detail(item)">
                  <v-icon class="mr-1" color="warning">mdi-car-wash</v-icon>
                  Mark Avalible for Detail
                </v-list-item-title>
              </v-list-item>

              <!-- complete -->
              <v-list-item>
                <v-list-item-title @click="editItem(item)">
                  <v-icon class="mr-1" color="success">mdi-check-bold</v-icon>
                  {{ "Information & Sublet Completion" }}
                </v-list-item-title>
              </v-list-item>

              <!-- delete -->
              <v-list-item>
                <v-list-item-title @click="deleteItem(item)">
                  <v-icon class="mr-1" color="error">mdi-delete</v-icon>
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-data-table>
    <!-- // * Table: End -->
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";

export default {
  name: "Sublet",
  props: ["user"],
  data: () => ({
    sublet: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {},
    repairColor: null,
    // * Progress bar
    level: "",
    currentTime: Date.now(),
    state: "started",
    search: ""
  }),

  // ! Vuetify table dependency, DO NOT REMOVE UNLESS YOU KNOW WHAT YOU ARE DOING...
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    // send to detail
    // will still go through the flow of the process, won't go back to detail.
    detail(item) {
      // already gone to detail, won't let it go back
      if (item.shopToDetail === true) {
        alert("Vehicle is either in detail or has already been detailed.");
      } else {
        db.collection("tpo")
          .doc(item.id)
          .update({
            detail: true,
            shopToDetail: true,
            toDetailTimestamp: Date.now(),
            shopToDetailAssociate: firebase.auth().currentUser.displayName
          });
      }
    },
    //   * Buttons
    editItem(item) {
      this.editedIndex = this.sublet.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    // delete item
    deleteItem(item) {
      let answer = confirm("Are you sure you want to delete this item?");
      if (answer) {
        db.collection("tpo")
          .doc(item.id)
          .update({
            shop: false,
            sublet_inspection: false,
            detail: false,
            sublet: false,
            sublet_delete_timestamp: Date.now(),
            sublet_delete_user: firebase.auth().currentUser.displayName
          });
      }
    },
    sell(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          sold: true,
          sold_timestamp: Date.now()
        });
    },
    unsell(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          sold: false,
          sold_timestamp: ""
        });
    },
    // * Modal Functions
    completeRepair(repair, item) {
      // * Filters the sublet array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filterrepair = this.sublet.filter(sublet => {
        return sublet.vin == item.vin;
      });

      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          repairs: firebase.firestore.FieldValue.arrayUnion(
            repair + " - Complete"
          )
        });
      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          repairs: firebase.firestore.FieldValue.arrayRemove(repair)
        })
        .then(() => {
          filterrepair = this.sublet.filter(sublet => {
            return sublet.vin == item.vin;
          });
          this.editedIndex = this.sublet.indexOf(filterrepair[0]);
          this.editedItem = Object.assign({}, filterrepair[0]);
        });
    },
    complete(item) {
      let progress = this.progress(item);
      // * Filters the sublet array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filterrepair = this.sublet.filter(sublet => {
        return sublet.vin == item.vin;
      });
      if (progress == 100) {
        if ((!item.shopToDetail || item.shopToDetail === false) && item.shop_complete_timestamp) {
          db.collection("tpo")
            .doc(filterrepair[0].id)
            .update({
              sublet: false,
              detail: true,
              sublet_complete_user: firebase.auth().currentUser.displayName,
              sublet_complete_timestamp: Date.now()
            })
            .then(() => {
              db.collection("mail").add({
                to: "barry.laird@principleauto.com",
                message: {
                  subject: "Sublet Complete: " + filterrepair[0].vin + "",
                  text:
                    "Sublet is complete on this vehicle. It will now be taken to detail."
                }
              });
            });
          this.close();
          console.log("sending to detail....");
        } else {
          db.collection("tpo")
            .doc(filterrepair[0].id)
            .update({
              sublet: false,
              sublet_complete_user: firebase.auth().currentUser.displayName,
              sublet_complete_timestamp: Date.now()
            })
            .then(() => {
              db.collection("mail").add({
                to: "barry.laird@principleauto.com",
                message: {
                  subject: "Sublet Complete: " + filterrepair[0].vin + "",
                  text:
                    "Sublet is complete on this vehicle. It will now be taken to detail."
                }
              });
            });
          this.close();
          console.log("This car already went to detail....");
        }
      } else {
        alert(
          "Please make sure all sublet is complete before trying to complete this request."
        );
      }
    },
    elapsedTime(i) {
      let minutes = Math.floor(
        (this.currentTime - i.sublet_inspection_complete_timestamp) / 60000
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
    },
    sendback(i) {
      let filterrepair = this.sublet.filter(sublet => {
        return sublet.vin == i.vin;
      });
      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          sublet: "In process",
          shop: "In process",
          sublet_inspection: "In process"
        });
      this.close();
    },
    // * Essentials
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    // * Other
    progress(item) {
      let count = 0;
      if (item.repairs) {
        let length = item.repairs.length;
        item.repairs.forEach(element => {
          if (element.includes("Complete")) {
            count++;
          }
        });
        this.level = (count / length) * 100;
        return (count / length) * 100;
      }
    },
    numberDays(i) {
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
    },
    // * Other Methods
    updateCurrentTime: function() {
      if (this.$data.state == "started") {
        this.currentTime = Date.now();
      }
    },
    dateFormat(req) {
      return Math.floor((this.currentTime - req.initial_timestamp) / 60000);
    }
  },
  mounted() {
    this.interval = setInterval(this.updateCurrentTime, 1000);
    /* SmtpJS.com - v3.0.0 */
  },
  // * Database
  firestore() {
    return {
      sublet: db
        .collection("tpo")
        .where("sublet_inspection", "==", false)
        .where("sublet", "==", true)
        .orderBy("sold", "desc")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped>
.inline {
  display: inline-block;
}

.comment-text {
  font-size: 16px;
  color: grey;
  font-weight: normal;
  display: block;
}
</style>
