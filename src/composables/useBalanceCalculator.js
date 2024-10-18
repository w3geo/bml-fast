import { entry } from './useDataEntries.js';
import { tableAttribut, lookup } from './useLookUps.js';

/**
 * @typedef {Object} kulturbilanz
 * @property {Array<string>} errors Fehlermeldungen
 * @property {number} duengeobergrenze Dünge-Obergrenze
 * @property {number} duengeobergrenzered Dünge-Obergrenze
 * @property {number} nsaldo N-Saldo
 * @property {number} vfwert Vorfruchtwert Vorfrucht
 * @property {number} vfwertzf Vorfruchtwert Zwischenfrucht
 * @property {number} nminman Manueller N-Min
 * @property {number} redfaktor Reduktionsfaktor
 * @property {number} nmengehd N-Menge aus Handelsdüngern
 * @property {number} nmengebw N-Menge aus Bewässerung
 * @property {number} nmengesr N-Menge aus organischen Sekundärrohstoffen
 * @property {number} nmengewd N-Menge aus Wirtschaftsdüngern
 * @property {number} nabzug N-Abzug von Düngeobergrenze
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
  errors: [],
  duengeobergrenze: 0,
  duengeobergrenzered: 0,
  nsaldo: 0,
  vfwert: 0,
  vfwertzf: 0,
  nminman: 0,
  redfaktor: 0,
  nmengehd: 0,
  nmengebw: 0,
  nmengesr: 0,
  nmengewd: 0,
  nabzug: 0,
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
  errors: { label: 'Fehler', print: false, bold: false, border: '' },
  duengeobergrenze: { label: 'Düngeobergrenze', print: false, bold: false, border: '' },
  duengeobergrenzered: {
    label: 'Düngeobergrenze reduziert',
    print: false,
    bold: false,
    border: '',
  },
  nsaldo: { label: 'N-Saldo', print: false, bold: false, border: '' },
  vfwert: { label: 'Vorfruchtwert Vorfrucht', print: false, bold: false, border: '' },
  vfwertzf: { label: 'Vorfruchtwert Zwischenfrucht', print: false, bold: false, border: '' },
  nminman: { label: 'Manueller N-Min', print: false, bold: false, border: '' },
  redfaktor: { label: 'Reduktionsfaktor', print: false, bold: false, border: '' },
  nmengehd: { label: 'N-Menge aus Handelsdüngern', print: false, bold: false, border: '' },
  nmengebw: { label: 'N-Menge aus Bewässerung', print: false, bold: false, border: '' },
  nmengesr: {
    label: 'N-Menge aus organischen Sekundärrohstoffen',
    print: false,
    bold: false,
    border: '',
  },
  nmengewd: { label: 'N-Menge aus Wirtschaftsdüngern', print: false, bold: false, border: '' },
  nabzug: { label: 'N-Abzug von Düngeobergrenze', print: true, bold: false, border: '' },
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

/** @type {Object} */
const reduktionsfaktor = { Trockengebiet: 0.8, Feuchtgebiet: 0.6 };

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

  // 3. P-Entzug , nur nach erreichter Ertragslage
  const ppostfix =
    entry.value.phosphor_gehaltsklasse === 'E' ? '' : ` ${ertragslage.split(' ')[0]}`;
  pEntzug = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    `Phosphor ${entry.value.phosphor_gehaltsklasse}${ppostfix}`,
  );

  // 4. K-Entzug , nur nach erreichter Ertragslage
  const kpostfix = entry.value.kalium_gehaltsklasse === 'E' ? '' : ` ${ertragslage.split(' ')[0]}`;
  kEntzug = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    `Phosphor ${entry.value.kalium_gehaltsklasse}${kpostfix}`,
  );

  return [nEntzug, pEntzug, kEntzug];
}

/**
 * @returns {Array<kulturbilanz>}
 */
function calculateBilanz(retVal) {
  const zfgenutzt = lookup.value.aussaatTypeFilter.zwischenG.includes(
    entry.value.cultures[0].kultur,
  );
  const zfungenutzt = lookup.value.aussaatTypeFilter.zwischenU.includes(
    entry.value.cultures[0].kultur,
  );
  const vfgemüse = tableAttribut('kulturen', entry.value.vorfrucht, 'Gemüsekultur') === 'x';

  for (let c = 0; c < entry.value.cultures.length; c++) {
    const current = { ...emptyKulturbilanz };

    // A ---------- DÜNGEOBERGRENZE --------------------------------------------------------------------
    if (c > 0) {
      let elkey = 'Düngeobergrenze EL ' + entry.value.cultures[c].ertragslage;
      if (entry.value.nitratrisikogebiet) {
        elkey += ' A5';
      }
      current.duengeobergrenze = tableAttribut('kulturen', entry.value.cultures[c].kultur, elkey);
      current.duengeobergrenzered = current.duengeobergrenze;
    }

    // B ---------- ANRECHNUNG AUS DÜNGUNG UND ENTZÜGE -------------------------------------------------

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
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].n;
        current.pmengesr +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].p;
        current.kmengesr +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].k;
      }
      // 3. Anteile Wirtschaftsdünger
      if (entry.value.cultures[c].duengung[d].typ === 'wirtschaftsdünger') {
        current.nmengewd +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].n;
        current.pmengewd +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].p;
        current.kmengewd +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].k;
      }
      // 4. Anteile Bewässerung
      if (entry.value.cultures[c].duengung[d].typ === 'bewässerung') {
        current.nmengebw +=
          (entry.value.cultures[c].duengung[d].menge / 100) *
          (entry.value.cultures[c].duengung[d].n / 4.43);
      }
    }
    // Düngungen und Bilanz
    current.nanrechenbar =
      current.nmengehd + current.nmengebw + current.nmengesr + current.nmengewd;
    current.pduengung = current.pmengehd + current.pmengesr + current.pmengewd;
    current.kduengung = current.kmengehd + current.kmengesr + current.kmengewd;

    current.nbilanz = current.nanrechenbar - current.nentzug;
    current.pbilanz = current.pduengung - current.pentzug;
    current.kbilanz = current.kduengung - current.kentzug;

    // C ---------- ABZÜGE VORFRUCHT AUF HAUPTFRUCHT 1 -------------------------------------------------

    // Nur relevant, wenn Vorfrucht + keine oder ungenutzte ZF + Hauptfrucht 1
    if (
      c === 1 &&
      entry.value.vorfrucht !== '' &&
      !zfgenutzt &&
      entry.value.cultures[c].kultur !== ''
    ) {
      const hfgemüse =
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Gemüsekultur') === 'x';

      // 1. N-Saldo
      if (
        entry.value.flaeche_grundwasserschutz > 0 &&
        entry.value.teilnahme_grundwasserschutz_acker &&
        entry.value.nsaldo > 0
      ) {
        current.nsaldo = entry.value.nsaldo;
        if (zfungenutzt) {
          current.nsaldo =
            entry.value.nsaldo * reduktionsfaktor[entry.value.gw_acker_gebietszuteilung];
        }
      }

      // 2. Vorfruchtwert
      const hfmanuell = entry.value.cultures[c].nmin;
      const redfaktor = reduktionsfaktor[entry.value.gw_acker_gebietszuteilung];
      const hftable = Number(
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'VFW | Nmin selbes Jahr'),
      );
      const vfnmin = Number(
        tableAttribut('kulturen', entry.value.vorfrucht, 'VFW | Nmin Folgejahr'),
      );
      const zfnmin =
        entry.value.cultures[0].kultur !== ''
          ? Number(
              tableAttribut('kulturen', entry.value.cultures[0].kultur, 'VFW | Nmin Folgejahr'),
            )
          : 0;

      if (
        vfgemüse &&
        hfgemüse &&
        entry.value.flaeche_grundwasserschutz > 0 &&
        entry.value.teilnahme_grundwasserschutz_acker
      ) {
        current.nabzug = zfungenutzt ? entry.value.nsaldo * redfaktor + zfnmin : entry.value.nsaldo;
      }

      if (
        !vfgemüse &&
        entry.value.flaeche_grundwasserschutz > 0 &&
        entry.value.teilnahme_grundwasserschutz_acker &&
        !zfgenutzt
      ) {
        if (hfgemüse && hfmanuell != hftable && entry.value.nsaldo > hfmanuell) {
          current.nabzug = entry.value.nsaldo * redfaktor + vfnmin + zfnmin;
        }
        if (!hfgemüse && entry.value.nsaldo > 0) {
          current.nabzug = entry.value.nsaldo * redfaktor + vfnmin + zfnmin;
        }
      }

      if (
        !vfgemüse &&
        entry.value.flaeche_grundwasserschutz > 0 &&
        entry.value.teilnahme_grundwasserschutz_acker &&
        zfgenutzt
      ) {
        if (hfgemüse && hfmanuell != hftable && entry.value.nsaldo > hfmanuell) {
          current.nabzug = entry.value.nsaldo * redfaktor + vfnmin + zfnmin;
        }
        if (!hfgemüse && entry.value.nsaldo > 0) {
          current.nabzug = entry.value.nsaldo * redfaktor + vfnmin + zfnmin;
        }
      }
    }

    // RÜCKGABEWERT
    retVal.push(current);
  }

  return retVal;
}

/**
 * @returns {{bilanz: Array<kulturbilanz>, errors: Array<string>}}}
 */
export function updateBilanz() {
  errors = [];
  bilanz = [];
  let stopperErrors = false;

  // Pflichtangaben
  if (entry.value.flaeche <= 0) {
    errors.push('Fehlende Flächenangabe für den Schlag');
  }
  console.log(entry.value.cultures);
  if (entry.value.cultures.length < 2) {
    errors.push(
      'Keine Kulturen spezifiziert. Es werden keine Düngeobergrenzen oder Bilanzen berechnet.',
    );
    stopperErrors = true;
  }

  // Kulturen
  for (let c = 0; c < entry.value.cultures.length; c++) {
    bilanz.push({ ...emptyKulturbilanz });
    if (entry.value.cultures[c].kultur != '') {
      if (
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'Düngeverbot' &&
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'keine Ertragserfassung'
      ) {
        if (entry.value.cultures[c].ertragslage === '') {
          errors.push(`${c}. Hauptfrucht: Erwartete Ertragslage nicht angegeben`);
          stopperErrors = true;
        }
        if (
          entry.value.cultures[c].ertragslageernte === '' &&
          !(entry.value.cultures[c].ernte > 0)
        ) {
          errors.push(`${c}. Hauptfrucht: Keine Angaben zur Ernte`);
          stopperErrors = true;
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
            stopperErrors = true;
          } else if (entry.value.cultures[c].duengung[d].menge <= 0) {
            if (c > 0) {
              errors.push(`${c}. Hauptfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            } else {
              errors.push(`Zwischenfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
            }
            stopperErrors = true;
          }
        }
      }
    } else {
      if (c > 0) {
        errors.push(`${c}. Hauptfrucht: Keine Kultur definiert`);
        stopperErrors = true;
      }
    }
  }

  bilanz = stopperErrors ? [] : calculateBilanz(bilanz);
  return { bilanz, errors };
}

export function useBalanceCalculator() {
  return { updateBilanz, outputConfig };
}
