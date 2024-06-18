<template>
  <v-card class="entryForm" v-if="allData.datawindow">
    <v-row no-gutters class="boxHeader">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-list-box </v-icon>
        Datenfenster
      </v-col>
    </v-row>
    <v-row class="theForm" no-gutters
      ><v-col>
        <div class="selectSchlag" v-if="!allData.current">
          Bitte einen Schlag als Ausgangspunkt wählen!
        </div>
      </v-col></v-row
    >
    <v-row no-gutters class="bg-grey-lighten-3"
      ><v-col cols="6" class="pa-2">
        <v-btn block @click.stop="allData.datawindow = false">Abbrechen</v-btn> </v-col
      ><v-col cols="6" class="pa-2">
        <v-btn block @click.stop="allData.datawindow = false">Speichern</v-btn>
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { onMounted } from 'vue';

import { useDataEntries } from '../composables/useDataEntries.js';

const { allData } = useDataEntries();

onMounted(() => {
  console.log(allData.value);
});
</script>

<style scoped>
.theForm {
  height: calc(100% - 82px);
  overflow: auto;
}

.selectSchlag {
  margin: 10px;
  background-color: #ddd;
  padding: 10px;
  text-align: center;
}
.details {
  cursor: pointer;
}
.entryForm {
  position: absolute;
  left: 370px;
  top: 60px;
  width: 450px;
  height: calc(100vh - 70px);
  min-height: calc(100vh - 70px);
  overflow: auto;
}

.boxHeader .v-col {
  height: 30px;
  line-height: 30px;
  background-color: #777;
}

.schlagTools button {
  display: block;
}
</style>
