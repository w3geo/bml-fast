<template>
  <v-card class="fertilizerData" v-if="dataWindow === 2" elevation="10">
    <v-row no-gutters class="boxHeader bg-grey-darken-3 mb-3">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-chart-pie </v-icon>
        Nährstoff-Bilanz
      </v-col>
    </v-row>
    <v-row
      v-for="(message, index) in errors"
      :key="`error${index}`"
      no-gutters
      class="ma-1 mx-2 error"
      ><v-col cols="12" class="pa-1 pl-4"
        ><v-icon size="small">mdi-alert-box</v-icon>{{ message }}
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';
import { useLookup } from '../composables/useLookUps.js';
import { watch, ref } from 'vue';

const { dataWindow, entry } = useDataEntries();
const { tableAttribut } = useLookup();

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
    let kulturErrors = false;
    if (entry.value.cultures[c].kultur != '') {
      if (
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'Düngeverbot' &&
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'keine Ertragserfassung'
      ) {
        if (entry.value.cultures[c].ertragslage === '') {
          errors.value.push(`${c}. Hauptfrucht: Erwartete Ertragslage nicht angegeben`);
          kulturErrors = true;
        }
        if (entry.value.cultures[c].ertragslageernte === '') {
          errors.value.push(`${c}. Hauptfrucht: Keine Angaben zur Ernte`);
          kulturErrors = true;
        }
      }
      if (!kulturErrors) {
        console.log(entry.value.cultures);
      }
    } else {
      errors.value.push(`${c}. Hauptfrucht: Keine Kultur definiert`);
    }
  }
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
  position: relative;
  border: 1px solid red;
  font-size: 12px;
  color: red;
}
</style>

<style>
.error .v-icon {
  position: absolute;
  left: -2px;
  top: -2px;
}
</style>
