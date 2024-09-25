import { tableAttribut } from './useLookUps.js';

let bilanz = [];
let errors = [];
let calcCultures = [];

/**
 * returns Array
 */
function calculateBilanz() {
  console.log('calc', calcCultures);
  return [];
}

/**
 * returns Array
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
          (parseFloat(entry.cultures[c].ernte) === 0 || entry.cultures[c].ernte === '')
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
  return [bilanz, errors];
}

/**
 * @returns {{ updateBilanz: function }}
 */
export function useBalanceCalculator() {
  return { updateBilanz };
}
