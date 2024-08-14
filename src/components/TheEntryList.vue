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
        <div v-for="i in allData.saved.length" :key="i" class="pa-0 ma-0">
          <div
            class="bg-grey pa-1"
            v-if="i == 1 || (i > 1 && allData.saved[i - 1].jahr > allData.saved[i - 2].jahr)"
          >
            {{ allData.saved[i - 1].jahr }}
          </div>
          <v-row no-gutters class="bg-grey-lighten-4 ma-1 pa-1">
            <v-col cols="9"
              >{{ allData.saved[i - 1].schlagnummer }} /
              {{ allData.saved[i - 1].feldstuecksname }}</v-col
            >
            <v-col cols="3" class="text-right">
              <v-icon
                class="mt-1 mr-3"
                size="22"
                color="orange"
                icon="mdi-pencil"
                @click="editEntry(i - 1)"
              />
              <v-icon
                class="mt-1 mr-3"
                size="22"
                color="red"
                icon="mdi-close"
                @click="deleteEntry(i - 1)"
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters class="bg-grey-lighten-3"
      ><v-col class="pa-2">
        <v-btn block @click.stop="editEntry(null)">Neuer Eintrag</v-btn>
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';

const { allData, emptyEntry, emptyCulture, emptyFertilization, entry } = useDataEntries();

function editEntry(nr) {
  allData.value.current = nr;
  if (nr !== null) {
    entry.value = allData.value.saved[nr];
  } else {
    entry.value = { ...emptyEntry };
    entry.value.cultures = [{ ...emptyCulture }, { ...emptyCulture }];
    entry.value.cultures[0].duengung = [{ ...emptyFertilization }];
    entry.value.cultures[1].duengung = [{ ...emptyFertilization }];
  }
  allData.value.datawindow = true;
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
