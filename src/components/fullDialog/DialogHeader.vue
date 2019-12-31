<template>
  <v-toolbar dark color="primary">
    <v-btn icon dark @click="$store.state.fullscreenDialog = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-toolbar-title>Additional Information - {{ item.vin }}</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: "DialogHeader",
  props: ["item"]
};
</script>
