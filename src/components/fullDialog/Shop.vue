<template>
  <div class="wrapper">
    <v-row justify="center" align="center">
      <v-col cols="3">
        <!-- icons component -->
        <Icons
          :complete="item.shop_complete_timestamp"
          :inProcess="item.shop === true"
        />
      </v-col>
      <v-col>
        <v-row>
          <!-- title component -->
          <StepHeader title="Shop" />
        </v-row>
        <v-row>
          <!-- status component -->
          <Status
            :inProcess="!item.shop_complete_timestamp"
            :waiting="!item.initial_timestamp"
            :date="date"
            :time="time"
          />
        </v-row>
      </v-col>
    </v-row>
    <!-- avatar component -->
    <Avatar
      v-if="item.shop_complete_timestamp"
      :image="item.shop_associate_photo"
      :user="item.shop_associate"
    />
  </div>
</template>

<script>
import Icons from "../fullDialog/Icons";
import StepHeader from "../fullDialog/StepHeader";
import Status from "../fullDialog/Status";
import Avatar from "../fullDialog/Avatar";

export default {
  name: "Shop",
  props: ["date", "time", "item"],
  components: {
    Icons,
    StepHeader,
    Status,
    Avatar
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
