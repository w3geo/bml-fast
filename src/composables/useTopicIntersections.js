import { getSource } from 'ol-mapbox-style';
import { shallowRef, watch } from 'vue';
import { getPointResolution, transformExtent } from 'ol/proj';
import { MVT } from 'ol/format';
import { Map, View } from 'ol';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { Style, Fill } from 'ol/style';
import { getBottomLeft, getCenter, getHeight, getTopRight, getWidth } from 'ol/extent';
import { map, mapReady } from './useMap.js';
import { topics } from './useTopics.js';
import { partsSource, schlagInfo } from './useSchlag.js';
import VectorLayer from 'ol/layer/Vector.js';

/** @typedef {'nitrataktionsprogramm' | 'bdfl_l16_grundwasserschutz_acker' | 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_3' | 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_2' | 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_1' | 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel' | 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel_10' | 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_niedrig' | 'schwere_boeden'} Topic */
/** @typedef {(feature: import("ol/Feature.js").FeatureLike) => boolean} Filter */

/** @type {{[Key in Topic]: Filter}} */
const filtersByTopic = {
  nitrataktionsprogramm: (feature) =>
    feature.get('layer') === 'nitrataktionsprogramm' && feature.get('in_napv') === 1,
  bdfl_l16_grundwasserschutz_acker: (feature) =>
    feature.get('layer') === 'bdfl_l16_grundwasserschutz_acker',
  'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_3': (feature) =>
    feature.get('layer') === 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen' &&
    feature.get('el') === 'EL hoch 3',
  'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_2': (feature) =>
    feature.get('layer') === 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen' &&
    feature.get('el') === 'EL hoch 2',
  'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_1': (feature) =>
    feature.get('layer') === 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen' &&
    feature.get('el') === 'EL hoch 1',
  'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel': (feature) =>
    feature.get('layer') === 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen' &&
    feature.get('el') === 'EL mittel',
  'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel_10': (feature) =>
    feature.get('layer') === 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen' &&
    feature.get('el') === 'EL mittel -10%',
  'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_niedrig': (feature) =>
    feature.get('layer') === 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen' &&
    feature.get('el') === 'EL niedrig',
  schwere_boeden: (feature) => feature.get('layer') === 'schwere_boeden',
};

const topicKeys = Object.keys(filtersByTopic);

const blackFill = new Style({
  fill: new Fill({
    color: 'black',
  }),
});

const resolution = 5;
const topicImageData = {};

function createTopicLayer(topic) {
  const topicLayer = new VectorTileLayer({
    renderMode: 'vector',
    style(feature) {
      return filtersByTopic[topic](feature) ? blackFill : null;
    },
  });
  topicLayer.on('postrender', (e) => {
    const context = /** @type {CanvasRenderingContext2D} */ (e.context);
    topicImageData[topic] = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height,
    ).data;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  });
  return topicLayer;
}

const topicHectarsAllZero = /** @type {{[Key in Topic]: number}} */ (
  Object.freeze(topicKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}))
);
/** @type {import("vue").Ref<{[Key in Topic]: number}>} */
const topicHectars = shallowRef(topicHectarsAllZero);

function updateTopicHectars() {
  schlagLayer.changed();
  topicHectars.value = topicHectarsAllZero;
  if (!schlagInfo.value || schlagInfo.value.loading) {
    return;
  }

  const extent = transformExtent(schlagInfo.value.extent, 'EPSG:4326', 'EPSG:3857');
  const bl = getBottomLeft(extent).map((x) => Math.floor(x / resolution) * resolution);
  const tr = getTopRight(extent).map((y) => Math.ceil(y / resolution) * resolution);
  const adjustedExtent = [...bl, ...tr];
  offscreenMap.setSize([
    Math.ceil(getWidth(adjustedExtent) / resolution),
    Math.ceil(getHeight(adjustedExtent) / resolution),
  ]);
  offscreenMap.once('rendercomplete', () => {
    const pixelResolution =
      resolution * getPointResolution('EPSG:3857', 1, getCenter(adjustedExtent));
    let schlagArea = 0;
    const topicArea = /** @type {{[Key in Topic]: number}} */ ({});
    for (let i = 0, ii = schlagImageData.length; i < ii; i += 4) {
      const schlagAlpha = schlagImageData[i + 3];
      if (schlagAlpha > 0) {
        schlagArea += pixelResolution * pixelResolution * (schlagAlpha / 255);
        for (let t = 0, tt = topicKeys.length; t < tt; ++t) {
          const topic = topicKeys[t];
          const topicAlpha = topicImageData[topic][i + 3];
          if (topicAlpha > 0) {
            topicArea[topic] =
              (topicArea[topic] || 0) +
              pixelResolution * pixelResolution * (Math.min(schlagAlpha, topicAlpha) / 255);
          }
        }
      }
    }
    const calibrationFactor = (schlagInfo.value.sl_flaeche_brutto_ha * 10000) / schlagArea;
    topicKeys.forEach((topic) => {
      topicArea[topic] = ((topicArea[topic] || 0) * calibrationFactor) / 10000;
    });
    topicHectars.value = topicArea;
  });
  offscreenMap.getView().fit(transformExtent(adjustedExtent, 'EPSG:3857', 'EPSG:4326'));
}

watch([schlagInfo, topics], updateTopicHectars);

const schlagLayer = new VectorLayer({
  style: blackFill,
  source: partsSource,
});
let schlagImageData;
schlagLayer.on('postrender', (e) => {
  const context = /** @type {CanvasRenderingContext2D} */ (e.context);
  schlagImageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data;
});

const topicLayers = topicKeys.map(createTopicLayer);

const offscreenMap = new Map({
  pixelRatio: 1 / resolution,
  controls: [],
  interactions: [],
  target: document.createElement('div'),
  layers: [...topicLayers, schlagLayer],
  view: new View({
    resolutions: [1],
  }),
});

mapReady.then(() => {
  const templateSource = /** @type {import("ol/source/VectorTile.js").default} */ (
    getSource(map, 'agrargis')
  );
  const source = new VectorTileSource({
    format: new MVT(),
    minZoom: 15,
    maxZoom: 15,
    tileLoadFunction: templateSource.getTileLoadFunction(),
    tileUrlFunction: templateSource.getTileUrlFunction(),
  });
  offscreenMap
    .getLayers()
    .forEach((layer) => layer instanceof VectorTileLayer && layer.setSource(source));
});

/**
 * @returns {{topicHectars: import("vue").Ref<{[Key in Topic]: number}>}}
 */
export function useTopicIntersections() {
  return { topicHectars };
}
