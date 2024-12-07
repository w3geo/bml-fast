import { shallowRef } from 'vue';
import feldstücknutzungsarten from '../assets/data/feldstücknutzungsarten.json' with { type: 'json' };
import bodenartenbodenschwere from '../assets/data/bodenartenbodenschwere.json' with { type: 'json' };
import kulturen from '../assets/data/kulturen.json' with { type: 'json' };
import wirtschaftsdünger from '../assets/data/wirtschaftsdünger.json' with { type: 'json' };
import sekundärrohstoffe from '../assets/data/sekundärrohstoffe.json' with { type: 'json' };
import handelsdünger from '../assets/data/handelsdünger.json' with { type: 'json' };
import entzugstabelleWeizen from '../assets/data/entzugstabelle-weizen.json' with { type: 'json' };
import entzugstabelleBraugerste from '../assets/data/entzugstabelle-braugerste.json' with { type: 'json' };

const wrrl = [
  { value: '-', title: '-', code: 'Keine' },
  { value: 'A', title: 'A', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_niedrig' },
  { value: 'B', title: 'B', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel' },
  { value: 'C', title: 'C', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel_10' },
  { value: 'D', title: 'D', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_1' },
  { value: 'E', title: 'E', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_2' },
  { value: 'F', title: 'F', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_3' },
];

const kornfeuchteListe = [
  { title: 12, value: 12 },
  { title: 13, value: 13 },
  { title: 14, value: 14 },
  { title: 15, value: 15 },
  { title: 16, value: 16 },
];

const wrrl_tablecolumn = {
  A: 'WRRL Steiermark EL niedrig',
  B: 'WRRL Steiermark EL mittel -10%',
  C: 'WRRL Steiermark EL mittel',
  D: 'WRRL Steiermark EL hoch 1',
  E: 'WRRL Steiermark EL hoch 2',
  F: 'WRRL Steiermark EL hoch 3',
};

const proteinListe = {
  4: [
    { title: '11', value: 11 },
    { title: '11,5', value: 11.5 },
    { title: '12', value: 12 },
    { title: '12,5', value: 12.5 },
    { title: '13', value: 13 },
    { title: '13,5', value: 13.5 },
    { title: '14', value: 14 },
    { title: '14,5', value: 14.5 },
    { title: '15', value: 15 },
    { title: '15,5', value: 15.5 },
    { title: '16', value: 16 },
    { title: '16,5', value: 16.5 },
    { title: '17', value: 17 },
    { title: '17,5', value: 17.5 },
    { title: '18', value: 18 },
    { title: '18,5', value: 18.5 },
    { title: '19', value: 19 },
    { title: '19,5', value: 19.5 },
    { title: '20', value: 20 },
    { title: '20,5', value: 20.5 },
    { title: '21', value: 21 },
    { title: '21,5', value: 21.5 },
    { title: '22', value: 22 },
  ],
  5: [
    { title: '9', value: 9 },
    { title: '9,5', value: 9.5 },
    { title: '10', value: 10 },
    { title: '10,5', value: 10.5 },
    { title: '11', value: 11 },
    { title: '11,5', value: 11.5 },
    { title: '12', value: 12 },
    { title: '12,5', value: 12.5 },
    { title: '13', value: 13 },
    { title: '13,5', value: 13.5 },
    { title: '14', value: 14 },
    { title: '14,5', value: 14.5 },
    { title: '15', value: 15 },
    { title: '15,5', value: 15.5 },
    { title: '16', value: 16 },
  ],
};

const ertragsLagen = ['niedrig', 'mittel', 'hoch 1', 'hoch 2', 'hoch 3'];
const limitAckerzahl = ['niedrig', 'mittel'];

const yearItems = [];
{
  const thisYear = new Date().getFullYear();
  for (let y = thisYear + 1; y < thisYear + 5; y++) {
    yearItems.push(y);
  }
}

const ackerzahlItems = [
  { title: 'Größer/Gleich 30', value: 30 },
  { title: 'Kleiner 30', value: 29 },
];

const fertilizationTypes = [
  { title: 'Keine', value: '' },
  { title: 'Eigener Handelsdünger', value: 'eigene' },
  { title: 'Handelsdünger', value: 'handelsdünger' },
  { title: 'Sekundärrohstoffe', value: 'sekundärrohstoffe' },
  { title: 'Wirtschaftsdünger', value: 'wirtschaftsdünger' },
  { title: 'Bewässerung', value: 'bewässerung' },
];

const aussaatTypeFilter = {
  zwischenU: ['1.1.600', '1.1.610', '1.1.620'],
  zwischenG: ['1.1.630', '1.1.640', '1.1.650'],
};

const kulturenItems = {
  zwischen: [],
  alle: [],
};
for (let k = 0; k < kulturen.length; k++) {
  if (
    aussaatTypeFilter.zwischenU.includes(kulturen[k].ID) ||
    aussaatTypeFilter.zwischenG.includes(kulturen[k].ID)
  ) {
    kulturenItems.zwischen.push({ value: kulturen[k].ID, title: kulturen[k].Kultur });
  } else {
    kulturenItems.alle.push({ value: kulturen[k].ID, title: kulturen[k].Kultur });
    const alleFNA = kulturen[k].Feldstücknutzungsart.split(';');
    for (let f = 0; f < alleFNA.length; f++) {
      if (kulturenItems[alleFNA[f]]) {
        kulturenItems[alleFNA[f]].push({ value: kulturen[k].ID, title: kulturen[k].Kultur });
      } else {
        kulturenItems[alleFNA[f]] = [{ value: kulturen[k].ID, title: kulturen[k].Kultur }];
      }
    }
  }
}
for (let k in kulturenItems) {
  kulturenItems[k].splice(0, 0, { title: 'Keine', value: '' });
}

/**
 * @type {import('vue').ShallowRef<Object>}
 */
export const lookup = shallowRef({
  yearItems: yearItems,
  ackerzahlItems: ackerzahlItems,
  wrrl: wrrl,
  ertragsLagen: ertragsLagen,
  limitAckerzahl: limitAckerzahl,
  kulturenItems: kulturenItems,
  kornfeuchteListe: kornfeuchteListe,
  proteinListe: proteinListe,
  fertilizationTypes: fertilizationTypes,
  aussaatTypeFilter: aussaatTypeFilter,
  feldstücknutzungsarten,
  bodenartenbodenschwere,
  kulturen,
  wirtschaftsdünger,
  sekundärrohstoffe,
  handelsdünger,
  entzugstabelleWeizen,
  entzugstabelleBraugerste,
  wrrltablecolumn: wrrl_tablecolumn,
});

/**
 * @returns {*}
 */
export function tableAttribut(table, id, attrib) {
  let result = '';
  if (id && id != '') {
    const dataRow = lookup.value[table].find((k) => k.ID == id);
    result = dataRow && dataRow[attrib] ? dataRow[attrib] : '';
  }
  return result;
}

/**
 * @returns {{ lookup: Object, tableAttribut: function }}
 */
export function useLookup() {
  return { lookup, tableAttribut };
}
