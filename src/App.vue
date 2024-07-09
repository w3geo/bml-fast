<template>
  <v-app>
    <v-app-bar density="compact">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      <v-img max-width="38" :src="logo"></v-img>
      <v-app-bar-title class="font-weight-black text-grey-darken-2">FaST Tool </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher temporary @click="drawer = false">
      <v-row no-gutters class="mt-4">
        <v-col cols="12" class="pa-3 pt-1">
          <a class="drawerLdink" href="https://info.bml.gv.at/impressum.html" target="_blank"
            >Impressum</a
          >
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <div class="searchField">
      <place-search />
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PlaceSearch from './components/PlaceSearch.vue';
import logo from './assets/logo.svg';
import { useLookup } from './composables/useLookUps.js';

const { lookup } = useLookup();

const drawer = ref(false);

onMounted(async () => {
  const response = await fetch('data/schlagnutzungsarten.json');
  const data = await response.json();
  lookup.schlagnutzungsarten = data;
});
</script>

<style scoped>
.searchField {
  z-index: 2000;
  position: absolute;
  right: 10px;
  top: 4px;
  width: 50%;
  max-width: 340px;
}

.drawerLink {
  color: #666;
  text-decoration: none;
  font-size: 18px;
}
</style>
<style>
@supports (-webkit-touch-callout: none) {
  body,
  #app,
  .v-application .v-application__wrap {
    min-height: -webkit-fill-available;
  }
}
</style>
