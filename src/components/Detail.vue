<template>
  <v-container class="detail mt-10">
    <!-- // * Table: Start -->
    <v-data-table
      :headers="$store.state.detailManager"
      :items="detail"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.numDays="{ item }">{{ numberDays(item) }}</template>
      <template v-slot:item.elapsed="{ item }">{{
        elapsedTime(item)
      }}</template>
      <template v-slot:top>
        <v-row align="center" class="mr-5">
          <v-col>
            <v-card-title class="display-2 font-weight-light">
              Detail
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

              <!-- complete -->
              <v-list-item>
                <v-list-item-title @click="complete(item)">
                  <v-icon class="mr-1" color="success">mdi-check-bold</v-icon>
                  Complete
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

      <!-- sold icon -->
      <template v-slot:item.sold="{ item }">
        <v-img
          v-if="item.sold && item.sold === true"
          src="../assets/sold.png"
          max-height="50px"
          max-width="50px"
        ></v-img
      ></template>
    </v-data-table>
    <!-- table - end -->
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";
export default {
  name: "Detail",
  data() {
    return {
      detail: [],
      currentTime: Date.now(),
      state: "started",
      search: ""
    };
  },
  methods: {
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
            detail_delete_timestamp: Date.now(),
            detail_delete_user: firebase.auth().currentUser.displayName
          });
      }
    },
    complete(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          detail: false,
          detail_complete_timestamp: Date.now(),
          detail_complete_associate: firebase.auth().currentUser.displayName,
          detail_complete_associate_photo: firebase.auth().currentUser.photoURL
        })
        .then(() => {
          let date = new Date(
            item.detail_complete_timestamp
          ).toLocaleDateString();
          db.collection("mail").add({
            to: "barry.laird@principleauto.com",
            message: {
              subject: `Detail Completed - ${item.vin}`,
              text: `The detail for ${item.vin} was completed on ${new Date()}.`
            }
          });
        });
    },
    sendback(i) {
      db.collection("tpo")
        .doc(i.id)
        .update({
          detail: false,
          sublet: true
        });
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
    timeLogic(minutes) {
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
    elapsedTime(i) {
      // if was manually sent to detail or not
      // If there was no sublet - sublet inspection timestamp
      // if there was sublet - max(shop complete or sublet inspection complete)
      let minutes = null;
      // if was sent manually to detail
      if (i.toDetailTimestamp) {
        minutes = Math.floor((this.currentTime - i.toDetailTimestamp) / 60000);
        return this.timeLogic(minutes);
      } else if (i.sublet_complete_timestamp) {
        minutes = Math.floor(
          (this.currentTime - i.sublet_complete_timestamp) / 60000
        );
        return this.timeLogic(minutes);
      } else if (
        i.sublet_inspection_complete_timestamp &&
        i.shop_complete_timestamp
      ) {
        // if was sent here from sublet or shop
        if (
          i.sublet_inspection_complete_timestamp > i.shop_complete_timestamp
        ) {
          minutes = Math.floor(
            (this.currentTime - i.sublet_inspection_complete_timestamp) / 60000
          );
          return this.timeLogic(minutes);
        } else {
          minutes = Math.floor(
            (this.currentTime - i.shop_complete_timestamp) / 60000
          );
          return this.timeLogic(minutes);
        }
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
      detail: db
        .collection("tpo")
        .where("detail", "==", true)
        .orderBy("sold", "desc")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped></style>
