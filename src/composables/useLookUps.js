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

/**
 * @type {import('vue').ShallowRef<Object>}
 */
export const lookup = shallowRef({ wrrl: wrrl, kulturenItems: kulturenItems });

async function getJson(what) {
  const response = await fetch(`data/${what}.json`);
  const data = await response.json();
  lookup.value[what] = data;

  if (what === 'kulturen') {
    for (let k = 0; k < data.length; k++) {
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
}

{
  getJson('feldstücknutzungsarten');
  getJson('bodenartenbodenschwere');
  getJson('kulturen');
}

/**
 * @returns {{ lookup: import('vue').ShallowRef<Object> }}
 */
export function useLookup() {
  return { lookup };
}
