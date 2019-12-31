<template>
  <v-stepper-step
    :step="step"
    :complete="completed"
    color="success"
    :rules="[() => callback]"
    >{{ title }}
    <!-- sublet_inspection  -->
    <small v-if="inProcess">Currently in Process</small>
    <small v-else-if="complete">{{ date }} @ {{ time }}</small>
    <small v-else-if="waiting">Waiting on Process</small>
  </v-stepper-step>
</template>

<script>
export default {
  name: "ThreeChoice",
  props: [
    "step",
    "completed",
    "callback",
    "inProcess",
    "complete",
    "date",
    "time",
    "waiting",
    "title"
  ]
};
</script>
