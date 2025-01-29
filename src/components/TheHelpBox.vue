<template>
  <v-card class="helpBox" v-if="helpToggle" elevation="10">
    <v-row no-gutters class="boxHeader bg-orange text-white">
      <v-col cols="10" class="text-button">
        <v-icon class="mx-1"> mdi-help-circle </v-icon>
        {{ currentHelp.title }}
      </v-col>
      <v-col cols="2" class="pr-1 text-right">
        <v-icon @click="helpToggle = false"> mdi-close </v-icon>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="pa-3 helpText text-body-2"> {{ currentHelp.text }}</v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { useHelp } from '../composables/useHelp.js';
const { helpToggle, currentHelp } = useHelp();
</script>

<style scoped>
.helpBox {
  position: absolute;
  right: 10px;
  top: 60px;
  width: 400px;
  height: 210px;
  z-index: 1000;
}

.helpText {
  height: 180px;
  overflow: auto;
}
</style>
