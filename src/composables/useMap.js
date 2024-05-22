import 'ol/ol.css';
import { Map, View } from 'ol';
import { Control, defaults } from 'ol/control.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import Link from 'ol/interaction/Link.js';
import { useGeographic } from 'ol/proj.js';
import { apply, applyStyle, getLayer, getSource, renderTransparent } from 'ol-mapbox-style';
import { getCenter } from 'ol/extent.js';
import { shallowRef } from 'vue';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import { INITIAL_EXTENT } from '../constants.js';

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

export const mapReady = apply(map, './map/style.json').then(() => {
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
 * @type {Promise<import("ol/style/Style.js").StyleLike|import('ol/style/flat.js').FlatStyleLike>}
 */
export const filterStyle = mapReady.then(async () => {
  const style = JSON.parse(JSON.stringify(map.get('mapbox-style')));
  style.layers.forEach((l) => {
    if (l.metadata?.group === 'one') {
      l.layout = { ...l.layout, visibility: 'visible' };
    } else {
      l.layout = { ...l.layout, visibility: 'none' };
    }
  });
  const filterLayer = new VectorTileLayer();
  await applyStyle(filterLayer, style, 'agrargis', './map/style.json');
  return filterLayer.getStyle();
});

/**
 * @returns {{ map: Map, mapReady: Promise<void>, mapView: import('vue').ShallowRef<MapView> }}
 */
export function useMap() {
  return { map, mapReady, mapView };
}
