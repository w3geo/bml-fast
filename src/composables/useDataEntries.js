import { ref } from 'vue';

/**
 * @typedef fertilization
 * @property {string} name
 */

/**
 * @typedef harvest
 * @property {string} typ
 * @property {Array<harvest>} duengung
 */

/**
 * @typedef dataEntry
 * @property {number} jahr
 * @property {string} schlagnummer
 * @property {string} feldstuecksname
 * @property {string} flaechennutzungsart
 * @property {number} flaeche
 * @property {number} flaeche_nitratrisikogebiet
 * @property {number} flaeche_grundwasserschutz_graz
 * @property {string} duengeklasse_grundwasserschutz
 * @property {boolean} flaeche_grundwasserschutz_acker
 * @property {number} ackerzahl
 * @property {string} phosphor_gehaltsklasse
 * @property {string} kalium_gehaltsklasse
 * @property {string} bodenart
 * @property {string} vorfrucht
 * @property {string} stickstoffueberschuss
 * @property {Array<harvest>} ernten
 */

/**
 * @typedef allData
 * @property {Array<dataEntry>|null} saved
 * @property {dataEntry|null} current
 */

export const allData = ref({ saved: null, current: null });

export function useDataEntries() {
  return { allData };
}
