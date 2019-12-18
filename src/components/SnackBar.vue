<template>
  <div class="text-center">
    <v-snackbar v-model="$store.state.alert" :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="$store.state.alert === false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "SnackBar",
  props: ["alert", "timeout", "text"]
};
</script>
