import { ref } from 'vue';

/**
 * @typedef Fertilization
 * @property {string} typ
 * @property {string} id
 * @property {number} menge
 * @property {number} n
 * @property {number} p
 * @property {number} k
 */

/**
 * @typedef Culture
 * @property {string} kultur
 * @property {string} ertragslage
 * @property {number} ernte
 * @property {string} ertragslageernte
 * @property {number} feuchte
 * @property {number} protein
 * @property {number} nmin
 * @property {number} nminvorgabe
 * @property {Array<Fertilization>} duengung
 */

/**
 * @typedef DataEntry
 * @property {number} jahr
 * @property {number} feldstuecksnummer
 * @property {string} schlagnummer
 * @property {string} feldstuecksname
 * @property {string} flaechennutzungsart
 * @property {number} flaeche
 * @property {number} flaeche_nitratrisikogebiet
 * @property {boolean} nitratrisikogebiet
 * @property {number} flaeche_schwereboeden
 * @property {number} flaeche_grundwasserschutz
 * @property {boolean} wrrl
 * @property {string} wrrl_duengeklasse
 * @property {boolean} teilnahme_grundwasserschutz_acker
 * @property {string} gw_acker_gebietszuteilung
 * @property {number} ackerzahl
 * @property {string} phosphor_gehaltsklasse
 * @property {string} kalium_gehaltsklasse
 * @property {string} bodenart
 * @property {string} vorfrucht
 * @property {number} nsaldo
 * @property {Array<number>} extent
 * @property {Array<number>} parts
 * @property {{basic: import('./useSchlag').SchlagInfo, programs: import('./useTopicIntersections').TopicHectars}} schlaginfo
 * @property {Array<Culture>} cultures
 */

export const emptyFertilization = { typ: '', id: '', menge: 0, n: 0, p: 0, k: 0 };
export const emptyCulture = {
  kultur: '',
  ertragslage: '',
  ernte: 0,
  ertragslageernte: '',
  feuchte: 14,
  protein: 12,
  nmin: 0,
  nminvorgabe: 0,
  duengung: [],
};

/** @tpye {DataEntry} */
export const emptyEntry = {
  jahr: 0,
  feldstuecksnummer: 0,
  schlagnummer: '',
  feldstuecksname: '',
  flaechennutzungsart: '',
  flaeche: 0,
  flaeche_nitratrisikogebiet: 0,
  nitratrisikogebiet: false,
  flaeche_schwereboeden: 0,
  flaeche_grundwasserschutz: 0,
  wrrl: false,
  wrrl_duengeklasse: '-',
  teilnahme_grundwasserschutz_acker: false,
  gw_acker_gebietszuteilung: 'Trockengebiet',
  ackerzahl: 31,
  phosphor_gehaltsklasse: 'C',
  kalium_gehaltsklasse: 'C',
  bodenart: 'lS - lehmiger Sand',
  vorfrucht: '',
  nsaldo: 0,
  extent: [],
  parts: [],
  schlaginfo: { basic: null, programs: null },
  cultures: [{ ...emptyCulture }, { ...emptyCulture }],
};

/** @type {import('vue').Ref<DataEntry>} */
export const entry = ref({ ...emptyEntry });

/** @type {import('vue').Ref<Array>} */
export const savedData = ref([]);

/** @type {import('vue').Ref<Number|null>} */
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
 * @returns {{ currentSaved: import('vue').Ref<Number>, dataWindow:import('vue').Ref<Number>, savedData: import('vue').Ref<Array> , emptyFertilization: Fertilization, emptyCulture: Culture, emptyEntry: DataEntry, entry: import('vue').Ref<Object> }}
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
