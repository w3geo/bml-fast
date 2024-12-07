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
 * @property {number} nabzug N-Abzug von Düngeobergrenze
 * @property {number} nanrechenbar Anrechenbarer Stickstoff
 * @property {number} nentzug N-Entzug
 * @property {number} nbilanz N-Bilanz
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

/**
 * @type {Object<keyof kulturbilanz, Object>}
 */
export const outputConfig = {
  errorsOG: { label: 'Fehler OG', print: false, bold: false, border: '' },
  errorsBI: { label: 'Fehler BI', print: false, bold: false, border: '' },
  duengeobergrenze: { label: 'Düngeobergrenze (brutto)', print: true, bold: false, border: '' },
  duengeobergrenzered: {
    label: 'Düngeobergrenze (netto))',
    print: true,
    bold: true,
    border: '',
  },
  nsaldo: { label: 'N-Saldo', print: false, bold: false, border: '' },
  vfwert: { label: 'Vorfruchtwert Vorfrucht', print: false, bold: false, border: '' },
  vfwertzf: { label: 'Vorfruchtwert Zwischenfrucht', print: false, bold: false, border: '' },
  nminman: { label: 'Manueller N-Min', print: false, bold: false, border: '' },
  redfaktor: { label: 'Reduktionsfaktor', print: false, bold: false, border: '' },
  nmengehd: { label: 'N aus Handelsdüngern', print: false, bold: false, border: '' },
  nmengebw: { label: 'N aus Bewässerung', print: false, bold: false, border: '' },
  nmengesr: {
    label: 'N aus org. Sekundärrohstoffen',
    print: false,
    bold: false,
    border: '',
  },
  nmengewd: { label: 'N aus Wirtschaftsdüngern', print: false, bold: false, border: '' },
  nabzug: { label: 'N-Abzug von Düngeobergrenze', print: false, bold: false, border: '' },
  nanrechenbar: { label: 'Anrechenbarer Stickstoff', print: true, bold: false, border: '' },
  nentzug: { label: 'N-Entzug', print: false, bold: false, border: '' },
  nbilanz: { label: 'N-Bilanz', print: true, bold: true, border: 'bottom' },
  pbedarf: { label: 'P-Bedarf', print: true, bold: false, border: '' },
  pmengehd: { label: 'P aus Handelsdüngern', print: false, bold: false, border: '' },
  pmengesr: {
    label: 'P aus org. Sekundärrohstoffen',
    print: false,
    bold: false,
    border: '',
  },
  pmengewd: { label: 'P aus Wirtschaftsdüngern', print: false, bold: false, border: '' },
  pduengung: { label: 'P-Düngung', print: true, bold: false, border: '' },
  pentzug: { label: 'P-Entzug', print: false, bold: false, border: '' },
  pbilanz: { label: 'P-Bilanz', print: true, bold: true, border: 'bottom' },
  kbedarf: { label: 'K-Bedarf', print: true, bold: false, border: '' },
  kmengehd: { label: 'K aus Handelsdüngern', print: false, bold: false, border: '' },
  kmengesr: {
    label: 'K aus org. Sekundärrohstoffen',
    print: false,
    bold: false,
    border: '',
  },
  kmengewd: { label: 'K aus Wirtschaftsdüngern', print: false, bold: false, border: '' },
  kduengung: { label: 'K-Düngung', print: true, bold: false, border: '' },
  kentzug: { label: 'K-Entzug', print: false, bold: false, border: '' },
  kbilanz: { label: 'K-Bilanz', print: true, bold: true, border: '' },
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
        0,
        0,
      ];
    }
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
 * @returns {Array<number>}
 */

function calculateBilanz(retVal) {
  let dogSumme = 0;
  let dogRedSumme = 0;

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
        retVal[c].duengeobergrenze =
          wrrlCompare < retVal[c].duengeobergrenze ? wrrlCompare : retVal[c].duengeobergrenze;
      }

      retVal[c].duengeobergrenzered = retVal[c].duengeobergrenze;
      dogSumme += retVal[c].duengeobergrenze;
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
        if (entry.value.flaeche_grundwasserschutz > 0 && hfgemüse && retVal[c].nsaldo <= vfnmin) {
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
        (vfAusnahme === 'Grünland' && hfAusnahme === 'Grünland')
      ) {
        retVal[c].vfwert = 0;
      }
    }

    // F ---------- ANRECHNUNG NSALDO FÜR ALLE ANDEREN FÄLLE AUF HAUPTFRUCHT 1 ----------------------------
    // Nur relevant, wenn keine VF, keine oder ungenutzte ZF + Hauptfrucht 1, bzw. Korrektur NMIN ODER SALDO
    if (c === 1 && entry.value.vorfrucht === '' && entry.value.cultures[c].kultur !== '') {
      retVal[c].vfwert = zfnmin;

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
              retVal[c].nsaldo = retVal[c - 1].nbilanz * redfaktor;
              retVal[c].vfwert = 0;
            }
          } else {
            if (retVal[c - 1].nbilanz > 20) {
              retVal[c].nsaldo = retVal[c - 1].nbilanz * redfaktor;
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

      if (entry.value.flaeche_grundwasserschutz === 0 && !hf2gemüse) {
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

    retVal[c].pduengung =
      Number(retVal[c].pmengehd) + Number(retVal[c].pmengesr) + Number(retVal[c].pmengewd);
    retVal[c].kduengung =
      Number(retVal[c].kmengehd) + Number(retVal[c].kmengesr) + Number(retVal[c].kmengewd);

    // Sonderfall ungenutzte ZF und HF1
    if (c === 1 && zfungenutzt) {
      retVal[1].nanrechenbar += retVal[0].nanrechenbar;
      retVal[1].pduengung += retVal[0].pduengung;
      retVal[1].kduengung += retVal[0].kduengung;
    }

    retVal[c].nbilanz = retVal[c].nanrechenbar - Number(retVal[c].nentzug);
    retVal[c].pbilanz = retVal[c].pduengung - Number(retVal[c].pentzug);
    retVal[c].kbilanz = retVal[c].kduengung - Number(retVal[c].kentzug);

    retVal[c].duengeobergrenzered =
      retVal[c].duengeobergrenze -
      retVal[c].nsaldo -
      retVal[c].vfwert -
      retVal[c].vfwertzf -
      retVal[c].nminman;

    dogRedSumme += retVal[c].duengeobergrenzered;
  }
  return [dogSumme, dogRedSumme];
}

/**
 * @returns {{duengeobergrenze: number, duengeobergrenzered: number, bilanz: Array<kulturbilanz>, errors: Array<string>, redmarked: Array<string>}}
 */
export function updateBilanz() {
  const errors = [];
  const redmarked = [];
  let bilanz = [];
  let duengeobergrenze = 0;
  let duengeobergrenzered = 0;

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

  [duengeobergrenze, duengeobergrenzered] = calculateBilanz(bilanz);
  return { duengeobergrenze, duengeobergrenzered, bilanz, errors, redmarked };
}

export function useBalanceCalculator() {
  return { updateBilanz, outputConfig };
}
