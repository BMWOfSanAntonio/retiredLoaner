<template>
  <v-btn color="primary" dark @click="toggleDialog()">Information</v-btn>
</template>

<script>
export default {
  name: "InformationButton",
  methods: {
    toggleDialog(item) {
      this.$emit("open-dialog", item);
    }
  }
};
</script>
