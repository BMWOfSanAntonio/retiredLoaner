<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ label }}:</v-list-item-title>
      <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
      <v-list-item-subtitle v-if="associate">{{
        associate
      }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "AdditionalInformationLabel",
  props: ["label", "value", "associate"],
  data() {
    return {};
  }
};
</script>
