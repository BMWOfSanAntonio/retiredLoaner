<template>
  <v-app>
    <!-- navigation component -->
    <Navigation :user="user" />
    <!-- main content -->
    <v-content>
      <router-view :user="user"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import firebase from "firebase";

// components
import Navigation from "./components/layout/Navigation";

export default {
  name: "App",
  components: {
    Navigation
  },
  data: () => ({
    // current user google data object
    user: firebase.auth().currentUser
  })
};
</script>
