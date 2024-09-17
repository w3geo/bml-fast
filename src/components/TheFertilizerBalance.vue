<template>
  <v-card class="fertilizerData" v-if="dataWindow === 2" elevation="10">
    <v-row no-gutters class="boxHeader bg-grey-darken-3">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-chart-pie </v-icon>
        Nährstoff-Bilanz
      </v-col>
    </v-row>
    <v-row
      v-for="(message, index) in errors"
      :key="`error${index}`"
      no-gutters
      class="ma-1 pa-1 error"
      ><v-col cols="1"><v-icon>mdi-alert</v-icon></v-col
      ><v-col cols="11">{{ message }} </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';
// import { useLookup } from '../composables/useLookUps.js';
import { watch, ref } from 'vue';

const { dataWindow, entry } = useDataEntries();
// const { lookup } = useLookup();

const bilanz = ref([]);
const errors = ref([]);

watch(
  entry,
  () => {
    calculateBilanz();
  },
  { deep: true },
);

function calculateBilanz() {
  errors.value = [];

  // Pflichtangaben
  if (entry.value.flaeche <= 0) {
    errors.value.push('Fehlende Flächenangabe für den Schlag');
  }

  // Kulturen
  for (let c = 1; c < entry.value.cultures.length; c++) {
    if (entry.value.cultures[c].kultur != '') {
      // hurra
    } else {
      errors.value.push(`Keine Kultur für Hauptfrucht N° ${c} definiert`);
    }
  }
  console.log(entry.value.cultures);
  bilanz.value = [];
}
</script>

<style scoped>
.fertilizerData {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 350px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}

.error {
  border: 1px solid red;
  font-size: 13px;
  color: red;
  text-align: center;
}
</style>
