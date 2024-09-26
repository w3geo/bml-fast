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
  </v-card>
</template>

<script setup>
import { useDataEntries } from '../composables/useDataEntries.js';
import { useBalanceCalculator } from '../composables/useBalanceCalculator.js';
import { ref, computed } from 'vue';

const { dataWindow } = useDataEntries();
const { updateBilanz } = useBalanceCalculator();

const winMaximize = ref(false);

const bilanz = computed(() => updateBilanz());
</script>

<style scoped>
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
