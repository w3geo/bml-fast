<template>
  <v-card class="entryForm" v-if="allData.datawindow">
    <v-row no-gutters class="boxHeader">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-list-box </v-icon>
        Datenfenster
      </v-col>
    </v-row>
    <v-row class="theForm" no-gutters>
      <v-col>
        <div class="selectSchlag" v-if="!tempData.basic && allData.current === null">
          Bitte einen Schlag als Ausgangspunkt wählen!
        </div>
        <v-form ref="entryform" v-if="tempData.basic || allData.current !== null">
          <div class="pa-4 mb-2 bg-grey-lighten-4">
            Bitte geben Sie Ihre Daten ein. Blau markierte Felder sind Pflichtfelder. Kursiv
            geschriebene Werte sind gesperrt (aus Daten berechnet). Die Düngebilanz wird angezeigt,
            sobald alle notwendigen Feldern mit Werten befüllt sind.
          </div>
          <v-expansion-panels variant="accordion" v-model="panelInit">
            <v-expansion-panel value="basisdaten" rounded="0" elevation="0">
              <v-expansion-panel-title static class="bg-grey-lighten-3">
                Basisdaten
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row no-gutters>
                  <v-col cols="6" class="px-4">
                    <v-text-field
                      v-model="entry.schlagnummer"
                      label="Schlagnummer"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="6" class="px-4">
                    <v-text-field
                      v-model="entry.feldstuecksname"
                      label="Feldstücksname"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-text-field
                      v-model="lookup.feldstücknutzungsarten[entry.flaechennutzungsart]"
                      label="Flächennutzungsart"
                      variant="outlined"
                      density="compact"
                      disabled
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-text-field
                      v-model="entry.flaeche"
                      label="Fläche (ha)"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-divider color="grey" thickness="4" class="py-2" />

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-text-field
                      v-model="nitratRisikoGebiet"
                      label="Nitratrisikogebiet"
                      variant="outlined"
                      density="compact"
                      disabled
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-select
                      v-model="entry.duengeklasse_grundwasserschutz"
                      :items="lookup.wrrl"
                      label="Düngeklasse Grundwasserschutz"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-text-field
                      v-model="bdfl_l16"
                      label="Fläche im Maßnahmengebiet Vorbeugender Grundwasserschutz"
                      variant="outlined"
                      density="compact"
                      disabled
                    />
                  </v-col>
                  <v-col cols="6" class="px-4">
                    <v-select
                      v-if="bdfl_l16 > 0"
                      v-model="entry.teilnahme_grundwasserschutz_acker"
                      :items="itemsJaNein"
                      label="Teilnahme am vorbeugenden Grundwasserschutz"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters v-if="entry.teilnahme_grundwasserschutz_acker">
                  <v-col cols="6" class="px-4">
                    <v-text-field
                      v-model="entry.stickstoffueberschuss"
                      label="Stickstoffüberschuss"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-select
                      v-model="entry.gw_acker_gebietszuteilung"
                      :items="itemsGWAcker"
                      label="GW-Acker Gebietszuteilung"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-divider color="grey" thickness="4" class="py-2" />

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-select
                      v-model="entry.phosphor_gehaltsklasse"
                      :items="itemsABCDE"
                      label="Phosphor Gehaltsklasse"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-select
                      v-model="entry.kalium_gehaltsklasse"
                      :items="itemsABCDE"
                      label="Kalium Gehaltsklasse"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="6" class="px-4">
                    <v-text-field
                      v-model="entry.ackerzahl"
                      label="Ackerzahl"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-select
                      v-model="entry.bodenart"
                      :items="lookup.bodenartenbodenschwere"
                      label="Bodenart"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-divider color="grey" thickness="4" class="py-2" />

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory">
                    <v-select
                      v-model="entry.jahr"
                      :items="itemsYear"
                      label="Jahr"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="6" class="px-4">
                    <v-select
                      v-model="entry.vorfrucht"
                      :items="lookup.kulturenItems[entry.flaechennutzungsart]"
                      label="Vorfrucht"
                      variant="outlined"
                      density="compact"
                      clearable
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel value="ernten" rounded="0" elevation="0">
              <v-expansion-panel-title static class="bg-grey-lighten-3">
                Ernten
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-card class="ma-0 pa-0" v-for="i in entry.ernten.length" :key="i">
                  <v-row no-gutters class="bg-grey-lighten-4 mb-3">
                    <v-col cols="10" class="pl-2">
                      <span class="text-button">Ernte {{ i }}</span>
                    </v-col>
                    <v-col cols="2" class="text-right">
                      <v-icon
                        v-if="i == entry.ernten.length && entry.ernten.length > 1"
                        class="mt-1"
                        size="28"
                        color="red"
                        icon="mdi-close"
                        @click="deleteHarvest(i - 1)"
                      />
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="9" class="px-4 obligatory">
                      <v-select
                        v-model="entry.ernten[i - 1].kultur"
                        :items="lookup.kulturenItems[entry.flaechennutzungsart]"
                        label="Kultur"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="3" class="px-4 obligatory">
                      <v-text-field
                        v-model="entry.ernten[i - 1].menge"
                        label="Menge"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-card>
                <v-btn
                  class="mt-5"
                  prepend-icon="mdi-plus"
                  color="green-lighten-4"
                  size="small"
                  @click="addHarvest"
                  >Ernte hinzufügen</v-btn
                >
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel value="data" rounded="0" elevation="0">
              <v-expansion-panel-title static class="bg-grey-lighten-3 font-italic">
                Schlag-Daten (Debugging / Testing)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pa-2 bg-blue-lighten-5" style="overflow: hidden">
                  SCHLAG-DATEN:<br />
                  <pre>{{ tempData.basic }}</pre>
                  <pre>{{ tempData.programs }}</pre>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
      </v-col>
    </v-row>
    <v-row no-gutters class="bg-grey-lighten-3"
      ><v-col cols="6" class="pa-2"> <v-btn block @click.stop="cancelData">Abbrechen</v-btn> </v-col
      ><v-col cols="6" class="pa-2">
        <v-btn v-if="tempData.basic || allData.current !== null" block @click.stop="saveData"
          >Speichern</v-btn
        >
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';
import { watch, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSchlag } from '../composables/useSchlag.js';
import { mapReady, useMap } from '../composables/useMap.js';
import { SCHLAEGE_SOURCE } from '../constants.js';
import { useTopicIntersections } from '../composables/useTopicIntersections.js';
import { useLookup } from '../composables/useLookUps.js';

const { allData, emptyHarvest, entry } = useDataEntries();
const { schlagInfo } = useSchlag();
const { map } = useMap();
const route = useRoute();
const router = useRouter();
const { topicHectars } = useTopicIntersections();

const emit = defineEmits(['schlag']);

const schlaegeLastModified = ref();

const { lookup } = useLookup();

const tempData = ref({ basic: null, programs: null });

const panelInit = ref(['basisdaten']);

const itemsJaNein = [
  { value: true, title: 'Ja' },
  { value: false, title: 'Nein' },
];

const itemsYear = [2021, 2022, 2023, 2024];

const itemsABCDE = ['A', 'B', 'C', 'D', 'E'];

const itemsGWAcker = ['Trockengebiet', 'Feuchtgebiet'];

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

function deleteHarvest(nr) {
  entry.value.ernten.splice(nr, 1);
}

function addHarvest() {
  entry.value.ernten.push({ ...emptyHarvest });
}

function dataSort(a, b) {
  return a.jahr < b.jahr ? -1 : 1;
}

function saveData() {
  if (allData.value.current !== null) {
    allData.value.saved[allData.value.current] = { ...entry.value };
  } else {
    allData.value.saved.push(entry.value);
    allData.value.saved.sort(dataSort);
  }

  localStorage.setItem('fasttool', JSON.stringify(allData.value.saved));
  allData.value.datawindow = false;
  panelInit.value = ['basisdaten'];
}

function cancelData() {
  tempData.value = { basic: null, programs: null };
  allData.value.datawindow = false;
  panelInit.value = ['basisdaten'];
}

watch(schlagInfo, (value) => {
  if (value?.id !== Number(route.params.schlagId)) {
    tempData.value.basic = schlagInfo.value;
    if (tempData.value.basic) {
      entry.value.flaechennutzungsart = tempData.value.basic.fnar_code;
      entry.value.flaeche = tempData.value.basic.sl_flaeche_brutto_ha;

      entry.value.extent = tempData.value.basic.extent;
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
  if (tempData.value.programs) {
    entry.value.flaeche_nitratrisikogebiet = tempData.value.programs.nitrataktionsprogramm;

    entry.value.duengeklasse_grundwasserschutz = '-';
    let currentDuengeklasse = 0;
    for (let l = 1; l < lookup.value.wrrl.length; l++) {
      if (tempData.value.programs[lookup.value.wrrl[l].code] > currentDuengeklasse) {
        currentDuengeklasse = tempData.value.programs[lookup.value.wrrl[l].code];
        entry.value.duengeklasse_grundwasserschutz = lookup.value.wrrl[l].value;
      }
    }
  }
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

const nitratRisikoGebiet = computed(() => {
  return entry.value.flaeche_nitratrisikogebiet > entry.value.flaeche / 2 ? 'JA' : 'NEIN';
});

const bdfl_l16 = computed(() => {
  return tempData.value.programs && tempData.value.programs.bdfl_l16_grundwasserschutz_acker
    ? tempData.value.programs.bdfl_l16_grundwasserschutz_acker
    : 0;
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

div.obligatory div.v-field {
  opacity: 0.7 !important;
}

div.obligatory div.v-input--disabled {
  font-style: italic;
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
