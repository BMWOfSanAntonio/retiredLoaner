<template>
  <div>
    <v-dialog v-model="dialog" max-width="800px">
      <!-- floating fab button -->
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" color="error" large dark fixed bottom right fab>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <!-- dialog window -->
      <v-card>
        <!-- dialog title -->
        <v-card-title>
          <span class="headline">Add New Pre-Owned Vehicle</span>
        </v-card-title>

        <!-- dialog main content -->
        <v-card-text>
          <v-container>
            <v-row>
              <!-- VIN -->
              <v-col cols="12" sm="12">
                <v-text-field v-model="vin" label="VIN*"></v-text-field>
              </v-col>

              <!-- year -->
              <v-col cols="12" sm="4">
                <v-select
                  v-model="year"
                  :items="$store.state.years"
                  label="Year*"
                  required
                ></v-select>
              </v-col>

              <!-- make -->
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="make"
                  :items="$store.state.makes"
                  label="Make*"
                ></v-select>
              </v-col>

              <!-- model -->
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="model"
                  label="Model*"
                  hint="430i, F150, Silverado 1500, etc."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <!-- color -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="color"
                  :items="$store.state.colors"
                  label="Color*"
                ></v-select>
              </v-col>

              <!-- type of vehicle -->
              <v-col>
                <v-select
                  v-model="type"
                  :items="$store.state.type"
                  label="Type of Vehicle*"
                ></v-select>
              </v-col>

              <!-- sold -->
              <v-col cols="12" sm="6">
                <div class="body-1">Is this a sold unit?</div>
                <v-radio-group v-model="sold">
                  <v-radio label="Yes" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </v-col>

              <!-- repair order number -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="ro"
                  label="RO #"
                  hint="Complete repair order number goes here..."
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>

        <!-- dialog actions -->
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Cancel</v-btn
          >
          <v-btn @click="addCar" color="blue darken-1" text>Submit</v-btn>
        </v-card-actions>
        <!-- form: end -->
      </v-card>
    </v-dialog>
    <SnackBar :alert="alert" :timeout="timeout" :text="text" />
  </div>
</template>

<script>
import { db } from "../main";
import firebase from "firebase";
import SnackBar from "../components/SnackBar";
export default {
  name: "AddVehicle",
  components: {
    SnackBar
  },
  props: ["user"],
  data() {
    return {
      // * Snackbar
      alert: false,
      text: "Make sure you fill out all required fields.",
      timeout: 2000,
      // * Form Variables
      vin: null,
      year: null,
      make: null,
      model: null,
      color: null,
      ro: null,
      sold: null,
      type: null,
      //   * Dialog
      dialog: false,
      // * Database pullins
      tpo: [],
      shop: [],
      subletInspection: [],
      sublet: [],
      detail: [],
      inProcess: []
    };
  },
  mounted() {},
  methods: {
    mergeInProcess() {
      let combineAll = this.shop.concat(
        this.detail,
        this.subletInspection,
        this.sublet
      );
      let allNoDuplicates = Array.from(new Set(combineAll.map(a => a.id))).map(
        id => {
          return combineAll.find(a => a.id === id);
        }
      );
      this.inProcess = allNoDuplicates;
    },
    // * Adding a car to the database
    addCar() {
      this.mergeInProcess();
      let filtered = this.inProcess.filter(item => {
        return this.vin == item.vin;
      });
      // Only when the entire form is filled out can the form be submitted
      if (
        this.vin !== null &&
        this.year !== null &&
        this.make !== null &&
        this.model !== null &&
        this.color !== null &&
        this.sold !== null &&
        this.ro !== null &&
        this.type !== null
      ) {
        if (filtered.length > 0) {
          alert("This VIN is already in the system...");
        } else {
          db.collection("tpo").add({
            // * Form Values
            vin: this.vin,
            year: this.year,
            make: this.make,
            model: this.model,
            color: this.color,
            type: this.type,
            // * Timestamps
            initial_timestamp: Date.now(),
            // States
            shop: true,
            sublet_inspection: true,
            sublet: false,
            detail: false,
            // * Extras
            shopToDetail: false,
            repairs: [],
            sold: this.sold,
            ro: this.ro
          });
          // Resetting the values to null
          this.vin = null;
          this.year = null;
          this.make = null;
          this.model = null;
          this.color = null;
          // * Closes the modal window
          this.dialog = false;
          this.type = null;
          this.sold = null;
          this.ro = null;
        }
      } else {
        // * Shows the snackbar if you did not fill out the form completely. Snack bar is located at the bottom on the component.
        this.$store.state.alert = true;
      }
    }
  },
  firestore() {
    return {
      shop: db.collection("tpo").where("shop", "==", true),
      subletInspection: db
        .collection("tpo")
        .where("sublet_inspection", "==", true),
      sublet: db.collection("tpo").where("sublet", "==", true),
      detail: db.collection("tpo").where("detail", "==", true)
    };
  }
};
</script>
