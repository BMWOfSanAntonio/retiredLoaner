<template>
  <v-row align="center">
    <v-col class="remove-top-bottom-padding" cols="3">
      <!-- image -->
      <v-avatar v-if="image" class="inline" size="36">
        <img :src="image" />
      </v-avatar>
      <v-avatar v-else class="inline" size="36">
        <v-icon large>mdi-account-circle</v-icon>
      </v-avatar>
    </v-col>
    <v-col class="remove-top-bottom-padding">
      <!-- user's name -->
      <div class="body-2 inline">
        <div>{{ user }}</div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Avatar",
  props: ["image", "user"],
  data() {
    return {};
  }
};
</script>

<style>
.inline {
  display: inline;
}
.remove-top-bottom-padding {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
