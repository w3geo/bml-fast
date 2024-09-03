<template>
  <v-card class="fertilizerData" v-if="allData.datawindow === 2" elevation="10">
    <v-row no-gutters class="boxHeader bg-grey-darken-3">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-chart-pie </v-icon>
        Nährstoff-Bilanz
      </v-col>
    </v-row>
    <v-row class="theList" no-gutters
      ><v-col>
        <div class="noData">Zu wenige Daten</div>
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';

const { allData } = useDataEntries();
</script>

<style scoped>
.noData {
  margin: 10px;
  padding: 10px;
  text-align: center;
}

.fertilizerData {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 350px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}
</style>
