<template>
  <v-card
    class="fertilizerData"
    :class="winMaximize ? 'maximized' : ''"
    v-if="dataWindow === 2"
    elevation="10"
  >
    <v-row no-gutters class="boxHeader bg-grey-darken-3 mb-3">
      <v-col cols="10" class="text-button text-white">
        <v-icon class="mx-1"> mdi-chart-pie </v-icon>
        Nährstoff-Bilanz
      </v-col>
      <v-col cols="2" class="text-right">
        <v-icon class="mr-2" @click.stop="winMaximize = !winMaximize"
          >{{ winMaximize ? 'mdi-window-restore' : 'mdi-window-maximize' }}
        </v-icon>
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

const winMaximize = ref(false);
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
  for (let c = 0; c < entry.value.cultures.length; c++) {
    let anyErrors = false;
    if (entry.value.cultures[c].kultur != '') {
      if (
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'Düngeverbot' &&
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'keine Ertragserfassung'
      ) {
        if (entry.value.cultures[c].ertragslage === '') {
          errors.value.push(`${c}. Hauptfrucht: Erwartete Ertragslage nicht angegeben`);
          anyErrors = true;
        }
        if (
          entry.value.cultures[c].ertragslageernte === '' &&
          parseFloat(entry.value.cultures[c].ernte) === 0
        ) {
          errors.value.push(`${c}. Hauptfrucht: Keine Angaben zur Ernte`);
          anyErrors = true;
        }
      }
      // Düngung
      if (entry.value.cultures[c].duengung.length > 0) {
        for (let d = 0; d < entry.value.cultures[c].duengung.length; d++) {
          if (entry.value.cultures[c].duengung[d].typ === '') {
            if (c > 0) {
              errors.value.push(`${c}. Hauptfrucht, ${d + 1}. Düngung: Keine Angaben zum Typ`);
            } else {
              errors.value.push(`Zwischenfrucht, ${d + 1}. Düngung: Keine Angaben zum Typ`);
            }
            anyErrors = true;
          } else if (entry.value.cultures[c].duengung[d].menge <= 0) {
            if (c > 0) {
              errors.value.push(`${c}. Hauptfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            } else {
              errors.value.push(`Zwischenfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            }
            anyErrors = true;
          }
        }
      }

      if (!anyErrors) {
        // Balance goes here / WIP
      }
    } else {
      if (c > 0) {
        errors.value.push(`${c}. Hauptfrucht: Keine Kultur definiert`);
      }
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

.fertilizerData.maximized {
  height: calc(100% - 70px);
  width: 1010px;
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
