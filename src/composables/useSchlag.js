import { getSource } from 'ol-mapbox-style';
import { createEmpty, extend } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { toGeometry } from 'ol/render/Feature';
import { shallowRef, watch } from 'vue';
import { GeoJSON } from 'ol/format';
import { SCHLAEGE_SOURCE } from '../constants.js';
import { map, mapReady } from './useMap.js';
import { dataWindow } from '../composables/useDataEntries.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

/** @typedef {Array<{x: number, y: number}>} Vectors */

/**
 * @typedef SchlagInfo
 * @property {number} id
 * @property {boolean} loading
 * @property {number} [sl_flaeche_brutto_ha]
 * @property {string} [snar_bezeichnung]
 * @property {string} [fnar_code]
 * @property {string} [kz_bio_oepul_jn]
 * @property {import("ol/extent").Extent} [extent]
 * @property {Array<import('geojson').Polygon>} [parts]
 */

const geojson = new GeoJSON();

/** @type {import('vue').Ref<SchlagInfo>} */
export const schlagInfo = shallowRef();

/**
 * @param {import("ol/pixel").Pixel} pixel
 * @returns
 */
function getSchlagAtPixel(pixel) {
  return map.forEachFeatureAtPixel(pixel, (feature) =>
    feature.get('layer') === SCHLAEGE_SOURCE ? feature : undefined,
  );
}

/**
 * Get all parts of a schlag feature, from all involved tiles.
 * @param {import("ol/render/Feature").default} feature
 * @returns {Promise<Array<import("ol/render/Feature").default>>}
 */
async function getSchlagParts(feature) {
  const id = feature.getId();
  const extent = feature.getGeometry().getExtent();
  const source = /** @type {import("ol/source.js").VectorTile} */ (getSource(map, 'agrargis'));
  const tilePromises = [];
  source.getTileGrid().forEachTileCoord(extent, 12, (tileCoord) => {
    tilePromises.push(
      new Promise((resolve, reject) => {
        const [z, x, y] = tileCoord;
        const tile = source.getTile(z, x, y, 1, source.getProjection());
        if (tile.getState() < 2) {
          const onchange = () => {
            if (tile.getState() === 2 || tile.getState() === 4) {
              tile.removeEventListener('change', onchange);
              resolve(tile);
            } else if (tile.getState() === 3) {
              tile.removeEventListener('change', onchange);
              reject();
            }
          };
          tile.addEventListener('change', onchange);
          tile.load();
        } else {
          resolve(tile);
        }
      }),
    );
  });
  const tiles = await Promise.all(tilePromises);
  return tiles.reduce((acc, tile) => {
    tile.getSourceTiles().forEach((sourceTile) => {
      acc.push(
        ...sourceTile
          .getFeatures()
          .filter(
            (renderFeature) =>
              renderFeature.getId() === id && renderFeature.get('layer') === SCHLAEGE_SOURCE,
          ),
      );
    });
    return acc;
  }, []);
}

function findSchlag(schlagId) {
  return new Promise((resolve) => {
    mapReady.then(() => {
      map.once('rendercomplete', () => {
        const extent = transformExtent(map.getView().calculateExtent(), 'EPSG:4326', 'EPSG:3857');
        const features = /** @type {import("ol/source/Vector.js").default} */ (
          getSource(map, 'agrargis')
        )
          .getFeaturesInExtent(extent)
          .filter((feature) => feature.get('layer') === SCHLAEGE_SOURCE);
        const feature = features.find((f) => f.getId() === Number(schlagId));
        resolve(feature);
      });
      map.render();
    });
  });
}

async function setSchlagInfo(feature) {
  if (!feature) {
    schlagInfo.value = null;
    return;
  }
  const features = await getSchlagParts(feature);
  const extent = createEmpty();
  features.forEach((polygon) => extend(extent, polygon.getExtent()));
  /** @type {Array<import("geojson").Polygon>} */
  const parts = /** @type {Array<import("geojson").Polygon>} */ (
    features.map((f) =>
      geojson.writeGeometryObject(toGeometry(f), { featureProjection: 'EPSG:3857' }),
    )
  );
  schlagInfo.value = {
    ...feature.getProperties(),
    loading: false,
    id: feature.getId(),
    extent: transformExtent(extent, 'EPSG:3857', 'EPSG:4326'),
    parts,
  };
}

map.on('click', (event) => {
  if (dataWindow.value === 1) {
    const selectedRenderFeature = getSchlagAtPixel(event.pixel);
    setSchlagInfo(
      schlagInfo.value?.id !== selectedRenderFeature?.getId() ? selectedRenderFeature : null,
    );
  }
});
map.on('pointermove', (event) => {
  if (event.dragging) {
    return;
  }
  map.getTargetElement().style.cursor =
    dataWindow.value === 1 && getSchlagAtPixel(event.pixel) ? 'pointer' : '';
});

watch(schlagInfo, (value) => {
  removeSchlagParts();
  if (!value) {
    return;
  }
  if (value?.loading) {
    findSchlag(value.id).then((feature) => {
      setSchlagInfo(feature);
    });
    return;
  }
  showSchlagParts(value.parts, { zoom: false });
});

export const partsSource = new VectorSource({
  overlaps: false,
});

const partsLayer = new VectorLayer({
  source: partsSource,
  style: {
    'fill-color': 'rgba(255, 0, 0, 0.25)',
  },
});

function removeSchlagParts() {
  if (!partsLayer) {
    return;
  }
  map.removeLayer(partsLayer);
}

/**
 * @param {Array<import('geojson').Polygon>} parts
 */
function showSchlagParts(parts, options = { zoom: true }) {
  if (!parts.length) {
    return;
  }
  removeSchlagParts();
  partsSource.clear();
  partsSource.addFeatures(
    geojson.readFeatures({
      type: 'FeatureCollection',
      features: parts.map((geometry) => ({
        type: 'Feature',
        geometry,
      })),
    }),
  );
  if (options.zoom) {
    map
      .getView()
      .fit(partsLayer.getSource().getExtent(), { duration: 500, padding: [50, 50, 50, 400] });
  }
  map.addLayer(partsLayer);
}

/**
 * @returns {{
 *   schlagInfo: import('vue').Ref<SchlagInfo>,
 *   showSchlagParts: (parts: Array<import('geojson').Polygon>) => void,
 *   removeSchlagParts: () => void,
 * }}
 */
export function useSchlag() {
  return { schlagInfo, showSchlagParts, removeSchlagParts };
}
