<template>
  <div class="wrapper">
    <v-row align="center">
      <v-col cols="3">
        <!-- icons component -->
        <Icons
          :complete="item.detail_complete_timestamp"
          :inProcess="item.detail === true"
        />
      </v-col>
      <v-col>
        <v-row>
          <!-- title component -->
          <StepHeader title="Detail" />
        </v-row>
        <v-row>
          <!-- status component -->
          <Status
            :inProcess="item.detail === true"
            :waiting="
              item.detail === false &&
                !item.sublet_inspection_complete_timestamp
            "
            :date="date"
            :time="time"
          />
        </v-row>
      </v-col>
    </v-row>
    <!-- avatar component -->
    <Avatar
      v-if="item.detail_complete_timestamp"
      :image="item.detail_complete_associate_photo"
      :user="item.detail_complete_associate"
    />
  </div>
</template>

<script>
import Icons from "../fullDialog/Icons";
import StepHeader from "../fullDialog/StepHeader";
import Status from "../fullDialog/Status";
import Avatar from "../fullDialog/Avatar";

export default {
  name: "SubletInspection",
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
