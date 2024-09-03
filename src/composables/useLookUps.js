import { shallowRef } from 'vue';
import feldstücknutzungsarten from '../assets/data/feldstücknutzungsarten.json';
import bodenartenbodenschwere from '../assets/data/bodenartenbodenschwere.json';
import kulturen from '../assets/data/kulturen.json';
import wirtschaftsdünger from '../assets/data/wirtschaftsdünger.json';
import sekundärrohstoffe from '../assets/data/sekundärrohstoffe.json';
import handelsdünger from '../assets/data/handelsdünger.json';
import entzugstabelleWeizen from '../assets/data/entzugstabelle-weizen.json';
import entzugstabelleBraugerste from '../assets/data/entzugstabelle-braugerste.json';

const wrrl = [
  { value: '-', title: '-', code: 'Keine' },
  { value: 'A', title: 'A', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_niedrig' },
  { value: 'B', title: 'B', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel' },
  { value: 'C', title: 'C', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel_10' },
  { value: 'D', title: 'D', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_1' },
  { value: 'E', title: 'E', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_2' },
  { value: 'F', title: 'F', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_3' },
];

const ertragsLagen = ['niedrig', 'mittel', 'hoch 1', 'hoch 2', 'hoch 3'];
const limitAckerzahl = ['niedrig', 'mittel'];

/*
EL niedrig Bereich
EL niedrig t / m3 ab
Entzugsfaktor EL niedrig
Düngeobergrenze EL mittel
Düngeobergenze EL mittel A5
EL mittel Bereich 
EL mittel t / m3 je ab
Entzugsfaktor EL mittel
Düngeobergrenze EL hoch 1
Düngeobergrenze EL hoch 1 A5
EL hoch 1 Bereich
EL hoch 1 t / m3 ab
Entzugsfaktor EL hoch 1
Düngeobergrenze EL hoch 2
Düngeobergenze EL hoch 2 A5
EL hoch 2 Bereich
EL hoch 2 t / m3 ab
Entzugsfaktor EL hoch 2
Düngeobergrenze EL hoch 3
Düngeobergenze EL hoch 3 A5
EL hoch 3 t / m3 Bereich
EL hoch 3 t / m3 ab
EL hoch 3 t / m3 bis


EL niedrig
EL mittel
EL hoch 1
EL hoch 2
EL hoch 3
*/

const yearItems = [];
{
  const thisYear = new Date().getFullYear();
  for (let y = thisYear - 2; y < thisYear + 2; y++) {
    yearItems.push(y);
  }
}

const fertilizationTypes = [
  { title: 'Keine', value: '' },
  { title: 'Eigener Handelsdünger', value: 'eigene' },
  { title: 'Handelsdünger', value: 'handelsdünger' },
  { title: 'Sekundärrohstoffe', value: 'sekundärrohstoffe' },
  { title: 'Wirtschaftsdünger', value: 'wirtschaftsdünger' },
];

const aussaatTypes = {
  0: [
    { title: 'Keine', value: '' },
    { title: 'Genutzt / Ungenutzt', value: 'zwischen' },
  ],
  1: [
    { title: 'Keine', value: '' },
    { title: 'Ungenutzte Zwischenfrucht', value: 'zwischenU' },
    { title: 'Genutzte Zwischenfrucht', value: 'zwischenG' },
    { title: 'Hauptfrucht', value: 'haupt' },
  ],
};

const aussaatTypeFilter = {
  zwischenU: ['1.1.600', '1.1.610', '1.1.620'],
  zwischenG: ['1.1.630', '1.1.640', '1.1.650'],
};

const kulturenItems = {
  zwischen: [],
};
for (let k = 0; k < kulturen.length; k++) {
  if (aussaatTypeFilter.zwischenU.includes(kulturen[k].ID)) {
    kulturenItems.zwischen.push({ value: kulturen[k].ID, title: kulturen[k].Kultur });
  } else if (aussaatTypeFilter.zwischenG.includes(kulturen[k].ID)) {
    kulturenItems.zwischen.push({ value: kulturen[k].ID, title: kulturen[k].Kultur });
  } else {
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
  wrrl: wrrl,
  ertragsLagen: ertragsLagen,
  limitAckerzahl: limitAckerzahl,
  kulturenItems: kulturenItems,
  fertilizationTypes: fertilizationTypes,
  aussaatTypes: aussaatTypes,
  aussaatTypeFilter: aussaatTypeFilter,
  feldstücknutzungsarten,
  bodenartenbodenschwere,
  kulturen,
  wirtschaftsdünger,
  sekundärrohstoffe,
  handelsdünger,
  entzugstabelleWeizen,
  entzugstabelleBraugerste,
});

/**
 * @returns {{ lookup: import('vue').ShallowRef<Object> }}
 */
export function useLookup() {
  return { lookup };
}
