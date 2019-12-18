<template>
  <v-app-bar color="primary" dark :elevate-on-scroll="true" app>
    <!-- navigation branding -->
    <v-toolbar-title class="headline text-uppercase">
      <span>TPO</span>
      <span class="font-weight-light">Tracker</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- navigation links -->
    <v-btn v-if="user" text to="/">
      <v-icon class="mr-2">mdi-desktop-mac-dashboard</v-icon>
      Dashboard
    </v-btn>
    <v-btn v-if="user" text to="/reports">
      <v-icon class="mr-2">mdi-poll</v-icon>
      Metrics
    </v-btn>
    <v-btn v-if="user" text @click="logout">
      <v-icon class="mr-2">mdi-logout</v-icon>
      Sign out
    </v-btn>
  </v-app-bar>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Navigation",
  props: ["user"],
  data() {
    return {};
  },
  methods: {
    logout() {
      firebase.auth().signOut();
      this.$router.push("/login");
    }
  }
};
</script>
