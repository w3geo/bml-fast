export const lookup = { schlagnutzungsarten: {} };

async () => {
  const response = await fetch('data/schlagnutzungsarten.json');
  const data = await response.json();
  console.log(data);
  lookup.schlagnutzungsarten = data;
  console.log(lookup);
};

/**
 * @returns {{ lookup: Object }}
 */
export function useLookup() {
  return { lookup };
}
