<template>
  <v-card
    class="fertilizerData"
    :class="winMaximize ? 'maximized' : ''"
    v-if="dataWindow === 2"
    elevation="10"
  >
    <v-row no-gutters class="boxHeader bg-grey-darken-3">
      <v-col cols="10" class="text-button text-white">
        <v-icon class="mx-1"> mdi-chart-pie </v-icon>
        Nährstoffbilanzen
      </v-col>
      <v-col cols="2" class="text-right pr-1"
        ><v-icon size="small" @click="showHelp('fertilizerbalance')">mdi-help-circle</v-icon></v-col
      >
    </v-row>
    <v-sheet height="calc(100% - 70px)" class="overflow-auto">
      <v-card
        class="ma-1"
        elevation="0"
        color="red-lighten-1"
        v-for="(message, index) in bilanz.errors"
        :key="`error${index}`"
      >
        <v-row no-gutters class="error"
          ><v-col cols="1" class="pa-1"><v-icon dark size="24">mdi-alert-box</v-icon></v-col
          ><v-col vols="11" class="pa-2">{{ message }} </v-col></v-row
        ></v-card
      >

      <v-sheet v-for="(kultur, index) in bilanz.bilanz" :key="`bilanztable${index}`">
        <v-card
          v-if="
            entry.cultures[index].kultur !== '' &&
            !lookup.aussaatTypeFilter.zwischenU.includes(entry.cultures[index].kultur)
          "
          class="ma-2 cardBorder"
          :class="index == 0 ? 'zwischenfrucht' : 'hauptfrucht'"
          elevation="0"
        >
          <v-row no-gutters class="bg-brown-lighten-2">
            <v-col cols="12" class="pa-1 cultureHeader">
              {{
                (index === 0 ? 'Zwischenfrucht: ' : index + '.Hauptfrucht: ') +
                tableAttribut('kulturen', entry.cultures[index].kultur, 'Kultur')
              }}</v-col
            ></v-row
          >

          <v-card
            class="ma-1"
            elevation="0"
            color="red-lighten-1"
            v-for="(message, index) in kultur.errorsOG"
            :key="`error${index}`"
          >
            <v-row no-gutters class="error"
              ><v-col cols="1" class="pa-1"><v-icon dark size="24">mdi-alert-box</v-icon></v-col
              ><v-col vols="11" class="pa-2">{{ message }} </v-col></v-row
            ></v-card
          >

          <v-card class="ma-1 pa-1" elevation="0" v-if="index === 0 || kultur.duengeobergrenze > 0">
            <v-sheet v-if="kultur.errorsOG.length === 0" class="py-1">
              <v-card
                class="ma-1"
                elevation="0"
                color="red-lighten-1"
                v-for="(message, index) in kultur.errorsBI"
                :key="`error${index}`"
              >
                <v-row no-gutters class="error"
                  ><v-col cols="1" class="pa-1"><v-icon dark size="24">mdi-alert-box</v-icon></v-col
                  ><v-col vols="11" class="pa-2">{{ message }} </v-col></v-row
                ></v-card
              >

              <table class="bilanz">
                <tr
                  v-for="(pvalue, pkey) in kultur"
                  :key="`row_${index}_${pkey}`"
                  :class="{
                    // @ts-ignore
                    markred: bilanz.redmarked.includes(pkey),
                    hidezero:
                      !outputConfig[pkey].print ||
                      (pkey === 'nminman' &&
                        Number(pvalue) === Number(entry.cultures[index].nminvorgabe)) ||
                      (pkey === 'nminman' &&
                        Number(pvalue) === 0 &&
                        Number(entry.cultures[index].nmin) !== 0) ||
                      (outputConfig[pkey].printnotzero && Number(pvalue) == 0),
                    bold: outputConfig[pkey].bold,
                  }"
                >
                  <td :class="`cellborder${outputConfig[pkey].border}`">
                    <div :class="`cell header${outputConfig[pkey].header}`">
                      {{ outputConfig[pkey].header }}
                    </div>
                    <div>
                      {{ winMaximize ? outputConfig[pkey].label : outputConfig[pkey].labelshort }}
                    </div>
                  </td>
                  <td :class="`cellborder${outputConfig[pkey].border}`">
                    <div :class="`cell header${outputConfig[pkey].header}`">
                      {{ outputConfig[pkey].unit }}
                    </div>
                    <div>
                      {{
                        pvalue
                          ? pvalue.toLocaleString('de-DE', {
                              style: 'decimal',
                              maximumFractionDigits: 2,
                            })
                          : '0'
                      }}
                    </div>
                  </td>
                </tr>
              </table>
            </v-sheet>
          </v-card>
        </v-card>
      </v-sheet>

      <v-card class="ma-2 cardBorder schlag" elevation="0">
        <v-row no-gutters class="bg-grey-darken-3">
          <v-col cols="12" class="pa-1 cultureHeader">Schlag: Bilanz / ha</v-col></v-row
        >

        <table class="bilanz">
          <tr class="bold">
            <td class="cellbordertop">
              <div class="cell">Stickstoff</div>
              <div>
                {{
                  winMaximize
                    ? outputConfig['nanrechenbar'].label
                    : outputConfig['nanrechenbar'].labelshort
                }}
              </div>
            </td>
            <td class="cellbordertop">
              <div class="cell">kg N/ha</div>
              <div>
                {{
                  bilanz.summen.nanrechenbarSumme.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{
                  winMaximize ? outputConfig['nentzug'].label : outputConfig['nentzug'].labelshort
                }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  bilanz.summen.nentzugSumme.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{ winMaximize ? outputConfig['nsaldo'].label : outputConfig['nsaldo'].labelshort }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  bilanz.summen.nsaldoSumme.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellbordertop">
              <div class="cell">Phosphor</div>
              <div>
                {{
                  winMaximize
                    ? outputConfig['pduengung'].label
                    : outputConfig['pduengung'].labelshort
                }}
              </div>
            </td>
            <td class="cellbordertop">
              <div class="cell">kg P₂O₅/ha</div>
              <div>
                {{
                  bilanz.summen.pduengungSumme.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{
                  winMaximize ? outputConfig['pentzug'].label : outputConfig['pentzug'].labelshort
                }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  bilanz.summen.pentzugSumme.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellbordertop">
              <div class="cell">Kalium</div>
              <div>
                {{
                  winMaximize
                    ? outputConfig['kduengung'].label
                    : outputConfig['kduengung'].labelshort
                }}
              </div>
            </td>
            <td class="cellbordertop">
              <div class="cell">kg K₂O/ha</div>

              <div>
                {{
                  bilanz.summen.kduengungSumme.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{
                  winMaximize ? outputConfig['kentzug'].label : outputConfig['kentzug'].labelshort
                }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  bilanz.summen.kentzugSumme.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
        </table>
      </v-card>

      <v-card class="ma-2 cardBorder schlag" elevation="0">
        <v-row no-gutters class="bg-grey-darken-3">
          <v-col cols="12" class="pa-1 cultureHeader"
            >{{
              'Schlag: Bilanz gesamt (' +
              entry.flaeche.toLocaleString('de-DE', {
                style: 'decimal',
                maximumFractionDigits: 2,
              }) +
              'ha)'
            }}
          </v-col></v-row
        >

        <table class="bilanz">
          <tr class="bold">
            <td class="cellbordertop">
              <div class="cell">Stickstoff</div>
              <div>
                {{
                  winMaximize
                    ? outputConfig['nanrechenbar'].label
                    : outputConfig['nanrechenbar'].labelshort
                }}
              </div>
            </td>
            <td class="cellbordertop">
              <div class="cell">kg N</div>
              <div>
                {{
                  (entry.flaeche * bilanz.summen.nanrechenbarSumme).toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{
                  winMaximize ? outputConfig['nentzug'].label : outputConfig['nentzug'].labelshort
                }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  (entry.flaeche * bilanz.summen.nentzugSumme).toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{ winMaximize ? outputConfig['nsaldo'].label : outputConfig['nsaldo'].labelshort }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  (entry.flaeche * bilanz.summen.nsaldoSumme).toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellbordertop">
              <div class="cell">Phosphor</div>
              <div>
                {{
                  winMaximize
                    ? outputConfig['pduengung'].label
                    : outputConfig['pduengung'].labelshort
                }}
              </div>
            </td>
            <td class="cellbordertop">
              <div class="cell">kg P₂O₅</div>
              <div>
                {{
                  (entry.flaeche * bilanz.summen.pduengungSumme).toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{
                  winMaximize ? outputConfig['pentzug'].label : outputConfig['pentzug'].labelshort
                }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  (entry.flaeche * bilanz.summen.pentzugSumme).toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellbordertop">
              <div class="cell">Kalium</div>
              <div>
                {{
                  winMaximize
                    ? outputConfig['kduengung'].label
                    : outputConfig['kduengung'].labelshort
                }}
              </div>
            </td>
            <td class="cellbordertop">
              <div class="cell">kg K₂O</div>
              <div>
                {{
                  (entry.flaeche * bilanz.summen.kduengungSumme).toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
          <tr class="bold">
            <td class="cellborder">
              <div>
                {{
                  winMaximize ? outputConfig['kentzug'].label : outputConfig['kentzug'].labelshort
                }}
              </div>
            </td>
            <td class="cellborder">
              <div>
                {{
                  (entry.flaeche * bilanz.summen.kentzugSumme).toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </td>
          </tr>
        </table>
      </v-card>
    </v-sheet>
    <v-row no-gutters class="bg-grey-darken-2"
      ><v-col class="pa-2">
        <v-btn
          density="compact"
          :prepend-icon="winMaximize ? 'mdi-magnify-minus' : 'mdi-magnify-plus'"
          color="grey-lighten-3"
          block
          @click.stop="winMaximize = !winMaximize"
          >{{ winMaximize ? 'Verkleinern (Übersicht)' : 'Vergrößern (Detailansicht)' }}
        </v-btn>
      </v-col></v-row
    >
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';
import { useBalanceCalculator } from '../composables/useBalanceCalculator.js';
import { ref, computed } from 'vue';
import { useHelp } from '../composables/useHelp.js';

const { showHelp } = useHelp();

const { dataWindow, entry } = useDataEntries();
const { updateBilanz, outputConfig } = useBalanceCalculator();
import { useLookup } from '../composables/useLookUps.js';

const winMaximize = ref(false);

const bilanz = computed(() => updateBilanz());
const { lookup, tableAttribut } = useLookup();
</script>

<style scoped>
table.bilanz {
  width: 100%;
  border-collapse: collapse;
}
table.bilanz tr {
  padding: 0px;
}

table.bilanz td div {
  line-height: 22px;
  padding-left: 4px;
  padding-right: 4px;
}
table.bilanz td div.cell {
  background-color: #ddd;
  font-weight: 500;

  color: black;
}

table.bilanz tr.hide {
  font-style: italic;
}
table.bilanz tr.hide td {
  color: lightpink;
}

table.bilanz tr.hidezero {
  display: none;
}

table.bilanz tr.markred td {
  color: #ef5350 !important;
}

.tableHeader {
  padding: 2px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.0892857143em !important;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase !important;
}

table.bilanz td {
  font-size: 12px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  color: #444;
  letter-spacing: 0.0892857143em !important;
  font-family: 'Roboto', sans-serif;
}

table.bilanz td.cellbordertop {
  border-top: 1px solid #ddd;
}
table.bilanz td.cellborderbottom {
  border-bottom: 1px solid #ddd;
}

table.bilanz td.cellbordertopbottom {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

table.bilanz tr.bold td {
  font-weight: 600;
  color: #000;
}

table.bilanz td.borderbottom {
  border-bottom-width: 3px;
}

table.bilanz tr td:nth-child(1) {
  width: 75%;
  white-space: nowrap;
  overflow: hidden;
}
table.bilanz tr td:nth-child(2) {
  width: 25%;
  text-align: right;
}

.fertilizerData {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 400px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}

.fertilizerData.maximized {
  height: calc(100% - 70px);
  width: 1060px;
}

.error {
  position: relative;
  font-size: 12px;
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

.cardBorder.schlag {
  border-color: rgb(66, 66, 66);
}

.cultureHeader {
  font-size: 12px;
  text-transform: uppercase;
}
</style>
