<template>
  <v-card
    :class="!tempData.basic && allData.current === null ? 'beforeEntryForm' : 'entryForm'"
    v-if="allData.datawindow > 0"
    elevation="10"
  >
    <v-row no-gutters class="boxHeader bg-grey-darken-2">
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
          <v-expansion-panels variant="accordion" multiple v-model="panelInit">
            <v-expansion-panel value="basisdaten" rounded="0" elevation="0">
              <v-expansion-panel-title static class="bg-grey-darken-1">
                Basisdaten
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row no-gutters>
                  <v-col cols="6" class="px-4 mb-3">
                    <v-text-field
                      v-model="entry.schlagnummer"
                      label="Schlagnummer"
                      variant="outlined"
                      hide-details
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 mb-3">
                    <v-text-field
                      v-model="entry.feldstuecksname"
                      label="Feldstücksname"
                      variant="outlined"
                      hide-details
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-text-field
                      v-model="lookup.feldstücknutzungsarten[entry.flaechennutzungsart]"
                      label="Flächennutzungsart"
                      variant="outlined"
                      density="compact"
                      hide-details
                      disabled
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-text-field
                      v-model="entry.flaeche"
                      label="Fläche (ha)"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-divider color="grey" thickness="4" class="py-2" />

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-text-field
                      v-model="nitratRisikoGebiet"
                      label="Nitratrisikogebiet"
                      variant="outlined"
                      density="compact"
                      hide-details
                      disabled
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-select
                      v-model="entry.duengeklasse_grundwasserschutz"
                      :items="lookup.wrrl"
                      label="Düngeklasse Grundwasserschutz"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-text-field
                      v-model="bdfl_l16"
                      label="Fläche im Maßnahmengebiet Vorbeugender Grundwasserschutz"
                      variant="outlined"
                      density="compact"
                      hide-details
                      disabled
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 mb-3">
                    <v-select
                      v-if="bdfl_l16 > 0"
                      v-model="entry.teilnahme_grundwasserschutz_acker"
                      :items="itemsJaNein"
                      label="Teilnahme am vorbeugenden Grundwasserschutz"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters v-if="entry.teilnahme_grundwasserschutz_acker">
                  <v-col cols="6" class="px-4 mb-3">
                    <v-text-field
                      v-model="entry.stickstoffueberschuss"
                      label="Stickstoffüberschuss"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-select
                      v-model="entry.gw_acker_gebietszuteilung"
                      :items="itemsGWAcker"
                      label="GW-Acker Gebietszuteilung"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-divider color="grey" thickness="4" class="py-2" />

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-select
                      v-model="entry.phosphor_gehaltsklasse"
                      :items="itemsABCDE"
                      label="Phosphor Gehaltsklasse"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-select
                      v-model="entry.kalium_gehaltsklasse"
                      :items="itemsABCDE"
                      label="Kalium Gehaltsklasse"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 mb-3">
                    <v-select
                      v-if="entry.flaechennutzungsart === 'A'"
                      v-model="entry.ackerzahl"
                      :items="lookup.ackerzahlItems"
                      label="Ackerzahl"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @update:model-value="allCulturesReset"
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-select
                      v-model="entry.bodenart"
                      :items="lookup.bodenartenbodenschwere"
                      label="Bodenart"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-divider color="grey" thickness="4" class="py-2" />

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-select
                      v-model="entry.jahr"
                      :items="lookup.yearItems"
                      label="Wirtschaftsjahr"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 mb-3">
                    <v-select
                      v-model="entry.vorfrucht"
                      :items="lookup.kulturenItems.alle"
                      label="Vorfrucht"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel value="kulturen" rounded="0" elevation="0">
              <v-expansion-panel-title static class="bg-grey-darken-1">
                Zwischenfrucht / Hauptkulturen
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-card class="mt-1 mb-4 pa-0 cardBorder zwischenfrucht" elevation="0">
                  <v-row no-gutters class="bg-brown-lighten-3 mb-3">
                    <v-col cols="10" class="pl-2">
                      <span class="text-button">Zwischenfrucht</span>
                    </v-col>
                    <v-col cols="2" class="text-right"> </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="12" class="px-4 mb-3">
                      <v-select
                        v-model="entry.cultures[0].typ"
                        :items="lookup.aussaatTypes[0]"
                        label="Art der Zwischenfrucht"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters v-if="entry.cultures[0].typ != ''">
                    <v-col cols="12" class="px-4 mb-3">
                      <v-select
                        v-model="entry.cultures[0].kultur"
                        :items="lookup.kulturenItems.zwischen"
                        label="Kultur"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <v-card
                  class="mt-1 mb-4 pa-0 cardBorder hauptfrucht"
                  elevation="0"
                  v-for="i in entry.cultures.length - 1"
                  :key="`kultur${i}`"
                >
                  <v-row no-gutters class="bg-brown-lighten-2">
                    <v-col cols="10" class="pl-2">
                      <span class="text-button">{{ i }}. Hauptfrucht</span>
                    </v-col>
                    <v-col cols="2" class="text-right">
                      <v-btn icon size="20" @click="deleteCulture(i)" class="mt-2 mr-2">
                        <v-icon size="20" color="red" icon="mdi-close"
                      /></v-btn>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="12" class="mb-2 pa-1 bg-brown-lighten-4"
                      >Aussaat / Erwartete Ertragslage</v-col
                    >
                    <v-col cols="12" class="px-4 obligatory mb-3">
                      <v-select
                        v-model="entry.cultures[i].kultur"
                        :items="lookup.kulturenItems[entry.flaechennutzungsart]"
                        label="Kultur"
                        variant="outlined"
                        density="compact"
                        hide-details
                        @update:model-value="cultureChanged(i)"
                      />
                    </v-col>
                    <v-col cols="12" class="px-4 obligatory mb-2">
                      <v-select
                        v-if="entry.cultures[i].kultur != ''"
                        v-model="entry.cultures[i].ertragslage"
                        :items="ertragsLagen(entry.cultures[i].kultur)"
                        label="Erwartete Ertragslage"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    v-if="
                      entry.cultures[i].kultur != '' &&
                      kulturAttribut(entry.cultures[i].kultur, 'Ertragserfassungsart') !==
                        'Düngeverbot'
                    "
                  >
                    <v-col cols="12" class="mb-2 pa-1 bg-brown-lighten-4">Düngungen</v-col>
                    <v-card
                      v-for="f in entry.cultures[i].duengung.length"
                      :key="`kultur${i}duengung${f}`"
                      class="border-md mx-1 mb-2 w-100"
                      elevation="0"
                    >
                      <v-row no-gutters class="bg-light-green-lighten-3">
                        <v-col cols="10" class="pl-2">
                          <span class="text-subtitle-2">{{ f }}. Düngung</span>
                        </v-col>
                        <v-col cols="2" class="text-right">
                          <v-btn
                            icon
                            size="18"
                            @click.stop="deleteFertilization(i, f - 1)"
                            class="mt-0 mr-1"
                          >
                            <v-icon size="18" color="red" icon="mdi-close"
                          /></v-btn>
                        </v-col>
                      </v-row>

                      <v-row no-gutters>
                        <v-col
                          :cols="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            entry.cultures[i].duengung[f - 1].typ != 'eigene'
                              ? 5
                              : 12
                          "
                          class="pa-2"
                        >
                          <v-select
                            v-model="entry.cultures[i].duengung[f - 1].typ"
                            :items="lookup.fertilizationTypes"
                            label="Typ"
                            variant="outlined"
                            density="compact"
                            hide-details
                            @update:model-value="fertilizationChanged('typ', i, f - 1)"
                          />
                        </v-col>
                        <v-col
                          cols="7"
                          class="pa-2"
                          v-if="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            entry.cultures[i].duengung[f - 1].typ != 'eigene'
                          "
                        >
                          <v-select
                            v-model="entry.cultures[i].duengung[f - 1].id"
                            :items="lookup[entry.cultures[i].duengung[f - 1].typ]"
                            :label="firstUppercase(entry.cultures[i].duengung[f - 1].typ)"
                            variant="outlined"
                            density="compact"
                            hide-details
                            @update:model-value="fertilizationChanged('id', i, f - 1)"
                          />
                        </v-col>
                        <v-col
                          cols="3"
                          class="pa-2"
                          v-if="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            v-model="entry.cultures[i].duengung[f - 1].menge"
                            :label="`Menge (in ${entry.cultures[i].duengung[f - 1].typ == 'handelsdünger' ? tableAttribut('handelsdünger', entry.cultures[i].duengung[f - 1].id, 'Einheit') : 'm³'})`"
                            variant="outlined"
                            density="compact"
                            hide-details
                          />
                        </v-col>
                        <v-col
                          cols="2"
                          class="pa-2 text-right"
                          v-if="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i].duengung[f - 1].id == ''
                            )
                          "
                        ></v-col>

                        <v-col
                          cols="2"
                          class="pa-2"
                          v-if="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            :disabled="entry.cultures[i].duengung[f - 1].typ == 'handelsdünger'"
                            v-model="entry.cultures[i].duengung[f - 1].n"
                            label="N(%)"
                            variant="outlined"
                            density="compact"
                            hide-details
                          />
                        </v-col>
                        <v-col
                          cols="2"
                          class="pa-2"
                          v-if="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            :disabled="entry.cultures[i].duengung[f - 1].typ == 'handelsdünger'"
                            v-model="entry.cultures[i].duengung[f - 1].p"
                            label="P₂O₅(%)"
                            variant="outlined"
                            density="compact"
                            hide-details
                          />
                        </v-col>
                        <v-col
                          cols="2"
                          class="pa-2"
                          v-if="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            :disabled="entry.cultures[i].duengung[f - 1].typ == 'handelsdünger'"
                            v-model="entry.cultures[i].duengung[f - 1].k"
                            label="K₂O(%)"
                            variant="outlined"
                            density="compact"
                            hide-details
                          />
                        </v-col>

                        <v-col
                          cols="1"
                          class="pa-2 text-right"
                          v-if="
                            entry.cultures[i].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i].duengung[f - 1].id == ''
                            )
                          "
                        ></v-col>
                      </v-row>
                    </v-card>
                    <v-col cols="12" class="pa-2">
                      <v-btn
                        block
                        flat
                        color="light-green-lighten-3"
                        density="compact"
                        prepend-icon="mdi-plus"
                        @click.stop="addFertilization(i)"
                        >Düngung hinzufügen</v-btn
                      ></v-col
                    >
                  </v-row>
                  <v-row no-gutters v-if="entry.cultures[i].kultur != ''">
                    <v-col cols="12" class="mb-2 pa-1 bg-brown-lighten-4">Ernte / Ertrag</v-col>
                    <v-col cols="6" class="pa-2">
                      <v-select
                        v-if="ertragsTyp(entry.cultures[i].kultur, 'einheit') == 'EL Auswahl'"
                        v-model="entry.cultures[i].ertragslageernte"
                        :items="ertragsLagen(entry.cultures[i].kultur)"
                        label="Ertrag (Klasse)"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                      <v-text-field
                        v-if="['t', 'm3'].includes(ertragsTyp(entry.cultures[i].kultur, 'einheit'))"
                        v-model="entry.cultures[i].ernte"
                        :label="`Ernte (in ${ertragsTyp(entry.cultures[i].kultur, 'einheit')})`"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="3" class="pa-2">
                      <v-text-field
                        v-if="
                          ertragsTyp(entry.cultures[i].kultur, '') == 4 ||
                          ertragsTyp(entry.cultures[i].kultur, '') == 5
                        "
                        v-model="entry.cultures[i].feuchte"
                        label="Kornfeuchte"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="3" class="pa-2">
                      <v-text-field
                        v-if="
                          ertragsTyp(entry.cultures[i].kultur, '') == 4 ||
                          ertragsTyp(entry.cultures[i].kultur, '') == 5
                        "
                        v-model="entry.cultures[i].protein"
                        label="Proteingehalt"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-card>
                <v-btn
                  block
                  flat
                  class="mt-5"
                  prepend-icon="mdi-plus"
                  color="brown-lighten-2"
                  size="small"
                  @click="addCulture"
                  >Hauptfrucht hinzufügen</v-btn
                >
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel value="data" rounded="0" elevation="0" v-if="debug">
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
    <v-row no-gutters class="bg-grey-darken-2"
      ><v-col :cols="!tempData.basic && allData.current === null ? 12 : 6" class="pa-2">
        <v-btn density="compact" color="red" prepend-icon="mdi-close" block @click.stop="cancelData"
          >Abbrechen</v-btn
        > </v-col
      ><v-col cols="6" class="pa-2">
        <v-btn density="compact" color="green" prepend-icon="mdi-check" block @click.stop="saveData"
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

const debug = true; // TRUE FÜR DEBUG PANEL

const { allData, emptyCulture, emptyFertilization, entry } = useDataEntries();
const { schlagInfo } = useSchlag();
const { map } = useMap();
const route = useRoute();
const router = useRouter();
const { topicHectars } = useTopicIntersections();
const emit = defineEmits(['schlag']);
const schlaegeLastModified = ref();
const { lookup } = useLookup();
const tempData = ref({ basic: null, programs: null });
const panelInit = ref(['basisdaten', 'kulturen']);
const itemsJaNein = [
  { value: true, title: 'Ja' },
  { value: false, title: 'Nein' },
];
const itemsABCDE = ['A', 'B', 'C', 'D', 'E'];
const itemsGWAcker = ['Trockengebiet', 'Feuchtgebiet'];

mapReady.then(() => {
  const date = new Date(map.get('mapbox-style').metadata.sources[SCHLAEGE_SOURCE].lastModified);
  schlaegeLastModified.value = new Intl.DateTimeFormat('de-AT').format(date);
});

function firstUppercase(input) {
  const strinput = input.toString();
  return strinput.charAt(0).toUpperCase() + strinput.slice(1);
}

function addFertilization(cindex) {
  entry.value.cultures[cindex].duengung.push({ ...emptyFertilization });
}

function deleteFertilization(cindex, findex) {
  entry.value.cultures[cindex].duengung.splice(findex, 1);
}

function fertilizationChanged(what, cindex, findex) {
  entry.value.cultures[cindex].duengung[findex].menge = 0;
  entry.value.cultures[cindex].duengung[findex].n = 0;
  entry.value.cultures[cindex].duengung[findex].p = 0;
  entry.value.cultures[cindex].duengung[findex].k = 0;
  if (what == 'typ') {
    entry.value.cultures[cindex].duengung[findex].id = '';
  }
  if (what == 'id' && entry.value.cultures[cindex].duengung[findex].typ == 'handelsdünger') {
    const hDuenger = lookup.value[entry.value.cultures[cindex].duengung[findex].typ].find(
      (d) => d.ID == entry.value.cultures[cindex].duengung[findex].id,
    );
    if (hDuenger) {
      entry.value.cultures[cindex].duengung[findex].n = parseFloat(hDuenger['N [%]'])
        ? parseFloat(hDuenger['N [%]'])
        : 0;
      entry.value.cultures[cindex].duengung[findex].p = parseFloat(hDuenger['P2O5 [%]'])
        ? parseFloat(hDuenger['P2O5 [%]'])
        : 0;
      entry.value.cultures[cindex].duengung[findex].k = parseFloat(hDuenger['K2O [%]'])
        ? parseFloat(hDuenger['K2O [%]'])
        : 0;
    }
  }
}

function cultureChanged(index) {
  entry.value.cultures[index].ertragslage = '';
}

function allCulturesReset() {
  for (let c = 0; c < entry.value.cultures.length; c++) {
    entry.value.cultures[c].ertragslage = '';
  }
}

function tableAttribut(table, id, attrib) {
  const dataRow = lookup.value[table].find((k) => k.ID == id);
  return dataRow && dataRow[attrib] ? dataRow[attrib] : '?';
}

function kulturAttribut(id, attrib) {
  const dataRow = lookup.value.kulturen.find((k) => k.ID == id);
  return dataRow[attrib] ? dataRow[attrib] : null;
}

function ertragsTyp(kultur, what) {
  const dataRow = lookup.value.kulturen.find((k) => k.ID == kultur);
  if (what == 'einheit') {
    return dataRow.Ertragserfassungsart ? dataRow.Ertragserfassungsart : 't';
  } else {
    return dataRow[
      'Saldierungsart 1=t/ha; 2=m3/ha;3=kg N/ha;4=Weichweizen; 5=Braugerste;6=Mais;7=EL Auswahl;8=keine Eingabe'
    ]
      ? dataRow[
          'Saldierungsart 1=t/ha; 2=m3/ha;3=kg N/ha;4=Weichweizen; 5=Braugerste;6=Mais;7=EL Auswahl;8=keine Eingabe'
        ]
      : 0;
  }
}

function ertragsLagen(kultur) {
  const dataRow = lookup.value.kulturen.find((k) => k.ID == kultur);
  const itemReturn = [{ title: 'Keine', value: '' }];
  if (dataRow) {
    for (const el of lookup.value.ertragsLagen) {
      if (dataRow[`EL ${el} Bereich`] != '') {
        if (entry.value.flaechennutzungsart == 'A' && entry.value.ackerzahl < 30) {
          // Sonderfall Ackerzahl < 30, Ackerkultur
          if (lookup.value.limitAckerzahl.includes(el)) {
            itemReturn.push({ title: `${el} (${dataRow[`EL ${el} Bereich`]})`, value: el });
          }
        } else {
          itemReturn.push({ title: `${el} (${dataRow[`EL ${el} Bereich`]})`, value: el });
        }
      }
    }
  }
  return itemReturn;
}

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

function deleteCulture(nr) {
  entry.value.cultures.splice(nr, 1);
}

function addCulture() {
  entry.value.cultures.push({ ...emptyCulture });
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
  tempData.value = { basic: null, programs: null };
  allData.value.datawindow = 0;
  panelInit.value = ['basisdaten', 'kulturen'];
  schlagInfo.value = null;
}

function cancelData() {
  tempData.value = { basic: null, programs: null };
  allData.value.datawindow = 0;
  panelInit.value = ['basisdaten', 'kulturen'];
  schlagInfo.value = null;
}

watch(schlagInfo, (value) => {
  if (value?.id !== Number(route.params.schlagId)) {
    tempData.value.basic = JSON.parse(JSON.stringify(schlagInfo.value));
    if (tempData.value.basic) {
      if (tempData.value.programs) {
        if (
          tempData.value.basic.sl_flaeche_brutto_ha / 2 <
          tempData.value.programs.schwere_boeden
        ) {
          entry.value.bodenart = 'sL - sandiger Lehm';
        }
      }

      entry.value.flaechennutzungsart = tempData.value.basic.fnar_code;
      entry.value.flaeche = tempData.value.basic.sl_flaeche_brutto_ha;
      entry.value.schlaginfo.basic = schlagInfo.value;

      entry.value.extent = tempData.value.basic.extent;

      entry.value.jahr = new Date().getFullYear();

      allData.value.datawindow = 2;
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
    if (tempData.value.basic) {
      if (tempData.value.basic.sl_flaeche_brutto_ha / 2 < tempData.value.programs.schwere_boeden) {
        entry.value.bodenart = 'sL - sandiger Lehm';
      }
    }

    entry.value.flaeche_nitratrisikogebiet = tempData.value.programs.nitrataktionsprogramm;
    entry.value.schlaginfo.programs = JSON.parse(JSON.stringify(value));

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
  height: calc(100% - 70px);
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

.beforeEntryForm {
  position: absolute;
  left: 10px;
  top: 60px;
  width: 350px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}

.schlagTools button {
  display: block;
}

.cardBorder {
  border: 2px solid;
  border-bottom: 5px solid;
}

.cardBorder.zwischenfrucht {
  border-color: #bcaaa4;
}

.cardBorder.hauptfrucht {
  border-color: #a1887f;
}
</style>
