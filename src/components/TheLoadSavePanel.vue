<template>
  <v-card class="fertilizerData" v-if="!allData.datawindow">
    <v-row no-gutters class="boxHeader">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-file-arrow-up-down </v-icon>
        Daten Export / Import
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="4" class="pa-2">Export:</v-col>
      <v-col cols="8" class="pa-2">
        <v-btn prepend-icon="mdi-file-download" hide-input block @click.stop="downloadJson"
          >Download</v-btn
        >
      </v-col>
      <v-divider class="my-3" />
      <v-col cols="4" class="pa-2">Import:</v-col>
      <v-col cols="8" class="pa-2">
        <v-file-input
          accept=".txt"
          label="Datei wählen"
          variant="outlined"
          density="compact"
          v-model="inputFile"
          prepend-icon=""
          prepend-inner-icon="mdi-file-upload"
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
import download from 'downloadjs';
import { useDataEntries } from '../composables/useDataEntries.js';
import { ref } from 'vue';

const { allData } = useDataEntries();
const inputFile = ref(null);
const showAlert = ref({ color: 'green', text: '', show: false });

function downloadJson() {
  const data = JSON.stringify(allData.value.saved);
  const today = new Date();
  const filename = `fast-export-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.txt`;
  download(data, filename, 'text/plain');
}

function readJson() {
  const reader = new FileReader();
  if (inputFile.value) {
    reader.readAsText(inputFile.value);
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result.toString());
        allData.value.saved = imported;
        localStorage.setItem('fasttool', JSON.stringify(allData.value.saved));
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

.fertilizerData {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 350px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}

.boxHeader .v-col {
  height: 30px;
  line-height: 30px;
  background-color: #777;
}
</style>
