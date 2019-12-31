<template>
  <v-stepper-step
    :step="step"
    :complete="completed"
    color="success"
    :rules="[() => callback]"
  >
    {{ title }}
    <small v-if="waiting">Waiting on Process</small>
    <small v-else-if="inProcess">Currently in Process</small>
    <template v-else-if="complete">
      <small>
        {{ date }} @
        {{ time }}
      </small>
      <small>{{ associate }}</small>
    </template>
    <template v-else-if="final">
      <small>{{ finalInformation }}</small>
      <small>{{ finalSubInformation }}</small>
    </template>
  </v-stepper-step>
</template>

<script>
export default {
  name: "ThreeChoice",
  props: [
    "step",
    "completed",
    "callback",
    "title",
    "waiting",
    "inProcess",
    "complete",
    "final",
    "date",
    "associate",
    "time",
    "finalInformation",
    "finalSubInformation"
  ]
};
</script>
