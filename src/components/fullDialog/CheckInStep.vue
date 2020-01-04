<template>
  <div class="wrapper">
    <v-row align="center">
      <v-col cols="3">
        <!-- icons component -->
        <Icons :complete="item.initial_timestamp" />
      </v-col>
      <v-col>
        <v-row>
          <!-- title component -->
          <StepHeader title="Check In" />
        </v-row>
        <v-row>
          <!-- status component -->
          <Status
            :inProcess="false"
            :waiting="false"
            :date="date"
            :time="time"
          />
        </v-row>
      </v-col>
    </v-row>
    <!-- avatar component -->
    <Avatar
      v-if="item.createdBy"
      :image="item.createdByPhoto"
      :user="item.createdBy"
    />
  </div>
</template>

<script>
import Avatar from "./Avatar";
import Icons from "./Icons";
import StepHeader from "./StepHeader";
import Status from "./Status";
export default {
  name: "Step",
  props: ["date", "time", "item"],
  components: {
    Avatar,
    Icons,
    StepHeader,
    Status
  },
  data() {
    return {};
  }
};
</script>

<style>
.wrapper {
  font-size: 14px;
}
.inline {
  display: inline;
}
</style>
