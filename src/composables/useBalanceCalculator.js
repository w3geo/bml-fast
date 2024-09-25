import { tableAttribut } from './useLookUps.js';

/**
 * @typedef {Object} Bilanzeintrag
 */

/** @type {Array<Bilanzeintrag>} */
let bilanz = [];
/** @type {Array<string>} */
let errors = [];
/** @type {Array<import('./useDataEntries.js').Culture>} */
let calcCultures = [];

/**
 * @returns {Array<Bilanzeintrag>}
 */
function calculateBilanz() {
  const retVal = [];
  for (let c = 0; c < calcCultures.length; c++) {
    console.log(calcCultures[c]);
  }
  return retVal;
}

/**
 * @param {import('./useDataEntries.js').DataEntry} entry
 * @returns {{bilanz: Array<Bilanzeintrag>, errors: Array<string>}}}
 */
export function updateBilanz(entry) {
  errors = [];
  calcCultures = [];
  let anyErrors = false;

  // Pflichtangaben
  if (entry.flaeche <= 0) {
    errors.push('Fehlende Flächenangabe für den Schlag');
  }

  // Kulturen
  for (let c = 0; c < entry.cultures.length; c++) {
    if (entry.cultures[c].kultur != '') {
      if (
        tableAttribut('kulturen', entry.cultures[c].kultur, 'Ertragserfassungsart') !==
          'Düngeverbot' &&
        tableAttribut('kulturen', entry.cultures[c].kultur, 'Ertragserfassungsart') !==
          'keine Ertragserfassung'
      ) {
        if (entry.cultures[c].ertragslage === '') {
          errors.push(`${c}. Hauptfrucht: Erwartete Ertragslage nicht angegeben`);
          anyErrors = true;
        }
        if (
          entry.cultures[c].ertragslageernte === '' &&
          (entry.cultures[c].ernte === 0 || entry.cultures[c].ernte.toString() === '')
        ) {
          errors.push(`${c}. Hauptfrucht: Keine Angaben zur Ernte`);
          anyErrors = true;
        }
      }
      // Düngung
      if (entry.cultures[c].duengung.length > 0) {
        for (let d = 0; d < entry.cultures[c].duengung.length; d++) {
          if (entry.cultures[c].duengung[d].typ === '') {
            if (c > 0) {
              errors.push(`${c}. Hauptfrucht, ${d + 1}. Düngung: Keine Angaben zum Typ`);
            } else {
              errors.push(`Zwischenfrucht, ${d + 1}. Düngung: Keine Angaben zum Typ`);
            }
            anyErrors = true;
          } else if (entry.cultures[c].duengung[d].menge <= 0) {
            if (c > 0) {
              errors.push(`${c}. Hauptfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            } else {
              errors.push(`Zwischenfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            }
            anyErrors = true;
          }
        }
      }

      // Everything OK?
      if (!anyErrors) {
        calcCultures.push(entry.cultures[c]);
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
