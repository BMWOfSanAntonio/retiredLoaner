<template>
  <v-toolbar dark color="primary">
    <v-btn icon dark @click="toggleDialog()">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-toolbar-title>Additional Information - {{ item.vin }}</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: "DialogHeader",
  props: ["item"],
  methods: {
    toggleDialog() {
      this.$emit("close-dialog");
    }
  }
};
</script>
