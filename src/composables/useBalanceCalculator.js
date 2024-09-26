import { entry } from './useDataEntries.js';
import { tableAttribut } from './useLookUps.js';

/**
 * @typedef {Object} kulturbilanz
 * @property {number} N-Menge aus Handelsdüngern
 * @property {number} N-Menge aus Bewässerung
 * @property {number} N-Menge aus organischen Sekundärrohstoffen
 * @property {number} N-Menge aus Wirtschaftsdüngern
 * @property {number} N-Vorfruchtwert
 * @property {number} Nmin-Wert
 * @property {number} Anrechenbarer Stickstoff
 * @property {number} N-Entzug
 * @property {number} N-Bilanz
 * @property {number} P-Mengen aus Handelsdüngern
 * @property {number} P-Menge aus organischen Sekundärrohstoffen
 * @property {number} P-Menge aus Wirtschaftsdüngern
 * @property {number} P-Düngung
 * @property {number} P-Entzug
 * @property {number} P-Bilanz
 * @property {number} K-Mengen aus Handelsdüngern
 * @property {number} K-Menge aus organischen Sekundärrohstoffen
 * @property {number} K-Menge aus Wirtschaftsdüngern
 * @property {number} K-Düngung
 * @property {number} K-Entzug
 * @property {number} K-Bilanz
 */

const emptyKulturbilanz = {
  'N-Menge aus Handelsdüngern': 0,
  'N-Menge aus Bewässerung': 0,
  'N-Menge aus organischen Sekundärrohstoffen': 0,
  'N-Menge aus Wirtschaftsdüngern': 0,
  'N-Vorfruchtwert': 0,
  'Nmin-Wert': 0,
  'Anrechenbarer Stickstoff': 0,
  'N-Entzug': 0,
  'N-Bilanz': 0,
  'P-Mengen aus Handelsdüngern': 0,
  'P-Menge aus organischen Sekundärrohstoffen': 0,
  'P-Menge aus Wirtschaftsdüngern': 0,
  'P-Düngung': 0,
  'P-Entzug': 0,
  'P-Bilanz': 0,
  'K-Mengen aus Handelsdüngern': 0,
  'K-Menge aus organischen Sekundärrohstoffen': 0,
  'K-Menge aus Wirtschaftsdüngern': 0,
  'K-Düngung': 0,
  'K-Entzug': 0,
  'K-Bilanz': 0,
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
  return { updateBilanz };
}
