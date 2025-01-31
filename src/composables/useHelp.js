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
  form_feldstuecksnummer: {
    title: 'Feldstück/Name',
    text: 'Eine frei wählbare Bezeichnung für das Feldstück.',
  },
  form_schlagnummer: {
    title: 'Feldstück/Nummer',
    text: 'Eine frei wählbare Nummer für das Feldstück - nur Eingabe ganzer Zahlen möglich.',
  },
  form_flaechennutzungsart: {
    title: 'Schlagnummer',
    text: 'Eine frei wählbare Nummerierung (Zahlen/Buchstaben) für den Schlag.',
  },
  form_flaeche: {
    title: 'Flächennutzungsart',
    text: 'Die Flächennutzungsart für den Schlag gemäß Eintrag im Inspire Agrar-Atlas. NUR LESBAR.',
  },
  form_imGrundwasserschutz: {
    title: 'Fläche im Grundwasserschutz',
    text: 'Lage des Schlags im Grundwasserschutz gemäß Eintrag im Inspire Agrar-Atlas. NUR LESBAR.',
  },
  form_teilnahme_grundwasserschutz_acker: {
    title: 'Teilnahme am vorbgeugenden Grundwasserschutz',
    text: 'Angabe, ob der Schlag Teil eines vorbeugenden Grundwasserschutz-Programms ist.',
  },
  form_nsaldo: {
    title: 'N-Saldo',
    text: 'Nitrat-Saldo aus der Vorjahres-Fruchtfolge (Angabe in kg N pro Hektar).',
  },
  form_gw_acker_gebietszuteilung: {
    title: 'Grundwasserschutz Gebietszuteilung',
    text: 'Gebietszuteilung laut Grundwasserchutz-Acker. Vorgabe aus dem Inspire Agrar-Atlas, kann jedoch geändert werden.',
  },
  form_imNitratrisikogebiet: {
    title: 'Nitratrisikogebiet',
    text: 'Angabe, ob Schlag im Nitratrisikogebiet liegt.',
  },
  form_wrrl_duengeklasse: {
    title: 'Düngeklasse WRRL',
    text: 'Düngeklasse A-F gemäß Wasserrahmenrichtlinie. Vorgabe aus dem Inspire Agrar-Atlas, kann jedoch geändert werden.',
  },
  form_phosphor_gehaltsklasse: {
    title: 'Phosphor-Gehaltsklasse',
    text: 'Vorgabe aus dem Inspire Agrar-Atlas, kann jedoch geändert werden.',
  },
  form_kalium_gehaltsklasse: {
    title: 'Kalium-Gehaltsklasse',
    text: 'Vorgabe aus dem Inspire Agrar-Atlas, kann jedoch geändert werden.',
  },
  form_ackerzahl: {
    title: 'Ackerzahl',
    text: 'Die Ackerzahl des Schlags. Für die Nährstoffbilanz ist nur wesentlich, ob diese größer/gleich oder kleiner 30 ist.',
  },
  form_bodenart: {
    title: 'Bodenart',
    text: 'Die überwiegende Bodenart des Schlags. Vorgabe aus dem Inspire Agrar-Atlas, kann jedoch geändert werden.',
  },
  form_jahr: {
    title: 'Wirtschaftsjahr',
    text: 'Wirtschaftsjahr, für welches die Eingaben erfolgen.',
  },
  form_vorfrucht: {
    title: 'Vorfrucht',
    text: 'Wenn vorhanden, Vorfrucht. Im Allgemeinen letzte Frucht des vorangegangenen Wirtschaftsjahres.',
  },
  zwischenfrucht: {
    title: 'Zwischenfrucht',
    text: 'Wenn vorhanden, Spezifikationen für genutzte/ungenutzte Zwischenfrucht mit oder ohne Legum. Für genützte Zwischenfrüchte kann auch die Düngung erfasst werden.',
  },
  form_zwischenfrucht_kultur: {
    title: 'Kultur / Zwischenfrucht',
    text: 'Die Kultur der Zwischenfrucht. Nur für genutzte Zwischenfrüchte kann auch die Düngung erfasst werden. Ein Klick auf das X-Symbol löscht den Eintrag und setzt das Feld auf den Wert "Keine" zurück.',
  },
  form_ertragslage: {
    title: 'Erwartete Ertragslage',
    text: 'Die für die jeweilige Frucht erwartete Ertragslage in Klassen (unterschiedlich je nach Frucht).',
  },
  form_nmin: {
    title: 'Min. Stickstoff',
    text: 'Wert für den zum Anbauzeitpunkt im Boden vorhandenen mineralischen Stickstoff. Wird durch Berechnung vorgegeben (kann auch 0 sein). Kann verändert werden ("manuller NMin-Wert").',
  },
  form_nminvorgabe: {
    title: 'NMin Vorgabe',
    text: 'Vorgabe durch Berechnung für den NMin-Wert. Nur als Referenz angegeben, kann nicht verändert werden (statt dessen kann das NMin Feld verändert werden).',
  },
  duengungen: {
    title: 'Düngungen',
    text: 'In dieser Sektion können alle für eine Frucht ausgebrachten Nährstoffe ("Düngungen") spezifiziert werden.',
  },
  form_duengung_typ: { title: 'Düngung / Typ', text: 'Auswahl des Dünger-Typs.' },
  form_duengung_id: {
    title: 'Dünger / Auswahl',
    text: 'Wird als Typ "Handelsdünger", "Wirtschaftsdünger" oder "Sekundärrohstofe" angegeben, muss in diesem Feld die Bezeichnung / der Name gewählt werden.',
  },
  form_duengung_menge: {
    title: 'Dünger / Menge',
    text: 'Ausbringungs-Menge für den gewählten Dünger. Je nach Dünger Angabe in Tonnen bzw. Kubikmenter, Kilogramm oder Liter, immer pro Hektar.',
  },
  form_duengung_n: {
    title: 'Dünger / Stickstoff',
    text: 'Anteil Stickstoff im gewählten Dünger. Bei Handelsdüngern wird dieser Wert automatisch befüllt. Der Wert ist entweder in Prozent oder in kg pro Tonne/Kubikmeter anzugeben.',
  },
  form_duengung_p: {
    title: 'Dünger / Phosphor',
    text: 'Anteil Phosphor im gewählten Dünger. Bei Handelsdüngern wird dieser Wert automatisch befüllt. Der Wert ist entweder in Prozent oder in kg pro Tonne/Kubikmeter anzugeben.',
  },
  form_duengung_k: {
    title: 'Dünger / Kalium',
    text: 'Anteil Kalium im gewählten Dünger. Bei Handelsdüngern wird dieser Wert automatisch befüllt. Der Wert ist entweder in Prozent oder in kg pro Tonne/Kubikmeter anzugeben.',
  },
  ernteertrag: {
    title: 'Ertrag der Ernte',
    text: 'Hier ist der Ertrag der Ernte anzugeben. Bei ausgewählten Getreidesorte ist zudem die Kornfeuchte und der Proteingehalt zu spezifizieren.',
  },
  form_ertragslageernte: { title: 'Ernte', text: 'Geerntete Menge in Form einer Ertragsklasse.' },
  form_ernte: { title: 'Ernte', text: 'Geerntete Menge in Tonnen.' },
  form_feuchte: {
    title: 'Kornfeuchte',
    text: 'Gemessene Kornfeuchte (Wert zwischen 12 und 16 möglich).',
  },
  form_protein: {
    title: 'Proteingehalt',
    text: 'Gemessener Proteingehalt (Wert zwischen 9 und 16 möglich).',
  },
  fertilizerbalance: {
    title: 'Nährstoffbilanz',
    text: 'In diesem Fenster werden die errechnenten Nährstoffbilanzen für die einzelnen Zwischen- und Hauptfrüchte angezeigt, sowie eine Bilanz über den ganzen Schlag.',
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
