import { shallowRef } from 'vue';

/**
 * @typedef helpEntry
 * @property {string} title
 * @property {string} text
 */

const allHelp = {
  importexport: {
    title: 'Import / Export',
    text: 'In diesem Fenster finden Sie zwei Buttons. Der obere exportiert alle aktuellen Daten in eine Datei, der untere liest eine geeignete, zuvor exportierte Datei ein und ersetzt die aktuellen Daten durch deren Inhalt',
  },
  entrylist: {
    title: 'Eintragsliste',
    text: 'In diesem Fenster finden sie alle angelegten Datensätze. Sie können mit dem grauen Marker einen Eintrag lokalisieren, mit dem orangen Bleistiftsymbol bearbeiten oder mit dem roten Löschen-Symbol entfernen. Mit dem Button "Neuer Eintrag" legen Sie einen neuen Datensatz an, dazu bitte einen Schlag auswählen.',
  },
  datawindow: {
    title: 'Eintragsliste',
    text: 'In diesem Fenster sehen Sie die Basis-Daten des gewählten Schlags. Sie können diese teilweise ändern / ergänzen. In der zweiten Sektion spezifizieren Sie die Fruchtfolge und die ausgebrachten Nährstoffe. Für mehr Hilfe bitte das Icon im jeweiligen Eingabefeld anklicken!',
  },
  form_feldstuecksname: {
    title: 'Feldstücksname',
    text: 'Geben Sie hier einen frei wählbaren Namen für das zugehörige Feldstück ein',
  },
  form_feldstuecksnummer: { title: '', text: '' },
  form_schlagnummer: { title: '', text: '' },
  form_flaechennutzungsart: { title: '', text: '' },
  form_flaeche: { title: '', text: '' },
  form_imGrundwasserschutz: { title: '', text: '' },
  form_teilnahme_grundwasserschutz_acker: { title: '', text: '' },
  form_nsaldo: { title: '', text: '' },
  form_gw_acker_gebietszuteilung: { title: '', text: '' },
  form_imNitratrisikogebiet: { title: '', text: '' },
  form_wrrl_duengeklasse: { title: '', text: '' },
  form_phosphor_gehaltsklasse: { title: '', text: '' },
  form_kalium_gehaltsklasse: { title: '', text: '' },
  form_ackerzahl: { title: '', text: '' },
  form_bodenart: { title: '', text: '' },
  form_jahr: { title: '', text: '' },
  form_vorfrucht: { title: '', text: '' },
  zwischenfrucht: { title: '', text: '' },
  form_zwischenfrucht_kultur: { title: '', text: '' },
  form_ertragslage: { title: '', text: '' },
  form_nmin: { title: '', text: '' },
  form_nminvorgabe: { title: '', text: '' },
  duengungen: { title: '', text: '' },
  form_duengung_typ: { title: '', text: '' },
  form_duengung_id: { title: '', text: '' },
  form_duengung_menge: { title: '', text: '' },
  form_duengung_n: { title: '', text: '' },
  form_duengung_p: { title: '', text: '' },
  form_duengung_k: { title: '', text: '' },
  ernteertrag: { title: '', text: '' },
  form_ertragslageernte: { title: '', text: '' },
  form_ernte: { title: '', text: '' },
  form_feuchte: { title: '', text: '' },
  form_protein: { title: '', text: '' },
};

/**
 * @type {import('vue').ShallowRef<helpEntry>}
 */
export const currentHelp = shallowRef({ title: '', text: '' });

/**
 * @type {import('vue').ShallowRef<Boolean>}
 */
export const helpToggle = shallowRef(false);

/**
 * @param {string} key
 */
export function showHelp(key) {
  if (allHelp[key]) {
    currentHelp.value = { title: allHelp[key].title, text: allHelp[key].text };
  } else {
    currentHelp.value = {
      title: `Key '${key}'`,
      text: 'Keine Hilfe für diesen Help-Key verfügbar',
    };
  }
  helpToggle.value = true;
}

/**
 * @returns {{ showHelp: function , helpToggle: import('vue').ShallowRef<Boolean>, currentHelp: import('vue').ShallowRef<helpEntry> }}
 */
export function useHelp() {
  return { showHelp, helpToggle, currentHelp };
}
