<template>
  <v-card
    class="fertilizerData"
    :class="winMaximize ? 'maximized' : ''"
    v-if="dataWindow === 2"
    elevation="10"
  >
    <v-row no-gutters class="boxHeader bg-grey-darken-3 mb-3">
      <v-col cols="10" class="text-button text-white">
        <v-icon class="mx-1"> mdi-chart-pie </v-icon>
        Nährstoff-Bilanz
      </v-col>
      <v-col cols="2" class="text-right">
        <v-icon class="mr-2" @click.stop="winMaximize = !winMaximize"
          >{{ winMaximize ? 'mdi-window-restore' : 'mdi-window-maximize' }}
        </v-icon>
      </v-col>
    </v-row>
    <v-row
      v-for="(message, index) in bilanz.errors"
      :key="`error${index}`"
      no-gutters
      class="ma-1 mx-2 error"
      ><v-col cols="12" class="pa-1 pl-4"
        ><v-icon size="small">mdi-alert-box</v-icon>{{ message }}
      </v-col></v-row
    >
    <v-row no-gutters
      ><v-col>
        <table v-for="(kultur, index) in bilanz.bilanz" :key="`bilanztable${index}`" class="bilanz">
          <tr>
            <th colspan="2">
              {{ tableAttribut('kulturen', entry.cultures[index].kultur, 'Kultur') }}
            </th>
          </tr>
          <tr
            v-for="(pvalue, pkey) in kultur"
            :key="`row_${index}_${pkey}`"
            :class="{ hide: !outputConfig[pkey].print, bold: outputConfig[pkey].bold }"
          >
            <td :class="`border${outputConfig[pkey].border}`">{{ outputConfig[pkey].label }}</td>
            <td :class="`border${outputConfig[pkey].border}`">
              {{ pvalue.toLocaleString('de-DE', { style: 'decimal' }) }}
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
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
const { tableAttribut } = useLookup();
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
  display: none;
}

table.bilanz th {
  padding: 2px;
  font-size: 11px;
  background-color: #eee;
  text-align: left;
}

table.bilanz tr.bold td {
  font-weight: bold;
}

table.bilanz td {
  padding: 2px;
  border: 1px solid #eee;
  font-size: 11px;
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
}

.fertilizerData {
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 350px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}

.fertilizerData.maximized {
  height: calc(100% - 70px);
  width: 1010px;
}

.error {
  position: relative;
  border: 1px solid red;
  font-size: 12px;
  color: red;
}
</style>

<style>
.error .v-icon {
  position: absolute;
  left: -2px;
  top: -2px;
}
</style>
