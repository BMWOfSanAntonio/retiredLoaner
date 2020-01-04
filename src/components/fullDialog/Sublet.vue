<template>
  <div class="wrapper">
    <v-row align="center">
      <v-col cols="3">
        <!-- icons component -->
        <Icons
          :complete="
            (item.sublet === false &&
              item.sublet_inspection_complete_timestamp) ||
              item.sublet_complete_timestamp
          "
          :inProcess="
            item.sublet === true &&
              item.shop_complete_timestamp &&
              item.sublet_inspection_complete_timestamp
          "
        />
      </v-col>
      <v-col>
        <v-row>
          <!-- title component -->
          <StepHeader title="Sublet" />
        </v-row>
        <v-row>
          <!-- status component -->
          <Status
            :noSublet="item.no_sublet"
            :inProcess="
              item.sublet === true &&
                item.shop_complete_timestamp &&
                item.sublet_inspection_complete_timestamp
            "
            :waiting="
              !item.shop_complete_timestamp ||
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
      v-if="item.sublet === false && item.sublet_inspection_complete_timestamp"
      :image="item.sublet_inspection_associate_photo"
      :user="
        item.sublet_inspection_associate || item.sublet_instpection_associate
      "
    />
  </div>
</template>

<script>
import Icons from "../fullDialog/Icons";
import StepHeader from "../fullDialog/StepHeader";
import Status from "../fullDialog/Status";
import Avatar from "../fullDialog/Avatar";

export default {
  name: "Sublet",
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
