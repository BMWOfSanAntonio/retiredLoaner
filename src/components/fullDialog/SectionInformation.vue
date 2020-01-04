<template>
  <v-list-item two-line>
    <!-- if there is a value that is not true/false, null, blank, etc -->
    <v-list-item-content v-if="value">
      <v-list-item-title>{{ label }}</v-list-item-title>
      <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
    </v-list-item-content>
    <!-- if there is a value that is true or false -->
    <v-list-item-content v-else>
      <v-list-item-title>{{ label }}</v-list-item-title>
      <v-list-item-subtitle>No information at this time</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "SectionInformation",
  props: ["label", "value"]
};
</script>
