import 'ol/ol.css';
import { Map, View } from 'ol';
import { Control, defaults } from 'ol/control.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import Link from 'ol/interaction/Link.js';
import { useGeographic } from 'ol/proj.js';
import { apply, getSource, renderTransparent } from 'ol-mapbox-style';
import { getCenter } from 'ol/extent.js';
import { shallowRef } from 'vue';
import { AGRARATLAS_STYLE_URL, INITIAL_EXTENT } from '../constants.js';
import { register as registerPMTiles } from 'pmtiles-protocol';

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

registerPMTiles();
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

export const mapReady = apply(map, AGRARATLAS_STYLE_URL).then(() => {
  const { layers } = map.get('mapbox-style');
  layers.forEach((layer) => {
    const source = getSource(map, layer.source);
    if ('tileOptions' in source) {
      /** @type {import('ol/Tile.js').Options} */ (source.tileOptions).transition = undefined;
    }
  });
  //@ts-expect-error
  /** @type {import("ol/source/VectorTile.js").default} */ (getSource(map, 'agrargis')).overlaps_ =
    false;
});

/**
 * @returns {{ map: Map, mapReady: Promise<void>, mapView: import('vue').ShallowRef<MapView> }}
 */
export function useMap() {
  return { map, mapReady, mapView };
}
