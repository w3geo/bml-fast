<template>
  <v-card class="panelSize" v-if="dataWindow === 0" elevation="10">
    <v-row no-gutters class="boxHeader bg-grey-darken-2">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-file-arrow-up-down </v-icon>
        Daten Export / Import
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col cols="4" class="pa-2 pt-4">
        <v-icon color="grey" size="20" class="mr-2">mdi-file-download</v-icon>Export:</v-col
      >
      <v-col cols="8" class="pa-2">
        <v-btn color="grey-lighten-4" block @click.stop="downloadJson">Download</v-btn>
      </v-col>
      <v-divider class="my-3" />
      <v-col cols="4" class="pa-2 pt-4">
        <v-icon color="grey" size="20" class="mr-2">mdi-file-upload</v-icon>Import:</v-col
      >
      <v-col cols="8" class="pa-2">
        <v-file-input
          bg-color="grey-lighten-4"
          hide-details
          center-affix
          accept=".txt"
          label="Datei wählen"
          variant="outlined"
          density="compact"
          v-model="inputFile"
          prepend-icon=""
          @update:modelValue="readJson"
        />
      </v-col>
    </v-row>
  </v-card>
  <v-snackbar :color="showAlert.color" v-model="showAlert.show">
    {{ showAlert.text }}

    <template v-slot:actions>
      <v-btn icon="mdi-close" variant="text" @click="showAlert.show = false" />
    </template>
  </v-snackbar>
</template>

<script setup>
import { dataWindow, useDataEntries } from '../composables/useDataEntries.js';
import { ref } from 'vue';

const { savedData } = useDataEntries();
const inputFile = ref(null);
const showAlert = ref({ color: 'green', text: '', show: false });

const link = document.createElement('a');

function downloadJson() {
  const data = JSON.stringify(savedData.value);
  const today = new Date();
  const filename = `fast-export-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.txt`;
  link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
  link.download = filename;
  link.click();
}

function readJson() {
  const reader = new FileReader();
  if (inputFile.value) {
    reader.readAsText(inputFile.value, 'utf-8');
    reader.onload = () => {
      try {
        const imported = JSON.parse(/** @type {string} */ (reader.result));
        savedData.value = imported;
        localStorage.setItem('fasttool', JSON.stringify(savedData.value));
        showAlert.value.text = 'Import erfolgreich. Die Daten wurden eingelesen.';
        showAlert.value.color = 'green';
        showAlert.value.show = true;
        inputFile.value = null;
      } catch (e) {
        showAlert.value.text = 'Achtung: Fehlerhafte Datei - Import fehlgeschlagen';
        showAlert.value.color = 'red';
        showAlert.value.show = true;
        inputFile.value = null;
      }
    };
  }
}
</script>

<style scoped>
.noData {
  margin: 10px;
  padding: 10px;
  text-align: center;
}

.panelSize {
  position: absolute;
  left: 10px;
  bottom: calc(50vh - 210px);
  width: 400px;
  height: 180px;
  overflow: auto;
}
</style>
