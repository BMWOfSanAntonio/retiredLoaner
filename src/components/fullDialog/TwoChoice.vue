<template>
  <v-stepper-step
    :step="step"
    :complete="completed"
    color="success"
    :rules="[() => callback]"
  >
    {{ title }}
    <template v-if="completed">
      <small>{{ date }} @ {{ time }} </small><small>{{ user }}</small>
    </template>
    <template v-else>
      <small>Currently in Process</small>
    </template>
  </v-stepper-step>
</template>

<script>
export default {
  name: "ShopStep",
  props: [
    "step",
    "complete",
    "callback",
    "title",
    "completed",
    "date",
    "time",
    "user"
  ]
};
</script>
