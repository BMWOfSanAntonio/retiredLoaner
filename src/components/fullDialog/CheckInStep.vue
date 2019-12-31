<template>
  <v-stepper-step :step="1" color="success" :complete="complete">
    {{ title }}
    <small> {{ date }} @ {{ time }} </small>
  </v-stepper-step>
</template>

<script>
export default {
  name: "Step",
  props: ["step", "complete", "title", "date", "time"],
  data() {
    return {};
  }
};
</script>
