import { entry } from './useDataEntries.js';
import { tableAttribut, lookup } from './useLookUps.js';

/**
 * @typedef {Object} kulturbilanz
 * @property {number} nmengehd N-Menge aus Handelsdüngern
 * @property {number} nmengebw N-Menge aus Bewässerung
 * @property {number} nmengesr N-Menge aus organischen Sekundärrohstoffen
 * @property {number} nmengewd N-Menge aus Wirtschaftsdüngern
 * @property {number} nvorfrucht N-Vorfruchtwert
 * @property {number} nmin Nmin-Wert
 * @property {number} nanrechenbar Anrechenbarer Stickstoff
 * @property {number} nentzug N-Entzug
 * @property {number} nbilanz N-Bilanz
 * @property {number} pmengehd P-Menge aus Handelsdüngern
 * @property {number} pmengesr P-Menge aus organischen Sekundärrohstoffen
 * @property {number} pmengewd P-Menge aus Wirtschaftsdüngern
 * @property {number} pduengung P-Düngung
 * @property {number} pentzug P-Entzug
 * @property {number} pbilanz P-Bilanz
 * @property {number} kmengehd K-Mengen aus Handelsdüngern
 * @property {number} kmengesr K-Menge aus organischen Sekundärrohstoffen
 * @property {number} kmengewd K-Menge aus Wirtschaftsdüngern
 * @property {number} kduengung K-Düngung
 * @property {number} kentzug K-Entzug
 * @property {number} kbilanz K-Bilanz
 */

/**
 * @type kulturbilanz
 */
const emptyKulturbilanz = {
  nmengehd: 0,
  nmengebw: 0,
  nmengesr: 0,
  nmengewd: 0,
  nvorfrucht: 0,
  nmin: 0,
  nanrechenbar: 0,
  nentzug: 0,
  nbilanz: 0,
  pmengehd: 0,
  pmengesr: 0,
  pmengewd: 0,
  pduengung: 0,
  pentzug: 0,
  pbilanz: 0,
  kmengehd: 0,
  kmengesr: 0,
  kmengewd: 0,
  kduengung: 0,
  kentzug: 0,
  kbilanz: 0,
};

/**
 * @type {Object<keyof kulturbilanz, Object>}
 */
export const outputConfig = {
  nmengehd: { label: 'N-Menge aus Handelsdüngern', print: false, bold: false, border: '' },
  nmengebw: { label: 'N-Menge aus Bewässerung', print: false, bold: false, border: '' },
  nmengesr: {
    label: 'N-Menge aus organischen Sekundärrohstoffen',
    print: false,
    bold: false,
    border: '',
  },
  nmengewd: { label: 'N-Menge aus Wirtschaftsdüngern', print: false, bold: false, border: '' },
  nvorfrucht: { label: 'N-Vorfruchtwert', print: true, bold: false, border: '' },
  nmin: { label: 'Nmin-Wert', print: true, bold: false, border: '' },
  nanrechenbar: { label: 'Anrechenbarer Stickstoff', print: true, bold: false, border: '' },
  nentzug: { label: 'N-Entzug', print: false, bold: false, border: '' },
  nbilanz: { label: 'N-Bilanz', print: true, bold: true, border: 'bottom' },
  pmengehd: { label: 'P-Menge aus Handelsdüngern', print: false, bold: false, border: '' },
  pmengesr: {
    label: 'P-Menge aus organischen Sekundärrohstoffen',
    print: false,
    bold: false,
    border: '',
  },
  pmengewd: { label: 'P-Menge aus Wirtschaftsdüngern', print: false, bold: false, border: '' },
  pduengung: { label: 'P-Düngung', print: true, bold: false, border: '' },
  pentzug: { label: 'P-Entzug', print: false, bold: false, border: '' },
  pbilanz: { label: 'P-Bilanz', print: true, bold: true, border: 'bottom' },
  kmengehd: { label: 'K-Mengen aus Handelsdüngern', print: false, bold: false, border: '' },
  kmengesr: {
    label: 'K-Menge aus organischen Sekundärrohstoffen',
    print: false,
    bold: false,
    border: '',
  },
  kmengewd: { label: 'K-Menge aus Wirtschaftsdüngern', print: false, bold: false, border: '' },
  kduengung: { label: 'K-Düngung', print: true, bold: false, border: '' },
  kentzug: { label: 'K-Entzug', print: false, bold: false, border: '' },
  kbilanz: { label: 'K-Bilanz', print: true, bold: true, border: '' },
};

/** @type {Array<kulturbilanz>} */
let bilanz = [];
/** @type {Array<string>} */
let errors = [];

/**
 * @param {number} idx
 * @returns {Array<number>}
 */
function calculateEntzug(idx) {
  let nEntzug = 0;
  let pEntzug = 0;
  let kEntzug = 0;
  const saldierung = Number(
    tableAttribut('kulturen', entry.value.cultures[idx].kultur, 'Saldierungsart'),
  );
  const erfassung = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    'Ertragserfassungsart',
  );
  if (erfassung === 'keine Ertragserfassung' || erfassung === 'Düngeverbot') {
    // KEIN ENTZUG
    return [0, 0, 0];
  }

  // 1. Ertragslage bestimmen
  let ertragslage = 'niedrig';
  // entweder aus Auswahl
  if (erfassung === 'EL Auswahl') {
    ertragslage = entry.value.cultures[idx].ertragslageernte;
  } else {
    // oder berechnen aus Ernte
    for (let e = 0; e < lookup.value.ertragsLagen.length; e++) {
      if (
        entry.value.cultures[idx].ernte >=
        tableAttribut(
          'kulturen',
          entry.value.cultures[idx].kultur,
          `EL ${lookup.value.ertragsLagen[e]} t / m3 ab`,
        )
      ) {
        ertragslage = lookup.value.ertragsLagen[e];
      }
    }
  }

  // 2. N-Entzug , unterschiedlich ermittelt nach Saldierungsart
  switch (saldierung) {
    case 1:
    case 2:
      nEntzug =
        entry.value.cultures[idx].ernte *
        tableAttribut(
          'kulturen',
          entry.value.cultures[idx].kultur,
          `Entzugsfaktor EL ${ertragslage}`,
        );
      break;
    case 3:
      nEntzug = tableAttribut(
        'kulturen',
        entry.value.cultures[idx].kultur,
        `Düngeobergrenze EL ${ertragslage}${entry.value.nitratrisikogebiet ? ' A5' : ''}`,
      );
      break;
    case 4:
      nEntzug =
        lookup.value.entzugstabelleWeizen[entry.value.cultures[idx].feuchte][
          entry.value.cultures[idx].protein
        ] * entry.value.cultures[idx].ernte;
      break;
    case 5:
      nEntzug =
        lookup.value.entzugstabelleBraugerste[entry.value.cultures[idx].feuchte][
          entry.value.cultures[idx].protein
        ] * entry.value.cultures[idx].ernte;
      break;
    case 6:
      if (
        entry.value.cultures[idx].ernte >
        tableAttribut('kulturen', entry.value.cultures[idx].kultur, 'EL hoch 3 t / m3 bis')
      ) {
        nEntzug =
          entry.value.cultures[idx].ernte *
          tableAttribut(
            'kulturen',
            entry.value.cultures[idx].kultur,
            'Entzugswert höher EL hoch 3 für Körnermais / CCM',
          );
      } else {
        nEntzug =
          entry.value.cultures[idx].ernte *
          tableAttribut(
            'kulturen',
            entry.value.cultures[idx].kultur,
            `Entzugsfaktor EL ${ertragslage}`,
          );
      }
      break;
    case 7:
      if (entry.value.nitratrisikogebiet) {
        nEntzug = tableAttribut(
          'kulturen',
          entry.value.cultures[idx].kultur,
          `Düngeobergrenze EL ${ertragslage} A5`,
        );
      } else {
        nEntzug = tableAttribut(
          'kulturen',
          entry.value.cultures[idx].kultur,
          `Düngeobergrenze EL ${ertragslage}`,
        );
      }
      break;
  }

  // 3. P-Entzug , unterschiedlich ermittelt nach Saldierungsart

  // 4. K-Entzug , unterschiedlich ermittelt nach Saldierungsart

  return [nEntzug, pEntzug, kEntzug];
}

/**
 * @returns {Array<kulturbilanz>}
 */
function calculateBilanz() {
  bilanz = [];
  const retVal = [];
  for (let c = 0; c < entry.value.cultures.length; c++) {
    const current = { ...emptyKulturbilanz };
    [current.nentzug, current.pentzug, current.kentzug] = calculateEntzug(c);
    for (let d = 0; d < entry.value.cultures[c].duengung.length; d++) {
      // Düngungen iterieren
      // 1. Anteile Handelsdünger
      if (
        entry.value.cultures[c].duengung[d].typ === 'handelsdünger' ||
        entry.value.cultures[c].duengung[d].typ === 'eigene'
      ) {
        current.nmengehd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].n / 100);
        current.pmengehd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].p / 100);
        current.kmengehd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].k / 100);
      }
      // 2. Anteile Sekundärrohstofe
      if (entry.value.cultures[c].duengung[d].typ === 'sekundärrohstoffe') {
        current.nmengesr +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].n / 100);
        current.pmengesr +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].p / 100);
        current.kmengesr +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].k / 100);
      }
      // 3. Anteile Wirtschaftsdünger
      if (entry.value.cultures[c].duengung[d].typ === 'wirtschaftsdünger') {
        current.nmengewd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].n / 100);
        current.pmengewd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].p / 100);
        current.kmengewd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].k / 100);
      }
    }
    // Düngungen und Bilanz
    current.nanrechenbar = current.nmengehd + current.nmengesr + current.nmengewd;
    current.pduengung = current.pmengehd + current.pmengesr + current.pmengewd;
    current.kduengung = current.kmengehd + current.kmengesr + current.kmengewd;

    current.nbilanz = current.nanrechenbar - current.nentzug;
    current.pbilanz = current.pduengung - current.pentzug;
    current.kbilanz = current.kduengung - current.kentzug;

    retVal.push(current);
  }

  return retVal;
}

/**
 * @returns {{bilanz: Array<kulturbilanz>, errors: Array<string>}}}
 */
export function updateBilanz() {
  errors = [];
  let anyErrors = false;

  // Pflichtangaben
  if (entry.value.flaeche <= 0) {
    errors.push('Fehlende Flächenangabe für den Schlag');
  }

  // Kulturen
  for (let c = 0; c < entry.value.cultures.length; c++) {
    if (entry.value.cultures[c].kultur != '') {
      if (
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'Düngeverbot' &&
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'keine Ertragserfassung'
      ) {
        if (entry.value.cultures[c].ertragslage === '') {
          errors.push(`${c}. Hauptfrucht: Erwartete Ertragslage nicht angegeben`);
          anyErrors = true;
        }
        if (
          entry.value.cultures[c].ertragslageernte === '' &&
          !(entry.value.cultures[c].ernte > 0)
        ) {
          errors.push(`${c}. Hauptfrucht: Keine Angaben zur Ernte`);
          anyErrors = true;
        }
      }
      // Düngung
      if (entry.value.cultures[c].duengung.length > 0) {
        for (let d = 0; d < entry.value.cultures[c].duengung.length; d++) {
          if (entry.value.cultures[c].duengung[d].typ === '') {
            if (c > 0) {
              errors.push(`${c}. Hauptfrucht, ${d + 1}. Düngung: Keine Angaben zum Typ`);
            } else {
              errors.push(`Zwischenfrucht, ${d + 1}. Düngung: Keine Angaben zum Typ`);
            }
            anyErrors = true;
          } else if (entry.value.cultures[c].duengung[d].menge <= 0) {
            if (c > 0) {
              errors.push(`${c}. Hauptfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            } else {
              errors.push(`Zwischenfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            }
            anyErrors = true;
          }
        }
      }
    } else {
      if (c > 0) {
        errors.push(`${c}. Hauptfrucht: Keine Kultur definiert`);
        anyErrors = true;
      }
    }
  }

  bilanz = anyErrors ? [] : calculateBilanz();
  return { bilanz, errors };
}

export function useBalanceCalculator() {
  return { updateBilanz, outputConfig };
}
