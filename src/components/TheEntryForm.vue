<template>
  <v-card
    :class="entry.flaeche === 0 && currentSaved === null ? 'beforeEntryForm' : 'entryForm'"
    v-if="dataWindow > 0"
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
        <div class="selectSchlag" v-if="dataWindow === 1 && currentSaved === null">
          Bitte einen Schlag als Ausgangspunkt wählen!
        </div>
        <v-form ref="entryform" v-if="dataWindow === 2">
          <v-expansion-panels variant="accordion" multiple v-model="panelInit">
            <v-expansion-panel value="basisdaten" rounded="0" elevation="0">
              <v-expansion-panel-title static class="bg-grey-darken-1">
                Basisdaten
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row no-gutters>
                  <v-col cols="6" class="px-4 mb-3">
                    <v-text-field
                      v-model="entry.feldstuecksname"
                      label="Feldstück/Name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.threechars"
                    />
                  </v-col>
                  <v-col cols="3" class="px-4 mb-3">
                    <v-text-field
                      v-model.number="entry.feldstuecksnummer"
                      label="Feldstück/Nr"
                      variant="outlined"
                      type="number"
                      density="compact"
                      :rules="rules.notzero"
                    />
                  </v-col>
                  <v-col cols="3" class="px-4 mb-3">
                    <v-text-field
                      v-model="entry.schlagnummer"
                      label="Schlagnummer"
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
                      v-model.number="entry.flaeche"
                      label="Fläche (ha)"
                      variant="outlined"
                      density="compact"
                      type="number"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-divider color="grey" thickness="4" class="py-2" />

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-text-field
                      v-model="imGrundwasserschutz"
                      label="Fläche im Grundwasserschutz"
                      variant="outlined"
                      density="compact"
                      hide-details
                      disabled
                    />
                  </v-col>

                  <v-col cols="6" class="px-4 mb-3" v-if="entry.flaechennutzungsart === 'A'">
                    <v-select
                      v-if="entry.flaeche_grundwasserschutz > 0"
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
                      v-model.number="entry.nsaldo"
                      label="N-Saldo (kg N/ha)"
                      variant="outlined"
                      density="compact"
                      type="number"
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

                <v-row no-gutters>
                  <v-col cols="6" class="px-4 obligatory mb-3">
                    <v-text-field
                      v-model="imNitratrisikogebiet"
                      label="Fläche im Nitratrisikogebiet"
                      variant="outlined"
                      density="compact"
                      hide-details
                      disabled
                    />
                  </v-col>
                  <v-col cols="6" class="px-4 obligatory mb-3" v-if="entry.wrrl">
                    <v-select
                      v-model="entry.wrrl_duengeklasse"
                      :items="lookup.wrrl"
                      label="Düngeklasse WRRL"
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
                    <v-autocomplete
                      v-model="entry.vorfrucht"
                      v-model:search="search.vorfrucht"
                      :items="lookup.kulturenItems.alle"
                      label="Vorfrucht"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @click="clearSearch('vorfrucht')"
                      @update:model-value="cultureChanged(-1)"
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
                <v-card
                  class="mt-1 mb-12 pa-0 cardBorder hauptfrucht"
                  elevation="0"
                  v-for="i in entry.cultures.length"
                  :key="`kultur${i - 1}`"
                >
                  <v-row no-gutters class="bg-brown-lighten-2">
                    <v-col cols="10" class="pl-2">
                      <span class="text-button">{{
                        i === 1 ? 'Zwischenfrucht' : `${i - 1}. Hauptfrucht`
                      }}</span>
                    </v-col>
                    <v-col cols="2" class="text-right">
                      <v-btn
                        v-if="i > 1"
                        icon
                        size="20"
                        @click="deleteCulture(i - 1)"
                        class="mt-2 mr-2"
                      >
                        <v-icon size="20" color="red" icon="mdi-close"
                      /></v-btn>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="12" class="mb-2 pa-1 bg-brown-lighten-4"
                      >Aussaat {{ i > 1 ? '/ Erwartete Ertragslage' : '' }}</v-col
                    >
                    <v-col cols="12" class="px-4 obligatory mb-3">
                      <v-autocomplete
                        v-model="entry.cultures[i - 1].kultur"
                        v-model:search="search.kultur"
                        :items="
                          i > 1
                            ? lookup.kulturenItems[entry.flaechennutzungsart]
                            : lookup.kulturenItems.zwischen
                        "
                        label="Kultur"
                        variant="outlined"
                        density="compact"
                        hide-details
                        clearable
                        @click="clearSearch('kultur')"
                        @update:model-value="cultureChanged(i - 1)"
                      />
                    </v-col>
                    <v-col
                      :cols="
                        tableAttribut('kulturen', entry.cultures[i - 1].kultur, 'Gemüsekultur') ===
                        'x'
                          ? 6
                          : 12
                      "
                      class="px-4 obligatory mb-2"
                      v-if="
                        entry.cultures[i - 1].kultur != '' &&
                        tableAttribut(
                          'kulturen',
                          entry.cultures[i - 1].kultur,
                          'Ertragserfassungsart',
                        ) !== 'Düngeverbot' &&
                        tableAttribut(
                          'kulturen',
                          entry.cultures[i - 1].kultur,
                          'Ertragserfassungsart',
                        ) !== 'keine Ertragserfassung'
                      "
                    >
                      <v-select
                        v-model="entry.cultures[i - 1].ertragslage"
                        :items="ertragsLagen(entry.cultures[i - 1].kultur, false)"
                        label="Erwartete Ertragslage"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>

                    <v-col
                      v-if="
                        tableAttribut('kulturen', entry.cultures[i - 1].kultur, 'Gemüsekultur') ===
                        'x'
                      "
                      cols="3"
                      class="px-4 mb-3"
                    >
                      <v-text-field
                        v-model="entry.cultures[i - 1].nmin"
                        label="NMin / manuell"
                        variant="outlined"
                        density="compact"
                        type="number"
                        hide-details
                      />
                    </v-col>
                    <v-col
                      v-if="
                        tableAttribut('kulturen', entry.cultures[i - 1].kultur, 'Gemüsekultur') ===
                        'x'
                      "
                      cols="3"
                      class="px-4 mb-3"
                    >
                      <v-text-field
                        v-model="entry.cultures[i - 1].nminvorgabe"
                        label="Vorgabe"
                        variant="outlined"
                        density="compact"
                        type="number"
                        disabled
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    v-if="
                      (i === 1 &&
                        lookup.aussaatTypeFilter.zwischenG.includes(entry.cultures[0].kultur)) ||
                      (i > 1 &&
                        entry.cultures[i - 1].kultur != '' &&
                        tableAttribut(
                          'kulturen',
                          entry.cultures[i - 1].kultur,
                          'Ertragserfassungsart',
                        ) !== 'Düngeverbot')
                    "
                  >
                    <v-col cols="12" class="mb-2 pa-1 bg-brown-lighten-4">Düngungen</v-col>
                    <v-card
                      v-for="f in entry.cultures[i - 1].duengung.length"
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
                            @click.stop="deleteFertilization(i - 1, f - 1)"
                            class="mt-0 mr-1"
                          >
                            <v-icon size="18" color="red" icon="mdi-close"
                          /></v-btn>
                        </v-col>
                      </v-row>

                      <v-row no-gutters>
                        <v-col
                          :cols="
                            entry.cultures[i - 1].duengung[f - 1].typ != '' &&
                            entry.cultures[i - 1].duengung[f - 1].typ != 'eigene' &&
                            entry.cultures[i - 1].duengung[f - 1].typ != 'bewässerung'
                              ? 5
                              : 12
                          "
                          class="pa-2"
                        >
                          <v-select
                            v-model="entry.cultures[i - 1].duengung[f - 1].typ"
                            :items="lookup.fertilizationTypes"
                            label="Typ"
                            variant="outlined"
                            density="compact"
                            hide-details
                            @update:model-value="fertilizationChanged('typ', i - 1, f - 1)"
                          />
                        </v-col>
                        <v-col
                          cols="7"
                          class="pa-2"
                          v-if="
                            entry.cultures[i - 1].duengung[f - 1].typ != '' &&
                            entry.cultures[i - 1].duengung[f - 1].typ != 'eigene' &&
                            entry.cultures[i - 1].duengung[f - 1].typ != 'bewässerung'
                          "
                        >
                          <v-autocomplete
                            v-model="entry.cultures[i - 1].duengung[f - 1].id"
                            v-model:search="search.duengung"
                            :items="lookup[entry.cultures[i - 1].duengung[f - 1].typ]"
                            :label="firstUppercase(entry.cultures[i - 1].duengung[f - 1].typ)"
                            variant="outlined"
                            density="compact"
                            hide-details
                            @click="clearSearch('duengung')"
                            @update:model-value="fertilizationChanged('id', i - 1, f - 1)"
                            clearable
                          />
                        </v-col>
                        <v-col
                          cols="3"
                          class="pa-2"
                          v-if="
                            entry.cultures[i - 1].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i - 1].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            v-model.number="entry.cultures[i - 1].duengung[f - 1].menge"
                            :label="
                              npkLabel(
                                'menge',
                                entry.cultures[i - 1].duengung[f - 1].typ,
                                entry.cultures[i - 1].duengung[f - 1].id,
                              )
                            "
                            min="0"
                            variant="outlined"
                            density="compact"
                            type="number"
                            hide-details
                          />
                        </v-col>

                        <v-col
                          cols="3"
                          class="pa-2"
                          v-if="
                            entry.cultures[i - 1].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i - 1].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            :disabled="entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger'"
                            v-model.number="entry.cultures[i - 1].duengung[f - 1].n"
                            :label="npkLabel('n', entry.cultures[i - 1].duengung[f - 1].typ, 0)"
                            variant="outlined"
                            density="compact"
                            type="number"
                            hide-details
                          />
                        </v-col>
                        <v-col
                          cols="3"
                          class="pa-2"
                          v-if="
                            entry.cultures[i - 1].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i - 1].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            :disabled="
                              entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' ||
                              entry.cultures[i - 1].duengung[f - 1].typ == 'bewässerung'
                            "
                            v-model.number="entry.cultures[i - 1].duengung[f - 1].p"
                            :label="npkLabel('p', entry.cultures[i - 1].duengung[f - 1].typ, 0)"
                            variant="outlined"
                            density="compact"
                            type="number"
                            hide-details
                          />
                        </v-col>
                        <v-col
                          cols="3"
                          class="pa-2"
                          v-if="
                            entry.cultures[i - 1].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i - 1].duengung[f - 1].id == ''
                            )
                          "
                        >
                          <v-text-field
                            :disabled="
                              entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' ||
                              entry.cultures[i - 1].duengung[f - 1].typ == 'bewässerung'
                            "
                            v-model.number="entry.cultures[i - 1].duengung[f - 1].k"
                            :label="npkLabel('k', entry.cultures[i - 1].duengung[f - 1].typ, 0)"
                            variant="outlined"
                            density="compact"
                            type="number"
                            hide-details
                          />
                        </v-col>

                        <v-col
                          cols="1"
                          class="pa-2 text-right"
                          v-if="
                            entry.cultures[i - 1].duengung[f - 1].typ != '' &&
                            !(
                              entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' &&
                              entry.cultures[i - 1].duengung[f - 1].id == ''
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
                        @click.stop="addFertilization(i - 1)"
                        >Düngung hinzufügen</v-btn
                      ></v-col
                    >
                  </v-row>
                  <v-row
                    no-gutters
                    v-if="
                      entry.cultures[i - 1].kultur != '' &&
                      tableAttribut(
                        'kulturen',
                        entry.cultures[i - 1].kultur,
                        'Ertragserfassungsart',
                      ) !== 'Düngeverbot' &&
                      tableAttribut(
                        'kulturen',
                        entry.cultures[i - 1].kultur,
                        'Ertragserfassungsart',
                      ) !== 'keine Ertragserfassung'
                    "
                  >
                    <v-col cols="12" class="mb-2 pa-1 bg-brown-lighten-4">Ernte / Ertrag</v-col>
                    <v-col cols="6" class="pa-2">
                      <v-select
                        v-if="ertragsTyp(entry.cultures[i - 1].kultur, 'einheit') == 'EL Auswahl'"
                        v-model="entry.cultures[i - 1].ertragslageernte"
                        :items="ertragsLagen(entry.cultures[i - 1].kultur, true)"
                        label="Ertrag (Klasse)"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                      <v-text-field
                        v-if="
                          ['t', 'm3'].includes(ertragsTyp(entry.cultures[i - 1].kultur, 'einheit'))
                        "
                        v-model.number="entry.cultures[i - 1].ernte"
                        :label="`Ernte (in ${ertragsTyp(entry.cultures[i - 1].kultur, 'einheit')})`"
                        variant="outlined"
                        density="compact"
                        type="number"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="3" class="pa-2">
                      <v-select
                        v-if="
                          ertragsTyp(entry.cultures[i - 1].kultur, '') == 4 ||
                          ertragsTyp(entry.cultures[i - 1].kultur, '') == 5
                        "
                        v-model="entry.cultures[i - 1].feuchte"
                        label="Kornfeuchte"
                        :items="lookup.kornfeuchteListe"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="3" class="pa-2">
                      <v-select
                        v-if="
                          ertragsTyp(entry.cultures[i - 1].kultur, '') == 4 ||
                          ertragsTyp(entry.cultures[i - 1].kultur, '') == 5
                        "
                        v-model="entry.cultures[i - 1].protein"
                        label="Proteingehalt"
                        :items="lookup.proteinListe[ertragsTyp(entry.cultures[i - 1].kultur, '')]"
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
                  <pre>{{ entry.schlaginfo.basic }}</pre>
                  <pre>{{ entry.schlaginfo.programs }}</pre>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
      </v-col>
    </v-row>
    <v-row no-gutters class="bg-grey-darken-2"
      ><v-col :cols="dataWindow === 1 ? 12 : 4" class="pa-2">
        <v-btn density="compact" color="red" prepend-icon="mdi-close" block @click.stop="cancelData"
          >Abbrechen</v-btn
        > </v-col
      ><v-col cols="4" class="pa-2" v-if="dataWindow === 2">
        <v-btn
          density="compact"
          color="green"
          prepend-icon="mdi-check"
          block
          @click.stop="saveData(true)"
          >Kopie Speichern</v-btn
        > </v-col
      ><v-col cols="4" class="pa-2" v-if="dataWindow === 2">
        <v-btn
          density="compact"
          color="green-darken-2"
          prepend-icon="mdi-check"
          block
          @click.stop="saveData(false)"
          >Speichern</v-btn
        >
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';
import { watch, ref, computed } from 'vue';
import { useSchlag } from '../composables/useSchlag.js';
import { mapReady, useMap } from '../composables/useMap.js';
import { SCHLAEGE_SOURCE } from '../constants.js';
import { useTopicIntersections } from '../composables/useTopicIntersections.js';
import { useLookup } from '../composables/useLookUps.js';

const debug = true; // TRUE FÜR DEBUG PANEL

const { savedData, currentSaved, dataWindow, emptyCulture, emptyFertilization, entry } =
  useDataEntries();
const { schlagInfo } = useSchlag();
const { map } = useMap();
const { topicHectars } = useTopicIntersections();
const schlaegeLastModified = ref();
const { lookup, tableAttribut } = useLookup();
const panelInit = ref(['basisdaten', 'kulturen']);
const itemsJaNein = [
  { value: true, title: 'Ja' },
  { value: false, title: 'Nein' },
];
const itemsABCDE = ['A', 'B', 'C', 'D', 'E'];
const itemsGWAcker = ['Trockengebiet', 'Feuchtgebiet'];
const entryform = ref();

const imGrundwasserschutz = computed(() => {
  return entry.value.flaeche_grundwasserschutz > 0 ? 'Ja' : 'Nein';
});
const imNitratrisikogebiet = computed(() => {
  return entry.value.nitratrisikogebiet ? 'Ja' : 'Nein';
});

const rules = {
  threechars: [
    (value) => {
      if (value.length < 3) {
        return 'Mindestens 3 Zeichen eingeben';
      }
      return true;
    },
  ],
  notzero: [(value) => value > 0 || 'Dieser Wert muss größer Null sein'],
};

const search = ref({ vorfrucht: null, kultur: null, duengung: null });

mapReady.then(() => {
  const date = new Date(map.get('mapbox-style').metadata.sources[SCHLAEGE_SOURCE].lastModified);
  schlaegeLastModified.value = new Intl.DateTimeFormat('de-AT').format(date);
});

function clearSearch(what) {
  search.value[what] = null;
}

function firstUppercase(input) {
  const strinput = input.toString();
  return strinput.charAt(0).toUpperCase() + strinput.slice(1);
}

function npkLabel(what, type, fid) {
  let label = '';
  switch (what) {
    case 'n':
      label = 'N(%)';
      if (type === 'bewässerung') {
        label = 'NO₃(mg/L)';
      }
      if (type === 'wirtschaftsdünger') {
        label = 'Njw(kg/m³)';
      }
      if (type === 'sekundärrohstoffe') {
        label = 'Njw(kg/t|m³)';
      }
      break;
    case 'p':
      label = 'P₂O₅(%)';
      if (type === 'bewässerung') {
        label = 'P₂O₅(mg/L)';
      }
      if (type === 'wirtschaftsdünger') {
        label = 'P₂O₅(kg/m³)';
      }
      if (type === 'sekundärrohstoffe') {
        label = 'P₂O₅(kg/t|m³)';
      }
      break;
    case 'k':
      label = 'K₂O(%)';
      if (type === 'bewässerung') {
        label = 'K₂O(mg/L)';
      }
      if (type === 'wirtschaftsdünger') {
        label = 'K₂O(kg/m³)';
      }
      if (type === 'sekundärrohstoffe') {
        label = 'K₂O(kg/t|m³)';
      }
      break;
    case 'menge':
      label = tableAttribut('handelsdünger', fid, 'Einheit') + '/ha';
      if (type === 'bewässerung') {
        label = 'mm = l/m²';
      }
      if (type === 'eigene') {
        label = 'kg/ha';
      }
      if (type === 'wirtschaftsdünger') {
        label = 'm³/ha';
      }
      if (type === 'sekundärrohstoffe') {
        label = 't|m³/ha';
      }
      break;

    //      :label="`Menge (${entry.cultures[i - 1].duengung[f - 1].typ == 'bewässerung' ? 'mm = l/m²' : entry.cultures[i - 1].duengung[f - 1].typ == 'handelsdünger' ? tableAttribut('handelsdünger', entry.cultures[i - 1].duengung[f - 1].id, 'Einheit') : 'm³'})`"
  }
  return label;
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

function nMinCalculator(index) {
  if (index >= entry.value.cultures.length || !entry.value.cultures[index].kultur) {
    return;
  }

  const isgemüse =
    tableAttribut('kulturen', entry.value.cultures[index].kultur, 'Gemüsekultur') === 'x';
  const vfgemüse = tableAttribut('kulturen', entry.value.vorfrucht, 'Gemüsekultur') === 'x';

  const zfgenutzt = lookup.value.aussaatTypeFilter.zwischenG.includes(
    entry.value.cultures[0].kultur,
  );

  entry.value.cultures[index].nmin = 0;
  entry.value.cultures[index].nminvorgabe = 0;

  if (isgemüse) {
    const oldnminvorgabe = entry.value.cultures[index].nminvorgabe;

    if (index === 1 && entry.value.vorfrucht !== '' && vfgemüse && !zfgenutzt) {
      // Vorfrucht-Ausnamen Gemüse
      const vfAusnahme = tableAttribut(
        'kulturen',
        entry.value.vorfrucht,
        'Ausnahme Vorfruchtwirkung',
      );
      const hfAusnahme = tableAttribut(
        'kulturen',
        entry.value.cultures[1].kultur,
        'Ausnahme Vorfruchtwirkung',
      );
      if (
        (vfAusnahme === 'Spargel' && hfAusnahme === 'Spargel') ||
        (vfAusnahme === 'Rhabarber' && hfAusnahme === 'Rhabarber')
      ) {
        return 0;
      }

      entry.value.cultures[index].nminvorgabe = tableAttribut(
        'kulturen',
        entry.value.vorfrucht,
        'VFW | Nmin Folgejahr',
      );
      if (entry.value.cultures[index].nmin === oldnminvorgabe) {
        entry.value.cultures[index].nmin = entry.value.cultures[index].nminvorgabe;
      }
    }
    if (index > 1 && entry.value.cultures[index - 1].kultur !== '') {
      entry.value.cultures[index].nminvorgabe = tableAttribut(
        'kulturen',
        entry.value.cultures[index - 1].kultur,
        'VFW | Nmin selbes Jahr',
      );
      if (entry.value.cultures[index].nmin === oldnminvorgabe) {
        entry.value.cultures[index].nmin = entry.value.cultures[index].nminvorgabe;
      }
    }
  }
}

function cultureChanged(index) {
  if (index === -1) {
    if (!entry.value.vorfrucht) {
      entry.value.vorfrucht = '';
    }
    nMinCalculator(1);
    return;
  }

  entry.value.cultures[index].ertragslage = '';
  if (!entry.value.cultures[index].kultur) {
    entry.value.cultures[index].kultur = '';
    entry.value.cultures[index].nminvorgabe = 0;
    entry.value.cultures[index].nmin = 0;
    return;
  }

  nMinCalculator(index);
  nMinCalculator(index + 1);
}

function allCulturesReset() {
  for (let c = 0; c < entry.value.cultures.length; c++) {
    entry.value.cultures[c].ertragslage = '';
  }
}

function ertragsTyp(kultur, what) {
  const dataRow = lookup.value.kulturen.find((k) => k.ID == kultur);
  if (what == 'einheit') {
    return dataRow.Ertragserfassungsart ? dataRow.Ertragserfassungsart : 't';
  } else {
    return dataRow['Saldierungsart'] ? dataRow['Saldierungsart'] : 0;
  }
}

function ertragsLagen(kultur, istErnte) {
  const dataRow = lookup.value.kulturen.find((k) => k.ID == kultur);
  const itemReturn = [{ title: 'Keine', value: '' }];
  if (dataRow) {
    for (const el of lookup.value.ertragsLagen) {
      if (dataRow[`EL ${el} Bereich`] != '') {
        if (entry.value.flaechennutzungsart == 'A' && !istErnte && entry.value.ackerzahl < 30) {
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

function deleteCulture(nr) {
  entry.value.cultures.splice(nr, 1);
}

function addCulture() {
  entry.value.cultures.push({ ...emptyCulture });
}

function dataSort(a, b) {
  return a.jahr < b.jahr ? -1 : 1;
}

function FloatTrunc(input) {
  let result = 0;
  const parts = input.toString().split('.');
  result = parseFloat(parts[0] + (parts[1] ? '.' + parts[1].substr(0, 4) : ''));
  return result;
}

async function saveData(copy) {
  const validated = await entryform.value.validate();
  if (!validated.valid) {
    return;
  }

  if (!copy && currentSaved.value !== null) {
    savedData.value[currentSaved.value] = { ...entry.value };
  } else {
    savedData.value.push({ ...entry.value });
    savedData.value.sort(dataSort);
  }
  localStorage.setItem('fasttool', JSON.stringify(savedData.value));
  dataWindow.value = 0;
  panelInit.value = ['basisdaten', 'kulturen'];
  schlagInfo.value = null;
}

function cancelData() {
  dataWindow.value = 0;
  panelInit.value = ['basisdaten', 'kulturen'];
  schlagInfo.value = null;
  topicHectars.value = null;
}

watch(schlagInfo, (value) => {
  if (currentSaved.value !== null || value === null) {
    return;
  }
  if (value) {
    if (entry.value.flaeche_schwereboeden) {
      if (FloatTrunc(value.sl_flaeche_brutto_ha) / 2 < entry.value.flaeche_schwereboeden) {
        entry.value.bodenart = 'sL - sandiger Lehm';
      }
    }
    if (entry.value.flaeche_nitratrisikogebiet) {
      entry.value.nitratrisikogebiet =
        entry.value.flaeche_nitratrisikogebiet > entry.value.flaeche / 2 ? true : false;
    }

    entry.value.flaechennutzungsart = value.fnar_code;
    entry.value.flaeche = FloatTrunc(value.sl_flaeche_brutto_ha);
    entry.value.extent = value.extent;
    entry.value.parts = value.parts;

    // Remove after Test Phase!
    entry.value.schlaginfo.basic = JSON.parse(JSON.stringify(schlagInfo.value));

    entry.value.jahr = new Date().getFullYear();
    if (entry.value.jahr < 2025) {
      entry.value.jahr = 2025;
    }

    dataWindow.value = 2;
  }
});

// Area of relevant topics inside the current schlag
watch(topicHectars, (value) => {
  if (currentSaved.value !== null || value === null) {
    return;
  }
  if (value) {
    if (entry.value.flaeche) {
      if (entry.value.flaeche / 2 < value.schwere_boeden) {
        entry.value.bodenart = 'sL - sandiger Lehm';
      }
    }

    entry.value.flaeche_nitratrisikogebiet = value.nitrataktionsprogramm;
    entry.value.flaeche_grundwasserschutz = value.bdfl_l16_grundwasserschutz_acker;

    if (entry.value.flaeche) {
      entry.value.nitratrisikogebiet =
        entry.value.flaeche_nitratrisikogebiet > entry.value.flaeche / 2 ? true : false;
    }

    // Remove after Test Phase!
    entry.value.schlaginfo.programs = JSON.parse(JSON.stringify(value));

    entry.value.wrrl_duengeklasse = '-';
    entry.value.wrrl = false;
    let currentDuengeklasse = 0;
    for (let l = 1; l < lookup.value.wrrl.length; l++) {
      if (value[lookup.value.wrrl[l].code] > currentDuengeklasse) {
        currentDuengeklasse = value[lookup.value.wrrl[l].code];
        entry.value.wrrl_duengeklasse = lookup.value.wrrl[l].value;
        entry.value.wrrl = true;
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
  left: 420px;
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
  width: 400px;
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
