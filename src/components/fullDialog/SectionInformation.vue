<template>
  <v-list three-line subheader>
    <v-subheader>Vehicle Information</v-subheader>
    <v-row justify="center">
      <v-col cols="4">
        <AdditionalInformationLabel label="VIN" :value="item.vin" />
        <AdditionalInformationLabel label="Year" :value="item.year" />
      </v-col>
      <v-col cols="4">
        <AdditionalInformationLabel label="Repair Order #" :value="item.ro" />
        <AdditionalInformationLabel label="Make" :value="item.make" />
      </v-col>
      <v-col cols="4">
        <AdditionalInformationLabel
          v-if="item.type"
          label="Type"
          :value="item.type"
        />
        <AdditionalInformationLabel
          v-else
          label="Type"
          value="No type selected"
        />
        <AdditionalInformationLabel label="Model" :value="item.model" />
      </v-col>
    </v-row>
  </v-list>
</template>

<script>
import AdditionalInformationLabel from "../AdditionalInformationLabel";
export default {
  name: "SectionInformation",
  components: {
    AdditionalInformationLabel
  },
  props: ["item"]
};
</script>
