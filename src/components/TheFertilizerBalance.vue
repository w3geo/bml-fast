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
        Düngeobergrenzen / Bilanz
      </v-col>
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

      <v-card class="ma-2" elevation="0" v-if="bilanz.errors.length === 0">
        <v-row no-gutters class="error bg-orange-darken-4"
          ><v-col cols="10" class="pa-2 tableHeader">Düngeobergrenze gesamt (brutto)</v-col
          ><v-col vols="2" class="pa-2 text-right tableHeader"
            >{{
              bilanz.duengeobergrenze
                ? bilanz.duengeobergrenze.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                : '0'
            }}
          </v-col></v-row
        ></v-card
      >
      <v-card class="ma-2" elevation="0" v-if="bilanz.errors.length === 0">
        <v-row no-gutters class="error bg-green-darken-4"
          ><v-col cols="10" class="pa-2 tableHeader">Düngeobergrenze gesamt (netto)</v-col
          ><v-col vols="2" class="pa-2 text-right tableHeader"
            >{{
              bilanz.duengeobergrenzered
                ? bilanz.duengeobergrenzered.toLocaleString('de-DE', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  })
                : '0'
            }}
          </v-col></v-row
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
              {{ tableAttribut('kulturen', entry.cultures[index].kultur, 'Kultur') }}</v-col
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

          <v-card
            color="grey"
            class="ma-1 pa-1"
            elevation="0"
            v-if="index === 0 || kultur.duengeobergrenze > 0"
          >
            <v-sheet class="bg-grey tableHeader">Bilanz</v-sheet>

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
                      // @ts-ignore
                      pkey === 'errorsBI' ||
                      // @ts-ignore
                      pkey === 'errorsOG' ||
                      (pvalue === 0 && !outputConfig[pkey].print),
                    hide: !outputConfig[pkey].print,
                    bold: outputConfig[pkey].bold,
                  }"
                >
                  <td :class="`border${outputConfig[pkey].border}`">
                    {{ outputConfig[pkey].label }}
                  </td>
                  <td :class="`border${outputConfig[pkey].border}`">
                    {{
                      pvalue
                        ? pvalue.toLocaleString('de-DE', {
                            style: 'decimal',
                            maximumFractionDigits: 2,
                          })
                        : '0'
                    }}
                  </td>
                </tr>
              </table>
            </v-sheet>
          </v-card>
        </v-card>
      </v-sheet>
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
  padding: 2px;
  border: 1px solid #eee;
  font-size: 11px;
  color: #777;
  font-weight: 500;
  letter-spacing: 0.0892857143em !important;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase !important;
}

table.bilanz tr.bold td {
  font-weight: bold;
  color: #000;
}

table.bilanz td.borderbottom {
  border-bottom-width: 3px;
}

table.bilanz tr td:nth-child(1) {
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
}
table.bilanz tr td:nth-child(2) {
  width: 15%;
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
.cultureHeader {
  font-size: 12px;
  text-transform: uppercase;
}
</style>
