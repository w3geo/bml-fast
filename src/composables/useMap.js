import 'ol/ol.css';
import { Map, View } from 'ol';
import { Control, defaults } from 'ol/control.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import Link from 'ol/interaction/Link.js';
import { useGeographic } from 'ol/proj.js';
import { apply, getLayer, getSource, renderTransparent } from 'ol-mapbox-style';
import { getCenter } from 'ol/extent.js';
import { shallowRef } from 'vue';
import { AGRARATLAS_STYLE_URL, INITIAL_EXTENT } from '../constants.js';
import { PMTiles } from 'pmtiles';

/**
 * @typedef {Object} MapView
 * @property {number} [zoom]
 * @property {import("ol/coordinate.js").Coordinate} [center]
 * @property {import("ol/extent.js").Extent} [extent]
 */

/**
 * @type {import('vue').ShallowRef<MapView>}
 */
export const mapView = shallowRef({});

renderTransparent(true);

useGeographic();

export const map = new Map({
  controls: defaults({ attributionOptions: { collapsible: false } }),
  view: new View({
    maxResolution: 78271.51696402048,
    extent: INITIAL_EXTENT,
    showFullExtent: true,
    center: getCenter(INITIAL_EXTENT),
    zoom: 0,
  }),
  moveTolerance: 3,
});
const gps = document.createElement('div');
gps.title = 'Auf meinen Standort zentrieren';
gps.className = 'ol-control ol-unselectable ol-gps';
gps.innerHTML = '<button><i class="mdi mdi-crosshairs-gps"></i></button>';
gps.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition((position) =>
    map.getView().animate({
      center: [position.coords.longitude, position.coords.latitude],
      zoom: 18,
    }),
  );
});
map.addControl(
  new Control({
    element: gps,
  }),
);
map.addControl(new ScaleLine());
map.addInteraction(new Link({ params: ['x', 'y', 'z', 'r'] }));
map.on('moveend', () => {
  const view = map.getView();
  mapView.value = {
    zoom: view.getZoom(),
    center: view.getCenter(),
    extent: view.calculateExtent(),
  };
});

const pmtilesByUrl = {};
const tileUrlRegex = /^pmtiles:\/\/(.+)\/([0-9]+)\/([0-9]+)\/([0-9]+).mvt$/;
const tileCoordRegex = /\/([0-9]+)\/([0-9]+)\/([0-9]+).mvt$/;
export const transformRequest = async (url, type) => {
  /** @type {PMTiles} */
  let pmtiles;
  if (url.startsWith('pmtiles://')) {
    const baseUrl = url.slice(10).replace(tileCoordRegex, '');
    if (!pmtilesByUrl[baseUrl]) {
      const agraratlasStyleUrl = new URL(AGRARATLAS_STYLE_URL, window.location.href);
      pmtilesByUrl[baseUrl] = new PMTiles(new URL(url.slice(10), agraratlasStyleUrl).href);
    }
    pmtiles = pmtilesByUrl[baseUrl];
  }
  if (!pmtiles) {
    return url;
  }
  if (type === 'Source') {
    const tileJson = await pmtiles.getTileJson(url);
    return `data:application/json,${encodeURIComponent(JSON.stringify(tileJson))}`;
  }
  if (type === 'Tiles') {
    const [, baseUrl, z, x, y] = url.match(tileUrlRegex);
    const tileResult = await pmtilesByUrl[baseUrl].getZxy(Number(z), Number(x), Number(y));
    const data = tileResult?.data ?? new ArrayBuffer(0);
    const objectUrl = URL.createObjectURL(new Blob([data]));
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    return objectUrl;
  }
  return url;
};

export const mapReady = apply(map, AGRARATLAS_STYLE_URL, {
  transformRequest,
}).then(() => {
  const { layers } = map.get('mapbox-style');
  layers.forEach((layer) => {
    const source = getSource(map, layer.source);
    if ('tileOptions' in source) {
      /** @type {import('ol/Tile.js').Options} */ (source.tileOptions).transition = undefined;
    }
  });
  getLayer(map, 'neigungsklassen').setSource(null);
});

/**
 * @returns {{ map: Map, mapReady: Promise<void>, mapView: import('vue').ShallowRef<MapView> }}
 */
export function useMap() {
  return { map, mapReady, mapView };
}
