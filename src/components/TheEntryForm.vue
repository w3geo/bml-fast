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
        <div class="selectSchlag" v-if="!tempData.basic">
          Bitte einen Schlag als Ausgangspunkt wählen!
        </div>
        <v-form ref="entryform" v-if="tempData.basic">
          <div class="pa-4">
            Bitte geben Sie Ihre Daten ein. Blau markierte Felder sind Pflichtfelder. Die
            Güngebilanz wird angezeigt, sobald alle notwendigen Feldern mit Werten befüllt sind.
          </div>
          <v-row no-gutters>
            <v-col cols="6" class="px-4 obligatory">
              <v-text-field
                v-model="entry.flaechennutzungsart"
                label="Flächennutzungsart"
                variant="outlined"
                density="compact"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="px-4 obligatory">
              <v-text-field
                v-model="entry.flaeche"
                label="Fläche (ha)"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6" class="px-4">
              <v-text-field
                v-model="entry.schlagnummer"
                label="Schlagnummer"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="px-4">
              <v-text-field
                v-model="entry.feldstuecksname"
                label="Feldstücksname"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form> </v-col
    ></v-row>
    <v-row no-gutters class="bg-grey-lighten-3"
      ><v-col cols="6" class="pa-2"> <v-btn block @click.stop="cancelData">Abbrechen</v-btn> </v-col
      ><v-col cols="6" class="pa-2">
        <v-btn v-if="tempData.basic" block @click.stop="saveData">Speichern</v-btn>
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';
const { allData, emptyEntry } = useDataEntries();
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSchlag } from '../composables/useSchlag.js';
import { mapReady, useMap } from '../composables/useMap.js';
import { SCHLAEGE_SOURCE } from '../constants.js';
import { useTopicIntersections } from '../composables/useTopicIntersections.js';

const { schlagInfo } = useSchlag();
const { map } = useMap();
const route = useRoute();
const router = useRouter();
const { topicHectars } = useTopicIntersections();

const emit = defineEmits(['schlag']);

const schlaegeLastModified = ref();

const tempData = ref({ basic: null, programs: null });

const entry = ref({ ...emptyEntry });

mapReady.then(() => {
  const date = new Date(map.get('mapbox-style').metadata.sources[SCHLAEGE_SOURCE].lastModified);
  schlaegeLastModified.value = new Intl.DateTimeFormat('de-AT').format(date);
});

function setSchlagId(id) {
  if (Number(id) !== schlagInfo.value?.id) {
    schlagInfo.value = id
      ? {
          loading: true,
          id: Number(id),
        }
      : null;
  }
}

function saveData() {
  console.log(entry.value, tempData.value);
}

function cancelData() {
  tempData.value = { basic: null, programs: null };
  allData.value.datawindow = false;
}

watch(schlagInfo, (value) => {
  if (value?.id !== Number(route.params.schlagId)) {
    tempData.value.basic = schlagInfo.value;
    if (tempData.value.basic) {
      entry.value.flaechennutzungsart = tempData.value.basic.fnar_code;
      entry.value.flaeche = tempData.value.basic.sl_flaeche_brutto_ha;
    }
    if (tempData.value.basic && tempData.value.basic.parts) {
      delete tempData.value.basic.parts;
    }
    router.push({ params: { ...route.params, schlagId: value?.id } });
  }
  if (value && !value.loading) {
    emit('schlag', true);
  }
});

// Area of relevant topics inside the current schlag
watch(topicHectars, (value) => {
  tempData.value.programs = value;
});

map.on('singleclick', (event) => {
  if (map.getView().getZoom() < 12) {
    map.getView().animate({
      zoom: 12,
      center: event.coordinate,
      duration: 500,
    });
  }
});

watch(() => route.params.schlagId, setSchlagId);
setSchlagId(route.params.schlagId);
</script>

<style>
div.obligatory div.v-field__overlay {
  border-left-style: solid;
  border-left-color: teal !important;
  border-left-width: 5px !important;
}
</style>
<style scoped>
.theForm {
  height: calc(100% - 82px);
  overflow: auto;
  font-size: 13px;
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
  width: 650px;
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
