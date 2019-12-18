<template>
  <div :class="center" class="title font-weight-bold mt-2">
    {{ title }}:
    <span class="font-weight-regular" v-if="calculation !== 'NaN days'"
      >{{ calculation }}
    </span>
    <span class="font-weight-regular" v-else>{{ alternativeMessage }}</span>
  </div>
</template>
<script>
export default {
  name: "MetricLabel",
  props: ["title", "calculation", "alternativeMessage", "center"],
  data() {
    return {};
  }
};
</script>
