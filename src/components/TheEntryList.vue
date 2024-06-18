<template>
  <v-card class="entryList">
    <div class="greyOut" v-if="allData.datawindow" />
    <v-row no-gutters class="boxHeader">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-view-list </v-icon>
        Gespeicherte Einträge
      </v-col>
    </v-row>
    <v-row class="theList" no-gutters
      ><v-col>
        <div class="noEntry" v-if="allData.saved.length === 0">Keine gespeicherten Einträge.</div>
      </v-col></v-row
    >
    <v-row no-gutters class="bg-grey-lighten-3"
      ><v-col class="pa-2">
        <v-btn block @click.stop="allData.datawindow = true">Neuer Eintrag</v-btn>
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';

const { allData } = useDataEntries();
</script>

<style scoped>
.greyOut {
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: white;
  opacity: 0.5;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.noEntry {
  margin: 10px;
  padding: 10px;
  text-align: center;
}

.theList {
  height: calc(100% - 82px);
  overflow: auto;
}

.entryList {
  position: absolute;
  left: 10px;
  top: 60px;
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
