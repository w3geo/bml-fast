import { shallowRef } from 'vue';
import { map, mapReady } from './useMap.js';

/**
 * @typedef Topic
 * @property {string} id
 * @property {string} label
 * @property {string|undefined} warning
 * @property {string} color
 * @property {boolean} inExtent
 * @property {boolean} inSchlagExtent
 * @property {number} urlSort
 * @property {number} displaySort
 * @property {boolean} visible
 * @property {string|undefined} category
 */

/**
 * @type {import('vue').ShallowRef<Array>}
 */
export const topics = shallowRef([]);

mapReady.then(() => {
  const { layers } = map.get('mapbox-style');
  topics.value.push(
    ...Object.values(
      layers
        .filter((l) => l.metadata?.group === 'one' && l.type !== 'raster')
        .map((l) => ({
          id: l.id,
          label: l.metadata?.label,
          warning: l.metadata?.warning,
          color: l.paint?.['fill-color'],
          urlSort: l.metadata?.urlSort,
          displaySort: l.metadata?.displaySort || Number.MAX_SAFE_INTEGER,
          category: l.metadata?.category,
        }))
        .reduce((acc, { id, label, warning, color, urlSort, displaySort, category }) => {
          if (!(label in acc)) {
            acc[label] = {
              id,
              label,
              warning,
              color,
              inExtent: false,
              inSchlagExtent: false,
              urlSort,
              displaySort,
              category,
              visible: false,
            };
          }
          return acc;
        }, {}),
    ),
  );
});

export function useTopics() {
  return { topics };
}
