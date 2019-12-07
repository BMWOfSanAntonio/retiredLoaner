<template>
  <v-container class="detail mt-10">
    <!-- // * Table: Start -->
    <v-data-table
      :headers="$store.state.detailManager"
      :items="detail"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.numDays="{ item }">{{
        numberDays(item.data)
      }}</template>
      <template v-slot:item.elapsed="{ item }">{{
        elapsedTime(item.data)
      }}</template>
      <template v-slot:top>
        <v-row align="center" class="mr-5">
          <v-col>
            <div class="font-weight-light display-1 ml-4">
              Detail
            </div>
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
      <template v-slot:item.action="{ item }">
        <v-icon
          v-if="item.sold !== true"
          color="primary"
          class="mr-2"
          @click="sell(item.data)"
          >mdi-car</v-icon
        >
        <v-icon
          v-if="item.data.sold && item.data.sold === true"
          color="error"
          class="mr-2"
          @click="unsell(item.data)"
          >mdi-car</v-icon
        >
        <v-icon color="green" class="mr-2" @click="complete(item.data)"
          >mdi-check-circle</v-icon
        >
        <v-icon color="red" @click="deleteItem(item.data)">mdi-delete</v-icon>
        <v-icon @click="sendback(item.data)" class="ml-2" color="primary"
          >mdi-arrow-left-circle</v-icon
        >
      </template>
      <template v-slot:item.sold="{ item }">
        <v-img
          v-if="item.data.sold && item.data.sold === true"
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
  name: "Detail",
  data() {
    return {
      detail: [],
      subletDetail: [],
      shopDetail: [],
      currentTime: Date.now(),
      state: "started",
      search: "",
      details: [],
      one: null,
      two: null
    };
  },
  computed: {
    filtered() {
      let test = [...this.detail, ...this.shopDetail, ...this.subletDetail];
      return test;
    }
  },
  methods: {
    deleteItem(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          detail: "Deleted",
          detail_delete_timestamp: Date.now(),
          detail_delete_associate: firebase.auth().currentUser.displayName
        });
    },
    complete(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          detail: "Complete",
          detail_complete_timestamp: Date.now(),
          detail_complete_associate: firebase.auth().currentUser.displayName
        });
    },
    sendback(i) {
      db.collection("tpo")
        .doc(i.id)
        .update({
          detail: "In process",
          sublet: "In process"
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
    elapsedTime(i) {
      let minutes = null;
      if (i.sublet_complete_timestamp > i.shop_complete_timestamp) {
        minutes = Math.floor(
          (this.currentTime - i.sublet_complete_timestamp) / 60000
        );
      } else {
        minutes = Math.floor(
          (this.currentTime - i.shop_complete_timestamp) / 60000
        );
      }

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
        .where("shop", "==", "Complete")
        .where("sublet", "==", "Complete")
        .where("detail", "==", "In process")
        .orderBy("sold", "desc")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped></style>
