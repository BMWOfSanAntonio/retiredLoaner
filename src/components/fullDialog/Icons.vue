<template>
  <div>
    <v-icon v-if="complete" color="success">mdi-check-circle</v-icon>
    <v-icon v-else-if="inProcess" color="primary">mdi-wrench</v-icon>
    <v-icon v-else color="error">mdi-close-octagon</v-icon>
  </div>
</template>

<script>
export default {
  name: "Icons",
  props: ["complete", "inProcess"]
};
</script>
