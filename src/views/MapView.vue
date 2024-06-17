<template>
  <div ref="mapContainer" class="map" />
  <the-entry-list />
  <the-entry-form />
  <the-fertilizer-balance />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import TheEntryList from '../components/TheEntryList.vue';
import TheFertilizerBalance from '../components/TheFertilizerBalance.vue';
import TheEntryForm from '../components/TheEntryForm.vue';
import { useMap } from '../composables/useMap.js';

const { map } = useMap();
const mapContainer = ref();

onMounted(() => {
  map.setTarget(mapContainer.value);
});

onBeforeUnmount(() => {
  map.setTarget(null);
});
</script>

<style scoped>
.map {
  height: 100%;
}
</style>
<style>
div.ol-zoom {
  bottom: 2em;
  top: inherit;
  left: inherit;
  right: 0.5em;
}

div.ol-gps {
  bottom: 5.5em;
  top: inherit;
  left: inherit;
  right: 0.5em;
}

.ol-viewport.ol-touch div.ol-gps {
  bottom: 6.5em;
  top: inherit;
}

div.ol-rotate {
  bottom: 7.5em;
  top: inherit;
  left: inherit;
  right: 0.5em;
}

.ol-viewport.ol-touch div.ol-rotate {
  bottom: 9em;
}
</style>
