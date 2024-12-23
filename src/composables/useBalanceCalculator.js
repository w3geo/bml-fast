import { ref } from 'vue';
import { entry } from './useDataEntries.js';
import { tableAttribut, lookup } from './useLookUps.js';

/**
 * @typedef {Object} kulturbilanz
 * @property {Array<string>} errorsOG Fehlermeldungen Obergrenze
 * @property {Array<string>} errorsBI Fehlermeldungen Bilanz
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
 * @property {number} nabzug N-Abzug von Düngeobergrenze (n-Düngung);
 * @property {number} nanrechenbar Anrechenbarer Stickstoff
 * @property {number} nentzug N-Entzug
 * @property {number} nbilanz N-Bilanz
 * @property {number} nsaldoff N-Saldo für Folgefrucht
 * @property {number} pbedarf P-Bedarf der Kultur
 * @property {number} pmengehd P-Menge aus Handelsdüngern
 * @property {number} pmengesr P-Menge aus organischen Sekundärrohstoffen
 * @property {number} pmengewd P-Menge aus Wirtschaftsdüngern
 * @property {number} pduengung P-Düngung
 * @property {number} pentzug P-Entzug
 * @property {number} pbilanz P-Bilanz
 * @property {number} kbedarf K-Bedarf der Kultur
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
  errorsOG: [],
  errorsBI: [],
  duengeobergrenze: 0,
  nsaldo: 0,
  vfwert: 0,
  vfwertzf: 0,
  nminman: 0,
  duengeobergrenzered: 0,
  redfaktor: 0,
  nmengehd: 0,
  nmengebw: 0,
  nmengesr: 0,
  nmengewd: 0,
  nabzug: 0,
  nanrechenbar: 0,
  nentzug: 0,
  nbilanz: 0,
  nsaldoff: 0,
  pbedarf: 0,
  pmengehd: 0,
  pmengesr: 0,
  pmengewd: 0,
  pduengung: 0,
  pentzug: 0,
  pbilanz: 0,
  kbedarf: 0,
  kmengehd: 0,
  kmengesr: 0,
  kmengewd: 0,
  kduengung: 0,
  kentzug: 0,
  kbilanz: 0,
};

/** @type {import('vue').Ref<Array>} */
export const currentBilanz = ref([
  JSON.parse(JSON.stringify(emptyKulturbilanz)),
  JSON.parse(JSON.stringify(emptyKulturbilanz)),
]);

/**
 * @type {Object<keyof kulturbilanz, Object>}
 */
export const outputConfig = {
  errorsOG: {
    header: '',
    unit: '',
    labelshort: '',
    label: 'Fehler OG',
    printnotzero: false,
    print: false,
    bold: false,
    border: '',
  },
  errorsBI: {
    header: '',
    unit: '',
    labelshort: '',
    label: 'Fehler BI',
    printnotzero: false,
    print: false,
    bold: false,
    border: '',
  },
  duengeobergrenze: {
    header: 'Stickstoff',
    unit: 'kg N/ha',
    labelshort: 'Düngeobergrenze',
    label: 'Düngeobergrenze',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'bottom',
  },
  nsaldo: {
    header: '',
    unit: '',
    labelshort: 'N-Saldo',
    label: 'Stickstoffsaldo',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  vfwert: {
    header: '',
    unit: '',
    labelshort: 'Vorfruchtwert - Vorfrucht',
    label: 'Vorfruchtwert aus der Vorfrucht',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  vfwertzf: {
    header: '',
    unit: '',
    labelshort: 'Vorfruchtwert - Zwischenfrucht',
    label: 'Vorfruchtwert aus der Zwischenfrucht',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  nminman: {
    header: '',
    unit: '',
    labelshort: 'NMin gemessen',
    label: 'NMin gemessen',
    printnotzero: false,
    print: true,
    bold: false,
    border: '',
  },
  duengeobergrenzered: {
    labelshort: 'max. N-Düngung',
    label: 'maximal mögliche N-Düngung',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'topbottom',
  },
  redfaktor: {
    header: '',
    unit: '',
    labelshort: '',
    label: 'Reduktionsfaktor',
    printnotzero: false,
    print: false,
    bold: false,
    border: '',
  },
  nmengehd: {
    header: '',
    unit: '',
    labelshort: 'N aus Handelsdüngern',
    label: 'Stickstoff aus Handelsdüngern',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  nmengebw: {
    header: '',
    unit: '',
    labelshort: 'Stickstoff aus Bewässerung',
    label: 'Stickstoff aus Bewässerung',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  nmengesr: {
    labelshort: 'N aus org. Sekundärrohstoffen',
    label: 'Stickstoff aus org. Sekundärrohstoffen',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  nmengewd: {
    header: '',
    unit: '',
    labelshort: 'N aus Wirtschaftsdüngern',
    label: 'Stickstoff aus Wirtschaftsdüngern',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  nabzug: {
    header: '',
    unit: '',
    labelshort: 'Summe N-Düngung',
    label: 'Stickstoff aus aktiver Düngung',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'top',
  },
  nanrechenbar: {
    labelshort: 'Anzurechnender Stickstoff',
    label: 'Anzurechnender Stickstoff',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'top',
  },
  nentzug: {
    labelshort: 'N-Entzug',
    label: 'Stickstoff-Entzug mit dem Erntegut',
    printnotzero: false,
    print: true,
    bold: true,
    border: '',
  },
  nbilanz: {
    header: '',
    unit: '',
    labelshort: 'N-Bilanz',
    label: 'Stickstoff-Bilanz',
    printnotzero: false,
    print: true,
    bold: true,
    border: '',
  },
  nsaldoff: {
    header: '',
    unit: '',
    labelshort: 'N-Saldo Folgekultur',
    label: 'N-Saldo für Folgekultur',
    printnotzero: true,
    print: true,
    bold: true,
    border: '',
  },

  pbedarf: {
    header: 'Phosphor',
    unit: 'kg P₂O₅/ha',
    labelshort: 'P-Bedarf gem. Ertraglage',
    label: 'Phosphor-Bedarf gemäß Ertraglage',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'bottom',
  },
  pmengehd: {
    header: '',
    unit: '',
    labelshort: 'P aus Handelsdüngern',
    label: 'Phosphor aus Handelsdüngern',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  pmengesr: {
    labelshort: 'P aus org. Sekundärrohstoffen',
    label: 'Phosphor aus org. Sekundärrohstoffen',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  pmengewd: {
    header: '',
    unit: '',
    labelshort: 'P aus Wirtschaftsdüngern',
    label: 'Phosphor aus Wirtschaftsdüngern',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  pduengung: {
    header: '',
    unit: '',
    labelshort: 'P-Düngung',
    label: 'Phosphor-Düngung',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'top',
  },
  pentzug: {
    labelshort: 'P-Entzug',
    label: 'Phosphor-Entzug',
    printnotzero: false,
    print: true,
    bold: true,
    border: '',
  },
  pbilanz: {
    header: '',
    unit: '',
    labelshort: 'P-Bilanz',
    label: 'Phosphor-Bilanz',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'bottom',
  },
  kbedarf: {
    header: 'Kalium',
    unit: 'kg K₂O/ha',
    labelshort: 'K-Bedarf',
    label: 'Kalium-Bedarf gem. Ertragslage',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'bottom',
  },
  kmengehd: {
    header: '',
    unit: '',
    labelshort: 'K aus Handelsdüngern',
    label: 'Kalium aus Handelsdüngern',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  kmengesr: {
    labelshort: 'K aus org. Sekundärrohstoffen',
    label: 'Kalium aus org. Sekundärrohstoffen',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  kmengewd: {
    header: '',
    unit: '',
    labelshort: 'K aus Wirtschaftsdüngern',
    label: 'Kalium aus Wirtschaftsdüngern',
    printnotzero: true,
    print: true,
    bold: false,
    border: '',
  },
  kduengung: {
    header: '',
    unit: '',
    labelshort: 'K-Düngung',
    label: 'Kalium-Düngung',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'top',
  },
  kentzug: {
    header: '',
    unit: '',
    labelshort: 'K-Entzug',
    label: 'Kalium-Entzug',
    printnotzero: false,
    print: true,
    bold: true,
    border: '',
  },
  kbilanz: {
    header: '',
    unit: '',
    labelshort: 'K-Bilanz',
    label: 'Kalium-Bilanz',
    printnotzero: false,
    print: true,
    bold: true,
    border: 'bottom',
  },
};

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
  let pBedarf = 0;
  let kBedarf = 0;

  const saldierung = Number(
    tableAttribut('kulturen', entry.value.cultures[idx].kultur, 'Saldierungsart'),
  );
  const erfassung = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    'Ertragserfassungsart',
  );
  if (erfassung === 'keine Ertragserfassung' || erfassung === 'Düngeverbot') {
    if (lookup.value.aussaatTypeFilter.zwischenG.includes(entry.value.cultures[idx].kultur)) {
      return [
        Number(
          tableAttribut(
            'kulturen',
            entry.value.cultures[idx].kultur,
            `Düngeobergrenze EL mittel${entry.value.nitratrisikogebiet ? ' A5' : ''}`,
          ),
        ),
        Number(
          tableAttribut(
            'kulturen',
            entry.value.cultures[idx].kultur,
            `Phosphor ${entry.value.phosphor_gehaltsklasse} mittel`,
          ),
        ),
        Number(
          tableAttribut(
            'kulturen',
            entry.value.cultures[idx].kultur,
            `Phosphor ${entry.value.phosphor_gehaltsklasse} mittel`,
          ),
        ),
        Number(
          tableAttribut(
            'kulturen',
            entry.value.cultures[idx].kultur,
            `Kalium ${entry.value.kalium_gehaltsklasse} mittel`,
          ),
        ),
        Number(
          tableAttribut(
            'kulturen',
            entry.value.cultures[idx].kultur,
            `Kalium ${entry.value.phosphor_gehaltsklasse} mittel`,
          ),
        ),
      ];
    }
    // KEIN ENTZUG
    return [0, 0, 0, 0, 0];
  }

  // 1. Ertragslage bestimmen
  let ertragslage = 'niedrig';
  // entweder aus Auswahl
  if (erfassung === 'EL Auswahl') {
    ertragslage = entry.value.cultures[idx].ertragslageernte;
  } else {
    // oder berechnen aus Ernte
    for (let e = 0; e < lookup.value.ertragsLagen.length; e++) {
      const aktELage = tableAttribut(
        'kulturen',
        entry.value.cultures[idx].kultur,
        `EL ${lookup.value.ertragsLagen[e]} t / m3 ab`,
      );
      if (aktELage != '' && entry.value.cultures[idx].ernte >= Number(aktELage)) {
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

  // 3a. P-Bedarf nach erwarteter Ertragslage
  //  entry.value.cultures[idx].ertragslage
  const eppostfix =
    entry.value.phosphor_gehaltsklasse === 'E'
      ? ''
      : ` ${entry.value.cultures[idx].ertragslage.split(' ')[0]}`;
  pBedarf = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    `Phosphor ${entry.value.phosphor_gehaltsklasse}${eppostfix}`,
  );

  // 3b. P-Entzug , nur nach erreichter Ertragslage
  const ppostfix =
    entry.value.phosphor_gehaltsklasse === 'E' ? '' : ` ${ertragslage.split(' ')[0]}`;
  pEntzug = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    `Phosphor ${entry.value.phosphor_gehaltsklasse}${ppostfix}`,
  );

  // 4a. K-Bedarf nach erwarteter Ertragslage
  //  entry.value.cultures[idx].ertragslage

  const ekpostfix =
    entry.value.phosphor_gehaltsklasse === 'E'
      ? ''
      : ` ${entry.value.cultures[idx].ertragslage.split(' ')[0]}`;
  kBedarf = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    `Kalium ${entry.value.phosphor_gehaltsklasse}${ekpostfix}`,
  );

  // 4b. K-Entzug , nur nach erreichter Ertragslage
  const kpostfix = entry.value.kalium_gehaltsklasse === 'E' ? '' : ` ${ertragslage.split(' ')[0]}`;
  kEntzug = tableAttribut(
    'kulturen',
    entry.value.cultures[idx].kultur,
    `Kalium ${entry.value.kalium_gehaltsklasse}${kpostfix}`,
  );
  return [Number(nEntzug), Number(pBedarf), Number(pEntzug), Number(kBedarf), Number(kEntzug)];
}

/**
 * @param {Array<kulturbilanz>} retVal
 * @returns {Object}
 */

function calculateBilanz(retVal) {
  const summen = {
    dogSumme: 0,
    dogRedSumme: 0,
    nanrechenbarSumme: 0,
    nentzugSumme: 0,
    pduengungSumme: 0,
    pentzugSumme: 0,
    kduengungSumme: 0,
    kentzugSumme: 0,
    nsaldoSumme: 0,
  };

  const zfgenutzt = lookup.value.aussaatTypeFilter.zwischenG.includes(
    entry.value.cultures[0].kultur,
  );
  const zfungenutzt = lookup.value.aussaatTypeFilter.zwischenU.includes(
    entry.value.cultures[0].kultur,
  );
  const vfgemüse = tableAttribut('kulturen', entry.value.vorfrucht, 'Gemüsekultur') === 'x';
  const redfaktor = reduktionsfaktor[entry.value.gw_acker_gebietszuteilung];
  let vfnmin = Number(tableAttribut('kulturen', entry.value.vorfrucht, 'VFW | Nmin Folgejahr'));
  const zfnmin =
    entry.value.cultures[0].kultur !== ''
      ? Number(tableAttribut('kulturen', entry.value.cultures[0].kultur, 'VFW | Nmin selbes Jahr'))
      : 0;

  for (let c = 0; c < entry.value.cultures.length; c++) {
    const hfgemüse =
      tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Gemüsekultur') === 'x';
    const hfmanuell =
      Number(entry.value.cultures[c].nmin) !== Number(entry.value.cultures[c].nminvorgabe);

    retVal[c].nminman = Number(entry.value.cultures[c].nmin);

    // A ---------- DÜNGEOBERGRENZE / NMIN -------------------------------------------------------------
    if (entry.value.cultures[c].kultur !== '') {
      // I Düngeobergrenze
      let elkey =
        'Düngeobergrenze EL ' + (c === 0 ? 'mittel' : entry.value.cultures[c].ertragslage);
      if (entry.value.nitratrisikogebiet) {
        elkey += ' A5';
      }
      retVal[c].duengeobergrenze = Number(
        tableAttribut('kulturen', entry.value.cultures[c].kultur, elkey),
      );

      if (entry.value.wrrl_duengeklasse !== '-') {
        const wrrlCompare = Number(
          tableAttribut(
            'kulturen',
            entry.value.cultures[c].kultur,
            lookup.value.wrrltablecolumn[entry.value.wrrl_duengeklasse],
          ),
        );
        if (wrrlCompare && wrrlCompare > 0) {
          retVal[c].duengeobergrenze =
            wrrlCompare < retVal[c].duengeobergrenze ? wrrlCompare : retVal[c].duengeobergrenze;
        }
      }

      retVal[c].duengeobergrenzered = retVal[c].duengeobergrenze;
      summen.dogSumme += retVal[c].duengeobergrenze;
    }

    // B ---------- ANRECHNUNG AUS DÜNGUNG UND ENTZÜGE -------------------------------------------------

    [
      retVal[c].nentzug,
      retVal[c].pbedarf,
      retVal[c].pentzug,
      retVal[c].kbedarf,
      retVal[c].kentzug,
    ] = calculateEntzug(c);
    for (let d = 0; d < entry.value.cultures[c].duengung.length; d++) {
      // Düngungen iterieren
      // 1. Anteile Handelsdünger
      if (
        entry.value.cultures[c].duengung[d].typ === 'handelsdünger' ||
        entry.value.cultures[c].duengung[d].typ === 'eigene'
      ) {
        retVal[c].nmengehd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].n / 100);
        retVal[c].pmengehd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].p / 100);
        retVal[c].kmengehd +=
          entry.value.cultures[c].duengung[d].menge * (entry.value.cultures[c].duengung[d].k / 100);
      }
      // 2. Anteile Sekundärrohstofe
      if (entry.value.cultures[c].duengung[d].typ === 'sekundärrohstoffe') {
        retVal[c].nmengesr +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].n;
        retVal[c].pmengesr +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].p;
        retVal[c].kmengesr +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].k;
      }
      // 3. Anteile Wirtschaftsdünger
      if (entry.value.cultures[c].duengung[d].typ === 'wirtschaftsdünger') {
        retVal[c].nmengewd +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].n;
        retVal[c].pmengewd +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].p;
        retVal[c].kmengewd +=
          entry.value.cultures[c].duengung[d].menge * entry.value.cultures[c].duengung[d].k;
      }
      // 4. Anteile Bewässerung
      if (entry.value.cultures[c].duengung[d].typ === 'bewässerung') {
        retVal[c].nmengebw +=
          (entry.value.cultures[c].duengung[d].menge / 100) *
          (entry.value.cultures[c].duengung[d].n / 4.43);
      }
    }

    // C ---------- ANRECHNUNG ZWISCHENFRUCHT GENUTZT VON VORFRUCHT ------------------------------------------------
    // Nur relevant, wenn genutzte ZF + Hauptfrucht 1
    if (c === 0 && zfgenutzt && entry.value.cultures[c].kultur !== '') {
      if (entry.value.vorfrucht !== '') {
        retVal[c].vfwert = vfnmin;
      }
      if (entry.value.nsaldo > 0) {
        retVal[c].nsaldo = entry.value.nsaldo;
      }
    }

    // D ---------- ANRECHNUNG ZWISCHENFRUCHT GENUTZT AUF HAUPTFRUCHT 1 --------------------------------------------
    // Nur relevant, wenn genutzte ZF + Hauptfrucht 1
    if (c === 1 && zfgenutzt && entry.value.cultures[c].kultur !== '') {
      retVal[c].vfwertzf = zfnmin;
      if (retVal[0].nbilanz > 20) {
        retVal[c].nsaldo = retVal[0].nbilanz * redfaktor;
      }
    }

    // E ---------- ANRECHNUNG HAUPTFRUCHT 1 VON VORFRUCHT UND ZWISCHENFRUCHT --------------------------------------

    // Nur relevant, wenn Vorfrucht + keine oder ungenutzte ZF + Hauptfrucht 1
    if (
      c === 1 &&
      entry.value.vorfrucht !== '' &&
      !zfgenutzt &&
      entry.value.cultures[c].kultur !== ''
    ) {
      // 1. N-Saldo
      if (
        entry.value.flaeche_grundwasserschutz > 0 &&
        entry.value.teilnahme_grundwasserschutz_acker &&
        entry.value.nsaldo > 0
      ) {
        retVal[c].nsaldo = entry.value.nsaldo;
        if (zfungenutzt) {
          retVal[c].nsaldo = entry.value.nsaldo * redfaktor;
        }
        if (vfgemüse && !zfungenutzt && !zfgenutzt) {
          if (retVal[c].nsaldo > retVal[c].nminman) {
            retVal[c].nminman = 0;
          } else {
            retVal[c].nsaldo = 0;
          }
        }

        if (hfmanuell && vfgemüse && zfungenutzt && retVal[c].nsaldo > retVal[c].nminman) {
          retVal[c].nminman = 0;
        }
      }
      // 2. Vorfruchtwert der Vorfrucht
      if (
        (vfgemüse && hfgemüse && !zfungenutzt && !zfgenutzt && !hfmanuell) ||
        (vfgemüse && !hfgemüse && !zfgenutzt && !hfmanuell) ||
        (!vfgemüse && !zfgenutzt)
      ) {
        if (
          entry.value.flaeche_grundwasserschutz > 0 &&
          vfgemüse &&
          hfgemüse &&
          retVal[c].nsaldo <= vfnmin
        ) {
          retVal[c].vfwert = vfnmin;
          retVal[c].nminman = 0;
          retVal[c].nsaldo = 0;
        }
        if (!vfgemüse) {
          retVal[c].vfwert = vfnmin;
        }
        if (!hfgemüse) {
          retVal[c].vfwert = vfnmin;
          retVal[c].nminman = 0;
        }
      }

      // Ungenutzte ZF
      if (vfgemüse && hfgemüse && zfungenutzt) {
        if (!hfmanuell && retVal[c].nsaldo < vfnmin) {
          retVal[c].vfwert = vfnmin;
          retVal[c].nminman = 0;
          retVal[c].nsaldo = 0;
        }
        if (hfmanuell && retVal[c].nsaldo <= retVal[c].nminman) {
          retVal[c].vfwert = 0;
          retVal[c].nsaldo = 0;
        }
        if (!hfmanuell && retVal[c].nsaldo > retVal[c].nminman) {
          retVal[c].vfwert = 0;
          retVal[c].nminman = 0;
        }
      }

      // 3. Vorfruchtwert der Zwischenfrucht
      if (zfungenutzt) {
        retVal[c].vfwertzf = zfnmin;
      }

      // 4. Ausnahmen Vorfruchtwirkung
      const vfAusnahme = tableAttribut(
        'kulturen',
        entry.value.vorfrucht,
        'Ausnahme Vorfruchtwirkung',
      );
      const hfAusnahme = tableAttribut(
        'kulturen',
        entry.value.cultures[c].kultur,
        'Ausnahme Vorfruchtwirkung',
      );
      if (
        (vfAusnahme === 'Ackerfutter' && hfAusnahme === 'Ackerfutter') ||
        (vfAusnahme === 'Ackerfutter' && hfAusnahme === 'Grünland') ||
        (vfAusnahme === 'Grünland' && hfAusnahme === 'Grünland')
      ) {
        retVal[c].vfwert = 0;
      }
    }

    // F ---------- ANRECHNUNG NSALDO FÜR ALLE ANDEREN FÄLLE AUF HAUPTFRUCHT 1 ----------------------------
    // Nur relevant, wenn keine VF, keine oder ungenutzte ZF + Hauptfrucht 1, bzw. Korrektur NMIN ODER SALDO
    if (c === 1 && entry.value.vorfrucht === '' && entry.value.cultures[c].kultur !== '') {
      retVal[c].vfwertzf = zfnmin;

      if (!zfgenutzt && entry.value.nsaldo > 0) {
        retVal[c].nsaldo = zfungenutzt ? entry.value.nsaldo * redfaktor : entry.value.nsaldo;
      }
      if (retVal[c].nsaldo <= retVal[c].nminman) {
        retVal[c].nsaldo = 0;
      } else {
        retVal[c].nminman = 0;
      }
    }

    // G ---------- ANRECHNUNG HAUPTFRUCH N AUF HAUPTFRUCHT N+1 --------------------------------------------
    if (
      c > 1 &&
      entry.value.cultures[c].kultur !== '' &&
      entry.value.cultures[c - 1].kultur !== ''
    ) {
      retVal[c].nminman = 0; // Wird hier neu berechnet

      const hf1gemüse =
        tableAttribut('kulturen', entry.value.cultures[c - 1].kultur, 'Gemüsekultur') === 'x';
      const hf2gemüse =
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Gemüsekultur') === 'x';
      const hf1nmin =
        entry.value.cultures[c - 1].kultur !== ''
          ? Number(
              tableAttribut(
                'kulturen',
                entry.value.cultures[c - 1].kultur,
                'VFW | Nmin selbes Jahr',
              ),
            )
          : 0;

      const hf2manuell =
        Number(entry.value.cultures[c].nmin) !== Number(entry.value.cultures[c].nminvorgabe);
      const hf2manuellnmin = Number(entry.value.cultures[c].nmin);

      // N-Saldo
      if (
        entry.value.flaeche_grundwasserschutz > 0 &&
        entry.value.teilnahme_grundwasserschutz_acker
      ) {
        if (retVal[c - 1].nbilanz > 20) {
          if (hf1gemüse && hf2gemüse) {
            if (
              (hf2manuell && retVal[c - 1].nbilanz * redfaktor > hf2manuellnmin) ||
              (!hf2manuell && retVal[c - 1].nbilanz * redfaktor > hf1nmin)
            ) {
              const maxBilanz = Math.min(retVal[c - 1].nbilanz, 100);
              retVal[c].nsaldo = maxBilanz * redfaktor;
              retVal[c].vfwert = 0;
            }
          } else {
            if (retVal[c - 1].nbilanz > 20) {
              const maxBilanz = Math.min(retVal[c - 1].nbilanz, 100);
              retVal[c].nsaldo = maxBilanz * redfaktor;
            }
          }
        }
      }

      // NMIN Manuell
      if (hf2manuell) {
        retVal[c].nminman = hf2manuellnmin;
        if (
          entry.value.flaeche_grundwasserschutz > 0 &&
          entry.value.teilnahme_grundwasserschutz_acker &&
          hf1gemüse &&
          hf2gemüse &&
          retVal[c - 1].nbilanz * redfaktor > hf2manuellnmin
        ) {
          retVal[c].nminman = 0;
        }
      }

      // VFW aus HF1
      retVal[c].vfwert = hf1nmin;
      if (
        entry.value.flaeche_grundwasserschutz > 0 &&
        entry.value.teilnahme_grundwasserschutz_acker &&
        hf1gemüse &&
        hf2gemüse
      ) {
        if (hf2manuell || retVal[c].nsaldo > 0) {
          retVal[c].vfwert = 0;
        }
      }

      if (
        entry.value.flaeche_grundwasserschutz > 0 &&
        !entry.value.teilnahme_grundwasserschutz_acker &&
        hf2manuell
      ) {
        retVal[c].vfwert = 0;
      }

      if (entry.value.flaeche_grundwasserschutz === 0 && hf2manuell && hf1gemüse) {
        retVal[c].vfwert = 0;
      }
    }

    // Bewässerung unter 10 nicht berücksichtigen
    if (Number(retVal[c].nmengebw) < 10) {
      retVal[c].nmengebw = 0;
    }

    // Düngungen und Bilanz
    retVal[c].nanrechenbar =
      Number(retVal[c].nmengehd) +
      Number(retVal[c].nmengebw) +
      Number(retVal[c].nmengesr) +
      Number(retVal[c].nmengewd) +
      Number(retVal[c].nsaldo) +
      Number(retVal[c].vfwert) +
      Number(retVal[c].vfwertzf) +
      Number(retVal[c].nminman);

    retVal[c].nabzug = Number(
      (
        Number(retVal[c].nmengehd) +
        Number(retVal[c].nmengebw) +
        Number(retVal[c].nmengesr) +
        Number(retVal[c].nmengewd)
      ).toFixed(4),
    );

    retVal[c].pduengung = Number(
      (
        Number(retVal[c].pmengehd) +
        Number(retVal[c].pmengesr) +
        Number(retVal[c].pmengewd)
      ).toFixed(4),
    );
    retVal[c].kduengung = Number(
      (
        Number(retVal[c].kmengehd) +
        Number(retVal[c].kmengesr) +
        Number(retVal[c].kmengewd)
      ).toFixed(4),
    );

    // Sonderfall ungenutzte ZF und HF1
    if (c === 1 && zfungenutzt) {
      retVal[1].nanrechenbar += retVal[0].nanrechenbar;
      retVal[1].pduengung += retVal[0].pduengung;
      retVal[1].kduengung += retVal[0].kduengung;
    }

    retVal[c].nbilanz = retVal[c].nanrechenbar - Number(retVal[c].nentzug);
    retVal[c].pbilanz = retVal[c].pduengung - Number(retVal[c].pentzug);
    retVal[c].kbilanz = retVal[c].kduengung - Number(retVal[c].kentzug);

    // N-Saldo der Folgefrucht
    if (
      entry.value.flaeche_grundwasserschutz > 0 &&
      entry.value.teilnahme_grundwasserschutz_acker &&
      retVal[c].nbilanz > 20
    ) {
      const maxBilanz = Math.min(retVal[c].nbilanz, 100);
      retVal[c].nsaldoff = maxBilanz * redfaktor;
    }

    retVal[c].duengeobergrenzered = Math.max(
      0,
      retVal[c].duengeobergrenze -
        retVal[c].nsaldo -
        retVal[c].vfwert -
        retVal[c].vfwertzf -
        retVal[c].nminman,
    );

    summen.dogRedSumme += retVal[c].duengeobergrenzered;

    summen.nanrechenbarSumme += retVal[c].nanrechenbar;
    summen.nentzugSumme += retVal[c].nentzug;
    summen.pduengungSumme += retVal[c].pduengung;
    summen.pentzugSumme += retVal[c].pentzug;
    summen.kduengungSumme += retVal[c].kduengung;
    summen.kentzugSumme += retVal[c].kentzug;
    summen.nsaldoSumme += retVal[c].nsaldo;
  }
  return summen;
}

/**
 * @returns {{summen: Object, bilanz: Array<kulturbilanz>, errors: Array<string>, redmarked: Array<string>}}
 */
export function updateBilanz() {
  const errors = [];
  const redmarked = [];
  let bilanz = [];
  let summen = {};

  // Pflichtangaben
  if (entry.value.flaeche <= 0) {
    errors.push('Fehlende Flächenangabe für den Schlag');
  }
  // Kulturen
  let ccounter = 0;
  for (let c = 0; c < entry.value.cultures.length; c++) {
    bilanz.push(JSON.parse(JSON.stringify(emptyKulturbilanz)));
    const bct = bilanz.length - 1;

    if (entry.value.cultures[c].kultur != '') {
      ccounter++;
      if (
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'Düngeverbot' &&
        tableAttribut('kulturen', entry.value.cultures[c].kultur, 'Ertragserfassungsart') !==
          'keine Ertragserfassung'
      ) {
        if (entry.value.cultures[c].ertragslage === '') {
          bilanz[bct].errorsOG.push(`Erwartete Ertragslage nicht angegeben`);
          if (errors.length === 0) {
            errors.push(
              'Unvollständige Angaben bei mind. einer Kultur - es kann keine Gesamt-Düngeobergrenze berechnet werden.',
            );
          }
        }
        if (
          entry.value.cultures[c].ertragslageernte === '' &&
          !(entry.value.cultures[c].ernte > 0)
        ) {
          bilanz[c].errorsBI.push(`Keine Angaben zur Ernte`);
        }
      }
      // Düngung
      if (entry.value.cultures[c].duengung.length > 0) {
        for (let d = 0; d < entry.value.cultures[c].duengung.length; d++) {
          if (entry.value.cultures[c].duengung[d].typ === '') {
            if (c > 0) {
              bilanz[c].errorsBI.push(`${d + 1}. Düngung: Keine Angaben zum Typ`);
              redmarked.push('nanrechenbar', 'nbilanz', 'pbilanz', 'kbilanz');
            } else {
              bilanz[c].errorsBI.push(`Zwischenfrucht, ${d + 1}. Düngung: Keine Angaben zum Typ`);
              redmarked.push('nanrechenbar', 'nbilanz', 'pbilanz', 'kbilanz');
            }
          } else if (entry.value.cultures[c].duengung[d].menge <= 0) {
            if (c > 0) {
              bilanz[c].errorsBI.push(`${d + 1}. Düngung: Fehlende Mengenangabe`);
              redmarked.push('nanrechenbar', 'nbilanz', 'pbilanz', 'kbilanz');
            } else {
              bilanz[c].errorsBI.push(`Zwischenfrucht, ${d + 1}. Düngung: Fehlende Mengenangabe`);
              redmarked.push('nanrechenbar', 'nbilanz', 'pbilanz', 'kbilanz');
            }
          }
        }
      }
    }
  }

  if (ccounter == 0) {
    errors.push(
      'Keine Kulturen spezifiziert. Es werden keine Düngeobergrenzen oder Bilanzen berechnet.',
    );
  }

  summen = calculateBilanz(bilanz);
  currentBilanz.value = bilanz;
  return { summen, bilanz, errors, redmarked };
}

export function useBalanceCalculator() {
  return { updateBilanz, outputConfig, currentBilanz };
}
