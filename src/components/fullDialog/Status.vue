<template>
  <div>
    <div v-if="waiting">Waiting on Process</div>
    <div v-else-if="inProcess">
      Currently in Process...
    </div>
    <div v-else-if="noSublet">No Sublet to Perform</div>
    <div v-else>{{ date }} @ {{ time }}</div>
  </div>
</template>

<script>
export default {
  name: "Status",
  props: ["waiting", "inProcess", "date", "time", "noSublet"]
};
</script>
