<template>
  <v-container class="shop">
    <QuickMetrics :user="user" />
    <TheShop :user="user" />
    <AddVehicle :user="user" />
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";
import TheShop from "../components/Shop";
import QuickMetrics from "../components/QuickMetrics";
import AddVehicle from "../components/AddVehicle";
export default {
  name: "Shop",
  components: {
    QuickMetrics,
    TheShop,
    AddVehicle
  },
  props: ["user"]
};
</script>

<style scoped></style>
