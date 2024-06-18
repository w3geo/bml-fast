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

export const emptyHarvest = { typ: '', duengung: [] };
export const emptyFertilization = { name: '' };
export const emptyEntry = {
  jahr: 0,
  schlagnummer: '',
  feldstuecksname: '',
  flaechennutzungsart: '',
  flaeche: 0,
  flaeche_nitratrisikogebiet: 0,
  flaeche_grundwasserschutz_graz: 0,
  duengeklasse_grundwasserschutz: '',
  flaeche_grundwasserschutz_acker: false,
  ackerzahl: 0,
  phosphor_gehaltsklasse: '',
  kalium_gehaltsklasse: '',
  bodenart: '',
  vorfrucht: '',
  stickstoffueberschuss: '',
  ernten: [],
};

/**
 * @typedef allData
 * @property {Array<dataEntry>} saved
 * @property {dataEntry} current
 * @property {boolean} datawindow
 */

/** @type {import('vue').Ref<allData>} */
export const allData = ref({ saved: [], current: null, datawindow: false });

/**
 * @returns {{ allData: import('vue').Ref<allData> , emptyFertilization: fertilization, emptyHarvest: harvest, emptyEntry: dataEntry }}
 */
export function useDataEntries() {
  return { allData, emptyFertilization, emptyHarvest, emptyEntry };
}
