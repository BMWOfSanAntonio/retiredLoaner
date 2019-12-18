<template>
  <div>
    <v-chip :color="color">
      {{ calculation }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "Chip",
  props: ["calculation", "color"],
  data() {
    return {};
  }
};
</script>
