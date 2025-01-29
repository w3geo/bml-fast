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
  console.log(key, allHelp);
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
