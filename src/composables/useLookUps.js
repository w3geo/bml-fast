import { shallowRef } from 'vue';

const wrrl = [
  { value: '-', title: '-', code: 'Keine' },
  { value: 'A', title: 'A', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_niedrig' },
  { value: 'B', title: 'B', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel' },
  { value: 'C', title: 'C', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_mittel_10' },
  { value: 'D', title: 'D', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_1' },
  { value: 'E', title: 'E', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_2' },
  { value: 'F', title: 'F', code: 'bdfl_l26_wasserrahmenrichtlinie_ertragslagen-el_hoch_3' },
];

const kulturenItems = {};

const yearItems = [];
{
  const thisYear = new Date().getFullYear();
  for (let y = thisYear - 2; y < thisYear + 2; y++) {
    yearItems.push(y);
  }
}

const fertilizationTypes = ['Eigene', 'Handelsdünger', 'Wirtschaftsdünger', 'Sekundärrohstoffe'];

const aussaatTypes = {
  0: [
    { title: 'Keine', value: 'keine' },
    { title: 'Genutzt / Ungenutzt', value: 'zwischen' },
  ],
  1: [
    { title: 'Keine', value: 'keine' },
    { title: 'Ungenutzte Zwischenfrucht', value: 'zwischenU' },
    { title: 'Genutzte Zwischenfrucht', value: 'zwischenG' },
    { title: 'Hauptfrucht', value: 'haupt' },
  ],
};

const aussaatTypeFilter = {
  zwischenU: ['1.1.600', '1.1.610', '1.1.620'],
  zwischenG: ['1.1.630', '1.1.640', '1.1.650'],
};

/**
 * @type {import('vue').ShallowRef<Object>}
 */
export const lookup = shallowRef({
  yearItems: yearItems,
  wrrl: wrrl,
  kulturenItems: kulturenItems,
  fertilizationTypes: fertilizationTypes,
  aussaatTypes: aussaatTypes,
  aussaatTypeFilter: aussaatTypeFilter,
});

async function getJson(what) {
  const response = await fetch(`data/${what}.json`);
  const data = await response.json();
  lookup.value[what] = data;

  if (what === 'kulturen') {
    kulturenItems.zwischen = [];
    for (let k = 0; k < data.length; k++) {
      if (aussaatTypeFilter.zwischenU.includes(data[k].ID)) {
        kulturenItems.zwischen.push({ value: data[k].ID, title: data[k].Kultur });
      } else if (aussaatTypeFilter.zwischenG.includes(data[k].ID)) {
        kulturenItems.zwischen.push({ value: data[k].ID, title: data[k].Kultur });
      } else {
        const alleFNA = data[k].Feldstücknutzungsart.split(';');
        for (let f = 0; f < alleFNA.length; f++) {
          if (kulturenItems[alleFNA[f]]) {
            kulturenItems[alleFNA[f]].push({ value: data[k].ID, title: data[k].Kultur });
          } else {
            kulturenItems[alleFNA[f]] = [{ value: data[k].ID, title: data[k].Kultur }];
          }
        }
      }
    }
    console.log(kulturenItems);
  }
}

{
  getJson('feldstücknutzungsarten');
  getJson('bodenartenbodenschwere');
  getJson('kulturen');
  getJson('wirtschaftsdünger');
  getJson('sekundärrohstoffe');
  getJson('handelsdünger');
  getJson('entzugstabelle-weizen');
  getJson('entzugstabelle-braugerste');
}

/**
 * @returns {{ lookup: import('vue').ShallowRef<Object> }}
 */
export function useLookup() {
  return { lookup };
}
