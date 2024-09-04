<template>
  <v-card class="entryList" elevation="10">
    <div class="greyOut" v-if="allData.datawindow > 0" />
    <v-row no-gutters class="boxHeader bg-grey-darken-2">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-view-list </v-icon>
        Gespeicherte Einträge
      </v-col>
    </v-row>
    <v-row class="theList" no-gutters
      ><v-col>
        <div class="noEntry" v-if="allData.saved.length === 0">Keine gespeicherten Einträge.</div>
        <div v-for="i in allData.saved.length" :key="i" class="pa-0 ma-0">
          <div
            class="bg-grey pa-1"
            v-if="i == 1 || (i > 1 && allData.saved[i - 1].jahr > allData.saved[i - 2].jahr)"
          >
            {{ allData.saved[i - 1].jahr }}
          </div>
          <v-row no-gutters class="bg-grey-lighten-3 my-1 pa-1 text-subtitle-2">
            <v-col cols="9"
              >{{ allData.saved[i - 1].schlagnummer }} /
              {{ allData.saved[i - 1].feldstuecksname }}</v-col
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
import { nextTick, watch } from 'vue';

const { allData, emptyEntry, entry } = useDataEntries();
const { showSchlagParts } = useSchlag();

let removeSchlagParts;
watch(entry, (value) => {
  if (value && removeSchlagParts) {
    removeSchlagParts();
  }
});
function zoomTo(nr) {
  entry.value = JSON.parse(JSON.stringify(allData.value.saved[nr]));
  nextTick(() => {
    removeSchlagParts = showSchlagParts(allData.value.saved[nr].schlaginfo.basic.parts);
  });
}

function editEntry(nr) {
  allData.value.current = nr;
  if (nr !== null) {
    entry.value = JSON.parse(JSON.stringify(allData.value.saved[nr]));
  } else {
    entry.value = JSON.parse(JSON.stringify(emptyEntry));
  }
  allData.value.datawindow = nr === null ? 1 : 2;
}

function deleteEntry(nr) {
  allData.value.saved.splice(nr, 1);
  localStorage.setItem('fasttool', JSON.stringify(allData.value.saved));
}
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
  height: calc(100% - 70px);
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
</style>
