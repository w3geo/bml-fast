<template>
  <v-dialog persistent v-model="showOverlay" max-width="600">
    <v-card class="pa-5">
      <h3 class="mb-4">Integrierte Nährstoffbilanz - BETA Version.</h3>
      <p>
        Diese Version kann noch Fehler enthalten. Für Meldungen von Fehlern oder auch für Anregungen
        kontaktieren Sie uns bitte per E-Mail unter
        <a href="mailto:someone@somehere.com">someone@somehere.com</a>
      </p>
      <v-row no-gutters class="mt-10">
        <v-col cols="8"
          ><v-checkbox v-model="neverShowOverlay" label="Diesen Dialog nicht mehr anzeigen"
        /></v-col>
        <v-col cols="4" align="right"
          ><v-btn color="green" @click.stop="closeDialog">Verstanden</v-btn></v-col
        >
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showOverlay = ref(false);
const neverShowOverlay = ref(false);

onMounted(() => {
  if (!localStorage.getItem('fasttooldisclaimer')) {
    showOverlay.value = true;
  }
});

function closeDialog() {
  if (neverShowOverlay.value) {
    localStorage.setItem('fasttooldisclaimer', 'hide');
  }
  showOverlay.value = false;
}
</script>

<style scoped></style>
