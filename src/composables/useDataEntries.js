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
 * @typedef DataEntry
 * @property {number} jahr
 * @property {string} schlagnummer
 * @property {string} feldstuecksname
 * @property {string} flaechennutzungsart
 * @property {number} flaeche
 * @property {number} flaeche_nitratrisikogebiet
 * @property {number} flaeche_schwereboeden
 * @property {number} flaeche_grundwasserschutz
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
 * @property {Array<number>} parts
 * @property {Object} schlaginfo
 * @property {Array<culture>} cultures
 */

export const emptyFertilization = { typ: '', id: '', menge: 0, n: 0, p: 0, k: 0 };
export const emptyCulture = {
  typ: '',
  kultur: '',
  ertragslage: '',
  ernte: 0,
  ertragslageernte: '',
  feuchte: 0,
  protein: 0,
  duengung: [],
};
export const emptyEntry = {
  jahr: 0,
  schlagnummer: '',
  feldstuecksname: '',
  flaechennutzungsart: '',
  flaeche: 0,
  flaeche_nitratrisikogebiet: 0,
  flaeche_schwereboeden: 0,
  flaeche_grundwasserschutz: 0,
  duengeklasse_grundwasserschutz: '-',
  teilnahme_grundwasserschutz_acker: false,
  gw_acker_gebietszuteilung: 'Trockengebiet',
  ackerzahl: 31,
  phosphor_gehaltsklasse: 'C',
  kalium_gehaltsklasse: 'C',
  bodenart: 'lS - lehmiger Sand',
  vorfrucht: '',
  stickstoffueberschuss: 0,
  extent: [],
  parts: [],
  schlaginfo: { basic: null, programs: null },
  cultures: [{ ...emptyCulture }, { ...emptyCulture }],
};

export const entry = ref({ ...emptyEntry });

/** @type {import('vue').Ref<Array>} */
export const savedData = ref([]);

/** @type {import('vue').Ref<Number>} */
export const currentSaved = ref(null);

/** @type {import('vue').Ref<Number>} */
export const dataWindow = ref(0);

// load from local storage, if existing
{
  const saved = localStorage.getItem('fasttool');
  if (saved) {
    savedData.value = JSON.parse(saved);
  }
}

/**
 * @returns {{ currentSaved: import('vue').Ref<Number>, dataWindow:import('vue').Ref<Number>, savedData: import('vue').Ref<Array> , emptyFertilization: fertilization, emptyCulture: culture, emptyEntry: DataEntry, entry: import('vue').Ref<Object> }}
 */
export function useDataEntries() {
  return {
    currentSaved,
    dataWindow,
    savedData,
    emptyFertilization,
    emptyCulture,
    emptyEntry,
    entry,
  };
}
