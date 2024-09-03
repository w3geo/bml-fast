// @ts-nocheck
import csv from 'csvtojson';
import fs from 'fs';
import { mkdirp } from 'mkdirp';

const inDir = 'data/csv';
const outDir = 'src/assets/data';

async function getJson(csvfile) {
  const jsonArray = await csv({ trim: true, delimiter: ';' })
    .fromFile(csvfile)
    .preFileLine((fileLineString, lineIdx) => {
      return lineIdx > 0 ? fileLineString.replace(/,/g, '.') : fileLineString;
    });
  return jsonArray;
}

mkdirp.sync(outDir);

// 1. Kulturen
// @ts-ignore
let work = await getJson(`${inDir}/kulturen.csv`);
fs.writeFileSync(`${outDir}/kulturen.json`, JSON.stringify(work), { encoding: 'utf-8' });

// 2. Handelsdünger
// @ts-ignore
work = await getJson(`${inDir}/handelsdünger.csv`);
for (let e = 0; e < work.length; e++) {
  work[e]['title'] = work[e]['Handelsdünger'];
  work[e]['value'] = work[e]['ID'];
  work[e]['stabilisierte N-Dünger'] =
    work[e]['stabilisierte N-Dünger'].toString().toLowerCase() == 'x' ? true : false;
  work[e]['BIO'] = work[e]['BIO'].toString().toLowerCase() == 'x' ? true : false;
}
work.splice(0, 0, { title: 'Bitte wählen', value: '' });
fs.writeFileSync(`${outDir}/handelsdünger.json`, JSON.stringify(work), { encoding: 'utf-8' });

// 3. Wirtschaftsdünger
// @ts-ignore
work = await getJson(`${inDir}/wirtschaftsdünger.csv`);
for (let e = 0; e < work.length; e++) {
  work[e]['title'] = work[e]['Wirtschaftsdünger'];
  work[e]['value'] = work[e]['ID'];
}
work.splice(0, 0, { title: 'Bitte wählen', value: '' });
fs.writeFileSync(`${outDir}/wirtschaftsdünger.json`, JSON.stringify(work), { encoding: 'utf-8' });

// 4. Sekundärrohstoffe
// @ts-ignore
work = await getJson(`${inDir}/sekundärrohstoffe.csv`);
for (let e = 0; e < work.length; e++) {
  work[e]['title'] = work[e]['Organischer Dünger / Sekundärrohstoff'];
  work[e]['value'] = work[e]['ID'];
}
work.splice(0, 0, { title: 'Bitte wählen', value: '' });
fs.writeFileSync(`${outDir}/sekundärrohstoffe.json`, JSON.stringify(work), { encoding: 'utf-8' });

// 5. Bodenarten - Bodenschwere
// @ts-ignore
work = await getJson(`${inDir}/bodenartenbodenschwere.csv`);
const outputbs = [];
for (let e = 0; e < work.length; e++) {
  outputbs.push({
    value: work[e].Bodenart,
    title: work[e].Bodenart,
    schwere: work[e].Bodenschwere,
  });
}
fs.writeFileSync(`${outDir}/bodenartenbodenschwere.json`, JSON.stringify(outputbs), {
  encoding: 'utf-8',
});

// 6. Feldstücknutzungsarten
// @ts-ignore
work = await getJson(`${inDir}/feldstücknutzungsarten.csv`);
const outputsn = {};
for (let e = 0; e < work.length; e++) {
  outputsn[work[e].Abkürzung] = work[e].Feldstücknutzungsarten;
}
fs.writeFileSync(`${outDir}/feldstücknutzungsarten.json`, JSON.stringify(outputsn), {
  encoding: 'utf-8',
});

// 7. Entzugstabelle Weizen
// @ts-ignore
work = await getJson(`${inDir}/entzugstabelle-weizen.csv`);
const outputetw = { 12: {}, 13: {}, 14: {}, 15: {}, 16: {} };
for (let e = 0; e < work.length; e++) {
  for (let f = 12; f < 17; f++) {
    outputetw[f][work[e]['field1']] = work[e][f];
  }
}
fs.writeFileSync(`${outDir}/entzugstabelle-weizen.json`, JSON.stringify(outputetw), {
  encoding: 'utf-8',
});

// 8. Entzugstabelle Braugerste
// @ts-ignore
work = await getJson(`${inDir}/entzugstabelle-braugerste.csv`);
const outputetb = { 12: {}, 13: {}, 14: {}, 15: {}, 16: {} };
for (let e = 0; e < work.length; e++) {
  for (let f = 12; f < 17; f++) {
    outputetb[f][work[e]['field1']] = work[e][f];
  }
}
fs.writeFileSync(`${outDir}/entzugstabelle-braugerste.json`, JSON.stringify(outputetb), {
  encoding: 'utf-8',
});
