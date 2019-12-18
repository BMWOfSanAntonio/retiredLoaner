<template>
  <v-container class="manager">
    <QuickMetrics class="mb-10" :user="user" />
    <AddVehicle :user="user" />
    <Shop :user="user" />
    <SubletInspection :user="user" />
    <Sublet :user="user" />
    <Detail :user="user" />
  </v-container>
</template>

<script>
// * Components
import QuickMetrics from "@/components/QuickMetrics";
import Shop from "@/components/Shop";
import SubletInspection from "@/components/SubletInspection";
import Sublet from "@/components/Sublet";
import Detail from "@/components/Detail";
import AddVehicle from "@/components/AddVehicle";

export default {
  name: "Manager",
  props: ["user"],
  components: {
    QuickMetrics,
    Shop,
    SubletInspection,
    Sublet,
    Detail,
    AddVehicle
  },
  data() {
    return {};
  }
};
</script>
