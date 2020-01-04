<template>
  <v-container class="sublet-inspection mt-10">
    <!-- // * Table: Start -->
    <v-data-table
      :headers="$store.state.sublet_headers"
      :items="sublet_inspection"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.numDays="{ item }">{{
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
      <template v-slot:top>
        <v-row justify="end" class="mr-5">
          <v-col>
            <v-card-title class="display-2 font-weight-light">
              Sublet Inspection
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
        <!-- // * Information Dialog: Start -->
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <!-- // * Modal title -->
            <v-card-title>
              <span class="headline">{{
                "Sublet Inspection & Information"
              }}</span>
            </v-card-title>

            <v-card-text>
              <div class="title">Request Information:</div>
              <v-container>
                <!-- // * Modal Information -->
                <v-row>
                  <!-- // * Stock Number -->
                  <v-col cols="12">
                    <div class="body-1">
                      <span class="font-weight-bold">Stock Number:</span>
                      {{ editedItem.vin }}
                    </div>
                  </v-col>
                  <!-- // * RO # -->
                  <v-col cols="12">
                    <div class="body-1">
                      <span class="font-weight-bold">RO #:</span>
                      {{ editedItem.ro }}
                    </div>
                  </v-col>
                  <!-- // * Year -->
                  <v-col cols="12">
                    <div class="body-1">
                      <span class="font-weight-bold">Year:</span>
                      {{ editedItem.year }}
                    </div>
                  </v-col>
                  <!-- // * Make -->
                  <v-col cols="12">
                    <div class="body-1">
                      <span class="font-weight-bold">Make:</span>
                      {{ editedItem.make }}
                    </div>
                  </v-col>
                  <!-- // * Model -->
                  <v-col cols="12">
                    <div class="body-1">
                      <span class="font-weight-bold">Model:</span>
                      {{ editedItem.model }}
                    </div>
                  </v-col>
                  <!-- // * Color -->
                  <v-col cols="12">
                    <div class="body-1">
                      <span class="font-weight-bold">Color:</span>
                      {{ editedItem.color }}
                    </div>
                  </v-col>
                </v-row>
                <!-- Horizontal row -->
                <v-divider></v-divider>
                <div class="title">Assign Sublet:</div>
                <!-- // * Repair selctions -->
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.repairs"
                    :items="$store.state.sublet"
                    chips
                    label="Repairs to be completed"
                    multiple
                  ></v-select>
                </v-col>
                <!-- // * Comments -->
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.comments"
                    :items="$store.state.sublet"
                    chips
                    label="Repairs to be completed"
                    multiple
                  ></v-textarea>
                </v-col>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="closeInfo"
                >Cancel</v-btn
              >
              <v-btn @click="nosublet(editedItem)" color="success" text
                >No Sublet</v-btn
              >
              <v-btn color="blue darken-1" text @click="complete(editedItem)"
                >Complete Inspection</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Information Dialog: End -->
        <!-- // * Edit Dialog: Start -->
        <v-dialog v-model="dialog1" max-width="800px">
          <v-card>
            <!-- // * Modal title -->
            <v-card-title>
              <span class="headline">VIN: {{ editedItem.vin }}</span>
            </v-card-title>

            <v-card-text>
              <div class="title">Request Information:</div>
              <v-container>
                <!-- // * Modal Information -->
                <v-row>
                  <!-- // * VIN -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      disabled
                      v-model="editedItem.vin"
                      label="VIN"
                    ></v-text-field>
                  </v-col>
                  <!-- // * Year -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.year"
                      label="Year"
                    ></v-text-field>
                  </v-col>
                  <!-- // * Make -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.make"
                      label="Make"
                    ></v-text-field>
                  </v-col>
                  <!-- // * Model -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.model"
                      label="Model"
                    ></v-text-field>
                  </v-col>
                  <!-- // * Color -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.color"
                      label="Color"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="closeEdit"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="save(editedItem)"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Edit Dialog: End -->
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
                <v-list-item-title @click="editSublet(item)">
                  <v-icon class="mr-1" color="warning">mdi-pencil</v-icon>
                  Edit Infromation
                </v-list-item-title>
              </v-list-item>

              <!-- edit & sublet information -->
              <v-list-item>
                <v-list-item-title @click="informationSublet(item)">
                  <v-icon class="mr-1" color="info">mdi-information</v-icon>
                  {{ "Assign Repairs & Information" }}
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
    <!-- // ! Structure for edit modal -->
    <div class="text-center ma-2">
      <v-snackbar :timeout="2000" v-model="alert">
        Please make sure you fill out all fields.
        <v-btn color="error" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";
export default {
  name: "sublet-inspection",
  props: ["user"],
  data: () => ({
    //   * Database
    sublet_inspection: [],
    // * Information dialog
    dialog: false,
    dialog1: false,
    repairs: [],
    editedIndex: -1,
    editedItem: {},
    // * Edit dialog
    currentTime: Date.now(),
    state: "started",
    alert: false,
    // Search
    search: null
  }),

  // ! Vuetify table dependency, DO NOT REMOVE UNLESS YOU KNOW WHAT YOU ARE DOING...
  watch: {
    dialog(val) {
      val || this.closeInfo();
    }
  },

  methods: {
    //   * Buttons
    editSublet(item) {
      this.editedIndex = this.sublet_inspection.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog1 = true;
    },
    informationSublet(item) {
      this.editedIndex = this.sublet_inspection.indexOf(item);
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
            sublet_inspection_delete_timestamp: Date.now(),
            sublet_inspection_delete_user: firebase.auth().currentUser
              .displayName
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
    // * Information modal
    complete(item) {
      // * Filters the sublet inspection array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtersubletinspection = this.sublet_inspection.filter(sublet => {
        return sublet.vin == item.vin;
      });
      if (item.comments) {
        db.collection("tpo")
          .doc(filtersubletinspection[0].id)
          .update({
            sublet_inspection: false,
            sublet_inspection_complete_timestamp: Date.now(),
            sublet_inspection_associate: this.user.displayName,
            sublet_inspection_associate_photo: this.user.photoURL,
            repairs: item.repairs,
            comments: item.comments,
            sublet: true
          });
        this.closeInfo();
      } else {
        this.alert = true;
      }
    },
    nosublet(item) {
      // * Filters the sublet inspection array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtersubletinspection = this.sublet_inspection.filter(sublet => {
        return sublet.vin == item.vin;
      });
      // If there are comments
      if (item.comments) {
        // last step in the process
        // not the last step in the process
        if (item.shop_complete_timestamp && item.shopToDetail === false) {
          db.collection("tpo")
            .doc(filtersubletinspection[0].id)
            .update({
              sublet_inspection: false,
              sublet_inspection_complete_timestamp: Date.now(),
              sublet_inspection_associate: this.user.displayName,
              sublet_inspection_associate_photo: this.user.photoURL,
              sublet: false,
              no_sublet: true,
              comments: item.comments,
              repairs: null,
              detail: true
            });
        } else {
          db.collection("tpo")
            .doc(filtersubletinspection[0].id)
            .update({
              sublet_inspection: false,
              sublet_inspection_complete_timestamp: Date.now(),
              sublet_inspection_associate: this.user.displayName,
              sublet_inspection_associate_photo: this.user.photoURL,
              sublet: false,
              no_sublet: true,
              comments: item.comments,
              repairs: null
            });
        }
      } else {
        if (item.shop_complete_timestamp && item.shopToDetail === false) {
          db.collection("tpo")
            .doc(filtersubletinspection[0].id)
            .update({
              sublet_inspection: false,
              sublet_inspection_complete_timestamp: Date.now(),
              sublet_inspection_associate: this.user.displayName,
              sublet_inspection_associate_photo: this.user.photoURL,
              sublet: false,
              no_sublet: true,
              repairs: null,
              detail: true
            });
        } else {
          db.collection("tpo")
            .doc(filtersubletinspection[0].id)
            .update({
              sublet_inspection: false,
              sublet_inspection_complete_timestamp: Date.now(),
              sublet_inspection_associate: this.user.displayName,
              sublet_inspection_associate_photo: this.user.photoURL,
              sublet: false,
              no_sublet: true,
              repairs: null
            });
        }
      }

      this.closeInfo();
    },
    elapsedTime(i) {
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
    closeInfo() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    // * Edit modal
    save(item) {
      // * Filters the sublet inspection array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtersubletinspection = this.sublet_inspection.filter(sublet => {
        return sublet.vin == item.vin;
      });
      db.collection("tpo")
        .doc(filtersubletinspection[0].id)
        .update({
          vin: item.vin,
          year: item.year,
          make: item.make,
          model: item.model,
          color: item.color,
          sublet_inspection_edit_timestamp: Date.now(),
          sublet_inspection_edit_associate: this.user.displayName,
          sublet_inspection_edit_associate_photo: this.user.photoURL
        });
      this.closeEdit();
    },
    closeEdit() {
      this.dialog1 = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    numberDays(i) {
      return Math.floor((this.currentTime - i.initial_timestamp) / 86400000);
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
  firestore() {
    return {
      sublet_inspection: db
        .collection("tpo")
        .where("sublet_inspection", "==", true)
        .orderBy("sold", "desc")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped>
#app
  > div.v-application--wrap
  > main
  > div
  > div
  > div.container.sublet-inspection.mt-10
  > div.v-data-table.elevation-1.theme--light
  > div.v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  width: 100px;
}

#app
  > div.v-application--wrap
  > main
  > div
  > div
  > div.container.sublet-inspection.mt-10
  > div.v-data-table.elevation-1.theme--light
  > div.v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  width: 175px;
}
</style>
