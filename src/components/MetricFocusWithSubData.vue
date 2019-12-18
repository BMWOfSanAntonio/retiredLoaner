<template>
  <div>
    <LargeTotal
      :center="center"
      :largeCalc="largeCalc"
      :largeTitle="largeTitle"
    />
    <MetricLabel
      :center="center"
      :calculation="calculation"
      :title="title"
      :alternativeMessage="alternativeMessage"
    />
  </div>
</template>

<script>
import LargeTotal from "./LargeTotal";
import MetricLabel from "./MetricLabel";
export default {
  name: "MetricFocusWithSubData",
  props: [
    "center",
    "largeCalc",
    "calculation",
    "title",
    "alternativeMessage",
    "largeTitle"
  ],
  components: {
    LargeTotal,
    MetricLabel
  }
};
</script>
