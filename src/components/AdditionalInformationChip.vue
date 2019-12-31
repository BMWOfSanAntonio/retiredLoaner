<template>
  <v-chip dark :color="chipColor" x-large>
    <v-icon color="white">{{ icon }}</v-icon>
    <AdditionalInformationLabel
      :associate="associate"
      :label="label"
      :value="value"
    />
  </v-chip>
</template>

<script>
import AdditionalInformationLabel from "../components/AdditionalInformationLabel";
export default {
  name: "AdditionalInformationChip",
  props: ["label", "value", "item"],
  components: {
    AdditionalInformationLabel
  },
  data() {
    return {
      icon: "",
      associate: null
    };
  },
  computed: {
    chipColor() {
      if (this.label === "Check In Date") {
        this.icon = "mdi-check-circle";
        this.associate = this.item.checkedBy;
        return "success";
      } else if (this.label === "Shop") {
        if (this.item.shop_complete_timestamp) {
          this.icon = "mdi-check-circle";
          this.associate = this.item.shop_associate;
          return "success";
        } else {
          this.icon = "mdi-timer-sand";
          return "warning";
        }
      } else if (this.label === "Sublet Inspection") {
        if (this.item.sublet_inspection_complete_timestamp) {
          this.icon = "mdi-check-circle";
          if (this.item.sublet_inspection_associate) {
            this.associate = this.item.sublet_inspection_associate;
          } else {
            this.associate = this.item.sublet_instpection_associate;
          }

          return "success";
        } else {
          this.icon = "mdi-timer-sand";
          return "warning";
        }
      } else if (this.label === "Sublet") {
        if (this.item.sublet_complete_timestamp) {
          this.icon = "mdi-check-circle";
          this.associate = this.item.sublet_complete_user;
          return "success";
        } else if (
          this.item.sublet === false &&
          this.item.sublet_inspection_complete_timestamp &&
          !this.item.sublet_complete_timestamp
        ) {
          this.icon = "mdi-check-circle";
          this.associate = this.item.sublet_inspection_associate;
          return "success";
        } else if (this.item.sublet === true) {
          this.icon = "mdi-timer-sand";
          return "warning";
        }
      } else if (this.label === "Detail") {
        if (this.item.detail_complete_timestamp) {
          this.icon = "mdi-check-circle";
          this.associate = this.item.detail_complete_timestamp;
          return "success";
        } else if (this.item.detail === true) {
          this.icon = "mdi-timer-sand";
          return "warning";
        } else {
          this.icon = "mdi-close-circle";
          return `error`;
        }
      }
    }
  }
};
</script>
