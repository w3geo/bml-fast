import { ref } from 'vue';

/**
 * @typedef fertilization
 * @property {string} typ
 * @property {string} id
 * @property {number} menge
 * @property {number} n
 * @property {number} p
 * @property {number} k
 */

/**
 * @typedef culture
 * @property {string} typ
 * @property {string} kultur
 * @property {string} ertragslage
 * @property {number} ernte
 * @property {string} ertragslageernte
 * @property {number} feuchte
 * @property {number} protein
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
 * @property {Array<culture>} cultures
 */

export const emptyFertilization = { typ: 'Eigene', id: '', menge: 0, n: 0, p: 0, k: 0 };
export const emptyCulture = {
  typ: 'keine',
  kultur: '',
  ertragslage: '',
  ernte: 0,
  ertragslageernte: '',
  feuchte: 0,
  protein: 0,
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
  cultures: [{ ...emptyCulture }, { ...emptyCulture }],
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
 * @returns {{ allData: import('vue').Ref<allData> , emptyFertilization: fertilization, emptyCulture: culture, emptyEntry: dataEntry, entry: import('vue').Ref<Object> }}
 */
export function useDataEntries() {
  return { allData, emptyFertilization, emptyCulture, emptyEntry, entry };
}
