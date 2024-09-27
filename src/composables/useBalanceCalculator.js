import { entry } from './useDataEntries.js';
import { tableAttribut } from './useLookUps.js';

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
 * @type object
 */
const labels = {
  nmengehd: 'N-Menge aus Handelsdüngern ',
  nmengebw: 'N-Menge aus Bewässerung ',
  nmengesr: 'N-Menge aus organischen Sekundärrohstoffen',
  nmengewd: 'N-Menge aus Wirtschaftsdüngern',
  nvorfrucht: 'N-Vorfruchtwert   ',
  nmin: 'Nmin-Wert   ',
  nanrechenbar: 'Anrechenbarer Stickstoff  ',
  nentzug: 'N-Entzug   ',
  nbilanz: 'N-Bilanz   ',
  pmengehd: 'P-Menge aus Handelsdüngern ',
  pmengesr: 'P-Menge aus organischen Sekundärrohstoffen',
  pmengewd: 'P-Menge aus Wirtschaftsdüngern ',
  pduengung: 'P-Düngung   ',
  pentzug: 'P-Entzug   ',
  pbilanz: 'P-Bilanz   ',
  kmengehd: 'K-Mengen aus Handelsdüngern ',
  kmengesr: 'K-Menge aus organischen Sekundärrohstoffen',
  kmengewd: 'K-Menge aus Wirtschaftsdüngern ',
  kduengung: 'K-Düngung   ',
  kentzug: 'K-Entzug   ',
  kbilanz: 'K-Bilanz   ',
};

/** @type {Array<kulturbilanz>} */
let bilanz = [];
/** @type {Array<string>} */
let errors = [];

/**
 * @returns {Array<kulturbilanz>}
 */
function calculateBilanz() {
  bilanz = [];
  const retVal = [];
  for (let c = 0; c < entry.value.cultures.length; c++) {
    const current = { ...emptyKulturbilanz };
    retVal.push(current);
  }
  console.log(retVal);
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
  return { updateBilanz };
}
