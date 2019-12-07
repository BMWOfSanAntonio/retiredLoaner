<template>
  <v-container class="shop">
    <!-- // * Title -->
    <div class="mb-4 display-2 font-weight-thin">Shop</div>
    <!-- // * Table: Start -->
    <v-data-table
      :headers="$store.state.shop_headers"
      :items="shop"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.numDays="{ item }">{{
        elapsedTime(item)
      }}</template>
      <template v-slot:item.elapsed="{ item }">{{
        elapsedTime(item)
      }}</template>
      <template v-slot:top>
        <v-row justify="end" class="mr-5">
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
        <!-- // * Edit Dialog: Start -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Vehicle</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.vin"
                      label="VIN"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.year"
                      label="Year"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.make"
                      label="Make"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.model"
                      label="Model"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.color"
                      label="Color"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.ro"
                      label="RO #"
                    ></v-text-field>
                  </v-col>
                  <!-- Sublet working to be performed -->
                  <v-col cols="12">
                    <div class="title">Sublet Work:</div>
                    <div class="body-1 font-weight-bold">
                      Sublet Inspection Comments:
                    </div>
                    <ul>
                      <li>
                        {{ editedItem.comments }}
                      </li>
                    </ul>
                    <div class="body-1 font-weight-bold">
                      Sublet to Be Performed:
                    </div>
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
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save(editedItem)"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Edit Dialog: End -->
      </template>
      <template v-slot:item.status="{ item }">
        <span v-if="item.repairs && item.sublet_inspection === 'In process'"
          >No Sublet Inspection Performed</span
        >
        <span
          v-else-if="
            (item.repairs === null) & (item.sublet_inspection === 'Complete')
          "
          >No Sublet Needed</span
        >
        <span v-else-if="item.repairs !== null && item.repairs.length > 0"
          >Needs Sublet</span
        >
        <span v-else>Sublet Completed</span>
      </template>
      <template v-slot:item.action="{ item }">
        <!-- Menu -->
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn small color="primary" v-on="on">
                See Actions
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-if="item.sold !== true">
                <v-list-item-title @click="sell(item)">
                  <v-icon class="mr-1" color="success">mdi-currency-usd</v-icon>
                  Mark Sold Unit
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="item.sold === true">
                <v-list-item-title @click="unsell(item)">
                  <v-icon class="mr-1" color="error"
                    >mdi-currency-usd-off</v-icon
                  >
                  Unmark Sold Unit
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="sell(item)">
                  <v-icon class="mr-1" color="warning">mdi-car-wash</v-icon>
                  Mark Avalible for Detail
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="sell(item)">
                  <v-icon class="mr-1" color="success">mdi-check-bold</v-icon>
                  Complete
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="sell(item)">
                  <v-icon class="mr-1" color="info">mdi-pencil</v-icon>
                  Edit
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="sell(item)">
                  <v-icon class="mr-1" color="error">mdi-delete</v-icon>
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <template v-slot:item.sold="{ item }">
        <v-img
          class="image"
          v-if="item.sold && item.sold === true"
          src="../assets/sold.png"
          max-height="50px"
          max-width="50px"
        ></v-img
      ></template>
    </v-data-table>
    <!-- // * Table: End -->
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";
export default {
  name: "Shop",
  props: ["user"],
  data: () => ({
    shop: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {},
    currentTime: Date.now(),
    state: "started",
    search: "",
    actions: [
      {
        title: "Sell Car",
        icon: "mdi-car-wash"
      }
    ]
  }),

  // ! Vuetify table dependency, DO NOT REMOVE UNLESS YOU KNOW WHAT YOU ARE DOING...
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    //   * Buttons
    editItem(item) {
      this.editedIndex = this.shop.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let answer = confirm("Are you sure you want to delete this item?");
      if (answer) {
        db.collection("tpo")
          .doc(item.id)
          .update({
            shop: "Deleted",
            sublet_inspection: "Deleted",
            shop_delete_timestamp: Date.now()
          });
      }
    },
    complete(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          shop: "Complete",
          shop_complete_timestamp: Date.now(),
          shop_associate: this.user.displayName
        });
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
    // * Modal
    completeRepair(repair, item) {
      // * Filters the sublet array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filterrepair = this.shop.filter(shop => {
        return shop.vin == item.vin;
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
          filterrepair = this.shop.filter(shop => {
            return shop.vin == item.vin;
          });
          this.editedIndex = this.shop.indexOf(filterrepair[0]);
          this.editedItem = Object.assign({}, filterrepair[0]);
        });
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save(item) {
      // * Filters the shop array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtershop = this.shop.filter(shop => {
        return shop.vin == item.vin;
      });
      db.collection("tpo")
        .doc(filtershop[0].id)
        .update({
          vin: item.vin,
          year: item.year,
          make: item.make,
          model: item.model,
          color: item.color,
          ro: item.ro,
          shop_edit_timestamp: Date.now()
        });
      this.close();
    },
    numberDays(i) {
      return Math.floor((this.currentTime - i.initial_timestamp) / 86400000);
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
      shop: db
        .collection("tpo")
        .where("shop", "==", "In process")
        .orderBy("sold", "desc")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped></style>
