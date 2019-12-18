<template>
  <div class="display-1 font-weight-bold text-center">
    {{ largeTitle }}:
    <div class="display-4 font-weight-light mt-3" :class="center">
      <span>{{ largeCalc }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LargeTotal",
  props: ["largeCalc", "largeTitle", "center"],
  data() {
    return {};
  }
};
</script>

<style>
.good {
  color: lightgreen;
}
.bad {
  color: red;
}
</style>
