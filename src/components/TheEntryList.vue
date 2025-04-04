<template>
  <v-card class="entryList" elevation="10">
    <div class="greyOut" v-if="dataWindow > 0" />
    <v-row no-gutters class="boxHeader bg-grey-darken-2">
      <v-col cols="10" class="text-button text-white">
        <v-icon class="mx-1"> mdi-view-list </v-icon>
        Gespeicherte Einträge
      </v-col>
      <v-col cols="2" class="text-right pr-1"
        ><v-icon size="small" @click="showHelp('entrylist')">mdi-help-circle</v-icon></v-col
      >
    </v-row>
    <v-row class="theList" no-gutters
      ><v-col>
        <div class="noEntry" v-if="savedData.length === 0">Keine gespeicherten Einträge.</div>
        <div v-for="i in savedData.length" :key="i" class="pa-0 ma-0">
          <div
            class="bg-grey px-1"
            v-if="i == 1 || (i > 1 && savedData[i - 1].jahr > savedData[i - 2].jahr)"
          >
            {{ savedData[i - 1].jahr }}
          </div>
          <v-row
            no-gutters
            class="rowFormat header"
            v-if="i == 1 || (i > 1 && savedData[i - 1].jahr > savedData[i - 2].jahr)"
          >
            <v-col cols="9">
              <div>Feldstück: Name</div>
              <div>Nr</div>
              <div>Schlag</div></v-col
            >
            <v-col cols="3"></v-col>
          </v-row>
          <v-row no-gutters class="rowFormat">
            <v-col cols="9"
              ><div>{{ savedData[i - 1].feldstuecksname }}</div>
              <div>{{ savedData[i - 1].feldstuecksnummer }}</div>
              <div>{{ savedData[i - 1].schlagnummer }}</div></v-col
            >
            <v-col cols="3" class="text-right">
              <v-icon
                class="mr-1"
                size="22"
                color="grey"
                icon="mdi-map-marker"
                @click="zoomTo(i - 1)"
              />
              <v-icon
                class="mr-1"
                size="22"
                color="orange"
                icon="mdi-pencil-circle"
                @click="editEntry(i - 1)"
              />
              <v-icon
                class="mr-1"
                size="22"
                color="red"
                icon="mdi-close-circle"
                @click="deleteEntry(i - 1)"
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters class="bg-grey-darken-2"
      ><v-col class="pa-2">
        <v-btn
          density="compact"
          prepend-icon="mdi-plus"
          color="green"
          block
          @click.stop="editEntry(null)"
          >Neuer Eintrag</v-btn
        >
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useSchlag } from '../composables/useSchlag.js';
import { useDataEntries } from '../composables/useDataEntries.js';
import { watch } from 'vue';
import { useHelp } from '../composables/useHelp.js';

const { showHelp } = useHelp();

const { savedData, currentSaved, dataWindow, emptyEntry, entry } = useDataEntries();
const { showSchlagParts, removeSchlagParts } = useSchlag();

watch(entry, (value) => {
  removeSchlagParts();
  if (!value?.parts) {
    return;
  }
  showSchlagParts(value.parts);
});
function zoomTo(nr) {
  entry.value = JSON.parse(JSON.stringify(savedData.value[nr]));
}

function editEntry(nr) {
  currentSaved.value = nr;
  if (nr !== null) {
    entry.value = JSON.parse(JSON.stringify(savedData.value[nr]));
  } else {
    entry.value = JSON.parse(JSON.stringify(emptyEntry));
  }
  dataWindow.value = nr === null ? 1 : 2;
}

function deleteEntry(nr) {
  savedData.value.splice(nr, 1);
  localStorage.setItem('fasttool', JSON.stringify(savedData.value));
}
</script>

<style scoped>
.rowFormat {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  max-height: 30px;
}
.rowFormat div {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  font-size: 13px;
  line-height: 30px;
  padding-left: 5px;
}
.rowFormat.header {
  background-color: #ddd;
}
.rowFormat div:nth-child(1) {
  width: 70%;
}
.rowFormat div:nth-child(2) {
  width: 15%;
}
.rowFormat div:nth-child(3) {
  width: 15%;
}

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
  height: calc(100% - 70px);
  overflow: auto;
}

.entryList {
  position: absolute;
  left: 10px;
  top: 60px;
  width: 400px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}
</style>
