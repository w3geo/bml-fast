import { ref } from 'vue';

/**
 * @typedef fertilization
 * @property {string} name
 */

/**
 * @typedef harvest
 * @property {string} zwischenfrucht
 * @property {string} kultur
 * @property {number} menge
 * @property {Array<fertilization>} duengung
 */

/**
 * @typedef dataEntry
 * @property {number} jahr
 * @property {string} schlagnummer
 * @property {string} feldstuecksname
 * @property {string} flaechennutzungsart
 * @property {number} flaeche
 * @property {number} flaeche_nitratrisikogebiet
 * @property {string} duengeklasse_grundwasserschutz
 * @property {boolean} teilnahme_grundwasserschutz_acker
 * @property {string} gw_acker_gebietszuteilung
 * @property {number} ackerzahl
 * @property {string} phosphor_gehaltsklasse
 * @property {string} kalium_gehaltsklasse
 * @property {string} bodenart
 * @property {string} vorfrucht
 * @property {number} stickstoffueberschuss
 * @property {Array<number>} extent
 * @property {Array<harvest>} ernten
 */

export const emptyFertilization = { name: '' };
export const emptyHarvest = {
  zwischenfrucht: '',
  kultur: '',
  menge: 0,
  duengung: [{ ...emptyFertilization }],
};
export const emptyEntry = {
  jahr: 0,
  schlagnummer: '',
  feldstuecksname: '',
  flaechennutzungsart: '',
  flaeche: 0,
  flaeche_nitratrisikogebiet: 0,
  duengeklasse_grundwasserschutz: '-',
  teilnahme_grundwasserschutz_acker: false,
  gw_acker_gebietszuteilung: 'Trockengebiet',
  ackerzahl: 0,
  phosphor_gehaltsklasse: 'C',
  kalium_gehaltsklasse: 'C',
  bodenart: 'sU - sandiger Schluff',
  vorfrucht: '',
  stickstoffueberschuss: 0,
  extent: [],
  ernten: [{ ...emptyHarvest }],
};

export const entry = ref(emptyEntry);

/**
 * @typedef allData
 * @property {Array<dataEntry>} saved
 * @property {number} current
 * @property {boolean} datawindow
 */

/** @type {import('vue').Ref<allData>} */
export const allData = ref({ saved: [], current: null, datawindow: false });

// load from local storage, if existing
{
  const saved = localStorage.getItem('fasttool');
  if (saved) {
    allData.value.saved = JSON.parse(saved);
  }
}

/**
 * @returns {{ allData: import('vue').Ref<allData> , emptyFertilization: fertilization, emptyHarvest: harvest, emptyEntry: dataEntry, entry: import('vue').Ref<Object> }}
 */
export function useDataEntries() {
  return { allData, emptyFertilization, emptyHarvest, emptyEntry, entry };
}
