<template>
  <div class="display-1 font-weight-bold text-center">
    {{ largeTitle }}:
    <div class="display-4 font-weight-light mt-3" :class="center">
      {{ largeCalc }}
      <span :class="center" class="title align">
        <v-icon :class="center" large>
          {{ arrow }}
        </v-icon>
        ({{ percentage }})
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LargeTotal",
  props: ["largeCalc", "largeTitle", "center", "arrow", "percentage"],
  data() {
    return {};
  }
};
</script>

<style>
.align {
  vertical-align: middle;
}
.good {
  color: lightgreen !important;
}
.bad {
  color: red !important;
}
</style>
