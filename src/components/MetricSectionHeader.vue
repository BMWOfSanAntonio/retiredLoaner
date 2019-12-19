<template>
  <div class="text-center display-1 mb-5">{{ title }}</div>
</template>
<script>
export default {
  name: "MetricSectionHeader",
  props: ["title"],
  data() {
    return {};
  }
};
</script>

<style scoped>
div {
  text-decoration: underline !important;
}
</style>
