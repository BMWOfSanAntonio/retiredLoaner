<template>
  <div class="title ">
    {{ title }}: {{ calculation }}
    <span class="body-1 ">({{ percentage }}) </span>
  </div>
</template>
<script>
export default {
  name: "MetricLabelPercentage",
  props: ["title", "calculation", "percentage"]
};
</script>
